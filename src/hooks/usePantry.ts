import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

// interfaccia di risposta dal backend (deve matchare il tuo DTO Java)
export interface MatchResult {
  recipeId: number;
  recipeTitle: string;
  matchPercentage: number;
  ownedIngredients: string[];
  missingIngredients: string[];
  substitutions: string[];
}

// ---------------------------------------------------------
// HOOK PER LO SVUOTA FRIGO (Pantry Matcher)
// ---------------------------------------------------------

// POST: invia gli ingredienti dell'utente e riceve i match
export const usePantryMatch = () => {
  return useMutation({
    mutationFn: async (userIngredients: string[]) => {
      // mandiamo un oggetto con l'array degli ingredienti
      const { data } = await api.post<MatchResult[]>("/pantry/match", {
        ingredients: userIngredients,
      });
      return data;
    },
  });
};
