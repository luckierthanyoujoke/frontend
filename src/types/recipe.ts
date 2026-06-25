/** Recipe as returned by the Nest API (Prisma). */
export type Recipe = {
  id: string;
  title: string;
  ingredients: string[];
  steps: string[];
  category?: string | null;
  tags?: string[];
  diet?: string | null;
  restrictions?: string[];
  /** AI-generated dish photo URL when enabled at generation time. */
  imageUrl?: string | null;
  isAI: boolean;
  isPublished: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

/** Published recipe in the public feed (includes author). */
export type FeedRecipe = {
  id: string;
  title: string;
  ingredients: string[];
  steps: string[];
  category?: string | null;
  tags?: string[];
  diet?: string | null;
  restrictions?: string[];
  imageUrl?: string | null;
  isAI: boolean;
  isPublished: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: { name: string; avatarUrl: string | null; isPremium?: boolean };
  likesCount: number;
  likedByMe: boolean;
  /** Bookmark / saved (Instagram-style save), separate from like. */
  savedByMe: boolean;
  /** Community score 1–5 (see `ratingMax`). */
  ratingMax: number;
  ratingsCount: number;
  ratingAverage: number | null;
  myRating: number | null;
};

export type RecipeRatingFields = Pick<
  FeedRecipe,
  "ratingMax" | "ratingsCount" | "ratingAverage" | "myRating"
>;
