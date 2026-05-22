import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

export default function AdminRegioni() {
  return (
    <div>
      <div className="mb-10 border-b border-border pb-6">
        <h1 className="text-4xl font-headline text-foreground mb-2">Gestione Regioni</h1>
        <p className="text-muted-foreground">Censisci i territori a cui associare i manoscritti culinari.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form inserimento */}
        <div className="lg:col-span-1">
          <Card className="rounded-none border-border">
            <CardContent className="p-6 flex flex-col gap-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Aggiungi Regione</h3>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Nome Territorio</label>
                <Input placeholder="Es. Sardegna" className="bg-muted/10 rounded-none border-border" />
              </div>

              <Button className="bg-secondary text-white hover:bg-secondary/90 rounded-none font-bold text-xs uppercase tracking-widest h-12 mt-2">
                Salva Regione
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Tabella Dati */}
        <div className="lg:col-span-2">
          <Card className="rounded-none border-border">
            <CardContent className="p-0">
              <table className="w-full text-left border-collapse text-sm text-foreground">
                <thead>
                  <tr className="border-b border-border bg-muted/30 uppercase text-[10px] tracking-widest font-bold text-muted-foreground">
                    <th className="p-4">Regione</th>
                    <th className="p-4">Ricette Associate</th>
                    <th className="p-4 text-right">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <tr className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-bold">Lazio</td>
                    <td className="p-4 text-muted-foreground">42 manoscritti</td>
                    <td className="p-4 text-right">
                      {/* Bottone disabilitato per simulare il blocco se ci sono ricette associate */}
                      <Button
                        variant="outline"
                        size="icon"
                        disabled
                        title="Impossibile eliminare: ci sono ricette associate"
                        className="rounded-none border-border h-8 w-8 text-muted-foreground"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>

                  <tr className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-bold">Molise</td>
                    <td className="p-4 text-muted-foreground">0 manoscritti</td>
                    <td className="p-4 text-right">
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-none border-border h-8 w-8 text-destructive hover:bg-destructive hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
