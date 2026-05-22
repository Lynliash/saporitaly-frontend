import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArticleCard } from "@/components/ArticleCard";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* hero banner */}
      <section className="container mx-auto px-10 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="flex flex-col justify-center">
          <p className="text-secondary text-sm font-bold tracking-widest uppercase mb-4">L'Archivio del Patrimonio Gastronomico</p>
          <h1 className="text-5xl lg:text-6xl text-foreground font-headline leading-tight mb-6">Censimento delle Tradizioni Culinarie d'Italia.</h1>
          <p className="text-muted-foreground text-lg leading-relaxed mb-12 max-w-lg">
            Un'istituzione dedicata alla preservazione, catalogazione e studio critico delle ricette regionali italiane. Dall'analisi filologica degli
            ingredienti alla mappatura storica dei territori, SaporItaly funge da ponte tra la saggezza popolare e il rigore accademico.
          </p>
        </div>

        <div className="flex flex-col justify-center lg:pl-10">
          <h2 className="text-4xl font-headline text-foreground mb-3">Esplora per Regione</h2>
          <p className="text-muted-foreground mb-8 italic">Seleziona un territorio per accedere ai manoscritti e alle analisi organolettiche correlate.</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {/* bordi fissi e hover evidente */}
            {["Toscana", "Sicilia", "Lombardia", "Puglia", "Piemonte", "Campania", "Veneto", "Emilia-Romagna"].map((regione) => (
              <Link href="/esplora" key={regione}>
                <div className="bg-background p-5 rounded text-center border border-border hover:border-secondary hover:bg-muted/50 cursor-pointer transition-all text-foreground font-medium w-full shadow-sm">
                  {regione}
                </div>
              </Link>
            ))}
          </div>

          {/* link corretto alla rotta regioni */}
          <Link href="/regioni" className="w-full">
            <Button variant="outline" className="w-full py-6 text-sm tracking-widest uppercase font-bold border-border text-foreground hover:bg-muted">
              Visualizza tutte le 20 regioni 🌎
            </Button>
          </Link>
        </div>
      </section>

      {/* section articoli */}
      <section className="bg-muted/30 py-24 px-10 border-t border-border mt-auto">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <p className="text-secondary text-sm font-bold tracking-widest uppercase mb-2">Approfondimenti Archivistici</p>
              <h2 className="text-4xl font-headline text-foreground">Dalla Carta alla Tavola</h2>
            </div>
            <Link
              href="/esplora"
              className="text-secondary text-sm font-bold tracking-widest uppercase border-b-2 border-secondary pb-1 hover:text-secondary/80 transition-colors"
            >
              Sfoglia i manoscritti
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/ricetta">
              <ArticleCard
                category="Tecniche Antiche"
                title="L'Arte della Fermentazione Appenninica"
                description="Uno studio comparativo sui processi di conservazione dei latticini nelle comunità montane del XV secolo..."
                badgeBg="#8B0000"
                placeholderText="IMG Manoscritto"
              />
            </Link>

            <Link href="/ricetta">
              <ArticleCard
                category="Analisi Ingredienti"
                title="La Genomica del Pomodoro San Marzano"
                description="Mappatura scientifica delle varietà autoctone dell'agro-sarnese e il loro impatto sul profilo umami della salsa..."
                badgeBg="#C04000"
                placeholderText="IMG Pomodori"
              />
            </Link>

            <Link href="/ricetta">
              <ArticleCard
                category="Evoluzione Utensili"
                title="Dal Rame all'Acciaio: Mutamenti di Calore"
                description="Come la transizione dei materiali di cottura ha influenzato la riduzione dei sughi nella cucina aristocratica..."
                badgeBg="#E8C170"
                placeholderText="IMG Pentole"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="bg-muted py-16 px-10 border-t border-border">
        <div className="container mx-auto flex flex-col md:flex-row justify-between gap-10 text-sm text-muted-foreground">
          <div className="max-w-sm">
            <div className="text-2xl font-bold text-primary font-headline mb-4">SaporItaly</div>
            <p className="mb-6 leading-relaxed">
              L'eccellenza dell'archivistica gastronomica al servizio della cultura. Un progetto di ricerca permanente dedicato all'identità italiana.
            </p>
          </div>

          <div className="flex gap-16">
            <div className="flex flex-col gap-3">
              <span className="font-bold tracking-widest uppercase text-xs mb-2 text-foreground">Risorse</span>
              <a href="#" className="hover:text-secondary transition-colors">
                Archivio
              </a>
              <a href="#" className="hover:text-secondary transition-colors">
                Termini di Utilizzo
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
