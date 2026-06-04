"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Search, UtensilsCrossed, X } from "lucide-react";
import { RecipeCard } from "@/components/RecipeCard";
import { SectionHeader } from "@/components/SectionHeader";
import { CardSkeletonGrid, EmptyState, ErrorState, Loading } from "@/components/states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIngredients } from "@/hooks/useIngredients";
import {
  useRecipes,
  useRecipesByIngredient,
  useRecipesByRegion,
  useSearchRecipesByIngredient,
} from "@/hooks/useRecipes";
import { useRegions } from "@/hooks/useRegions";

const PAGE_SIZE = 12;
const ALL_REGIONS = "all";

const SORT_OPTIONS = [
  { value: "averageRating,desc", label: "Voto più alto" },
  { value: "prepTimeMinutes,asc", label: "Più veloci" },
  { value: "createdAt,desc", label: "Più recenti" },
] as const;

function EsploraContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ?ingredientId=N arriva dal catalogo ingredienti
  const ingredientIdParam = searchParams.get("ingredientId");
  const parsedIngredientId = ingredientIdParam ? Number(ingredientIdParam) : NaN;
  const ingredientId = Number.isInteger(parsedIngredientId) && parsedIngredientId > 0 ? parsedIngredientId : undefined;

  // searchInput immediato, term debounced
  const [searchInput, setSearchInput] = useState("");
  const [term, setTerm] = useState("");
  const [region, setRegion] = useState<string>(ALL_REGIONS);
  const [sort, setSort] = useState<string>(SORT_OPTIONS[0].value);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setTerm(searchInput.trim()), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  // modalità esclusive in ordine di precedenza: ingrediente (URL) > ricerca > regione > tutte
  const mode: "ingredient" | "search" | "region" | "all" = ingredientId
    ? "ingredient"
    : term
      ? "search"
      : region !== ALL_REGIONS
        ? "region"
        : "all";

  // se cambiano i criteri torno a pagina 0
  useEffect(() => {
    setPage(0);
  }, [term, region, sort, ingredientId]);

  const regionId = region !== ALL_REGIONS ? Number(region) : undefined;

  const { data: regions } = useRegions();
  const { data: ingredients } = useIngredients();

  // una query per modalità, abilitata solo quando serve; page/sort sono condivisi
  const ingredientQuery = useRecipesByIngredient(mode === "ingredient" ? ingredientId : undefined, { sort, page, size: PAGE_SIZE });
  const searchQuery = useSearchRecipesByIngredient(mode === "search" ? term : "", { sort, page, size: PAGE_SIZE });
  const regionQuery = useRecipesByRegion(mode === "region" ? regionId : undefined, { sort, page, size: PAGE_SIZE });
  const allQuery = useRecipes({ sort, page, size: PAGE_SIZE });

  const active =
    mode === "ingredient" ? ingredientQuery : mode === "search" ? searchQuery : mode === "region" ? regionQuery : allQuery;
  const { data, isLoading, isError } = active;

  const recipes = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;
  const totalPages = data?.totalPages ?? 0;
  const isFirst = data?.first ?? true;
  const isLast = data?.last ?? true;

  const regionName = useMemo(
    () => regions?.find((r) => r.id === regionId)?.name,
    [regions, regionId],
  );

  // nome ingrediente per l'etichetta del chip
  const ingredientName = useMemo(
    () => ingredients?.find((i) => i.id === ingredientId)?.name,
    [ingredients, ingredientId],
  );

  const clearIngredient = () => router.push("/esplora");

  return (
    <main className="container mx-auto px-5 sm:px-8 lg:px-10 py-10 sm:py-12 min-h-screen">
      <SectionHeader
        eyebrow="Archivio"
        title="Archivio Tradizioni"
        description="Sfoglia, filtra e ordina i manoscritti culinari della cucina italiana."
      />

      <div className="mb-8 flex flex-col gap-3 border border-border bg-muted/20 p-4 lg:flex-row lg:items-center">
        {/* la ricerca matcha nome o alias dell'ingrediente */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cerca per ingrediente (es. pomodoro)..."
            className="pl-9 bg-background rounded-none border-border focus-visible:ring-secondary"
          />
        </div>

        <div className="w-full lg:w-52">
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="w-full bg-background rounded-none border-border focus:ring-secondary">
              <SelectValue placeholder="Tutte le Regioni" />
            </SelectTrigger>
            <SelectContent position="popper" className="rounded-none border-border">
              <SelectItem value={ALL_REGIONS}>Tutte le Regioni</SelectItem>
              {regions?.map((r) => (
                <SelectItem key={r.id} value={String(r.id)}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full lg:w-52">
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-full bg-background rounded-none border-border focus:ring-secondary">
              <SelectValue placeholder="Ordina per..." />
            </SelectTrigger>
            <SelectContent position="popper" className="rounded-none border-border">
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {mode === "ingredient" && (
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 border border-secondary bg-secondary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-secondary">
            Ricette con {ingredientName ?? "questo ingrediente"}
            {!isLoading && (
              <span className="font-normal text-muted-foreground tabular-nums">
                · {totalElements} {totalElements === 1 ? "ricetta" : "ricette"}
              </span>
            )}
            <button
              type="button"
              onClick={clearIngredient}
              aria-label="Rimuovi il filtro per ingrediente"
              className="-mr-1 rounded-none outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
          <Link
            href="/esplora"
            className="text-xs font-bold uppercase tracking-widest text-muted-foreground underline-offset-4 transition-colors hover:text-secondary hover:underline"
          >
            Tutte le ricette
          </Link>
        </div>
      )}

      {/* con la ricerca testuale attiva il filtro regione viene ignorato */}
      {mode === "search" && region !== ALL_REGIONS && (
        <p className="mb-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Ricerca per ingrediente attiva — filtro regione ignorato
        </p>
      )}

      {isLoading ? (
        <CardSkeletonGrid count={PAGE_SIZE} />
      ) : isError ? (
        <ErrorState message="Impossibile caricare le ricette. Riprova più tardi." />
      ) : recipes.length === 0 ? (
        <EmptyState
          icon={<UtensilsCrossed className="w-10 h-10" />}
          title="Nessuna ricetta trovata"
          description={
            mode === "ingredient"
              ? `Nessuna ricetta usa ${ingredientName ?? "questo ingrediente"}.`
              : mode === "search"
                ? `Nessuna ricetta usa l'ingrediente "${term}". Prova con un altro termine.`
                : mode === "region"
                  ? `Non ci sono ancora ricette per ${regionName ?? "questa regione"}.`
                  : "L'archivio è ancora vuoto."
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                className="rounded-none"
                disabled={isFirst}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                <ChevronLeft className="w-4 h-4" />
                Precedente
              </Button>
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Pagina {page + 1} di {totalPages}
              </span>
              <Button
                variant="outline"
                className="rounded-none"
                disabled={isLast}
                onClick={() => setPage((p) => p + 1)}
              >
                Successiva
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </main>
  );
}

// useSearchParams() in App Router va dentro un Suspense
export default function Esplora() {
  return (
    <Suspense fallback={<Loading label="Caricamento archivio..." />}>
      <EsploraContent />
    </Suspense>
  );
}
