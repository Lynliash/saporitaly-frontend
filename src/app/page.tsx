import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      
      {/*
          SEZIONE HERO (home page) 
      */}
      <section className="container mx-auto px-10 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Colonna Sinistra */}
        <div className="flex flex-col justify-center">
          <p className="text-secondary text-sm font-bold tracking-widest uppercase mb-4">
            L'Archivio del Patrimonio Gastronomico
          </p>
          <h1 className="text-5xl lg:text-6xl text-foreground font-headline leading-tight mb-6">
            Censimento delle Tradizioni Culinarie d'Italia.
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed mb-12 max-w-lg">
            Un'istituzione dedicata alla preservazione, catalogazione e studio critico delle ricette regionali italiane. Dall'analisi filologica degli ingredienti alla mappatura storica dei territori, SaporItaly funge da ponte tra la saggezza popolare e il rigore accademico.
          </p>
          
          {/* Placeholder Mappa */}
          <div className="w-full max-w-sm h-64 bg-muted/80 rounded-xl border border-border flex items-center justify-center">
            <span className="text-muted-foreground font-medium tracking-widest uppercase text-sm">
              [ Immagine Mappa Italia ]
            </span>
          </div>
        </div>

        {/* Colonna Destra */}
        <div className="flex flex-col justify-center lg:pl-10">
          <h2 className="text-4xl font-headline text-foreground mb-3">Esplora per Regione</h2>
          <p className="text-muted-foreground mb-8 italic">
            Seleziona un territorio per accedere ai manoscritti e alle analisi organolettiche correlate.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            {["Toscana", "Sicilia", "Lombardia", "Puglia", "Piemonte", "Campania", "Veneto", "Emilia-Romagna"].map((regione) => (
              <div 
                key={regione} 
                className="bg-muted/40 p-5 rounded text-center border border-transparent hover:border-primary cursor-pointer transition-colors text-foreground font-medium"
              >
                {regione}
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full py-6 text-sm tracking-widest uppercase font-bold border-border text-foreground hover:bg-muted">
            Visualizza tutte le 20 regioni 🌎
          </Button>
        </div>
      </section>

      {/* 
          APPROFONDIMENTI (con le card)
          */}
      <section className="bg-muted/30 py-24 px-10 border-t border-border mt-auto">
        <div className="container mx-auto">
          
          {/* Intestazione Sezione */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <p className="text-secondary text-sm font-bold tracking-widest uppercase mb-2">
                Approfondimenti Archivistici
              </p>
              <h2 className="text-4xl font-headline text-foreground">
                Dalla Carta alla Tavola
              </h2>
            </div>
            <a href="#" className="text-secondary text-sm font-bold tracking-widest uppercase border-b-2 border-secondary pb-1 hover:text-secondary/80 transition-colors">
              Sfoglia i manoscritti
            </a>
          </div>

          {/* Griglia delle Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <article className="bg-card rounded-none overflow-hidden border border-border group cursor-pointer hover:shadow-lg transition-shadow">
              <div className="h-56 bg-primary/20 w-full flex items-center justify-center">
                 <span className="text-primary font-bold tracking-widest uppercase text-xs">[ Immagine Manoscritto ]</span>
              </div>
              <div className="p-8">
                <span className="inline-block bg-[#8B0000] text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest mb-4">
                  Tecniche Antiche
                </span>
                <h3 className="text-2xl font-headline mb-4 text-foreground">L'Arte della Fermentazione Appenninica</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Uno studio comparativo sui processi di conservazione dei latticini nelle comunità montane del XV secolo...
                </p>
              </div>
            </article>

            {/* Card 2 */}
            <article className="bg-card rounded-none overflow-hidden border border-border group cursor-pointer hover:shadow-lg transition-shadow">
              <div className="h-56 bg-secondary/20 w-full flex items-center justify-center">
                 <span className="text-secondary font-bold tracking-widest uppercase text-xs">[ Immagine Pomodori ]</span>
              </div>
              <div className="p-8">
                <span className="inline-block bg-[#C04000] text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest mb-4">
                  Analisi Ingredienti
                </span>
                <h3 className="text-2xl font-headline mb-4 text-foreground">La Genomica del Pomodoro San Marzano</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Mappatura scientifica delle varietà autoctone dell'agro-sarnese e il loro impatto sul profilo umami della salsa...
                </p>
              </div>
            </article>

            {/* Card 3 */}
            <article className="bg-card rounded-none overflow-hidden border border-border group cursor-pointer hover:shadow-lg transition-shadow">
              <div className="h-56 bg-neutral-200 w-full flex items-center justify-center">
                 <span className="text-neutral-500 font-bold tracking-widest uppercase text-xs">[ Immagine Pentole Rame ]</span>
              </div>
              <div className="p-8">
                <span className="inline-block bg-[#E8C170] text-black text-[10px] font-bold px-2 py-1 uppercase tracking-widest mb-4">
                  Evoluzione Utensili
                </span>
                <h3 className="text-2xl font-headline mb-4 text-foreground">Dal Rame all'Acciaio: Mutamenti di Calore</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Come la transizione dei materiali di cottura ha influenzato la riduzione dei sughi nella cucina aristocratica...
                </p>
              </div>
            </article>

          </div>
        </div>
      </section>

      {/* =========================================
          FOOTER (Piè di pagina)
          ========================================= */}
      <footer className="bg-muted py-16 px-10 border-t border-border">
         <div className="container mx-auto flex flex-col md:flex-row justify-between gap-10 text-sm text-muted-foreground">
            
            {/* Sinistra Footer */}
            <div className="max-w-sm">
              <div className="text-2xl font-bold text-primary font-headline mb-4">SaporItaly</div>
              <p className="mb-6 leading-relaxed">
                L'eccellenza dell'archivistica gastronomica al servizio della cultura. Un progetto di ricerca permanente dedicato all'identità italiana.
              </p>
              <div className="flex gap-4">
                <span className="cursor-pointer hover:text-foreground">📄</span>
                <span className="cursor-pointer hover:text-foreground">🌍</span>
                <span className="cursor-pointer hover:text-foreground">🎓</span>
              </div>
            </div>

            {/* Destra Footer */}
            <div className="flex gap-16">
              <div className="flex flex-col gap-3">
                <span className="font-bold tracking-widest uppercase text-xs mb-2 text-foreground">Risorse</span>
                <a href="#" className="hover:text-secondary transition-colors">Archives</a>
                <a href="#" className="hover:text-secondary transition-colors">Citations</a>
                <a href="#" className="hover:text-secondary transition-colors">Terms of Use</a>
                <a href="#" className="hover:text-secondary transition-colors">Faculty Contact</a>
              </div>
              <div className="flex flex-col gap-3">
                <span className="font-bold tracking-widest uppercase text-xs mb-2 text-foreground">Accademia</span>
                <a href="#" className="hover:text-secondary transition-colors">University Press</a>
                <a href="#" className="hover:text-secondary transition-colors">Research Grants</a>
                <a href="#" className="hover:text-secondary transition-colors">Library Network</a>
              </div>
            </div>

         </div>
      </footer>

    </main>
  );
}