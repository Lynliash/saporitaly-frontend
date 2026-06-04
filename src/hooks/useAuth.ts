import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import type { AuthResponse, CurrentUser, LoginRequest, RegisterRequest } from "@/lib/types";

// POST /auth/login — salva token + dati utente nello store
export const useLogin = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: async (body: LoginRequest) => {
      const { data } = await api.post<AuthResponse>("/auth/login", body);
      return data;
    },
    onSuccess: (data) => setAuth(data),
  });
};

// POST /auth/register — sempre ruolo BASE, poi logga
export const useRegister = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: async (body: RegisterRequest) => {
      const { data } = await api.post<AuthResponse>("/auth/register", body);
      return data;
    },
    onSuccess: (data) => setAuth(data),
  });
};

// GET /auth/me — gira solo se c'è un token
export const useMe = () => {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const { data } = await api.get<CurrentUser>("/auth/me");
      return data;
    },
    enabled: !!token,
    retry: false,
  });
};

// pulisce store + cache delle query
export const useLogout = () => {
  const logout = useAuthStore((s) => s.logout);
  const qc = useQueryClient();
  return () => {
    logout();
    qc.clear();
  };
};

// stato auth + ruolo, pronto per i componenti
export const useAuth = () => {
  const token = useAuthStore((s) => s.token);
  const username = useAuthStore((s) => s.username);
  const role = useAuthStore((s) => s.role);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  return {
    isAuthenticated: !!token,
    isAdmin: role === "ADMIN",
    username,
    role,
    hasHydrated,
  };
};
