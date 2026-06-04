import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Book, Leaf, Map, GitMerge } from "lucide-react";

// Moduli del backoffice mostrati come card di accesso rapido.
const modules = [
  {
    href: "/nuova-ricetta",
    title: "Nuova Ricetta",
    description: "Crea una nuova ricetta, definisci ingredienti essenziali e passaggi.",
    icon: PlusCircle,
    accent: true,
  },
  {
    href: "/admin/ricette",
    title: "Gestione Ricette",
    description: "Modifica o elimina ricette esistenti dall'archivio centrale.",
    icon: Book,
  },
  {
    href: "/admin/ingredienti",
    title: "Gestione Ingredienti",
    description: "Aggiungi nuove materie prime e gestisci i loro alias.",
    icon: Leaf,
  },
  {
    href: "/admin/regole",
    title: "Regole Sostituzione",
    description: "Configura le logiche di rimpiazzo e i punteggi per lo Svuota Frigo.",
    icon: GitMerge,
    accent: true,
  },
  {
    href: "/admin/regioni",
    title: "Territori",
    description: "Gestisci le regioni a cui sono associati i manoscritti culinari.",
    icon: Map,
  },
];

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8 border-b border-border pb-6 sm:mb-10">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-secondary">Backoffice</p>
        <h1 className="font-headline text-3xl text-foreground sm:text-4xl">Archivio</h1>
        <p className="mt-3 text-muted-foreground">Seleziona un modulo per gestire i dati del sistema.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map(({ href, title, description, icon: Icon, accent }) => (
          <Link key={href} href={href} className="group">
            <Card className="h-full cursor-pointer rounded-none border border-border transition-colors group-hover:border-secondary">
              <CardHeader>
                <Icon className={accent ? "mb-2 h-8 w-8 text-secondary" : "mb-2 h-8 w-8 text-foreground"} />
                <CardTitle className="font-headline text-xl">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
