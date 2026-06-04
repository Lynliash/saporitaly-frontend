import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import type { CreateReviewRequest, Page, PageParams, Review } from "@/lib/types";

// GET /reviews/by-recipe/{recipeId} — recensioni pubbliche, paginate
export const useReviewsByRecipe = (recipeId?: string, params: PageParams = {}) =>
  useQuery({
    queryKey: ["reviews", recipeId, params],
    queryFn: async () => {
      const { data } = await api.get<Page<Review>>(`/reviews/by-recipe/${recipeId}`, { params });
      return data;
    },
    enabled: !!recipeId,
    // tiene la pagina corrente durante il cambio pagina
    placeholderData: keepPreviousData,
  });

// GET /reviews/me/{recipeId} — la mia recensione (null se non l'ho ancora scritta)
export const useMyReview = (recipeId?: string) => {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ["reviews", "me", recipeId],
    queryFn: async () => {
      const res = await api.get<Review>(`/reviews/me/${recipeId}`);
      return res.status === 204 ? null : res.data; // 204 = non recensita
    },
    enabled: !!recipeId && !!token,
    retry: false,
  });
};

// invalida tutto quello che dipende dalle recensioni di quella ricetta
const invalidateRecipeReviews = (qc: ReturnType<typeof useQueryClient>, recipeId: string) => {
  qc.invalidateQueries({ queryKey: ["reviews", recipeId] });
  qc.invalidateQueries({ queryKey: ["reviews", "me", recipeId] });
  qc.invalidateQueries({ queryKey: ["recipes", recipeId] }); // media/conteggio aggiornati
  qc.invalidateQueries({ queryKey: ["recipes", "all"] });
};

// POST /reviews/recipe/{recipeId}
export const useCreateReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ recipeId, body }: { recipeId: string; body: CreateReviewRequest }) => {
      const { data } = await api.post<Review>(`/reviews/recipe/${recipeId}`, body);
      return data;
    },
    onSuccess: (_, { recipeId }) => invalidateRecipeReviews(qc, recipeId),
  });
};

// PUT /reviews/{reviewId} — solo l'autore (check nel BE)
export const useUpdateReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ reviewId, body }: { reviewId: string; recipeId: string; body: CreateReviewRequest }) => {
      const { data } = await api.put<Review>(`/reviews/${reviewId}`, body);
      return data;
    },
    onSuccess: (_, { recipeId }) => invalidateRecipeReviews(qc, recipeId),
  });
};

// DELETE /reviews/{reviewId} — solo l'autore
export const useDeleteReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ reviewId }: { reviewId: string; recipeId: string }) => {
      await api.delete(`/reviews/${reviewId}`);
    },
    onSuccess: (_, { recipeId }) => invalidateRecipeReviews(qc, recipeId),
  });
};
