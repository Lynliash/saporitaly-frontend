import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

// interfaccia base utente
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// POST effettua il login
export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await api.post("/auth/login", credentials);
      return data;
    },
  });
};

// POST registra nuovo utente
export const useRegister = () => {
  return useMutation({
    mutationFn: async (userData: RegisterData) => {
      const { data } = await api.post("/auth/register", userData);
      return data;
    },
  });
};

// GET
export const useGetMe = () => {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const { data } = await api.get<User>("/auth/me");
      return data;
    },
    retry: false, // se non si è loggati fallisce
  });
};
