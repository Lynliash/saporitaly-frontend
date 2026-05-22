import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Book, Leaf, Map, GitMerge } from "lucide-react";

export default function AdminDashboard() {
  return (
    <main className="container mx-auto px-10 py-12 min-h-screen">
      <div className="mb-10 border-b border-border pb-6">
        <h1 className="text-4xl font-headline text-foreground mb-2">Backoffice Archivio</h1>
        <p className="text-muted-foreground">Seleziona un modulo per gestire i dati del sistema.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/nuova-ricetta">
          <Card className="rounded-none border-border hover:bg-muted/10 transition-colors cursor-pointer h-full">
            <CardHeader>
              <PlusCircle className="w-8 h-8 text-secondary mb-2" />
              <CardTitle className="font-headline text-xl">Nuova Ricetta</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Crea una nuova ricetta, definisci ingredienti essenziali e passaggi.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/ricette">
          <Card className="rounded-none border-border hover:bg-muted/10 transition-colors cursor-pointer h-full">
            <CardHeader>
              <Book className="w-8 h-8 text-foreground mb-2" />
              <CardTitle className="font-headline text-xl">Gestione Ricette</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Modifica o elimina ricette esistenti dal database centrale.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/ingredienti">
          <Card className="rounded-none border-border hover:bg-muted/10 transition-colors cursor-pointer h-full">
            <CardHeader>
              <Leaf className="w-8 h-8 text-foreground mb-2" />
              <CardTitle className="font-headline text-xl">Gestione Ingredienti</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Aggiungi nuove materie prime e gestisci i loro alias.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/regole">
          <Card className="rounded-none border-border hover:bg-muted/10 transition-colors cursor-pointer h-full">
            <CardHeader>
              <GitMerge className="w-8 h-8 text-secondary mb-2" />
              <CardTitle className="font-headline text-xl">Regole Sostituzione</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Configura le logiche di rimpiazzo e i punteggi per lo Svuota Frigo.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/regioni">
          <Card className="rounded-none border-border hover:bg-muted/10 transition-colors cursor-pointer h-full">
            <CardHeader>
              <Map className="w-8 h-8 text-foreground mb-2" />
              <CardTitle className="font-headline text-xl">Territori</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Gestisci le regioni a cui sono associati i manoscritti culinari.</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </main>
  );
}
