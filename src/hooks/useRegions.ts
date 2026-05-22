import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface Region {
  id: number;
  name: string;
  description?: string;
}

// GET: lista tutte le regioni
export const useGetAllRegions = () => {
  return useQuery({
    queryKey: ["regions"],
    queryFn: async () => {
      const { data } = await api.get<Region[]>("/regions");
      return data;
    },
  });
};

// POST: crea una nuova regione (Admin) - inutile ma ok
export const useCreateRegion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newRegion: Partial<Region>) => {
      const { data } = await api.post("/regions", newRegion);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regions"] });
    },
  });
};

// DELETE cancella una regione (Admin) - inutile
export const useDeleteRegion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/regions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regions"] });
    },
  });
};
