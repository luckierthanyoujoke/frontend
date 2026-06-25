import { RECIPE_RATING_MAX } from "@/lib/recipe-rating";
import type { FeedRecipe } from "@/types/recipe";

/** Normalizes a recipe object from the Nest API (feed, detail, favorites, etc.). */
export function normalizeFeedRecipe(raw: unknown): FeedRecipe | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const user = o.user as Record<string, unknown> | undefined;
  return {
    id: String(o.id ?? ""),
    title: String(o.title ?? ""),
    ingredients: Array.isArray(o.ingredients)
      ? (o.ingredients as string[])
      : [],
    steps: Array.isArray(o.steps) ? (o.steps as string[]) : [],
    imageUrl:
      o.imageUrl === null || o.imageUrl === undefined
        ? null
        : String(o.imageUrl),
    isAI: Boolean(o.isAI),
    isPublished: Boolean(o.isPublished),
    userId: String(o.userId ?? ""),
    createdAt: String(o.createdAt ?? ""),
    updatedAt: String(o.updatedAt ?? ""),
    user: {
      name: String(user?.name ?? ""),
      avatarUrl:
        user?.avatarUrl === null || user?.avatarUrl === undefined
          ? null
          : String(user.avatarUrl),
      isPremium: Boolean(user?.isPremium),
    },
    likesCount: typeof o.likesCount === "number" ? o.likesCount : 0,
    likedByMe: Boolean(o.likedByMe),
    savedByMe: Boolean(o.savedByMe),
    category:
      o.category === null || o.category === undefined
        ? null
        : String(o.category),
    tags: Array.isArray(o.tags)
      ? (o.tags as unknown[]).map((t) => String(t))
      : [],
    diet:
      o.diet === null || o.diet === undefined ? null : String(o.diet),
    restrictions: Array.isArray(o.restrictions)
      ? (o.restrictions as unknown[]).map((t) => String(t))
      : [],
    ratingsCount: typeof o.ratingsCount === "number" ? o.ratingsCount : 0,
    ratingAverage:
      typeof o.ratingAverage === "number" ? o.ratingAverage : null,
    myRating: typeof o.myRating === "number" ? o.myRating : null,
    ratingMax:
      typeof o.ratingMax === "number" ? o.ratingMax : RECIPE_RATING_MAX,
  };
}
