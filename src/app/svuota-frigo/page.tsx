import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Check, X, ArrowRight, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function SvuotaFrigo() {
  return (
    <main className="container mx-auto px-10 py-12 min-h-screen flex flex-col">
      <div className="mb-10">
        <h1 className="text-4xl font-headline text-foreground mb-3">Svuota Frigo</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Scopri cosa puoi cucinare con quello che hai. Il sistema incrocerà la tua dispensa con le regole di sostituzione dell'archivio.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 flex-1">
        <div className="lg:col-span-1 border-r border-border pr-8 flex flex-col gap-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input type="text" placeholder="Aggiungi ingrediente..." className="pl-9 bg-background rounded-none border-border focus-visible:ring-secondary" />
          </div>

          <div>
            <h3 className="text-sm font-bold tracking-widest uppercase mb-4 text-foreground">In Dispensa</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="cursor-pointer hover:bg-destructive hover:text-white rounded-none">
                Spaghetti ✕
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-destructive hover:text-white rounded-none">
                Pancetta ✕
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-destructive hover:text-white rounded-none">
                Uova ✕
              </Badge>
            </div>
          </div>

          <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 mt-auto rounded-none tracking-widest uppercase font-bold text-xs h-12">
            Calcola Compatibilità
          </Button>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-sm font-bold tracking-widest uppercase mb-6 text-foreground">Risultati Ordinati per Compatibilità</h3>

          <div className="space-y-6">
            <Card className="rounded-none border-border hover:border-secondary transition-colors">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6 border-b border-border/50 pb-4">
                  <div>
                    <h4 className="text-2xl font-headline text-foreground mb-1">Spaghetti alla Carbonara</h4>
                    <p className="text-xs text-muted-foreground">Lazio • Primo Piatto • 25 min</p>
                  </div>
                  <div className="text-right">
                    <span className="text-4xl font-headline text-secondary block">85%</span>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Compatibilità</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-widest text-foreground mb-4">Ingredienti Presenti</h5>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-green-600" /> Spaghetti
                      </li>
                      <li className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-green-600" /> Uova (Tuorli)
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-widest text-foreground mb-4">Mancanti & Sostituzioni</h5>
                    <ul className="space-y-4">
                      <li className="text-sm border border-border bg-muted/10 p-3">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                          <X className="w-4 h-4 text-destructive" /> <span className="line-through">Guanciale</span>
                        </div>
                        <div className="flex items-center gap-2 text-secondary font-medium ml-6 text-xs uppercase tracking-widest">
                          <RefreshCw className="w-3 h-3" /> Usi: Pancetta (Regola applicata)
                        </div>
                      </li>

                      <li className="flex items-center gap-3 text-sm text-destructive font-medium">
                        <X className="w-4 h-4" /> Pecorino Romano
                      </li>
                      <li className="flex items-center gap-3 text-sm text-destructive font-medium">
                        <X className="w-4 h-4" /> Pepe Nero
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-border/50 flex justify-end">
                  <Link href="/ricetta">
                    <Button variant="ghost" className="rounded-none text-xs tracking-widest uppercase hover:bg-transparent hover:text-secondary">
                      Vedi Dettaglio <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
