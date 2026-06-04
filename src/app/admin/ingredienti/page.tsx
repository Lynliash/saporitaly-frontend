"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Carrot, Check, ChevronDown, Info, Pencil, Plus, Search, Tag, Trash2, X } from "lucide-react";

import { SectionHeader } from "@/components/SectionHeader";
import { Loading, ErrorState, EmptyState } from "@/components/states";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useIngredients,
  useCreateIngredient,
  useUpdateIngredient,
  useDeleteIngredient,
  useAliases,
  useCreateAlias,
  useDeleteAlias,
} from "@/hooks/useIngredients";
import { apiError } from "@/lib/api";
import { categoryLabel } from "@/lib/labels";
import type { CreateIngredientRequest, Ingredient, IngredientCategory } from "@/lib/types";

const CATEGORIES = Object.keys(categoryLabel) as IngredientCategory[];

const ingredientSchema = z.object({
  name: z.string().min(2, "Il nome deve avere almeno 2 caratteri"),
  category: z.enum([
    "PRODUCE",
    "MEAT",
    "FISH",
    "DAIRY",
    "GRAIN",
    "LEGUME",
    "HERB",
    "PANTRY",
    "CONDIMENT",
    "OTHER",
    "ALCOHOL",
  ] as const),
  slug: z.string().optional(),
  isPantryDefault: z.boolean().optional(),
});

type IngredientFormValues = z.infer<typeof ingredientSchema>;

const labelClass = "text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block";

const PANTRY_HELP =
  "Ingrediente sempre considerato presente in dispensa: lo svuotafrigo non lo chiede mai (es. sale, olio, acqua).";

// Alias derivati dal nome troncandolo di 1 e 2 caratteri, solo se >= 3 char e diversi dal nome
function suggestAliases(name: string): string[] {
  const base = name.trim().toLowerCase();
  if (base.length < 3) return [];
  const out: string[] = [];
  for (const cut of [1, 2]) {
    const candidate = base.slice(0, base.length - cut);
    if (candidate.length >= 3 && candidate !== base && !out.includes(candidate)) {
      out.push(candidate);
    }
  }
  return out;
}

export default function AdminIngredientiPage() {
  const { data: ingredients, isLoading, isError } = useIngredients();
  const createIngredient = useCreateIngredient();

  // Stesso stato per la ricerca nella lista e per il campo nome del form
  const [filter, setFilter] = useState("");

  const [aliases, setAliases] = useState<string[]>([]);
  const [newAlias, setNewAlias] = useState("");
  // Suggerimenti già scartati: non li riproponiamo mentre digita
  const [dismissedSuggestions, setDismissedSuggestions] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IngredientFormValues>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: { isPantryDefault: false },
  });

  const category = watch("category");
  const nameValue = watch("name") ?? "";
  const pantryDefault = watch("isPantryDefault") ?? false;

  const sorted = useMemo(
    () => [...(ingredients ?? [])].sort((a, b) => a.name.localeCompare(b.name, "it")),
    [ingredients]
  );
  const visible = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter(
      (ing) => ing.name.toLowerCase().includes(q) || ing.slug.toLowerCase().includes(q)
    );
  }, [sorted, filter]);

  // Match esatto sul nome digitato, per avvisare che esiste già
  const exactMatch = useMemo(() => {
    const q = nameValue.trim().toLowerCase();
    if (!q) return undefined;
    return sorted.find((ing) => ing.name.toLowerCase() === q);
  }, [sorted, nameValue]);

  // Esclude i suggerimenti già aggiunti o scartati
  const aliasSuggestions = useMemo(
    () =>
      suggestAliases(nameValue).filter(
        (s) => !aliases.includes(s) && !dismissedSuggestions.includes(s)
      ),
    [nameValue, aliases, dismissedSuggestions]
  );

  // Il nome digitato filtra anche la lista a destra
  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const addAlias = (value: string) => {
    const v = value.trim().toLowerCase();
    if (!v || aliases.includes(v)) return;
    setAliases((prev) => [...prev, v]);
  };

  const removeAlias = (value: string) => setAliases((prev) => prev.filter((a) => a !== value));

  const acceptSuggestion = (value: string) => addAlias(value);
  const dismissSuggestion = (value: string) =>
    setDismissedSuggestions((prev) => [...prev, value]);

  const resetCreateForm = () => {
    reset({ name: "", category: undefined, slug: "", isPantryDefault: false });
    setAliases([]);
    setNewAlias("");
    setDismissedSuggestions([]);
    setFilter(""); // il filtro rispecchia il nome, va azzerato anche lui
  };

  const onSubmit = (values: IngredientFormValues) => {
    const body: CreateIngredientRequest = {
      name: values.name.trim(),
      category: values.category,
      slug: values.slug?.trim() || undefined,
      isPantryDefault: values.isPantryDefault ?? false,
      aliases: aliases.length > 0 ? aliases : undefined,
    };
    createIngredient.mutate(body, {
      onSuccess: (created) => {
        toast.success("Ingrediente creato", { description: created.name });
        resetCreateForm();
      },
      onError: (err) => toast.error(apiError(err)),
    });
  };

  // Se acceso forza la categoria a Dispensa
  const onPantryToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setValue("isPantryDefault", checked);
    if (checked) setValue("category", "PANTRY", { shouldValidate: true });
  };

  return (
    <div>
      <SectionHeader
        eyebrow="Backoffice"
        title="Dizionario Ingredienti"
        description="Gestisci gli ingredienti del catalogo e mappa i sinonimi per il motore di ricerca."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-1">
          <Card className="rounded-none border-border bg-card lg:sticky lg:top-6">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">
                  Nuovo Ingrediente
                </h3>

                <div>
                  <label className={labelClass}>Nome</label>
                  <Input
                    placeholder="Es. Guanciale"
                    className={`bg-muted/10 rounded-none border-border ${errors.name ? "border-destructive" : ""}`}
                    {...register("name", { onChange: onNameChange })}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive mt-1 font-medium">{errors.name.message}</p>
                  )}
                  {exactMatch && (
                    <p className="text-xs text-secondary mt-1 font-medium flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 shrink-0" />
                      Esiste già: {exactMatch.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Categoria</label>
                  <Select
                    value={category ?? ""}
                    onValueChange={(v) => {
                      const next = v as IngredientCategory;
                      setValue("category", next, { shouldValidate: true });
                      // Se la categoria non è Dispensa, spegne il flag
                      if (next !== "PANTRY") setValue("isPantryDefault", false);
                    }}
                  >
                    <SelectTrigger
                      className={`w-full h-10 bg-muted/10 rounded-none border-border ${errors.category ? "border-destructive" : ""}`}
                    >
                      <SelectValue placeholder="Seleziona categoria" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c} className="rounded-none">
                          {categoryLabel[c]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-xs text-destructive mt-1 font-medium">
                      Seleziona una categoria
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Slug (opzionale)</label>
                  <Input
                    placeholder="Es. guanciale (generato se vuoto)"
                    className="bg-muted/10 rounded-none border-border"
                    {...register("slug")}
                  />
                </div>

                <div>
                  <label className={labelClass}>Alias (opzionali)</label>
                  {aliases.length > 0 && (
                    <ul className="flex flex-wrap gap-2 mb-2">
                      {aliases.map((a) => (
                        <li
                          key={a}
                          className="flex items-center gap-2 border border-border bg-background px-2.5 py-1 text-sm text-foreground"
                        >
                          <Tag className="w-3 h-3 opacity-50" />
                          {a}
                          <button
                            type="button"
                            title="Rimuovi alias"
                            onClick={() => removeAlias(a)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  {aliasSuggestions.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                        Suggeriti:
                      </span>
                      {aliasSuggestions.map((s) => (
                        <span
                          key={s}
                          className="flex items-center gap-1.5 border border-dashed border-secondary/60 bg-secondary/5 px-2.5 py-1 text-sm text-foreground"
                        >
                          {s}
                          <button
                            type="button"
                            title="Aggiungi questo alias"
                            onClick={() => acceptSuggestion(s)}
                            className="text-secondary hover:text-secondary/70 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            title="Scarta suggerimento"
                            onClick={() => dismissSuggestion(s)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <Input
                      value={newAlias}
                      onChange={(e) => setNewAlias(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addAlias(newAlias);
                          setNewAlias("");
                        }
                      }}
                      placeholder="Nuovo alias (es. guancia)"
                      className="bg-muted/10 rounded-none border-border"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={!newAlias.trim()}
                      onClick={() => {
                        addAlias(newAlias);
                        setNewAlias("");
                      }}
                      className="rounded-none border-border font-bold text-xs uppercase tracking-widest shrink-0 h-8"
                    >
                      <Plus className="w-4 h-4" />
                      Aggiungi
                    </Button>
                  </div>
                </div>

                {/* Controlled, così possiamo forzare la categoria a Dispensa */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer select-none border border-border bg-muted/10 p-3 hover:border-secondary transition-colors">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-secondary"
                      checked={pantryDefault}
                      onChange={onPantryToggle}
                    />
                    <span className="text-sm text-foreground">In dispensa di default</span>
                  </label>
                  <p className="text-xs text-muted-foreground mt-1.5 flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    {PANTRY_HELP}
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={createIngredient.isPending}
                  className="bg-secondary text-white hover:bg-secondary/90 rounded-none font-bold text-xs uppercase tracking-widest h-12 mt-2"
                >
                  {createIngredient.isPending ? "Salvataggio..." : "Salva Ingrediente"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {isLoading ? (
            <Loading label="Caricamento ingredienti..." />
          ) : isError ? (
            <ErrorState message="Impossibile caricare gli ingredienti." />
          ) : !ingredients || ingredients.length === 0 ? (
            <EmptyState
              icon={<Carrot className="w-8 h-8" />}
              title="Nessun ingrediente"
              description="Aggiungi il primo ingrediente dal modulo a sinistra."
            />
          ) : (
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Cerca per nome o slug..."
                  className="bg-muted/10 rounded-none border-border pl-9 pr-9"
                />
                {filter && (
                  <button
                    type="button"
                    title="Pulisci ricerca"
                    onClick={() => setFilter("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {visible.length === 0 ? (
                <EmptyState
                  icon={<Search className="w-8 h-8" />}
                  title="Nessun risultato"
                  description={`Nessun ingrediente corrisponde a "${filter.trim()}".`}
                />
              ) : (
                <Card className="rounded-none border-border">
                  <CardContent className="p-0">
                    <div className="hidden sm:grid grid-cols-[1fr_auto] gap-4 border-b border-border bg-muted/30 px-4 py-3 uppercase text-[10px] tracking-widest font-bold text-muted-foreground">
                      <span>
                        Ingrediente
                        <span className="ml-2 font-medium normal-case tracking-normal text-muted-foreground/70">
                          ({visible.length}
                          {visible.length !== sorted.length ? ` di ${sorted.length}` : ""})
                        </span>
                      </span>
                      <span className="text-right">Azioni</span>
                    </div>

                    <ul className="divide-y divide-border/60">
                      {visible.map((ing) => (
                        <IngredientRow
                          key={ing.id}
                          ing={ing}
                          highlight={exactMatch?.id === ing.id}
                        />
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Riga ingrediente: gestisce localmente edit inline e apertura del pannello alias.
function IngredientRow({ ing, highlight }: { ing: Ingredient; highlight?: boolean }) {
  const updateIngredient = useUpdateIngredient();
  const deleteIngredient = useDeleteIngredient();

  const [aliasOpen, setAliasOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  // bozza di modifica inline
  const [name, setName] = useState(ing.name);
  const [category, setCategory] = useState<IngredientCategory>(ing.category);
  const [slug, setSlug] = useState(ing.slug);
  const [pantry, setPantry] = useState(ing.isPantryDefault);

  const startEdit = () => {
    setName(ing.name);
    setCategory(ing.category);
    setSlug(ing.slug);
    setPantry(ing.isPantryDefault);
    setEditing(true);
  };

  // Se acceso forza la categoria a Dispensa
  const onPantryToggle = (checked: boolean) => {
    setPantry(checked);
    if (checked) setCategory("PANTRY");
  };

  // Se la categoria non è Dispensa, spegne il flag
  const onCategoryChange = (next: IngredientCategory) => {
    setCategory(next);
    if (next !== "PANTRY") setPantry(false);
  };

  const save = () => {
    if (name.trim().length < 2) {
      toast.error("Il nome deve avere almeno 2 caratteri");
      return;
    }
    updateIngredient.mutate(
      { id: ing.id, body: { name: name.trim(), category, slug: slug.trim() || undefined, isPantryDefault: pantry } },
      {
        onSuccess: () => {
          toast.success("Ingrediente aggiornato", { description: name.trim() });
          setEditing(false);
        },
        onError: (err) => toast.error(apiError(err)),
      }
    );
  };

  const handleDelete = () => {
    if (!confirm(`Eliminare "${ing.name}"? L'azione è irreversibile.`)) return;
    deleteIngredient.mutate(ing.id, {
      onSuccess: () => toast.success("Ingrediente eliminato", { description: ing.name }),
      // Il BE blocca l'eliminazione se è usato in una ricetta
      onError: (err) => toast.error(apiError(err)),
    });
  };

  return (
    <li className={`transition-colors ${highlight ? "bg-secondary/10" : "hover:bg-muted/10"}`}>
      {editing ? (
        <div className="flex flex-col gap-3 px-4 py-4 bg-muted/20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome"
              className="bg-background rounded-none border-border"
            />
            <Select value={category} onValueChange={(v) => onCategoryChange(v as IngredientCategory)}>
              <SelectTrigger className="w-full h-10 bg-background rounded-none border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-none">
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c} className="rounded-none">
                    {categoryLabel[c]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="Slug"
              className="bg-background rounded-none border-border"
            />
            <label className="flex items-center gap-3 cursor-pointer select-none border border-border bg-background px-3">
              <input
                type="checkbox"
                className="h-4 w-4 accent-secondary"
                checked={pantry}
                onChange={(e) => onPantryToggle(e.target.checked)}
              />
              <span className="text-sm text-foreground">In dispensa di default</span>
            </label>
          </div>
          <p className="text-xs text-muted-foreground flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            {PANTRY_HELP}
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={updateIngredient.isPending}
              onClick={save}
              className="rounded-none font-bold text-xs uppercase tracking-widest"
            >
              <Check className="w-4 h-4" /> Salva
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditing(false)}
              className="rounded-none border-border font-bold text-xs uppercase tracking-widest"
            >
              Annulla
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3">
          <div className="flex flex-wrap items-center gap-2 min-w-0 flex-1">
            <span className="font-bold text-foreground truncate">{ing.name}</span>
            <Badge variant="outline" className="rounded-none border-border text-muted-foreground">
              {categoryLabel[ing.category]}
            </Badge>
            {ing.isPantryDefault && (
              <Badge variant="secondary" className="rounded-none">
                Dispensa
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              aria-expanded={aliasOpen}
              onClick={() => setAliasOpen((v) => !v)}
              className="rounded-none border-border h-8 font-bold text-[10px] uppercase tracking-widest"
            >
              <Tag className="w-3.5 h-3.5" />
              Alias
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${aliasOpen ? "rotate-180" : ""}`} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              title="Modifica ingrediente"
              onClick={startEdit}
              className="rounded-none border-border h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              title="Elimina ingrediente"
              disabled={deleteIngredient.isPending}
              onClick={handleDelete}
              className="rounded-none border-border h-8 w-8 text-destructive hover:bg-destructive hover:text-white"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {aliasOpen && (
        <div className="border-t border-border/60 bg-muted/20 px-4 py-4">
          <AliasPanel ingredientId={ing.id} ingredientName={ing.name} />
        </div>
      )}
    </li>
  );
}

// Carica gli alias solo quando la riga viene aperta
function AliasPanel({
  ingredientId,
  ingredientName,
}: {
  ingredientId: number;
  ingredientName: string;
}) {
  const { data: aliases, isLoading, isError } = useAliases(ingredientId);
  const createAlias = useCreateAlias();
  const deleteAlias = useDeleteAlias();

  const [newAlias, setNewAlias] = useState("");

  const handleAdd = () => {
    const value = newAlias.trim();
    if (!value) return;
    createAlias.mutate(
      { ingredientId, body: { alias: value } },
      {
        onSuccess: () => {
          toast.success("Alias aggiunto", { description: `${value} → ${ingredientName}` });
          setNewAlias("");
        },
        onError: (err) => toast.error(apiError(err)),
      }
    );
  };

  const handleDelete = (aliasId: number, alias: string) => {
    deleteAlias.mutate(
      { aliasId, ingredientId },
      {
        onSuccess: () => toast.success("Alias rimosso", { description: alias }),
        onError: (err) => toast.error(apiError(err)),
      }
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">
        Alias di {ingredientName}
      </p>

      {isLoading ? (
        <Loading label="Caricamento alias..." />
      ) : isError ? (
        <ErrorState message="Impossibile caricare gli alias." />
      ) : !aliases || aliases.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nessun alias mappato per questo ingrediente.</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {aliases.map((a) => (
            <li
              key={a.id}
              className="flex items-center gap-2 border border-border bg-background px-2.5 py-1 text-sm text-foreground"
            >
              <Tag className="w-3 h-3 opacity-50" />
              {a.alias}
              <button
                type="button"
                title="Rimuovi alias"
                disabled={deleteAlias.isPending}
                onClick={() => handleDelete(a.id, a.alias)}
                className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          value={newAlias}
          onChange={(e) => setNewAlias(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder="Nuovo alias (es. guancia)"
          className="bg-background rounded-none border-border"
        />
        <Button
          type="button"
          variant="secondary"
          disabled={createAlias.isPending || !newAlias.trim()}
          onClick={handleAdd}
          className="rounded-none font-bold text-xs uppercase tracking-widest shrink-0 h-9"
        >
          <Plus className="w-4 h-4" />
          Aggiungi
        </Button>
      </div>
    </div>
  );
}
