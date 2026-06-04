import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { CreateRegionRequest, Region } from "@/lib/types";

// GET /regions
export const useRegions = () =>
  useQuery({
    queryKey: ["regions"],
    queryFn: async () => {
      const { data } = await api.get<Region[]>("/regions");
      return data;
    },
    // lista filtrabile: niente blank durante i refetch
    placeholderData: keepPreviousData,
  });

// GET /regions/{id}
export const useRegion = (id?: number) =>
  useQuery({
    queryKey: ["regions", id],
    queryFn: async () => {
      const { data } = await api.get<Region>(`/regions/${id}`);
      return data;
    },
    enabled: id != null,
  });

// POST /regions (admin)
export const useCreateRegion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateRegionRequest) => {
      const { data } = await api.post<Region>("/regions", body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["regions"] }),
  });
};

// PUT /regions/{id} (admin)
export const useUpdateRegion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: CreateRegionRequest }) => {
      const { data } = await api.put<Region>(`/regions/${id}`, body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["regions"] }),
  });
};

// DELETE /regions/{id} (admin) — bloccata dal BE se la regione è usata da ricette
export const useDeleteRegion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/regions/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["regions"] }),
  });
};
