"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, Sprout, Salad } from "lucide-react";
import { useIngredients } from "@/hooks/useIngredients";
import { categoryLabel } from "@/lib/labels";
import { SectionHeader } from "@/components/SectionHeader";
import { CardSkeletonGrid, ErrorState, EmptyState } from "@/components/states";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function CatalogoIngredienti() {
  const { data: ingredients, isLoading, isError } = useIngredients();
  const [query, setQuery] = useState("");

  // filtro lato client per nome, case-insensitive
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ingredients ?? [];
    return (ingredients ?? []).filter((i) => i.name.toLowerCase().includes(q));
  }, [ingredients, query]);

  return (
    <main className="container mx-auto px-5 sm:px-8 lg:px-10 py-10 sm:py-12 min-h-screen">
      <SectionHeader
        eyebrow="Materie prime"
        title="Catalogo Ingredienti"
        description="Consulta l'archivio completo degli ingredienti riconosciuti dal sistema."
      />

      <div className="relative max-w-md mb-8 sm:mb-10">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cerca un ingrediente..."
          aria-label="Cerca un ingrediente"
          className="h-11 pl-9 bg-background rounded-none border-border focus-visible:ring-secondary"
        />
      </div>

      {isLoading ? (
        <CardSkeletonGrid count={12} />
      ) : isError ? (
        <ErrorState message="Impossibile caricare gli ingredienti." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Salad className="w-10 h-10" />}
          title={query ? "Nessun ingrediente trovato" : "Catalogo vuoto"}
          description={
            query
              ? `Nessun risultato per "${query.trim()}". Prova con un altro termine.`
              : "Non ci sono ancora ingredienti in archivio."
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((ingredient) => {
            const meta = (
              <CardContent className="p-5 flex flex-col gap-3 h-full">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-headline text-xl text-foreground leading-tight transition-colors group-hover:text-secondary">
                    {ingredient.name}
                  </h3>
                  {/* freccia solo sugli ingredienti cliccabili (non di dispensa) */}
                  {!ingredient.isPantryDefault && (
                    <ArrowUpRight className="w-4 h-4 shrink-0 text-muted-foreground transition-[color,transform] group-hover:text-secondary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none" />
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="rounded-none">
                    {categoryLabel[ingredient.category]}
                  </Badge>
                  {ingredient.isPantryDefault && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-secondary">
                      <Sprout className="w-3.5 h-3.5" />
                      Dispensa base
                    </span>
                  )}
                </div>
                {!ingredient.isPantryDefault && (
                  <span className="mt-auto pt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-secondary">
                    Vedi le ricette
                  </span>
                )}
              </CardContent>
            );

            // gli ingredienti di dispensa stanno in quasi tutte le ricette:
            // filtrarci sopra non ha senso, quindi non sono cliccabili
            if (ingredient.isPantryDefault) {
              return (
                <Card key={ingredient.id} className="rounded-none border-border h-full">
                  {meta}
                </Card>
              );
            }

            return (
              <Link
                key={ingredient.id}
                href={`/esplora?ingredientId=${ingredient.id}`}
                aria-label={`Vedi le ricette con ${ingredient.name}`}
                className="group block h-full rounded-none outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Card className="rounded-none border-border h-full transition-colors group-hover:border-secondary">
                  {meta}
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
