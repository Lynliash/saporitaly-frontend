"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { ArrowLeftRight, ArrowRight, Replace, Search, Trash2 } from "lucide-react";

import { AuthGuard } from "@/components/AuthGuard";
import { SearchableSelect } from "@/components/SearchableSelect";
import { Loading, ErrorState, EmptyState } from "@/components/states";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  useIngredients,
  useSubstitutions,
  useCreateSubstitution,
  useDeleteSubstitution,
} from "@/hooks/useIngredients";
import { apiError } from "@/lib/api";

const helperClass = "text-xs text-muted-foreground mb-2 leading-snug";

// Lo score di compatibilità sta tra 0.0 e 1.0, come vincola il BE
const regolaSchema = z
  .object({
    ingredientId: z
      .number({ message: "Seleziona l'ingrediente mancante" })
      .int()
      .positive("Seleziona l'ingrediente mancante"),
    substituteId: z
      .number({ message: "Seleziona il sostituto" })
      .int()
      .positive("Seleziona il sostituto"),
    compatibilityScore: z
      .number({ message: "Il punteggio deve essere un numero" })
      .min(0, "Il punteggio minimo è 0.0")
      .max(1, "Il punteggio massimo è 1.0"),
    note: z.string().optional(),
  })
  // Un ingrediente non può sostituire sé stesso (anche il BE lo rifiuta)
  .refine((d) => d.ingredientId !== d.substituteId, {
    message: "L'ingrediente e il sostituto devono essere diversi",
    path: ["substituteId"],
  });

type RegolaFormValues = z.infer<typeof regolaSchema>;

function RegoleContent() {
  const { data: ingredients, isLoading: ingredientsLoading } = useIngredients();
  const { data: substitutions, isLoading, isError } = useSubstitutions();
  const createSub = useCreateSubstitution();
  const deleteSub = useDeleteSubstitution();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegolaFormValues>({
    resolver: zodResolver(regolaSchema),
    defaultValues: { compatibilityScore: 0.5, note: "" },
  });

  const ingredientId = watch("ingredientId");
  const substituteId = watch("substituteId");

  const [filter, setFilter] = useState("");

  // L'ordinamento lo gestisce SearchableSelect
  const options = useMemo(
    () => (ingredients ?? []).map((ing) => ({ value: ing.id, label: ing.name })),
    [ingredients]
  );

  const visibleSubs = useMemo(() => {
    const list = substitutions ?? [];
    const q = filter.trim().toLowerCase();
    return list
      .filter(
        (s) =>
          !q ||
          s.ingredientName.toLowerCase().includes(q) ||
          s.substituteName.toLowerCase().includes(q)
      )
      .sort((a, b) => a.ingredientName.localeCompare(b.ingredientName, "it"));
  }, [substitutions, filter]);

  const onSubmit = (data: RegolaFormValues) => {
    createSub.mutate(
      {
        ingredientId: data.ingredientId,
        substituteId: data.substituteId,
        compatibilityScore: data.compatibilityScore,
        note: data.note?.trim() ? data.note.trim() : undefined,
      },
      {
        onSuccess: () => {
          toast.success("Regola creata", {
            description: "La sostituzione è ora attiva per lo Svuota Frigo.",
          });
          reset({ compatibilityScore: 0.5, note: "" });
        },
        onError: (err) => toast.error(apiError(err)),
      }
    );
  };

  const onDelete = (id: number, label: string) => {
    if (!window.confirm(`Eliminare la regola "${label}"?`)) return;
    deleteSub.mutate(id, {
      onSuccess: () => toast.success("Regola eliminata"),
      onError: (err) => toast.error(apiError(err)),
    });
  };

  return (
    <div>
      <div className="mb-8 sm:mb-10 border-b border-border pb-6">
        <p className="text-secondary text-xs font-bold tracking-widest uppercase mb-2">Svuota Frigo</p>
        <h1 className="text-3xl sm:text-4xl font-headline text-foreground mb-2">Regole di Sostituzione</h1>
        <p className="text-muted-foreground max-w-2xl">
          Configura le logiche di rimpiazzo ingredienti. Il punteggio di compatibilità va da 0.0 (scarso) a 1.0 (perfetto).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-1">
          <Card className="rounded-none border-border bg-muted/10">
            <CardContent className="p-5 sm:p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Nuova Regola</h3>

                {/* Le regole sono bidirezionali lato BE */}
                <p className="flex items-start gap-2 border border-border bg-white p-3 text-xs text-muted-foreground leading-snug">
                  <ArrowLeftRight className="w-4 h-4 shrink-0 text-secondary mt-0.5" />
                  <span>
                    Le regole valgono in entrambi i versi: se A&rarr;B, allora anche B può sostituire A.
                  </span>
                </p>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                    Se manca
                  </label>
                  <p className={helperClass}>
                    L&apos;ingrediente che la ricetta richiede ma che potrebbe mancarti.
                  </p>
                  <SearchableSelect
                    options={options}
                    value={ingredientId}
                    onChange={(v) => setValue("ingredientId", v, { shouldValidate: true })}
                    placeholder={ingredientsLoading ? "Caricamento..." : "Scegli ingrediente"}
                    disabled={ingredientsLoading}
                    hasError={!!errors.ingredientId}
                  />
                  {errors.ingredientId && (
                    <p className="text-xs text-destructive mt-1 font-medium">{errors.ingredientId.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                    Usa al suo posto
                  </label>
                  <p className={helperClass}>Cosa puoi usare in sostituzione.</p>
                  <SearchableSelect
                    options={options}
                    value={substituteId}
                    onChange={(v) => setValue("substituteId", v, { shouldValidate: true })}
                    placeholder={ingredientsLoading ? "Caricamento..." : "Scegli sostituto"}
                    disabled={ingredientsLoading}
                    hasError={!!errors.substituteId}
                  />
                  {errors.substituteId && (
                    <p className="text-xs text-destructive mt-1 font-medium">{errors.substituteId.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                    Compatibilità (0.0 - 1.0)
                  </label>
                  <p className={helperClass}>
                    Quanto il sostituto somiglia all&apos;originale: 1.0 = identico, valori bassi =
                    ripiego.
                  </p>
                  <Input
                    type="number"
                    step="0.05"
                    min="0"
                    max="1"
                    placeholder="Es. 0.85"
                    className={`bg-white rounded-none border-border ${errors.compatibilityScore ? "border-destructive" : ""}`}
                    {...register("compatibilityScore", { valueAsNumber: true })}
                  />
                  {errors.compatibilityScore && (
                    <p className="text-xs text-destructive mt-1 font-medium">{errors.compatibilityScore.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                    Nota <span className="font-normal lowercase tracking-normal">(opzionale)</span>
                  </label>
                  <p className={helperClass}>
                    Testo libero mostrato all&apos;utente quando il sostituto viene applicato (es.
                    &laquo;perde un po&apos; di cremosità&raquo;).
                  </p>
                  <Input
                    placeholder="Es. solo per piatti freddi"
                    className="bg-white rounded-none border-border"
                    {...register("note")}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={createSub.isPending}
                  className="bg-secondary text-white hover:bg-secondary/90 rounded-none font-bold text-xs uppercase tracking-widest h-12 mt-2 disabled:opacity-60"
                >
                  {createSub.isPending ? "Salvataggio..." : "Aggiungi Regola"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {isLoading ? (
            <Loading label="Caricamento regole..." />
          ) : isError ? (
            <ErrorState message="Impossibile caricare le regole di sostituzione." />
          ) : !substitutions || substitutions.length === 0 ? (
            <EmptyState
              icon={<Replace className="w-10 h-10" />}
              title="Nessuna regola configurata"
              description="Crea la prima regola di sostituzione usando il modulo a fianco."
            />
          ) : (
            <Card className="rounded-none border-border">
              <CardContent className="p-0">
                <div className="border-b border-border p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      placeholder="Cerca per ingrediente o sostituto..."
                      className="bg-background rounded-none border-border pl-9 h-10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {visibleSubs.length} regol{visibleSubs.length === 1 ? "a" : "e"}
                    {filter.trim() && ` su ${substitutions.length}`}
                  </p>
                </div>

                {visibleSubs.length === 0 ? (
                  <p className="p-8 text-center text-sm text-muted-foreground">
                    Nessuna regola corrisponde a &laquo;{filter.trim()}&raquo;.
                  </p>
                ) : (
                <div className="max-h-[70vh] overflow-y-auto">
                <table className="hidden md:table w-full text-left border-collapse text-sm text-foreground">
                  <thead>
                    <tr className="border-b border-border bg-muted/30 uppercase text-[10px] tracking-widest font-bold text-muted-foreground">
                      <th className="p-4">Regola Logica</th>
                      <th className="p-4">Compatibilità</th>
                      <th className="p-4">Nota</th>
                      <th className="p-4 text-right">Azioni</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {visibleSubs.map((s) => (
                      <tr key={s.id} className="hover:bg-muted/20 transition-colors align-top">
                        <td className="p-4 font-medium">
                          <span className="inline-flex items-center gap-2 flex-wrap">
                            {s.ingredientName}
                            <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                            <span className="text-secondary font-bold">{s.substituteName}</span>
                          </span>
                        </td>
                        <td className="p-4 font-bold text-foreground whitespace-nowrap">
                          {s.compatibilityScore.toFixed(2)}
                          <span className="text-muted-foreground font-normal ml-1">
                            ({Math.round(s.compatibilityScore * 100)}%)
                          </span>
                        </td>
                        <td className="p-4 text-muted-foreground">{s.note || "—"}</td>
                        <td className="p-4 text-right">
                          <Button
                            variant="outline"
                            size="icon"
                            disabled={deleteSub.isPending}
                            onClick={() => onDelete(s.id, `${s.ingredientName} → ${s.substituteName}`)}
                            title="Elimina regola"
                            className="rounded-none border-border h-8 w-8 text-destructive hover:bg-destructive hover:text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <ul className="md:hidden divide-y divide-border/50">
                  {visibleSubs.map((s) => (
                    <li key={s.id} className="p-4 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap font-medium text-sm">
                          {s.ingredientName}
                          <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                          <span className="text-secondary font-bold">{s.substituteName}</span>
                        </div>
                        <p className="text-xs font-bold text-foreground mt-1">
                          Compatibilità: {s.compatibilityScore.toFixed(2)}{" "}
                          <span className="text-muted-foreground font-normal">
                            ({Math.round(s.compatibilityScore * 100)}%)
                          </span>
                        </p>
                        {s.note && <p className="text-xs text-muted-foreground mt-1">{s.note}</p>}
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={deleteSub.isPending}
                        onClick={() => onDelete(s.id, `${s.ingredientName} → ${s.substituteName}`)}
                        title="Elimina regola"
                        className="rounded-none border-border h-8 w-8 shrink-0 text-destructive hover:bg-destructive hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
                </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminRegoleSostituzione() {
  return (
    <AuthGuard adminOnly>
      <RegoleContent />
    </AuthGuard>
  );
}
