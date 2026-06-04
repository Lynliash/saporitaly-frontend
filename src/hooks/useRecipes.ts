import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { CreateRecipeRequest, Page, PageParams, RecipeDetail, RecipeSummary } from "@/lib/types";

// GET /recipes — lista paginata e ordinabile (sort es. "averageRating,desc")
export const useRecipes = (params: PageParams = {}) =>
  useQuery({
    queryKey: ["recipes", "all", params],
    queryFn: async () => {
      const { data } = await api.get<Page<RecipeSummary>>("/recipes", { params });
      return data;
    },
    // niente flicker su filtri/sort/pagina durante il refetch
    placeholderData: keepPreviousData,
  });

// GET /recipes/{id}
export const useRecipe = (id?: string) =>
  useQuery({
    queryKey: ["recipes", id],
    queryFn: async () => {
      const { data } = await api.get<RecipeDetail>(`/recipes/${id}`);
      return data;
    },
    enabled: !!id,
  });

// GET /recipes/by-region/{regionId}
export const useRecipesByRegion = (regionId?: number, params: PageParams = {}) =>
  useQuery({
    queryKey: ["recipes", "region", regionId, params],
    queryFn: async () => {
      const { data } = await api.get<Page<RecipeSummary>>(`/recipes/by-region/${regionId}`, { params });
      return data;
    },
    enabled: regionId != null,
    placeholderData: keepPreviousData,
  });

// GET /recipes/by-ingredient/{ingredientId}
export const useRecipesByIngredient = (ingredientId?: number, params: PageParams = {}) =>
  useQuery({
    queryKey: ["recipes", "ingredient", ingredientId, params],
    queryFn: async () => {
      const { data } = await api.get<Page<RecipeSummary>>(`/recipes/by-ingredient/${ingredientId}`, { params });
      return data;
    },
    enabled: ingredientId != null,
    placeholderData: keepPreviousData,
  });

// GET /recipes/search-by-ingredient?term=... (riconosce nome/slug/alias)
export const useSearchRecipesByIngredient = (term: string, params: PageParams = {}) =>
  useQuery({
    queryKey: ["recipes", "search", term, params],
    queryFn: async () => {
      const { data } = await api.get<Page<RecipeSummary>>("/recipes/search-by-ingredient", {
        params: { term, ...params },
      });
      return data;
    },
    enabled: term.trim().length > 0,
    placeholderData: keepPreviousData,
  });

// POST /recipes (admin)
export const useCreateRecipe = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateRecipeRequest) => {
      const { data } = await api.post<RecipeDetail>("/recipes", body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recipes"] }),
  });
};

// PUT /recipes/{id} (admin) — replace completo di ingredienti e step
export const useUpdateRecipe = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: CreateRecipeRequest }) => {
      const { data } = await api.put<RecipeDetail>(`/recipes/${id}`, body);
      return data;
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["recipes"] });
      qc.invalidateQueries({ queryKey: ["recipes", id] });
    },
  });
};

// DELETE /recipes/{id} (admin) — cancella anche le recensioni a cascata
export const useDeleteRecipe = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/recipes/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recipes"] }),
  });
};
