import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface Review {
  id: number;
  recipeId: number;
  userId: number;
  userName: string;
  rating: number; // 1-10
  comment: string;
  createdAt: string;
}

export interface CreateReviewDTO {
  recipeId: number;
  rating: number;
  comment: string;
}

// GET prende tutte le recensioni di una ricetta
export const useGetReviewsByRecipe = (recipeId: number) => {
  return useQuery({
    queryKey: ["reviews", recipeId],
    queryFn: async () => {
      const { data } = await api.get<Review[]>(`/recipes/${recipeId}/reviews`);
      return data;
    },
    enabled: !!recipeId, // aspetta che ci sia un ID valido
  });
};

// POST inserisce una nuova recensione (Utente)
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newReview: CreateReviewDTO) => {
      const { data } = await api.post("/reviews", newReview);
      return data;
    },
    onSuccess: (_, variables) => {
      // aggiorna specificamente la lista recensioni di QUELLA ricetta
      queryClient.invalidateQueries({ queryKey: ["reviews", variables.recipeId] });
    },
  });
};

// DELETE cancella la propria recensione (Utente)
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId: number) => {
      await api.delete(`/reviews/${reviewId}`);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};
