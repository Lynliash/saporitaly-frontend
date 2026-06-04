"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AxiosError } from "axios";
import {
  Clock,
  Flame,
  Users,
  Star,
  UtensilsCrossed,
  MessageSquare,
  Pencil,
  Trash2,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

import { useRecipe } from "@/hooks/useRecipes";
import {
  useReviewsByRecipe,
  useMyReview,
  useCreateReview,
  useUpdateReview,
  useDeleteReview,
} from "@/hooks/useReviews";
import { useAuth } from "@/hooks/useAuth";
import { apiError } from "@/lib/api";
import { difficultyLabel, recipeTypeLabel, formatMinutes, formatQuantity } from "@/lib/labels";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loading, ErrorState, EmptyState } from "@/components/states";
import RecipeSubstitutions from "@/components/RecipeSubstitutions";
import type { Review } from "@/lib/types";

const RATINGS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function DettaglioRicetta() {
  const { id } = useParams<{ id: string }>();
  const { data: recipe, isLoading, isError, error } = useRecipe(id);

  if (isLoading) {
    return (
      <main className="container mx-auto px-5 sm:px-8 lg:px-10 py-10 sm:py-12 min-h-screen">
        <Loading label="Carico la ricetta..." />
      </main>
    );
  }

  if (isError || !recipe) {
    const notFound = error instanceof AxiosError && error.response?.status === 404;
    return (
      <main className="container mx-auto px-5 sm:px-8 lg:px-10 py-10 sm:py-12 min-h-screen">
        <ErrorState message={notFound ? "Ricetta non trovata." : apiError(error)} />
        <div className="mt-6 text-center">
          <Link href="/esplora">
            <Button variant="outline" className="rounded-none">
              Torna all&apos;archivio
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;
  const steps = [...recipe.steps].sort((a, b) => a.stepOrder - b.stepOrder);

  return (
    <main className="container mx-auto px-5 sm:px-8 lg:px-10 py-12 sm:py-16 min-h-screen">
      <header className="mx-auto max-w-3xl text-center">
        <div className="mb-5 flex flex-wrap items-center justify-center gap-2">
          {recipe.regionName && (
            <Badge className="rounded-none border-none bg-secondary text-secondary-foreground text-[10px] uppercase tracking-widest">
              {recipe.regionName}
            </Badge>
          )}
          <Badge variant="outline" className="rounded-none text-[10px] uppercase tracking-widest">
            {recipeTypeLabel[recipe.type]}
          </Badge>
          <Badge variant="outline" className="rounded-none text-[10px] uppercase tracking-widest">
            {difficultyLabel[recipe.difficulty]}
          </Badge>
        </div>

        <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl leading-tight text-foreground">
          {recipe.title}
        </h1>

        {recipe.description && (
          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground">
            {recipe.description}
          </p>
        )}
      </header>

      <div className="mt-10 sm:mt-12 h-64 sm:h-80 lg:h-112 w-full overflow-hidden border border-border bg-muted/60">
        {recipe.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={recipe.imageUrl} alt={recipe.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground/40">
            <UtensilsCrossed className="w-12 h-12" />
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-y-6 border-y border-border py-6 text-center sm:grid-cols-3 lg:grid-cols-5 lg:divide-x lg:divide-border">
        <MetaItem icon={<Clock className="w-4 h-4 text-secondary" />} label="Preparazione" value={formatMinutes(recipe.prepTimeMinutes)} />
        <MetaItem icon={<Flame className="w-4 h-4 text-secondary" />} label="Cottura" value={formatMinutes(recipe.cookTimeMinutes)} />
        <MetaItem icon={<Clock className="w-4 h-4 text-secondary" />} label="Totale" value={formatMinutes(totalTime)} />
        <MetaItem icon={<Users className="w-4 h-4 text-secondary" />} label="Porzioni" value={`${recipe.servings}`} />
        <MetaItem
          icon={<Star className="w-4 h-4 fill-primary text-primary" />}
          label={`${recipe.reviewCount} ${recipe.reviewCount === 1 ? "voto" : "voti"}`}
          value={
            <>
              {recipe.averageRating.toFixed(1)}
              <span className="text-sm font-normal text-muted-foreground">/10</span>
            </>
          }
        />
      </div>

      <div className="mt-12 sm:mt-16 grid grid-cols-1 gap-12 md:grid-cols-3 lg:gap-16">
        <aside className="md:col-span-1">
          <div className="md:sticky md:top-8 space-y-10">
            <section>
              <SectionLabel>Ingredienti</SectionLabel>
              {recipe.ingredients.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nessun ingrediente indicato.</p>
              ) : (
                <ul className="divide-y divide-border border border-border bg-card">
                  {recipe.ingredients.map((ing) => (
                    <li key={ing.ingredientId} className="px-4 py-3.5">
                      <div className="flex items-baseline justify-between gap-3">
                        <span
                          className={
                            ing.isEssential
                              ? "text-sm font-medium text-foreground"
                              : "text-sm text-muted-foreground"
                          }
                        >
                          {ing.ingredientName}
                          {!ing.isEssential && (
                            <span className="ml-2 text-[10px] uppercase tracking-widest text-muted-foreground/70">
                              facoltativo
                            </span>
                          )}
                        </span>
                        <span className="shrink-0 text-sm font-medium text-secondary tabular-nums">
                          {formatQuantity(ing.quantity, ing.unit)}
                        </span>
                      </div>
                      {ing.note && (
                        <p className="mt-1 text-xs italic text-muted-foreground">{ing.note}</p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <RecipeSubstitutions ingredients={recipe.ingredients} />
          </div>
        </aside>

        <div className="md:col-span-2 space-y-16">
          <section>
            <SectionLabel>Procedimento</SectionLabel>
            {steps.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nessun passaggio indicato.</p>
            ) : (
              <ol className="divide-y divide-border border-t border-border">
                {steps.map((step) => (
                  <li key={step.stepOrder} className="flex gap-5 py-6 first:pt-7">
                    <span className="font-headline text-3xl sm:text-4xl leading-none text-secondary tabular-nums">
                      {String(step.stepOrder).padStart(2, "0")}
                    </span>
                    <p className="pt-1 text-base leading-loose text-foreground">{step.description}</p>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <RecensioniBlock recipeId={id} />
        </div>
      </div>
    </main>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="font-headline text-2xl sm:text-3xl text-foreground">{children}</h2>
      <div className="mt-3 h-px w-12 bg-secondary" />
    </div>
  );
}

function MetaItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 px-2">
      {icon}
      <span className="text-lg font-bold text-foreground tabular-nums">{value}</span>
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
    </div>
  );
}

function RecensioniBlock({ recipeId }: { recipeId: string }) {
  const { isAuthenticated, hasHydrated, username } = useAuth();
  const { data: reviewsPage, isLoading, isError } = useReviewsByRecipe(recipeId);
  const reviews = reviewsPage?.content ?? [];

  return (
    <section>
      <div className="mb-6">
        <h2 className="inline-flex items-center gap-2 font-headline text-2xl sm:text-3xl text-foreground">
          <MessageSquare className="w-5 h-5 text-secondary" />
          Recensioni
        </h2>
        <div className="mt-3 h-px w-12 bg-secondary" />
      </div>

      {hasHydrated && (isAuthenticated ? <MyReview recipeId={recipeId} /> : <LoginNote />)}

      <div className="mt-8">
        {isLoading ? (
          <Loading label="Carico le recensioni..." />
        ) : isError ? (
          <ErrorState message="Impossibile caricare le recensioni." />
        ) : reviews.length === 0 ? (
          <EmptyState
            title="Ancora nessuna recensione"
            description="Sii il primo a raccontare com'è andata in cucina."
            icon={<MessageSquare className="w-8 h-8" />}
          />
        ) : (
          <ul className="space-y-4">
            {reviews.map((r) => (
              <ReviewItem key={r.id} review={r} isMine={r.username === username} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function ReviewItem({ review, isMine }: { review: Review; isMine: boolean }) {
  return (
    <li>
      <Card className="rounded-none border-border ring-0">
        <CardContent className="p-5">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="font-medium text-foreground">
              {review.username}
              {isMine && (
                <span className="ml-2 text-[10px] uppercase tracking-widest text-secondary">
                  tu
                </span>
              )}
            </span>
            <Badge className="rounded-none border-none bg-primary text-primary-foreground font-bold">
              {review.rating}/10
            </Badge>
          </div>
          {review.comment && (
            <p className="text-sm leading-relaxed text-foreground">{review.comment}</p>
          )}
          <p className="mt-3 text-[10px] uppercase tracking-widest text-muted-foreground">
            {formatDate(review.createdAt)}
          </p>
        </CardContent>
      </Card>
    </li>
  );
}

function LoginNote() {
  return (
    <div className="flex flex-col items-start gap-3 border border-dashed border-border bg-muted/20 p-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
        <Lock className="w-4 h-4" />
        Accedi per lasciare la tua valutazione.
      </p>
      <Link href="/auth">
        <Button className="rounded-none bg-secondary text-secondary-foreground hover:bg-secondary/90 text-xs font-bold uppercase tracking-widest">
          Accedi per recensire
        </Button>
      </Link>
    </div>
  );
}

function MyReview({ recipeId }: { recipeId: string }) {
  const { data: myReview, isLoading } = useMyReview(recipeId);
  const [editing, setEditing] = useState(false);

  const deleteReview = useDeleteReview();

  if (isLoading) {
    return <Loading label="Controllo la tua recensione..." />;
  }

  if (myReview) {
    if (editing) {
      return (
        <ReviewForm
          recipeId={recipeId}
          initial={myReview}
          onDone={() => setEditing(false)}
          onCancel={() => setEditing(false)}
        />
      );
    }

    const handleDelete = () => {
      if (!confirm("Eliminare la tua recensione? L'azione è irreversibile.")) return;
      deleteReview.mutate(
        { reviewId: myReview.id, recipeId },
        {
          onSuccess: () => toast.success("Recensione eliminata"),
          onError: (err) => toast.error(apiError(err)),
        },
      );
    };

    return (
      <div className="border border-border bg-muted/10 p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-widest text-secondary">
            La tua valutazione
          </p>
          <Badge className="rounded-none border-none bg-primary text-primary-foreground font-bold">
            {myReview.rating}/10
          </Badge>
        </div>
        {myReview.comment && (
          <p className="text-sm leading-relaxed text-foreground">{myReview.comment}</p>
        )}
        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-none text-xs"
            onClick={() => setEditing(true)}
          >
            <Pencil className="w-3.5 h-3.5" /> Modifica
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-none text-xs text-destructive hover:bg-destructive hover:text-white"
            onClick={handleDelete}
            disabled={deleteReview.isPending}
          >
            <Trash2 className="w-3.5 h-3.5" /> Elimina
          </Button>
        </div>
      </div>
    );
  }

  return <ReviewForm recipeId={recipeId} initial={null} />;
}

function ReviewForm({
  recipeId,
  initial,
  onDone,
  onCancel,
}: {
  recipeId: string;
  initial: Review | null;
  onDone?: () => void;
  onCancel?: () => void;
}) {
  const [rating, setRating] = useState<number | null>(initial?.rating ?? null);
  const [comment, setComment] = useState(initial?.comment ?? "");

  const createReview = useCreateReview();
  const updateReview = useUpdateReview();
  const isEdit = !!initial;
  const isPending = createReview.isPending || updateReview.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating == null) {
      toast.error("Seleziona un voto da 1 a 10");
      return;
    }

    const body = { rating, comment: comment.trim() || undefined };

    if (isEdit) {
      updateReview.mutate(
        { reviewId: initial.id, recipeId, body },
        {
          onSuccess: () => {
            toast.success("Recensione aggiornata");
            onDone?.();
          },
          onError: (err) => toast.error(apiError(err)),
        },
      );
    } else {
      createReview.mutate(
        { recipeId, body },
        {
          onSuccess: () => toast.success("Grazie per la tua recensione"),
          onError: (err) => toast.error(apiError(err)),
        },
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-border bg-muted/10 p-5">
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-secondary">
        {isEdit ? "Modifica la tua valutazione" : "Lascia la tua valutazione"}
      </p>

      <div className="mb-4">
        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Voto (1-10)
        </label>
        <div className="flex flex-wrap gap-1.5">
          {RATINGS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              aria-pressed={rating === n}
              className={`h-9 w-9 border text-sm font-medium transition-colors ${
                rating === n
                  ? "border-secondary bg-secondary text-secondary-foreground"
                  : "border-border bg-background text-foreground hover:border-secondary"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Commento (facoltativo)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="Racconta com'è andata in cucina..."
          className="w-full resize-none border border-border bg-background p-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-secondary"
        />
      </div>

      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={isPending}
          className="rounded-none bg-secondary text-secondary-foreground hover:bg-secondary/90 text-xs font-bold uppercase tracking-widest"
        >
          {isEdit ? "Salva modifiche" : "Pubblica recensione"}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isPending}
            className="rounded-none text-xs"
          >
            Annulla
          </Button>
        )}
      </div>
    </form>
  );
}
