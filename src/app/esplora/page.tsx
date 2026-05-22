import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Search } from "lucide-react";
import Link from "next/link";

export default function Esplora() {
  return (
    <main className="container mx-auto px-10 py-12 min-h-screen">
      {/* header */}
      <div className="mb-10">
        <h1 className="text-4xl font-headline text-foreground mb-3">Archivio Tradizioni</h1>
        <p className="text-muted-foreground">Sfoglia, filtra e ordina i manoscritti culinari.</p>
      </div>

      {/* toolbar filtri */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-muted/20 p-4 border border-border">
        {/* search testuale */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input type="text" placeholder="Cerca ricetta..." className="pl-9 bg-background rounded-none border-border focus-visible:ring-secondary" />
        </div>

        {/* drop regione */}
        <div className="w-full md:w-48">
          <Select>
            <SelectTrigger className="w-full bg-background rounded-none border-border focus:ring-secondary">
              <SelectValue placeholder="Tutte le Regioni" />
            </SelectTrigger>
            <SelectContent position="popper" className="rounded-none border-border">
              <SelectItem value="all">Tutte le Regioni</SelectItem>
              <SelectItem value="lazio">Lazio</SelectItem>
              <SelectItem value="campania">Campania</SelectItem>
              <SelectItem value="toscana">Toscana</SelectItem>
              <SelectItem value="puglia">Puglia</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* drop ordinamento */}
        <div className="w-full md:w-56">
          <Select defaultValue="voto-desc">
            <SelectTrigger className="w-full bg-background rounded-none border-border focus:ring-secondary">
              <SelectValue placeholder="Ordina per..." />
            </SelectTrigger>
            <SelectContent position="popper" className="rounded-none border-border">
              <SelectItem value="voto-desc">Voto Medio (Alto-Basso)</SelectItem>
              <SelectItem value="tempo-asc">Tempo (Più veloci)</SelectItem>
              <SelectItem value="recenti">Più recenti</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* card 1 */}
        <Link href="/ricetta">
          <Card className="rounded-none cursor-pointer border-border hover:border-secondary transition-colors h-full flex flex-col">
            <div className="h-40 bg-muted/60 w-full flex items-center justify-center text-xs text-muted-foreground">[ img carbonara ]</div>
            <CardContent className="p-5 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-3">
                <Badge className="bg-secondary text-white rounded-none border-none text-[10px]">Lazio</Badge>
                {/* ranking numerico */}
                <span className="font-bold text-sm text-foreground">9.0/10</span>
              </div>
              <h3 className="text-xl font-headline mb-auto">Spaghetti alla Carbonara</h3>

              <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>25 min</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* card 2 */}
        <Link href="/ricetta">
          <Card className="rounded-none cursor-pointer border-border hover:border-secondary transition-colors h-full flex flex-col">
            <div className="h-40 bg-muted/60 w-full flex items-center justify-center text-xs text-muted-foreground">[ img ragu ]</div>
            <CardContent className="p-5 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-3">
                <Badge className="bg-secondary text-white rounded-none border-none text-[10px]">Campania</Badge>
                <span className="font-bold text-sm text-foreground">9.5/10</span>
              </div>
              <h3 className="text-xl font-headline mb-auto">Ragù Napoletano</h3>

              <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>360 min</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* card 3 */}
        <Link href="/ricetta">
          <Card className="rounded-none cursor-pointer border-border hover:border-secondary transition-colors h-full flex flex-col">
            <div className="h-40 bg-muted/60 w-full flex items-center justify-center text-xs text-muted-foreground">[ img ribollita ]</div>
            <CardContent className="p-5 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-3">
                <Badge className="bg-secondary text-white rounded-none border-none text-[10px]">Toscana</Badge>
                <span className="font-bold text-sm text-foreground">8.8/10</span>
              </div>
              <h3 className="text-xl font-headline mb-auto">Ribollita</h3>

              <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>120 min</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* card 4 */}
        <Link href="/ricetta">
          <Card className="rounded-none cursor-pointer border-border hover:border-secondary transition-colors h-full flex flex-col">
            <div className="h-40 bg-muted/60 w-full flex items-center justify-center text-xs text-muted-foreground">[ img orecchiette ]</div>
            <CardContent className="p-5 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-3">
                <Badge className="bg-secondary text-white rounded-none border-none text-[10px]">Puglia</Badge>
                <span className="font-bold text-sm text-foreground">9.2/10</span>
              </div>
              <h3 className="text-xl font-headline mb-auto">Orecchiette Cime di Rapa</h3>

              <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>40 min</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </main>
  );
}
