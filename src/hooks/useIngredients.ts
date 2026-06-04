import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  Alias,
  CreateAliasRequest,
  CreateIngredientRequest,
  CreateSubstitutionRequest,
  Ingredient,
  Substitution,
} from "@/lib/types";

// ingredienti
export const useIngredients = () =>
  useQuery({
    queryKey: ["ingredients"],
    queryFn: async () => {
      const { data } = await api.get<Ingredient[]>("/ingredients");
      return data;
    },
    // lista filtrabile: niente blank durante i refetch
    placeholderData: keepPreviousData,
  });

// GET /ingredients/{id}
export const useIngredient = (id?: number) =>
  useQuery({
    queryKey: ["ingredients", id],
    queryFn: async () => {
      const { data } = await api.get<Ingredient>(`/ingredients/${id}`);
      return data;
    },
    enabled: id != null,
  });

// POST /ingredients (admin)
export const useCreateIngredient = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateIngredientRequest) => {
      const { data } = await api.post<Ingredient>("/ingredients", body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ingredients"] }),
  });
};

// PUT /ingredients/{id} (admin)
export const useUpdateIngredient = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: CreateIngredientRequest }) => {
      const { data } = await api.put<Ingredient>(`/ingredients/${id}`, body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ingredients"] }),
  });
};

// DELETE /ingredients/{id} (admin) — bloccata dal BE se usato in qualche ricetta
export const useDeleteIngredient = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/ingredients/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ingredients"] }),
  });
};

// alias

// GET /ingredients/{id}/aliases
export const useAliases = (ingredientId?: number) =>
  useQuery({
    queryKey: ["ingredients", ingredientId, "aliases"],
    queryFn: async () => {
      const { data } = await api.get<Alias[]>(`/ingredients/${ingredientId}/aliases`);
      return data;
    },
    enabled: ingredientId != null,
  });

// POST /ingredients/{id}/aliases (admin)
export const useCreateAlias = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ ingredientId, body }: { ingredientId: number; body: CreateAliasRequest }) => {
      const { data } = await api.post<Alias>(`/ingredients/${ingredientId}/aliases`, body);
      return data;
    },
    onSuccess: (_, { ingredientId }) =>
      qc.invalidateQueries({ queryKey: ["ingredients", ingredientId, "aliases"] }),
  });
};

// DELETE /aliases/{aliasId} (admin)
export const useDeleteAlias = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ aliasId }: { aliasId: number; ingredientId: number }) => {
      await api.delete(`/aliases/${aliasId}`);
    },
    onSuccess: (_, { ingredientId }) =>
      qc.invalidateQueries({ queryKey: ["ingredients", ingredientId, "aliases"] }),
  });
};

// sostituzioni

// GET /substitutions (admin)
export const useSubstitutions = () =>
  useQuery({
    queryKey: ["substitutions"],
    queryFn: async () => {
      const { data } = await api.get<Substitution[]>("/substitutions");
      return data;
    },
    // lista filtrabile: niente blank durante i refetch
    placeholderData: keepPreviousData,
  });

// POST /substitutions (admin)
export const useCreateSubstitution = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateSubstitutionRequest) => {
      const { data } = await api.post<Substitution>("/substitutions", body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["substitutions"] }),
  });
};

// DELETE /substitutions/{id} (admin)
export const useDeleteSubstitution = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/substitutions/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["substitutions"] }),
  });
};
