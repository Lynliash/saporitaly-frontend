"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Loading } from "@/components/states";

// Protegge le pagine che richiedono login (e opzionalmente ADMIN).
// Aspetta l'idratazione dello store, altrimenti rimbalza al login per sbaglio.
export function AuthGuard({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { isAuthenticated, isAdmin, hasHydrated } = useAuth();
  const router = useRouter();

  const allowed = isAuthenticated && (!adminOnly || isAdmin);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!isAuthenticated) {
      router.replace("/auth");
    } else if (adminOnly && !isAdmin) {
      router.replace("/");
    }
  }, [hasHydrated, isAuthenticated, isAdmin, adminOnly, router]);

  if (!hasHydrated || !allowed) {
    return <Loading label="Verifica accesso..." />;
  }
  return <>{children}</>;
}
