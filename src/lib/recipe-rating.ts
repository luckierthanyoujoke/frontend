/** Must match backend `RECIPE_RATING_MAX`. */
export const RECIPE_RATING_MAX = 5;

export function formatRecipeRatingLabel(
  average: number | null,
  count: number,
  max: number = RECIPE_RATING_MAX,
): string {
  if (count <= 0 || average === null) return "No ratings yet";
  return `${average}/${max} · ${count} rating${count === 1 ? "" : "s"}`;
}
