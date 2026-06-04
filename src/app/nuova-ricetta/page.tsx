"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Plus, Trash2, ArrowLeft, ListOrdered, Carrot, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { AuthGuard } from "@/components/AuthGuard";
import { SectionHeader } from "@/components/SectionHeader";
import { ImageUpload } from "@/components/ImageUpload";
import { Loading, ErrorState } from "@/components/states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRecipe, useCreateRecipe, useUpdateRecipe } from "@/hooks/useRecipes";
import { useRegions } from "@/hooks/useRegions";
import { useIngredients } from "@/hooks/useIngredients";
import { difficultyLabel, recipeTypeLabel, unitLabel } from "@/lib/labels";
import { apiError } from "@/lib/api";
import type {
  CreateRecipeRequest,
  Difficulty,
  IngredientUnit,
  RecipeType,
} from "@/lib/types";

const DIFFICULTIES: Difficulty[] = ["EASY", "MEDIUM", "HARD"];
const TYPES: RecipeType[] = ["TRADITIONAL", "PERSONAL", "REVISITATION"];
const UNITS: IngredientUnit[] = [
  "GRAMS",
  "KG",
  "ML",
  "L",
  "PIECES",
  "TABLESPOON",
  "TEASPOON",
  "CUP",
  "QB",
];

// quantità/tempi arrivano come stringhe dagli input number, coerce le porta a number. Validazioni allineate al BE.
const schema = z.object({
  title: z.string().trim().min(3, "Il titolo deve avere almeno 3 caratteri"),
  description: z.string().trim().optional(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  prepTimeMinutes: z.coerce.number().int().min(0, "Non può essere negativo"),
  cookTimeMinutes: z.coerce.number().int().min(0, "Non può essere negativo"),
  servings: z.coerce.number().int().min(1, "Almeno 1 porzione"),
  regionId: z.string().optional(), // "" = nessuna
  imageUrl: z
    .string()
    .trim()
    .refine((v) => v === "" || /^https?:\/\/.+/.test(v), "Inserisci un URL valido")
    .optional(),
  type: z.enum(["TRADITIONAL", "PERSONAL", "REVISITATION"]),
  ingredients: z
    .array(
      z.object({
        ingredientId: z.string().min(1, "Scegli un ingrediente"),
        quantity: z.coerce.number().min(0, "Non può essere negativo"),
        unit: z.enum(["GRAMS", "KG", "ML", "L", "PIECES", "TABLESPOON", "TEASPOON", "CUP", "QB"]),
        isEssential: z.boolean(),
        note: z.string().trim().optional(),
      }),
    )
    .min(1, "Aggiungi almeno un ingrediente")
    .refine((rows) => rows.some((r) => r.isEssential), "Almeno un ingrediente deve essere essenziale"),
  steps: z
    .array(z.object({ description: z.string().trim().min(1, "La fase non può essere vuota") }))
    .min(1, "Aggiungi almeno una fase"),
});

type FormValues = z.input<typeof schema>;

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
      {children}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-destructive mt-1 font-medium">{message}</p>;
}

function RecipeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? undefined;
  const isEdit = !!id;

  const regionsQuery = useRegions();
  const ingredientsQuery = useIngredients();
  const recipeQuery = useRecipe(id); // gira solo se c'è l'id

  const createRecipe = useCreateRecipe();
  const updateRecipe = useUpdateRecipe();
  const isPending = createRecipe.isPending || updateRecipe.isPending;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      difficulty: "EASY",
      prepTimeMinutes: 0,
      cookTimeMinutes: 0,
      servings: 1,
      regionId: "",
      imageUrl: "",
      type: "TRADITIONAL",
      ingredients: [{ ingredientId: "", quantity: 0, unit: "GRAMS", isEssential: true, note: "" }],
      steps: [{ description: "" }],
    },
  });

  const ingredientFields = useFieldArray({ control, name: "ingredients" });
  const stepFields = useFieldArray({ control, name: "steps" });

  // in edit precompilo quando arriva il dettaglio. regionId arriva diretto dal BE, niente ambiguità.
  useEffect(() => {
    const r = recipeQuery.data;
    if (!isEdit || !r) return;
    reset({
      title: r.title,
      description: r.description ?? "",
      difficulty: r.difficulty,
      prepTimeMinutes: r.prepTimeMinutes,
      cookTimeMinutes: r.cookTimeMinutes,
      servings: r.servings,
      regionId: r.regionId != null ? String(r.regionId) : "",
      imageUrl: r.imageUrl ?? "",
      type: r.type,
      ingredients: r.ingredients.length
        ? r.ingredients.map((ing) => ({
            ingredientId: String(ing.ingredientId),
            quantity: ing.quantity,
            unit: ing.unit,
            isEssential: ing.isEssential,
            note: ing.note ?? "",
          }))
        : [{ ingredientId: "", quantity: 0, unit: "GRAMS", isEssential: true, note: "" }],
      steps: r.steps.length
        ? [...r.steps].sort((a, b) => a.stepOrder - b.stepOrder).map((s) => ({ description: s.description }))
        : [{ description: "" }],
    });
  }, [isEdit, recipeQuery.data, reset]);

  const onSubmit = (values: FormValues) => {
    const body: CreateRecipeRequest = {
      title: values.title.trim(),
      description: values.description?.trim() || undefined,
      difficulty: values.difficulty,
      prepTimeMinutes: Number(values.prepTimeMinutes),
      cookTimeMinutes: Number(values.cookTimeMinutes),
      servings: Number(values.servings),
      regionId: values.regionId ? Number(values.regionId) : undefined,
      imageUrl: values.imageUrl?.trim() || undefined,
      type: values.type,
      ingredients: values.ingredients.map((ing) => ({
        ingredientId: Number(ing.ingredientId),
        quantity: Number(ing.quantity),
        unit: ing.unit,
        isEssential: ing.isEssential,
        note: ing.note?.trim() || undefined,
      })),
      steps: values.steps.map((s, i) => ({ stepOrder: i + 1, description: s.description.trim() })),
    };

    const onSuccess = () => {
      toast.success(isEdit ? "Ricetta aggiornata" : "Ricetta creata");
      router.push("/admin/ricette");
    };
    const onError = (err: unknown) => toast.error(apiError(err));

    if (isEdit && id) {
      updateRecipe.mutate({ id, body }, { onSuccess, onError });
    } else {
      createRecipe.mutate(body, { onSuccess, onError });
    }
  };

  if (isEdit && recipeQuery.isLoading) return <Loading label="Carico la ricetta..." />;
  if (isEdit && recipeQuery.isError) return <ErrorState message="Impossibile caricare la ricetta." />;

  const regions = regionsQuery.data ?? [];
  const ingredients = ingredientsQuery.data ?? [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
      <div className="lg:col-span-2 space-y-8">
        <Card className="rounded-none border-border ring-0">
          <CardContent className="p-6 sm:p-8 flex flex-col gap-6">
            <div>
              <FieldLabel>Titolo</FieldLabel>
              <Input
                placeholder="Es. Spaghetti alla Carbonara"
                className={`bg-background rounded-none border-border ${errors.title ? "border-destructive" : ""}`}
                {...register("title")}
              />
              <FieldError message={errors.title?.message} />
            </div>

            <div>
              <FieldLabel>Descrizione</FieldLabel>
              <textarea
                rows={3}
                placeholder="Una breve presentazione della ricetta (opzionale)"
                className="w-full bg-background border border-border rounded-none p-3 text-sm focus:outline-none focus:ring-1 focus:ring-secondary"
                {...register("description")}
              />
              <FieldError message={errors.description?.message} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <FieldLabel>Difficoltà</FieldLabel>
                <Controller
                  control={control}
                  name="difficulty"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full bg-background rounded-none border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent position="popper" className="rounded-none border-border">
                        {DIFFICULTIES.map((d) => (
                          <SelectItem key={d} value={d}>
                            {difficultyLabel[d]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div>
                <FieldLabel>Tipo</FieldLabel>
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full bg-background rounded-none border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent position="popper" className="rounded-none border-border">
                        {TYPES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {recipeTypeLabel[t]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <FieldLabel>Preparazione (min)</FieldLabel>
                <Input
                  type="number"
                  min={0}
                  className={`bg-background rounded-none border-border ${errors.prepTimeMinutes ? "border-destructive" : ""}`}
                  {...register("prepTimeMinutes")}
                />
                <FieldError message={errors.prepTimeMinutes?.message} />
              </div>
              <div>
                <FieldLabel>Cottura (min)</FieldLabel>
                <Input
                  type="number"
                  min={0}
                  className={`bg-background rounded-none border-border ${errors.cookTimeMinutes ? "border-destructive" : ""}`}
                  {...register("cookTimeMinutes")}
                />
                <FieldError message={errors.cookTimeMinutes?.message} />
              </div>
              <div>
                <FieldLabel>Porzioni</FieldLabel>
                <Input
                  type="number"
                  min={1}
                  className={`bg-background rounded-none border-border ${errors.servings ? "border-destructive" : ""}`}
                  {...register("servings")}
                />
                <FieldError message={errors.servings?.message} />
              </div>
            </div>

            <div>
              <FieldLabel>Regione</FieldLabel>
              <Controller
                control={control}
                name="regionId"
                render={({ field }) => (
                  <Select
                    value={field.value || "none"}
                    onValueChange={(v) => field.onChange(v === "none" ? "" : v)}
                    disabled={regionsQuery.isLoading}
                  >
                    <SelectTrigger className="w-full bg-background rounded-none border-border">
                      <SelectValue placeholder="Nessuna regione" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="rounded-none border-border">
                      <SelectItem value="none">Nessuna regione</SelectItem>
                      {regions.map((r) => (
                        <SelectItem key={r.id} value={String(r.id)}>
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <FieldLabel>Immagine</FieldLabel>
              <Controller
                control={control}
                name="imageUrl"
                render={({ field }) => (
                  <ImageUpload value={field.value ?? ""} onChange={(url) => field.onChange(url)} />
                )}
              />
              <FieldError message={errors.imageUrl?.message} />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-none border-border ring-0">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-secondary" /> Procedimento
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-none border-border"
                onClick={() => stepFields.append({ description: "" })}
              >
                <Plus className="w-3 h-3 mr-1" /> Fase
              </Button>
            </div>

            <div className="space-y-4">
              {stepFields.fields.map((f, i) => (
                <div key={f.id} className="flex gap-3 items-start">
                  <span className="font-headline text-2xl text-secondary leading-none mt-1 w-7 shrink-0 text-center">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <textarea
                      rows={2}
                      placeholder="Descrivi questa fase..."
                      className={`w-full bg-background border rounded-none p-3 text-sm focus:outline-none focus:ring-1 focus:ring-secondary ${errors.steps?.[i]?.description ? "border-destructive" : "border-border"}`}
                      {...register(`steps.${i}.description` as const)}
                    />
                    <FieldError message={errors.steps?.[i]?.description?.message} />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="rounded-none border-border h-8 w-8 text-destructive hover:bg-destructive hover:text-white shrink-0"
                    onClick={() => stepFields.remove(i)}
                    disabled={stepFields.fields.length === 1}
                    aria-label="Rimuovi fase"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            {typeof errors.steps?.message === "string" && (
              <p className="text-xs text-destructive mt-3 font-medium">{errors.steps.message}</p>
            )}
            {errors.steps?.root?.message && (
              <p className="text-xs text-destructive mt-3 font-medium">{errors.steps.root.message}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <div className="lg:sticky lg:top-10 space-y-6">
          <Card className="rounded-none border-border ring-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                  <Carrot className="w-4 h-4 text-secondary" /> Ingredienti
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-none border-border"
                  onClick={() =>
                    ingredientFields.append({
                      ingredientId: "",
                      quantity: 0,
                      unit: "GRAMS",
                      isEssential: true,
                      note: "",
                    })
                  }
                >
                  <Plus className="w-3 h-3 mr-1" /> Aggiungi
                </Button>
              </div>

              <div className="space-y-5">
                {ingredientFields.fields.map((f, i) => (
                  <div key={f.id} className="border border-border bg-muted/10 p-3 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
                        # {i + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="rounded-none h-6 w-6 text-muted-foreground hover:text-destructive shrink-0"
                        onClick={() => ingredientFields.remove(i)}
                        disabled={ingredientFields.fields.length === 1}
                        aria-label="Rimuovi ingrediente"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div>
                      <Controller
                        control={control}
                        name={`ingredients.${i}.ingredientId` as const}
                        render={({ field }) => (
                          <Select
                            value={field.value || undefined}
                            onValueChange={field.onChange}
                            disabled={ingredientsQuery.isLoading}
                          >
                            <SelectTrigger
                              className={`w-full bg-background rounded-none border-border ${errors.ingredients?.[i]?.ingredientId ? "border-destructive" : ""}`}
                            >
                              <SelectValue placeholder="Scegli ingrediente" />
                            </SelectTrigger>
                            <SelectContent position="popper" className="rounded-none border-border max-h-60">
                              {ingredients.map((ing) => (
                                <SelectItem key={ing.id} value={String(ing.id)}>
                                  {ing.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      <FieldError message={errors.ingredients?.[i]?.ingredientId?.message} />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        min={0}
                        step="any"
                        placeholder="Q.tà"
                        className={`bg-background rounded-none border-border ${errors.ingredients?.[i]?.quantity ? "border-destructive" : ""}`}
                        {...register(`ingredients.${i}.quantity` as const)}
                      />
                      <Controller
                        control={control}
                        name={`ingredients.${i}.unit` as const}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-full bg-background rounded-none border-border">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent position="popper" className="rounded-none border-border max-h-60">
                              {UNITS.map((u) => (
                                <SelectItem key={u} value={u}>
                                  {unitLabel(u)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    <Input
                      placeholder="Nota (opzionale)"
                      className="bg-background rounded-none border-border"
                      {...register(`ingredients.${i}.note` as const)}
                    />

                    <Controller
                      control={control}
                      name={`ingredients.${i}.isEssential` as const}
                      render={({ field }) => (
                        <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            className="h-4 w-4 accent-secondary"
                          />
                          Essenziale
                        </label>
                      )}
                    />
                  </div>
                ))}
              </div>

              {typeof errors.ingredients?.message === "string" && (
                <p className="text-xs text-destructive mt-3 font-medium">{errors.ingredients.message}</p>
              )}
              {errors.ingredients?.root?.message && (
                <p className="text-xs text-destructive mt-3 font-medium">{errors.ingredients.root.message}</p>
              )}
            </CardContent>
          </Card>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-secondary text-white hover:bg-secondary/90 rounded-none font-bold text-xs uppercase tracking-widest h-14"
          >
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isEdit ? "Salva modifiche" : "Salva ricetta"}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default function NuovaRicettaPage() {
  return (
    <AuthGuard adminOnly>
      <main className="container mx-auto px-5 sm:px-8 lg:px-10 py-10 sm:py-12 min-h-screen">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8 md:mb-10">
          <SectionHeader
            eyebrow="Backoffice"
            title="Manoscritto Ricetta"
            description="Compila i dati, le dosi precise e il procedimento da archiviare."
          />
          <Link href="/admin/ricette">
            <Button variant="outline" className="rounded-none border-border">
              <ArrowLeft className="w-4 h-4 mr-2" /> Torna alle ricette
            </Button>
          </Link>
        </div>

        <RecipeForm />
      </main>
    </AuthGuard>
  );
}
