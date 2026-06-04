"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Plus,
  X,
  Check,
  RefreshCw,
  ArrowRight,
  Sparkles,
  Refrigerator,
  AlertTriangle,
} from "lucide-react";

import { AuthGuard } from "@/components/AuthGuard";
import { SectionHeader } from "@/components/SectionHeader";
import { Loading, EmptyState } from "@/components/states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiError } from "@/lib/api";
import { usePantryMatch } from "@/hooks/usePantry";
import { difficultyLabel, formatMinutes } from "@/lib/labels";
import type { PantryMatchResponse, RecipeMatchResult } from "@/lib/types";

// Pulisce l'ingrediente ma tiene spazi/trattini interni dei nomi composti (es. "cime di rapa").
function sanitizeIngredient(raw: string): string {
  const cleaned = raw
    .trim()
    .replace(/^[\s.,;:!?\-–—]+/, "")
    .replace(/[\s.,;:!?\-–—]+$/, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return "";
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

export default function SvuotaFrigoPage() {
  return (
    <AuthGuard>
      <SvuotaFrigo />
    </AuthGuard>
  );
}

function SvuotaFrigo() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [minMatchPercent, setMinMatchPercent] = useState(50);
  const [allowSubstitutions, setAllowSubstitutions] = useState(true);
  const [minSubstitutionScore, setMinSubstitutionScore] = useState<string>("any");

  const [result, setResult] = useState<PantryMatchResponse | null>(null);
  const pantryMatch = usePantryMatch();

  // niente doppioni, confronto case-insensitive
  function addIngredient() {
    const value = sanitizeIngredient(draft);
    if (!value) return;
    const exists = ingredients.some((i) => i.toLowerCase() === value.toLowerCase());
    if (!exists) setIngredients((prev) => [...prev, value]);
    setDraft("");
  }

  function removeIngredient(target: string) {
    setIngredients((prev) => prev.filter((i) => i !== target));
  }

  function calcola() {
    if (ingredients.length === 0) {
      toast.error("Aggiungi almeno un ingrediente alla dispensa.");
      return;
    }
    pantryMatch.mutate(
      {
        ingredients,
        minMatchPercent,
        allowSubstitutions,
        minSubstitutionScore:
          minSubstitutionScore === "any" ? undefined : Number(minSubstitutionScore),
      },
      {
        onSuccess: (data) => {
          setResult(data);
          toast.success(
            data.matches.length > 0
              ? `${data.matches.length} ricette compatibili trovate.`
              : "Nessuna ricetta compatibile con questi parametri."
          );
        },
        onError: (err) => toast.error(apiError(err, "Calcolo non riuscito.")),
      }
    );
  }

  return (
    <main className="container mx-auto px-5 sm:px-8 lg:px-10 py-10 sm:py-12 min-h-screen">
      <SectionHeader
        eyebrow="Cosa cucino oggi"
        title="Svuota Frigo"
        description="Inserisci gli ingredienti che hai in casa: incrociamo la tua dispensa con l'archivio (e le regole di sostituzione) per dirti cosa puoi preparare."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        <aside className="lg:col-span-4 xl:col-span-3">
          <div className="lg:sticky lg:top-8 flex flex-col gap-6">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">
                La tua dispensa
              </h2>
              <div className="flex gap-2">
                <Input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addIngredient();
                    }
                  }}
                  placeholder="Es. pomodoro, basilico..."
                  className="h-11 bg-background rounded-none border-border focus-visible:ring-secondary"
                  aria-label="Aggiungi ingrediente"
                />
                <Button
                  type="button"
                  onClick={addIngredient}
                  variant="secondary"
                  className="h-11 px-3 rounded-none shrink-0"
                  aria-label="Aggiungi"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {ingredients.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {ingredients.map((ing) => (
                    <Badge
                      key={ing}
                      variant="outline"
                      className="rounded-none gap-1.5 py-1 pr-1.5 text-sm border-border"
                    >
                      {ing}
                      <button
                        type="button"
                        onClick={() => removeIngredient(ing)}
                        className="inline-flex items-center justify-center text-muted-foreground transition-colors hover:text-destructive"
                        aria-label={`Rimuovi ${ing}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">
                  Nessun ingrediente aggiunto.
                </p>
              )}
            </div>

            <div className="border-t border-border pt-6 flex flex-col gap-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Opzioni
              </h2>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="minMatch"
                    className="text-xs font-bold uppercase tracking-widest text-foreground"
                  >
                    Compatibilità minima
                  </label>
                  <span className="font-headline text-lg text-secondary">
                    {minMatchPercent}%
                  </span>
                </div>
                <input
                  id="minMatch"
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={minMatchPercent}
                  onChange={(e) => setMinMatchPercent(Number(e.target.value))}
                  className="w-full accent-secondary cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-foreground">
                    Sostituzioni
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Usa ingredienti alternativi
                  </p>
                </div>
                <Button
                  type="button"
                  variant={allowSubstitutions ? "secondary" : "outline"}
                  size="sm"
                  className="rounded-none uppercase tracking-widest text-[10px] font-bold shrink-0"
                  aria-pressed={allowSubstitutions}
                  onClick={() => setAllowSubstitutions((v) => !v)}
                >
                  {allowSubstitutions ? "Attive" : "Disattive"}
                </Button>
              </div>

              {allowSubstitutions && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-foreground block mb-2">
                    Affidabilità sostituti
                  </label>
                  <Select
                    value={minSubstitutionScore}
                    onValueChange={setMinSubstitutionScore}
                  >
                    <SelectTrigger className="w-full h-10 bg-background rounded-none border-border focus:ring-secondary">
                      <SelectValue placeholder="Qualsiasi" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="rounded-none border-border">
                      <SelectItem value="any">Qualsiasi</SelectItem>
                      <SelectItem value="0.3">Bassa (0.3+)</SelectItem>
                      <SelectItem value="0.5">Media (0.5+)</SelectItem>
                      <SelectItem value="0.7">Alta (0.7+)</SelectItem>
                      <SelectItem value="0.9">Solo ottime (0.9+)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Quanto devono somigliare i sostituti all&apos;ingrediente
                    originale. Più alta = solo sostituti molto simili; più bassa
                    = anche sostituti di ripiego.
                  </p>
                </div>
              )}

              <Button
                type="button"
                onClick={calcola}
                disabled={pantryMatch.isPending}
                className="w-full h-12 bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-none tracking-widest uppercase font-bold text-xs"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {pantryMatch.isPending ? "Calcolo..." : "Calcola"}
              </Button>
            </div>
          </div>
        </aside>

        <section className="lg:col-span-8 xl:col-span-9">
          {pantryMatch.isPending ? (
            <Loading label="Incrocio la tua dispensa..." />
          ) : !result ? (
            <EmptyState
              icon={<Refrigerator className="w-10 h-10" />}
              title="Apri il frigo"
              description="Aggiungi gli ingredienti che hai e premi Calcola: ti mostreremo le ricette ordinate per compatibilità."
            />
          ) : (
            <Results data={result} />
          )}
        </section>
      </div>
    </main>
  );
}

function Results({ data }: { data: PantryMatchResponse }) {
  return (
    <div className="flex flex-col gap-6">
      {data.unrecognizedInputs.length > 0 && (
        <div className="flex items-start gap-3 border border-primary/40 bg-primary/10 p-4 text-sm">
          <AlertTriangle className="w-4 h-4 mt-0.5 text-secondary shrink-0" />
          <p className="text-foreground">
            <span className="font-bold">Non riconosciuti:</span>{" "}
            {data.unrecognizedInputs.join(", ")}. Prova con un nome diverso o un sinonimo.
          </p>
        </div>
      )}

      {data.matches.length === 0 ? (
        <EmptyState
          title="Nessuna corrispondenza"
          description="Nessuna ricetta raggiunge la soglia scelta. Prova ad abbassare la compatibilità minima, attivare le sostituzioni o aggiungere ingredienti."
        />
      ) : (
        <>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {data.matches.length}{" "}
            {data.matches.length === 1 ? "ricetta trovata" : "ricette trovate"} · ordinate per
            compatibilità
          </p>
          {data.matches.map((m) => (
            <MatchCard key={m.recipe.id} match={m} />
          ))}
        </>
      )}
    </div>
  );
}

function MatchCard({ match }: { match: RecipeMatchResult }) {
  const { recipe, matchPercent, coveredIngredients, missingIngredients, substitutions } = match;
  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  // indicizzo i sostituti per ingrediente mancante, così li mostro accanto alla X
  const substByRequired = new Map(substitutions.map((s) => [s.requiredIngredient, s]));

  return (
    <Card className="rounded-none border border-border ring-0 bg-card transition-colors hover:border-secondary p-0 gap-0">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-4 mb-5">
          <div className="min-w-0">
            <Link
              href={`/ricetta/${recipe.id}`}
              className="font-headline text-xl sm:text-2xl text-foreground leading-snug transition-colors hover:text-secondary line-clamp-2"
            >
              {recipe.title}
            </Link>
            <p className="mt-1 text-xs text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1">
              {recipe.regionName && <span>{recipe.regionName}</span>}
              {recipe.regionName && <span className="text-border">·</span>}
              <span className="uppercase tracking-widest">
                {difficultyLabel[recipe.difficulty]}
              </span>
              <span className="text-border">·</span>
              <span>{formatMinutes(totalTime)}</span>
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="block font-headline text-3xl sm:text-4xl text-secondary leading-none">
              {Math.round(matchPercent)}%
            </span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
              Compatibilità
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-foreground mb-3">
              Hai {coveredIngredients.length > 0 && `(${coveredIngredients.length})`}
            </h4>
            {coveredIngredients.length > 0 ? (
              <ul className="space-y-2.5">
                {coveredIngredients.map((ing) => (
                  <li key={ing} className="flex items-center gap-2.5 text-sm text-foreground">
                    <Check className="w-4 h-4 text-green-600 shrink-0" />
                    {ing}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Nessun ingrediente in comune.</p>
            )}
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-foreground mb-3">
              Ti manca {missingIngredients.length > 0 && `(${missingIngredients.length})`}
            </h4>
            {missingIngredients.length > 0 ? (
              <ul className="space-y-2.5">
                {missingIngredients.map((ing) => {
                  const subst = substByRequired.get(ing);
                  return (
                    <li key={ing} className="text-sm">
                      {subst ? (
                        // manca ma c'è un sostituto
                        <div className="border border-border bg-muted/20 p-2.5">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <X className="w-4 h-4 text-destructive shrink-0" />
                            <span className="line-through">{ing}</span>
                          </div>
                          <div className="ml-6 mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-secondary">
                            <span className="inline-flex items-center gap-1.5 font-medium">
                              <RefreshCw className="w-3 h-3" />
                              usi: {subst.substituteUsed}
                            </span>
                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                              {Math.round(subst.compatibilityScore * 100)}% affidabile
                            </span>
                          </div>
                          {subst.note && (
                            <p className="ml-6 mt-1 text-xs text-muted-foreground">{subst.note}</p>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2.5 text-destructive font-medium">
                          <X className="w-4 h-4 shrink-0" />
                          {ing}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-green-700">Hai tutto il necessario.</p>
            )}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border/60 flex justify-end">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="rounded-none uppercase tracking-widest text-xs hover:bg-transparent hover:text-secondary"
          >
            <Link href={`/ricetta/${recipe.id}`}>
              Vedi ricetta <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
