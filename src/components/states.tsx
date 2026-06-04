import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

// Stati condivisi: loading, vuoto, errore.

export function Loading({ label = "Caricamento..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
      <Loader2 className="w-6 h-6 animate-spin text-secondary" />
      <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
    </div>
  );
}

export function ErrorState({ message = "Qualcosa è andato storto." }: { message?: string }) {
  return (
    <div className="border border-destructive/30 bg-destructive/5 p-8 text-center">
      <p className="text-sm text-destructive font-medium">{message}</p>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="border border-dashed border-border bg-muted/20 p-12 text-center flex flex-col items-center gap-3">
      {icon && <div className="text-muted-foreground/60">{icon}</div>}
      <h3 className="font-headline text-xl text-foreground">{title}</h3>
      {description && <p className="text-sm text-muted-foreground max-w-sm">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

// Skeleton coerente con la RecipeCard
export function CardSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border border-border bg-card">
          <div className="h-44 skeleton" />
          <div className="p-5 space-y-3">
            <div className="h-3 w-16 skeleton" />
            <div className="h-5 w-3/4 skeleton" />
            <div className="h-3 w-1/3 skeleton" />
          </div>
        </div>
      ))}
    </div>
  );
}
