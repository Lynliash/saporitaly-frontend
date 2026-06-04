"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Refrigerator, LogOut, ArrowRight, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AuthGuard } from "@/components/AuthGuard";
import { SectionHeader } from "@/components/SectionHeader";
import { Loading, ErrorState } from "@/components/states";
import { useMe, useLogout } from "@/hooks/useAuth";
import type { UserRole } from "@/lib/types";

const roleLabel: Record<UserRole, string> = {
  BASE: "Membro",
  PREMIUM: "Premium",
  ADMIN: "Amministratore",
};

function ProfiloContent() {
  const router = useRouter();
  const { data: me, isLoading, isError } = useMe();
  const logout = useLogout();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (isLoading) return <Loading label="Carico il profilo..." />;
  if (isError || !me) return <ErrorState message="Impossibile caricare i dati del profilo." />;

  return (
    <>
      <SectionHeader eyebrow="Area Personale" title="Il tuo Profilo" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="rounded-none border-border lg:col-span-2">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-14 h-14 shrink-0 bg-muted border border-border flex items-center justify-center text-secondary">
                  <User className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-2xl font-headline text-foreground leading-tight truncate">{me.username}</h2>
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1 truncate">
                    <Mail className="w-3.5 h-3.5 shrink-0" /> {me.email}
                  </p>
                </div>
              </div>

              <Badge variant="secondary" className="rounded-none uppercase tracking-widest text-xs font-bold px-3 self-start">
                {roleLabel[me.role]}
              </Badge>
            </div>

            <div className="mt-8 pt-6 border-t border-border/60">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="rounded-none border-border hover:border-destructive hover:bg-destructive hover:text-white transition-colors gap-2"
              >
                <LogOut className="w-4 h-4" /> Esci
              </Button>
            </div>
          </CardContent>
        </Card>

        <Link href="/svuota-frigo" className="group block">
          <Card className="rounded-none border-border h-full transition-colors group-hover:border-secondary">
            <CardContent className="p-6 sm:p-8 flex flex-col h-full">
              <Refrigerator className="w-8 h-8 text-secondary mb-4" />
              <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-2">Cosa cucino oggi?</p>
              <h3 className="text-xl font-headline text-foreground leading-tight mb-2">Svuota Frigo</h3>
              <p className="text-sm text-muted-foreground">
                Inserisci gli ingredienti che hai in casa e scopri quali ricette puoi preparare.
              </p>
              <span className="mt-auto pt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground transition-colors group-hover:text-secondary">
                Inizia <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </CardContent>
          </Card>
        </Link>
      </div>
    </>
  );
}

export default function Profilo() {
  return (
    <main className="container mx-auto px-5 sm:px-8 lg:px-10 py-10 sm:py-12 min-h-screen">
      <AuthGuard>
        <ProfiloContent />
      </AuthGuard>
    </main>
  );
}
