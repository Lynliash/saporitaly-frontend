import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function AdminRicette() {
  return (
    <div>
      {/* header */}
      <div className="flex justify-between items-center mb-10 border-b border-border pb-6">
        <div>
          <h1 className="text-4xl font-headline text-foreground mb-2">Gestione Ricette</h1>
          <p className="text-muted-foreground">Modifica, elimina o aggiungi nuove ricette all'archivio.</p>
        </div>
        <Link href="/nuova-ricetta">
          <Button className="bg-secondary text-white hover:bg-secondary/90 rounded-none font-bold text-xs uppercase tracking-widest h-12 px-6">
            <Plus className="w-4 h-4 mr-2" /> Nuova Ricetta
          </Button>
        </Link>
      </div>

      {/* tabella dati */}
      <Card className="rounded-none border-border">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm text-foreground">
              <thead>
                <tr className="border-b border-border bg-muted/30 uppercase text-[10px] tracking-widest font-bold text-muted-foreground">
                  <th className="p-4">Titolo</th>
                  <th className="p-4">Regione</th>
                  <th className="p-4">Categoria</th>
                  <th className="p-4">Voto Medio</th>
                  <th className="p-4 text-right">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {/* riga mock 1 */}
                <tr className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 font-headline text-base">Spaghetti alla Carbonara</td>
                  <td className="p-4">Lazio</td>
                  <td className="p-4">Primo Piatto</td>
                  <td className="p-4 font-bold text-secondary">9.0</td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <Button variant="outline" size="icon" className="rounded-none border-border h-8 w-8 text-muted-foreground hover:text-foreground">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-none border-border h-8 w-8 text-destructive hover:bg-destructive hover:text-white">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>

                {/* riga mock 2 */}
                <tr className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 font-headline text-base">Ragù Napoletano</td>
                  <td className="p-4">Campania</td>
                  <td className="p-4">Secondo Piatto</td>
                  <td className="p-4 font-bold text-secondary">9.5</td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <Button variant="outline" size="icon" className="rounded-none border-border h-8 w-8 text-muted-foreground hover:text-foreground">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-none border-border h-8 w-8 text-destructive hover:bg-destructive hover:text-white">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
