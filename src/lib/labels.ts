import type { Difficulty, IngredientCategory, IngredientUnit, RecipeType } from "@/lib/types";

export const difficultyLabel: Record<Difficulty, string> = {
  EASY: "Facile",
  MEDIUM: "Media",
  HARD: "Difficile",
};

export const recipeTypeLabel: Record<RecipeType, string> = {
  TRADITIONAL: "Tradizionale",
  PERSONAL: "Personale",
  REVISITATION: "Rivisitazione",
};

export const categoryLabel: Record<IngredientCategory, string> = {
  PRODUCE: "Frutta e verdura",
  MEAT: "Carne",
  FISH: "Pesce",
  DAIRY: "Latticini",
  GRAIN: "Cereali",
  LEGUME: "Legumi",
  HERB: "Erbe aromatiche",
  PANTRY: "Dispensa",
  CONDIMENT: "Condimenti e salse",
  OTHER: "Altro",
  ALCOHOL: "Alcolici",
};

const unitShort: Record<IngredientUnit, string> = {
  GRAMS: "g",
  KG: "kg",
  ML: "ml",
  L: "l",
  PIECES: "pz",
  TABLESPOON: "cucchiai",
  TEASPOON: "cucchiaini",
  CUP: "tazze",
  QB: "q.b.",
};

export const unitLabel = (u: IngredientUnit) => unitShort[u];

// "400 g", "2 pz", "q.b." (per QB la quantità non ha senso)
export function formatQuantity(quantity: number, unit: IngredientUnit): string {
  if (unit === "QB") return "q.b.";
  const n = Number.isInteger(quantity) ? quantity : Number(quantity.toFixed(2));
  return `${n} ${unitShort[unit]}`;
}

// minuti -> "1h 20m" / "45m"
export function formatMinutes(min: number): string {
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}
