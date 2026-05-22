import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Info } from "lucide-react";

export default function CatalogoIngredienti() {
  return (
    <main className="container mx-auto px-10 py-12 min-h-screen">
      <div className="mb-10">
        <h1 className="text-4xl font-headline text-foreground mb-3">Catalogo Ingredienti</h1>
        <p className="text-muted-foreground">Consulta l'archivio completo delle materie prime e i loro alias riconosciuti dal sistema.</p>
      </div>

      {/* Ricerca */}
      <div className="relative max-w-md mb-10">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Cerca un ingrediente o un alias..."
          className="pl-9 bg-background rounded-none border-border focus-visible:ring-secondary"
        />
      </div>

      {/* Lista Ingredienti (Griglia) */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Card Ingrediente 1 */}
        <Card className="rounded-none border-border">
          <CardContent className="p-5">
            <h3 className="font-headline text-xl mb-2">Guanciale</h3>
            <div className="flex items-start gap-2 text-xs text-muted-foreground mt-4 border-t border-border/50 pt-4">
              <Info className="w-4 h-4 shrink-0" />
              <span>Conosciuto anche come: guanciale romano, guancia stagionata</span>
            </div>
          </CardContent>
        </Card>

        {/* Card Ingrediente 2 */}
        <Card className="rounded-none border-border">
          <CardContent className="p-5">
            <h3 className="font-headline text-xl mb-2">Pecorino Romano DOP</h3>
            <div className="flex items-start gap-2 text-xs text-muted-foreground mt-4 border-t border-border/50 pt-4">
              <Info className="w-4 h-4 shrink-0" />
              <span>Conosciuto anche come: pecorino</span>
            </div>
          </CardContent>
        </Card>

        {/* Card Ingrediente 3 */}
        <Card className="rounded-none border-border">
          <CardContent className="p-5">
            <h3 className="font-headline text-xl mb-2">Pancetta Tesa</h3>
            <div className="flex items-start gap-2 text-xs text-muted-foreground mt-4 border-t border-border/50 pt-4">
              <Info className="w-4 h-4 shrink-0" />
              <span>Conosciuto anche come: pancetta</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
