import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { PantryMatchRequest, PantryMatchResponse } from "@/lib/types";

// POST /pantry/match — lo Svuotafrigo. Richiede login (lato BE).
// Mando dispensa + tuning, torna le ricette ordinate per % di match.
export const usePantryMatch = () =>
  useMutation({
    mutationFn: async (body: PantryMatchRequest) => {
      const { data } = await api.post<PantryMatchResponse>("/pantry/match", body);
      return data;
    },
  });
