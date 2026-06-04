import Link from "next/link";
import { Clock, Star, UtensilsCrossed } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { difficultyLabel, formatMinutes } from "@/lib/labels";
import type { RecipeSummary } from "@/lib/types";

// Card ricetta, riusata in home, esplora, regione e svuotafrigo.
export function RecipeCard({ recipe }: { recipe: RecipeSummary }) {
  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  return (
    <Link
      href={`/ricetta/${recipe.id}`}
      className="group block h-full rounded-none outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <article className="h-full flex flex-col border border-border bg-card overflow-hidden transition-[transform,box-shadow,border-color] duration-300 ease-out-quart group-hover:border-secondary group-hover:shadow-lg group-hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none">
        <div className="relative h-44 w-full overflow-hidden bg-muted/60">
          {recipe.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 ease-out-quart group-hover:scale-105 motion-reduce:transition-none"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground/50">
              <UtensilsCrossed className="w-8 h-8" />
            </div>
          )}
          {recipe.regionName && (
            <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground rounded-none border-none text-[10px] uppercase tracking-widest">
              {recipe.regionName}
            </Badge>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-sm font-bold text-foreground tabular-nums">
              <Star className="w-3.5 h-3.5 fill-primary text-primary" />
              {recipe.averageRating.toFixed(1)}
              <span className="font-normal text-muted-foreground">/10</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {recipe.reviewCount} {recipe.reviewCount === 1 ? "voto" : "voti"}
            </span>
          </div>

          <h3 className="mb-auto font-headline text-xl leading-snug text-foreground line-clamp-2 transition-colors group-hover:text-secondary">
            {recipe.title}
          </h3>

          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> {formatMinutes(totalTime)}
            </span>
            <span className="uppercase tracking-widest">{difficultyLabel[recipe.difficulty]}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
