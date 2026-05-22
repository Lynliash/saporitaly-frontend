import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

// interfacce typescript (devono matchare i DTO di spring boot)
export interface Recipe {
  id: number;
  title: string;
  region: string;
  category: string;
  rating: number;
  prepTime: number;
  imageUrl?: string;
}

// ---------------------------------------------------------
// HOOKS PER LE RICETTE (Recipe Controller)
// ---------------------------------------------------------

// GET: lista tutte le ricette
export const useGetAllRecipes = () => {
  return useQuery({
    queryKey: ["recipes"],
    queryFn: async () => {
      const { data } = await api.get<Recipe[]>("/recipes");
      return data;
    },
  });
};

// GET: singola ricetta by id
export const useGetRecipeById = (id: number) => {
  return useQuery({
    queryKey: ["recipes", id],
    queryFn: async () => {
      const { data } = await api.get<Recipe>(`/recipes/${id}`);
      return data;
    },
    enabled: !!id, // l'hook non fa la chiamata finché non c'è un id valido
  });
};

// POST: crea nuova ricetta (admin)
export const useCreateRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newRecipe: Partial<Recipe>) => {
      const { data } = await api.post("/recipes", newRecipe);
      return data;
    },
    onSuccess: () => {
      // invalida la cache così la tabella admin si aggiorna da sola
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
  });
};
