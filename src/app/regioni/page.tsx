import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const TUTTE_LE_REGIONI = [
  "Abruzzo",
  "Basilicata",
  "Calabria",
  "Campania",
  "Emilia-Romagna",
  "Friuli-Venezia Giulia",
  "Lazio",
  "Liguria",
  "Lombardia",
  "Marche",
  "Molise",
  "Piemonte",
  "Puglia",
  "Sardegna",
  "Sicilia",
  "Toscana",
  "Trentino-Alto Adige",
  "Umbria",
  "Valle d'Aosta",
  "Veneto",
];

export default function ElencoRegioni() {
  return (
    <main className="container mx-auto px-10 py-12 min-h-screen flex flex-col">
      <div className="mb-12">
        <h1 className="text-4xl font-headline text-foreground mb-3">Le 20 Regioni d'Italia</h1>
        <p className="text-muted-foreground text-lg">Seleziona un territorio per esplorare le tradizioni culinarie locali.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {TUTTE_LE_REGIONI.map((regione) => (
          <Link href="/esplora" key={regione}>
            <Card className="rounded-none cursor-pointer border-border hover:border-secondary hover:bg-muted/30 transition-all text-center h-full flex items-center justify-center py-8">
              <CardContent className="p-0 font-headline text-lg">{regione}</CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
