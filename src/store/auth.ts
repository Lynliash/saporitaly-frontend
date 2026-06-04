import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserRole } from "@/lib/types";

interface AuthState {
  token: string | null;
  userId: string | null;
  username: string | null;
  role: UserRole | null;
  // evita il flash "non loggato" prima che zustand rilegga il localStorage
  hasHydrated: boolean;
  setAuth: (data: { token: string; userId: string; username: string; role: UserRole }) => void;
  logout: () => void;
  setHasHydrated: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userId: null,
      username: null,
      role: null,
      hasHydrated: false,
      setAuth: ({ token, userId, username, role }) => set({ token, userId, username, role }),
      logout: () => set({ token: null, userId: null, username: null, role: null }),
      setHasHydrated: (v) => set({ hasHydrated: v }),
    }),
    {
      name: "saporitaly-auth",
      partialize: (s) => ({ token: s.token, userId: s.userId, username: s.username, role: s.role }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    },
  ),
);
