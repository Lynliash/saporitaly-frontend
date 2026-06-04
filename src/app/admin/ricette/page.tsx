"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Star, Search, X, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AuthGuard } from "@/components/AuthGuard";
import { Loading, ErrorState, EmptyState } from "@/components/states";
import { useRecipes, useDeleteRecipe } from "@/hooks/useRecipes";
import { difficultyLabel, recipeTypeLabel } from "@/lib/labels";
import { apiError } from "@/lib/api";
import type { RecipeSummary } from "@/lib/types";

export default function AdminRicettePage() {
  return (
    <AuthGuard adminOnly>
      <AdminRicette />
    </AuthGuard>
  );
}

function AdminRicette() {
  const { data, isLoading, isError } = useRecipes({ size: 50, sort: "createdAt,desc" });
  const deleteRecipe = useDeleteRecipe();

  const [query, setQuery] = useState("");

  // Ordina e filtra solo la pagina già caricata, non tutto l'archivio
  const sorted = useMemo(
    () => [...(data?.content ?? [])].sort((a, b) => a.title.localeCompare(b.title, "it")),
    [data?.content]
  );
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter(
      (r) =>
        r.title.toLowerCase().includes(q) || (r.regionName?.toLowerCase().includes(q) ?? false)
    );
  }, [sorted, query]);

  // Il BE cancella a cascata anche le recensioni
  const handleDelete = (recipe: RecipeSummary) => {
    if (!confirm(`Eliminare "${recipe.title}"? Verranno cancellate anche le sue recensioni.`)) return;
    deleteRecipe.mutate(recipe.id, {
      onSuccess: () => toast.success("Ricetta eliminata."),
      onError: (err) => toast.error(apiError(err)),
    });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-10 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-headline text-foreground mb-2">Gestione Ricette</h1>
          <p className="text-muted-foreground">Modifica, elimina o aggiungi nuove ricette all&apos;archivio.</p>
        </div>
        <Link href="/nuova-ricetta" className="shrink-0">
          <Button className="bg-secondary text-white hover:bg-secondary/90 rounded-none font-bold text-xs uppercase tracking-widest h-12 px-6 w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" /> Nuova Ricetta
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <Loading label="Caricamento ricette..." />
      ) : isError ? (
        <ErrorState message="Impossibile caricare le ricette." />
      ) : !data || data.content.length === 0 ? (
        <EmptyState
          icon={<UtensilsCrossed className="w-10 h-10" />}
          title="Nessuna ricetta"
          description="Non c'è ancora nulla nell'archivio. Inizia aggiungendo la prima ricetta."
          action={
            <Link href="/nuova-ricetta">
              <Button className="bg-secondary text-white hover:bg-secondary/90 rounded-none font-bold text-xs uppercase tracking-widest h-11 px-6">
                <Plus className="w-4 h-4 mr-2" /> Nuova Ricetta
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cerca per titolo o regione..."
              className="bg-muted/10 rounded-none border-border pl-9 pr-9"
            />
            {query && (
              <button
                type="button"
                title="Pulisci ricerca"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
            {visible.length}
            {visible.length !== sorted.length ? ` di ${sorted.length}` : ""}{" "}
            {visible.length === 1 ? "ricetta" : "ricette"}
          </p>

          {visible.length === 0 ? (
            <EmptyState
              icon={<Search className="w-10 h-10" />}
              title="Nessun risultato"
              description={`Nessuna ricetta corrisponde a "${query.trim()}".`}
            />
          ) : (
            <Card className="rounded-none border-border">
              <CardContent className="p-0">
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm text-foreground">
                    <thead>
                      <tr className="border-b border-border bg-muted/30 uppercase text-[10px] tracking-widest font-bold text-muted-foreground">
                        <th className="p-4">Titolo</th>
                        <th className="p-4">Regione</th>
                        <th className="p-4">Difficoltà</th>
                        <th className="p-4">Tipo</th>
                        <th className="p-4">Voto</th>
                        <th className="p-4 text-right">Azioni</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {visible.map((recipe) => (
                        <tr key={recipe.id} className="hover:bg-muted/20 transition-colors">
                          <td className="p-4 font-headline text-base">{recipe.title}</td>
                          <td className="p-4 text-muted-foreground">{recipe.regionName ?? "—"}</td>
                          <td className="p-4">
                            <span className="inline-block border border-border bg-muted/30 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-foreground">
                              {difficultyLabel[recipe.difficulty]}
                            </span>
                          </td>
                          <td className="p-4 text-muted-foreground">{recipeTypeLabel[recipe.type]}</td>
                          <td className="p-4 font-bold text-secondary">
                            <span className="inline-flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                              {recipe.averageRating.toFixed(1)}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex justify-end gap-2">
                              <Link href={`/nuova-ricetta?id=${recipe.id}`}>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  title="Modifica"
                                  className="rounded-none border-border h-8 w-8 text-muted-foreground hover:text-foreground"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="outline"
                                size="icon"
                                title="Elimina"
                                disabled={deleteRecipe.isPending}
                                onClick={() => handleDelete(recipe)}
                                className="rounded-none border-border h-8 w-8 text-destructive hover:bg-destructive hover:text-white"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="md:hidden divide-y divide-border/50">
                  {visible.map((recipe) => (
                    <div key={recipe.id} className="p-5 flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-headline text-lg leading-snug text-foreground">{recipe.title}</h3>
                        <span className="inline-flex items-center gap-1 shrink-0 font-bold text-secondary">
                          <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                          {recipe.averageRating.toFixed(1)}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
                        <span>{recipe.regionName ?? "Senza regione"}</span>
                        <span className="inline-block border border-border bg-muted/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-foreground">
                          {difficultyLabel[recipe.difficulty]}
                        </span>
                        <span className="uppercase tracking-widest">{recipeTypeLabel[recipe.type]}</span>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <Link href={`/nuova-ricetta?id=${recipe.id}`} className="flex-1">
                          <Button
                            variant="outline"
                            className="w-full rounded-none border-border h-10 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground"
                          >
                            <Edit className="w-4 h-4 mr-2" /> Modifica
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          disabled={deleteRecipe.isPending}
                          onClick={() => handleDelete(recipe)}
                          className="flex-1 rounded-none border-border h-10 text-xs font-bold uppercase tracking-widest text-destructive hover:bg-destructive hover:text-white"
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Elimina
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
