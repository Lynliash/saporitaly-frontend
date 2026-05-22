import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface Ingredient {
  id: number;
  name: string;
  aliases: string[];
}

// GET catalogo ingredienti
export const useGetAllIngredients = () => {
  return useQuery({
    queryKey: ["ingredients"],
    queryFn: async () => {
      const { data } = await api.get<Ingredient[]>("/ingredients");
      return data;
    },
  });
};

// POST crea nuovo ingrediente con alias (Admin)
export const useCreateIngredient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newIngredient: Partial<Ingredient>) => {
      const { data } = await api.post("/ingredients", newIngredient);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
    },
  });
};

// DELETE cancella ingrediente (Admin)
export const useDeleteIngredient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/ingredients/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
    },
  });
};
