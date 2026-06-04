import axios, { AxiosError } from "axios";
import { useAuthStore } from "@/store/auth";

// base url del BE (Spring gira sulla 8000)
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// attacca il JWT a ogni richiesta, se loggati
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// token scaduto/invalido (401) -> sloggo, il prossimo render mostra il login
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);

// estrae il messaggio d'errore del BE ({ message, status, ... }) per i toast
export function apiError(error: unknown, fallback = "Si è verificato un errore"): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { message?: string } | undefined;
    return data?.message ?? error.message ?? fallback;
  }
  return fallback;
}
