"use client";

import { Star } from "lucide-react";
import { useState } from "react";

import { parseApiErrorMessage } from "@/lib/api-error";
import { getApiBaseUrl } from "@/lib/api-config";
import { fetchWithAuth } from "@/lib/api-fetch";
import { formatRecipeRatingLabel } from "@/lib/recipe-rating";
import { cn } from "@/lib/utils";
import type { RecipeRatingFields } from "@/types/recipe";

type Props = RecipeRatingFields & {
  recipeId: string;
  isSignedIn: boolean;
  getToken: () => Promise<string | null>;
  onRequireSignIn: () => void;
  onUpdated: (fields: RecipeRatingFields) => void;
};

export function RecipeRatingPanel({
  recipeId,
  ratingMax,
  ratingsCount,
  ratingAverage,
  myRating,
  isSignedIn,
  getToken,
  onRequireSignIn,
  onUpdated,
}: Props) {
  const [pending, setPending] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const active = hover ?? myRating ?? 0;

  async function applyScore(score: number) {
    if (!isSignedIn) {
      onRequireSignIn();
      return;
    }
    setPending(true);
    setError(null);
    try {
      const res = await fetchWithAuth(
        `${getApiBaseUrl()}/recipes/${encodeURIComponent(recipeId)}/rating`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ score }),
        },
        getToken,
      );
      const data: unknown = await res.json().catch(() => null);
      if (!res.ok) {
        setError(parseApiErrorMessage(data, "Could not save rating."));
        return;
      }
      if (data && typeof data === "object") {
        const o = data as Record<string, unknown>;
        onUpdated({
          ratingMax:
            typeof o.ratingMax === "number" ? o.ratingMax : ratingMax,
          ratingsCount:
            typeof o.ratingsCount === "number" ? o.ratingsCount : 0,
          ratingAverage:
            typeof o.ratingAverage === "number" ? o.ratingAverage : null,
          myRating: typeof o.myRating === "number" ? o.myRating : score,
        });
      }
    } catch {
      setError("Could not save rating.");
    } finally {
      setPending(false);
    }
  }

  async function clearRating() {
    if (!isSignedIn || !myRating) return;
    setPending(true);
    setError(null);
    try {
      const res = await fetchWithAuth(
        `${getApiBaseUrl()}/recipes/${encodeURIComponent(recipeId)}/rating`,
        { method: "DELETE" },
        getToken,
      );
      const data: unknown = await res.json().catch(() => null);
      if (!res.ok) {
        setError(parseApiErrorMessage(data, "Could not remove rating."));
        return;
      }
      if (data && typeof data === "object") {
        const o = data as Record<string, unknown>;
        onUpdated({
          ratingMax:
            typeof o.ratingMax === "number" ? o.ratingMax : ratingMax,
          ratingsCount:
            typeof o.ratingsCount === "number" ? o.ratingsCount : 0,
          ratingAverage:
            typeof o.ratingAverage === "number" ? o.ratingAverage : null,
          myRating: null,
        });
      }
    } catch {
      setError("Could not remove rating.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="space-y-2 rounded-lg border border-border bg-muted/30 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-heading text-lg font-semibold">Rating</h2>
        <p className="text-sm text-muted-foreground">
          {formatRecipeRatingLabel(ratingAverage, ratingsCount, ratingMax)}
        </p>
      </div>
      <div
        className="flex items-center gap-0.5"
        role="group"
        aria-label={`Rate from 1 to ${ratingMax}`}
        onMouseLeave={() => setHover(null)}
      >
        {Array.from({ length: ratingMax }, (_, i) => i + 1).map((value) => {
          const filled = value <= active;
          return (
            <button
              key={value}
              type="button"
              disabled={pending}
              className={cn(
                "rounded p-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "text-muted-foreground hover:text-amber-500",
                filled && "text-amber-500",
              )}
              aria-label={`${value} out of ${ratingMax}`}
              aria-pressed={myRating === value}
              onMouseEnter={() => setHover(value)}
              onClick={() => void applyScore(value)}
            >
              <Star
                className={cn(
                  "h-8 w-8",
                  filled && "fill-amber-400 text-amber-500",
                )}
              />
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        {isSignedIn
          ? "Click a star to rate (1–5). One rating per account."
          : "Sign in to rate this recipe."}
      </p>
      {myRating ? (
        <button
          type="button"
          className="text-xs text-muted-foreground underline-offset-2 hover:underline"
          disabled={pending}
          onClick={() => void clearRating()}
        >
          Clear your rating ({myRating}/{ratingMax})
        </button>
      ) : null}
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
