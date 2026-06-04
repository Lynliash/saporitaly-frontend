// Intestazione di sezione (occhiello + titolo), usata in giro per il sito.
export function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8 md:mb-10">
      {eyebrow && (
        <p className="text-secondary text-xs font-bold tracking-widest uppercase mb-2">{eyebrow}</p>
      )}
      <h1 className="text-3xl sm:text-4xl font-headline text-foreground leading-tight">{title}</h1>
      {description && <p className="text-muted-foreground mt-3 max-w-2xl">{description}</p>}
    </div>
  );
}
