"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { useRegions } from "@/hooks/useRegions";
import { SectionHeader } from "@/components/SectionHeader";
import { CardSkeletonGrid, EmptyState, ErrorState } from "@/components/states";
import { Card, CardContent } from "@/components/ui/card";

export default function ElencoRegioni() {
  const { data: regioni, isLoading, isError } = useRegions();

  return (
    <main className="container mx-auto px-5 sm:px-8 lg:px-10 py-10 sm:py-12 min-h-screen">
      <SectionHeader
        eyebrow="Territori"
        title="Le Regioni d'Italia"
        description="Seleziona un territorio per esplorare le tradizioni culinarie locali."
      />

      {isLoading ? (
        <CardSkeletonGrid count={8} />
      ) : isError ? (
        <ErrorState message="Impossibile caricare le regioni." />
      ) : !regioni || regioni.length === 0 ? (
        <EmptyState
          icon={<MapPin className="w-8 h-8" />}
          title="Nessuna regione"
          description="L'archivio dei territori è ancora vuoto."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {regioni.map((regione) => (
            <Link key={regione.id} href={`/regioni/${regione.id}`} className="group block h-full">
              <Card className="rounded-none h-full border border-border bg-card transition-all duration-300 group-hover:border-secondary group-hover:-translate-y-1 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                <CardContent className="p-6 flex flex-col h-full">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                    {regione.code}
                  </span>
                  <h2 className="font-headline text-2xl leading-tight text-foreground transition-colors group-hover:text-secondary">
                    {regione.name}
                  </h2>
                  {regione.description && (
                    <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
                      {regione.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
