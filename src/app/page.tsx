"use client";

import Link from "next/link";
import { ArrowRight, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecipeCard } from "@/components/RecipeCard";
import { SectionHeader } from "@/components/SectionHeader";
import { CardSkeletonGrid, EmptyState, ErrorState } from "@/components/states";
import { useRegions } from "@/hooks/useRegions";
import { useRecipes } from "@/hooks/useRecipes";

export default function Home() {
  const { data: regions, isLoading: regionsLoading, isError: regionsError } = useRegions();
  const { data: recipesPage, isLoading: recipesLoading, isError: recipesError } = useRecipes({
    size: 8,
    sort: "averageRating,desc",
  });

  const recipes = recipesPage?.content ?? [];

  return (
    <main className="min-h-screen flex flex-col">
      <section className="container mx-auto px-5 sm:px-8 lg:px-10 py-12 sm:py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        <div className="flex flex-col justify-center animate-in fade-in-0 slide-in-from-bottom-4 duration-700 ease-out">
          <p className="text-secondary text-xs font-bold tracking-widest uppercase mb-4">
            L&apos;Archivio del Patrimonio Gastronomico
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl text-foreground font-headline leading-tight mb-6">
            Censimento delle Tradizioni Culinarie d&apos;Italia.
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
            Un&apos;istituzione dedicata alla preservazione, catalogazione e studio critico delle ricette regionali
            italiane. Dall&apos;analisi filologica degli ingredienti alla mappatura storica dei territori, SaporItaly
            funge da ponte tra la saggezza popolare e il rigore accademico.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/esplora">
              <Button
                size="lg"
                className="w-full sm:w-auto rounded-none uppercase tracking-widest text-xs font-bold"
              >
                Sfoglia l&apos;archivio
              </Button>
            </Link>
            <Link href="/svuota-frigo">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto rounded-none uppercase tracking-widest text-xs font-bold border-border hover:border-secondary"
              >
                Svuota il frigo
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col justify-center lg:pl-10">
          <h2 className="text-3xl sm:text-4xl font-headline text-foreground mb-3">Esplora per Regione</h2>
          <p className="text-muted-foreground mb-8 italic">
            Seleziona un territorio per accedere alle ricette e alle analisi organolettiche correlate.
          </p>

          {regionsError ? (
            <ErrorState message="Impossibile caricare le regioni." />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8">
              {regionsLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-14.5 border border-border skeleton" />
                  ))
                : regions?.map((region) => (
                    <Link
                      href={`/regioni/${region.id}`}
                      key={region.id}
                      className="group block rounded-none outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <div className="bg-background p-4 sm:p-5 text-center border border-border group-hover:border-secondary group-hover:bg-muted/50 group-hover:shadow-sm group-hover:-translate-y-0.5 transition-all duration-200 ease-out-quart motion-reduce:transform-none text-foreground font-medium">
                        {region.name}
                      </div>
                    </Link>
                  ))}
            </div>
          )}

          <Link href="/regioni" className="w-full">
            <Button
              variant="outline"
              className="w-full py-6 rounded-none text-xs tracking-widest uppercase font-bold border-border text-foreground hover:bg-muted hover:border-secondary"
            >
              Vedi tutte le regioni
            </Button>
          </Link>
        </div>
      </section>

      <section className="bg-muted/30 py-16 sm:py-20 lg:py-24 px-5 sm:px-8 lg:px-10 border-t border-border mt-auto">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <SectionHeader
              eyebrow="Selezione della Curatela"
              title="Ricette in evidenza"
              description="Le preparazioni più apprezzate dell'archivio, ordinate per giudizio della comunità."
            />
            <Link
              href="/esplora"
              className="inline-flex items-center gap-2 text-secondary text-xs font-bold tracking-widest uppercase border-b-2 border-secondary pb-1 hover:text-secondary/80 transition-colors mb-8 md:mb-10 shrink-0"
            >
              Sfoglia tutte <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recipesError ? (
            <ErrorState message="Impossibile caricare le ricette in evidenza." />
          ) : recipesLoading ? (
            <CardSkeletonGrid count={8} />
          ) : recipes.length === 0 ? (
            <EmptyState
              title="Nessuna ricetta disponibile"
              description="L'archivio è in fase di catalogazione. Torna presto per scoprire le tradizioni."
              icon={<UtensilsCrossed className="w-8 h-8" />}
              action={
                <Link href="/esplora">
                  <Button variant="outline" className="rounded-none uppercase tracking-widest text-xs font-bold">
                    Vai all&apos;archivio
                  </Button>
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="bg-muted py-12 sm:py-16 px-5 sm:px-8 lg:px-10 border-t border-border">
        <div className="container mx-auto flex flex-col md:flex-row justify-between gap-10 text-sm text-muted-foreground">
          <div className="max-w-sm">
            <div className="text-2xl font-bold text-foreground font-headline mb-4">
              Sapor<span className="text-secondary">Italy</span>
            </div>
            <p className="leading-relaxed">
              L&apos;eccellenza dell&apos;archivistica gastronomica al servizio della cultura. Un progetto di ricerca
              permanente dedicato all&apos;identità italiana.
            </p>
          </div>

          <div className="flex gap-12 sm:gap-16">
            <div className="flex flex-col gap-3">
              <span className="font-bold tracking-widest uppercase text-xs mb-2 text-foreground">Risorse</span>
              <Link href="/esplora" className="hover:text-secondary transition-colors">
                Archivio
              </Link>
              <Link href="/regioni" className="hover:text-secondary transition-colors">
                Regioni
              </Link>
              <Link href="/ingredienti" className="hover:text-secondary transition-colors">
                Ingredienti
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
