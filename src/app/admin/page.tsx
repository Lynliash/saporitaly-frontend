import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils, Carrot, MapPin, Users } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-10 border-b border-border pb-6">
        <h1 className="text-4xl font-headline text-foreground mb-2">Pannello di Controllo</h1>
        <p className="text-muted-foreground">Riepilogo dei dati attualmente presenti nel database.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* widget card */}
        <Card className="rounded-none border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Ricette Totali</CardTitle>
            <Utensils className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-headline text-foreground">124</div>
          </CardContent>
        </Card>

        <Card className="rounded-none border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Ingredienti</CardTitle>
            <Carrot className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-headline text-foreground">842</div>
          </CardContent>
        </Card>

        <Card className="rounded-none border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Utenti Registrati</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-headline text-foreground">1.043</div>
          </CardContent>
        </Card>

        <Card className="rounded-none border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Regioni Coperte</CardTitle>
            <MapPin className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-headline text-foreground">
              20<span className="text-lg text-muted-foreground">/20</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
