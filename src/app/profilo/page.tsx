import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function ProfiloUtente() {
  return (
    <main className="container mx-auto px-10 py-12 min-h-screen">
      {/* header profilo */}
      <div className="flex items-center justify-between mb-10 border-b border-border pb-6">
        <div>
          <h1 className="text-4xl font-headline text-foreground mb-1">Mario Rossi</h1>
          <p className="text-muted-foreground text-sm">mario.rossi@email.it</p>
        </div>
        <Button variant="outline" className="rounded-none border-border hover:bg-destructive hover:text-white transition-colors">
          Esci
        </Button>
      </div>

      <Tabs defaultValue="dispensa" className="w-full">
        {/* nav tab */}
        <TabsList className="grid w-full max-w-md grid-cols-2 rounded-none bg-muted/50 mb-8">
          <TabsTrigger value="dispensa" className="rounded-none data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
            La mia Dispensa
          </TabsTrigger>
          <TabsTrigger value="ricette" className="rounded-none data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
            Le mie Ricette
          </TabsTrigger>
        </TabsList>

        {/* content dispensa */}
        <TabsContent value="dispensa">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* inserimento nuovi ingredienti */}
            <div className="md:col-span-1">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Aggiungi Ingrediente</h3>
              <div className="flex gap-2">
                <Input placeholder="Es. Guanciale" className="bg-muted/20 rounded-none border-border focus-visible:ring-secondary" />
                <Button className="rounded-none bg-secondary text-white hover:bg-secondary/90">+</Button>
              </div>
            </div>

            {/* lista ingredienti salvati */}
            <div className="md:col-span-2">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Attualmente in frigo</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="px-3 py-1 cursor-pointer hover:bg-destructive hover:text-white transition-colors">
                  Uova ✕
                </Badge>
                <Badge variant="outline" className="px-3 py-1 cursor-pointer hover:bg-destructive hover:text-white transition-colors">
                  Pecorino Romano ✕
                </Badge>
                <Badge variant="outline" className="px-3 py-1 cursor-pointer hover:bg-destructive hover:text-white transition-colors">
                  Pepe Nero ✕
                </Badge>
                <Badge variant="outline" className="px-3 py-1 cursor-pointer hover:bg-destructive hover:text-white transition-colors">
                  Guanciale ✕
                </Badge>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* content ricette salvate */}
        <TabsContent value="ricette">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* item ricetta */}
            <Card className="rounded-none border-border">
              <div className="h-32 bg-muted/50 w-full flex items-center justify-center text-xs text-muted-foreground">[ img ]</div>
              <CardContent className="p-4">
                <h4 className="font-headline text-lg mb-1">Spaghetti alla Carbonara</h4>
                <p className="text-xs text-muted-foreground mb-4">Caricata il: 20/05/2026</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="w-full rounded-none text-xs">
                    Modifica
                  </Button>
                  <Button variant="outline" size="sm" className="w-full rounded-none text-xs text-destructive hover:bg-destructive hover:text-white">
                    Elimina
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
