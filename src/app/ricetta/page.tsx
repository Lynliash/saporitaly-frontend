import { Badge } from "@/components/ui/badge";
import { Clock, Users, BookOpen, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function DettaglioRicetta() {
  return (
    <main className="container mx-auto px-10 py-12 min-h-screen">
      {/* header ricetta */}
      <div className="border-b border-border pb-8 mb-10">
        <div className="flex gap-2 mb-4">
          <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-none border-none">Lazio</Badge>
          <Badge className="bg-[#8B0000] text-white hover:bg-[#8B0000]/90 rounded-none border-none">Primo Piatto</Badge>
        </div>
        <h1 className="text-5xl font-headline text-foreground mb-6">Spaghetti alla Carbonara</h1>

        {/* meta info */}
        <div className="flex flex-wrap gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Prep: 15 min | Cottura: 10 min</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>4 Persone</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span>Manoscritto orig.: Trattoria Romana, 1954</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
        {/* col sx: ingredienti */}
        <div className="md:col-span-1">
          <div className="bg-muted/30 p-6 border border-border">
            <h3 className="text-xl font-headline text-foreground mb-4">Ingredienti</h3>
            <ul className="space-y-3 text-sm text-foreground">
              <li className="flex justify-between border-b border-border/50 pb-2">
                <span>Spaghetti</span>
                <span className="font-bold">400g</span>
              </li>
              <li className="flex justify-between border-b border-border/50 pb-2">
                <span>Guanciale (stagionato)</span>
                <span className="font-bold">150g</span>
              </li>
              <li className="flex justify-between border-b border-border/50 pb-2">
                <span>Tuorli d'uovo</span>
                <span className="font-bold">4</span>
              </li>
              <li className="flex justify-between border-b border-border/50 pb-2">
                <span>Pecorino Romano DOP</span>
                <span className="font-bold">100g</span>
              </li>
              <li className="flex justify-between pb-2">
                <span>Pepe nero in grani</span>
                <span className="font-bold">q.b.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* col dx: proc e recensioni */}
        <div className="md:col-span-2">
          <div className="mb-16">
            <h2 className="text-2xl font-headline text-foreground mb-6">Analisi e Procedimento</h2>
            <div className="prose prose-neutral max-w-none text-muted-foreground leading-relaxed space-y-6">
              <p>
                La preparazione autentica richiede un rigoroso controllo delle temperature per evitare la coagulazione precoce delle proteine dell'uovo. Il
                guanciale va sudato a fiamma dolce, affinché il grasso si sciolga divenendo traslucido e croccante.
              </p>

              <h4 className="text-foreground font-bold uppercase tracking-widest text-xs mt-8 mb-2">Fase 1: Il Grasso</h4>
              <p>
                Tagliare il guanciale a listarelle di circa 1 cm di spessore. Disporlo in una padella a freddo e portare sul fuoco. Rimuovere i pezzi croccanti
                e conservare il grasso liquido.
              </p>

              <h4 className="text-foreground font-bold uppercase tracking-widest text-xs mt-8 mb-2">Fase 2: La Carabaccia (Crema)</h4>
              <p>
                In una ciotola, unire i tuorli, il Pecorino Romano grattugiato e pepe nero. Aggiungere acqua di cottura e mescolare fino a ottenere un composto
                pastoso.
              </p>

              <h4 className="text-foreground font-bold uppercase tracking-widest text-xs mt-8 mb-2">Fase 3: Mantecatura</h4>
              <p>
                Scolare la pasta al dente nella padella con il grasso del guanciale. Versare la crema di uova e formaggio mescolando. Servire immediatamente.
              </p>
            </div>
          </div>

          {/* blocco recensioni */}
          <div className="border-t border-border pt-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-headline text-foreground">Recensioni</h2>
              <div className="bg-secondary text-white px-4 py-2 font-bold font-headline text-xl rounded-none">
                9.0 <span className="text-sm font-sans font-normal opacity-80">/ 10</span>
              </div>
            </div>

            {/* RECENSIONE*/}
            <Card className="bg-muted/10 border-secondary/30 mb-10 rounded-none">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold tracking-widest uppercase text-secondary block mb-1">La tua valutazione</span>
                    <span className="text-sm text-muted-foreground">Pubblicata il 14 Maggio 2026</span>
                  </div>
                  <Badge variant="outline" className="rounded-none border-secondary text-secondary font-bold text-lg">
                    9
                  </Badge>
                </div>
                <p className="text-sm text-foreground mb-6">
                  Ricetta perfetta! Ho seguito il consiglio sulla temperatura della padella e finalmente non ho fatto la frittata.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-none text-xs border-border">
                    <Edit className="w-3 h-3 mr-2" /> Modifica
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-none text-xs text-destructive hover:bg-destructive hover:text-white border-border">
                    <Trash2 className="w-3 h-3 mr-2" /> Elimina
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* lista recensioni*/}
            <div className="space-y-6">
              <div className="pb-6 border-b border-border/50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-bold text-foreground block">Giulia Bianchi</span>
                    <span className="text-xs text-muted-foreground">12 Maggio 2026</span>
                  </div>
                  <Badge variant="outline" className="rounded-none border-border text-muted-foreground font-bold text-lg">
                    10
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Niente a che vedere con la panna! Ottimo l'appunto sulla temperatura della padella.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
