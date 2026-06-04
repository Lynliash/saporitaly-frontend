"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, UtensilsCrossed } from "lucide-react";
import { useRegion } from "@/hooks/useRegions";
import { useRecipesByRegion } from "@/hooks/useRecipes";
import { RecipeCard } from "@/components/RecipeCard";
import { CardSkeletonGrid, EmptyState, ErrorState, Loading } from "@/components/states";

export default function DettaglioRegione() {
  const { id } = useParams<{ id: string }>();
  const regionId = Number(id);

  const { data: regione, isLoading: isLoadingRegion, isError: isErrorRegion } = useRegion(regionId);
  const {
    data: ricette,
    isLoading: isLoadingRecipes,
    isError: isErrorRecipes,
  } = useRecipesByRegion(regionId, { size: 12 });

  return (
    <main className="container mx-auto px-5 sm:px-8 lg:px-10 py-10 sm:py-12 min-h-screen">
      <Link
        href="/regioni"
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-secondary mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Tutte le regioni
      </Link>

      {isLoadingRegion ? (
        <Loading label="Caricamento regione..." />
      ) : isErrorRegion ? (
        <ErrorState message="Impossibile caricare la regione." />
      ) : regione ? (
        <header className="mb-10 md:mb-12">
          <p className="text-secondary text-xs font-bold tracking-widest uppercase mb-2">
            {regione.code}
          </p>
          <h1 className="text-3xl sm:text-4xl font-headline text-foreground leading-tight">
            {regione.name}
          </h1>
          {regione.description && (
            <p className="text-muted-foreground mt-3 max-w-2xl">{regione.description}</p>
          )}
        </header>
      ) : null}

      {isLoadingRecipes ? (
        <CardSkeletonGrid count={8} />
      ) : isErrorRecipes ? (
        <ErrorState message="Impossibile caricare le ricette di questa regione." />
      ) : !ricette || ricette.empty ? (
        <EmptyState
          icon={<UtensilsCrossed className="w-8 h-8" />}
          title="Nessuna ricetta"
          description="Non ci sono ancora ricette per questo territorio."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ricette.content.map((ricetta) => (
            <RecipeCard key={ricetta.id} recipe={ricetta} />
          ))}
        </div>
      )}
    </main>
  );
}
