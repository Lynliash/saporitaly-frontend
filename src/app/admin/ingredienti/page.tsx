import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, Tag } from "lucide-react";

export default function AdminIngredienti() {
  return (
    <div>
      {/* header */}
      <div className="mb-10 border-b border-border pb-6">
        <h1 className="text-4xl font-headline text-foreground mb-2">Dizionario Ingredienti</h1>
        <p className="text-muted-foreground">Gestisci gli ingredienti e mappa i sinonimi per il motore di ricerca.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* form inserimento rapido */}
        <div className="lg:col-span-1">
          <Card className="rounded-none border-border">
            <CardContent className="p-6 flex flex-col gap-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Nuovo Ingrediente</h3>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Nome Ufficiale</label>
                <Input placeholder="Es. Guanciale" className="bg-muted/10 rounded-none border-border" />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Alias (separati da virgola)</label>
                <Input placeholder="Es. guancia, guanciale romano" className="bg-muted/10 rounded-none border-border" />
              </div>

              <Button className="bg-secondary text-white hover:bg-secondary/90 rounded-none font-bold text-xs uppercase tracking-widest h-12 mt-2">
                Salva nel DB
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* lista ingredienti mappati */}
        <div className="lg:col-span-2">
          <Card className="rounded-none border-border">
            <CardContent className="p-0">
              <table className="w-full text-left border-collapse text-sm text-foreground">
                <thead>
                  <tr className="border-b border-border bg-muted/30 uppercase text-[10px] tracking-widest font-bold text-muted-foreground">
                    <th className="p-4">Ingrediente</th>
                    <th className="p-4">Alias Associati</th>
                    <th className="p-4 text-right">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {/* item guanciale */}
                  <tr className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-bold">Guanciale</td>
                    <td className="p-4 flex flex-wrap gap-1">
                      <span className="bg-muted px-2 py-0.5 text-xs rounded border border-border flex items-center gap-1 text-muted-foreground">
                        <Tag className="w-3 h-3 opacity-60" /> guancia
                      </span>
                      <span className="bg-muted px-2 py-0.5 text-xs rounded border border-border flex items-center gap-1 text-muted-foreground">
                        <Tag className="w-3 h-3 opacity-60" /> guanciale romano
                      </span>
                    </td>
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

                  {/* item pecorino */}
                  <tr className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-bold">Pecorino Romano DOP</td>
                    <td className="p-4 flex flex-wrap gap-1">
                      <span className="bg-muted px-2 py-0.5 text-xs rounded border border-border flex items-center gap-1 text-muted-foreground">
                        <Tag className="w-3 h-3 opacity-60" /> pecorino
                      </span>
                    </td>
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
