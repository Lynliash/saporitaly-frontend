import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// interfaccia dati in ingresso
interface ArticleCardProps {
  title: string;
  description: string;
  category: string;
  badgeBg: string; // hex del colore
  placeholderText: string;
}

export function ArticleCard({ title, description, category, badgeBg, placeholderText }: ArticleCardProps) {
  return (
    <Card className="rounded-none overflow-hidden border-border group cursor-pointer hover:shadow-lg transition-shadow">
      {/* box img temporaneo */}
      <div className="h-56 w-full flex items-center justify-center bg-muted/50">
        <span className="text-muted-foreground font-bold tracking-widest uppercase text-xs">[{placeholderText}]</span>
      </div>

      <CardContent className="p-8">
        {/* custom style sul badge per sovrascrievre shadcn */}
        <Badge
          className="text-[10px] font-bold px-2 py-1 uppercase tracking-widest mb-4 hover:opacity-90 rounded-none text-white border-none"
          style={{ backgroundColor: badgeBg }}
        >
          {category}
        </Badge>

        <h3 className="text-2xl font-headline mb-4 text-foreground">{title}</h3>

        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}
