export type UserRole = "BASE" | "PREMIUM" | "ADMIN";
export type Difficulty = "EASY" | "MEDIUM" | "HARD";
export type RecipeType = "TRADITIONAL" | "PERSONAL" | "REVISITATION";
export type IngredientCategory =
  | "PRODUCE"
  | "MEAT"
  | "FISH"
  | "DAIRY"
  | "GRAIN"
  | "LEGUME"
  | "HERB"
  | "PANTRY"
  | "CONDIMENT"
  | "OTHER"
  | "ALCOHOL";
export type IngredientUnit =
  | "GRAMS"
  | "KG"
  | "ML"
  | "L"
  | "PIECES"
  | "TABLESPOON"
  | "TEASPOON"
  | "CUP"
  | "QB";

// Wrapper di Spring Data per le risposte paginate
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // pagina corrente (0-based)
  size: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface AuthResponse {
  token: string;
  userId: string;
  username: string;
  role: UserRole;
}

export interface CurrentUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface RecipeSummary {
  id: string;
  title: string;
  description: string | null;
  difficulty: Difficulty;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  regionName: string | null;
  imageUrl: string | null;
  type: RecipeType;
  averageRating: number;
  reviewCount: number;
}

export interface RecipeIngredientLine {
  ingredientId: number;
  ingredientName: string;
  quantity: number;
  unit: IngredientUnit;
  isEssential: boolean;
  note: string | null;
}

export interface RecipeStep {
  stepOrder: number;
  description: string;
}

export interface RecipeDetail extends RecipeSummary {
  regionId: number | null;
  ingredients: RecipeIngredientLine[];
  steps: RecipeStep[];
}

export interface CreateRecipeIngredientRequest {
  ingredientId: number;
  quantity: number;
  unit: IngredientUnit;
  isEssential?: boolean;
  note?: string;
}

export interface CreateRecipeStepRequest {
  stepOrder: number;
  description: string;
}

export interface CreateRecipeRequest {
  title: string;
  description?: string;
  difficulty: Difficulty;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  regionId?: number;
  imageUrl?: string;
  type?: RecipeType;
  ingredients: CreateRecipeIngredientRequest[];
  steps: CreateRecipeStepRequest[];
}

export interface Region {
  id: number;
  name: string;
  code: string;
  description: string;
}

export interface CreateRegionRequest {
  name: string;
  code: string;
  description?: string;
}

export interface Ingredient {
  id: number;
  name: string;
  slug: string;
  category: IngredientCategory;
  isPantryDefault: boolean;
}

export interface CreateIngredientRequest {
  name: string;
  slug?: string;
  category: IngredientCategory;
  isPantryDefault?: boolean;
  aliases?: string[]; // usati solo in creazione
}

export interface Alias {
  id: number;
  alias: string;
}

export interface CreateAliasRequest {
  alias: string;
}

export interface Substitution {
  id: number;
  ingredientId: number;
  ingredientName: string;
  substituteId: number;
  substituteName: string;
  compatibilityScore: number;
  note: string | null;
}

export interface CreateSubstitutionRequest {
  ingredientId: number;
  substituteId: number;
  compatibilityScore: number;
  note?: string;
}

export interface Review {
  id: string;
  recipeId: string;
  userId: string;
  username: string;
  rating: number; // 1-10
  comment: string | null;
  createdAt: string;
}

export interface CreateReviewRequest {
  rating: number;
  comment?: string;
}

export interface PantryMatchRequest {
  ingredients: string[];
  minMatchPercent?: number;
  allowSubstitutions?: boolean;
  minSubstitutionScore?: number;
  limit?: number;
}

export interface SubstitutionInfo {
  requiredIngredient: string;
  substituteUsed: string;
  compatibilityScore: number;
  note: string | null;
}

export interface RecipeMatchResult {
  recipe: RecipeSummary;
  matchPercent: number; // 0-100
  coveredIngredients: string[];
  missingIngredients: string[];
  substitutions: SubstitutionInfo[];
}

export interface PantryMatchResponse {
  matches: RecipeMatchResult[];
  unrecognizedInputs: string[];
  totalCandidatesEvaluated: number;
}

// Parametri comuni di paginazione/ordinamento per gli endpoint Page<T>
export interface PageParams {
  page?: number;
  size?: number;
  sort?: string; // es. "averageRating,desc"
}
