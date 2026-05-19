import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="flex items-center justify-between px-10 py-5 border-b border-border bg-background">
      
      {/* Logo */}
      <div className="text-3xl font-bold text-primary font-headline">
        SaporItaly
      </div>

      {/* Navigazione tra Nord, Centro, Sud e Isole */}
      <nav className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground uppercase tracking-widest">
        <a href="#" className="hover:text-foreground transition-colors">North</a>
        <a href="#" className="text-secondary border-b-2 border-secondary pb-1">Central</a>
        <a href="#" className="hover:text-foreground transition-colors">South</a>
        <a href="#" className="hover:text-foreground transition-colors">Islands</a>
      </nav>

      {/* Azioni (Cerca e Svuota Frigo) */}
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-muted rounded-full transition-colors">
          <Search className="w-5 h-5 text-foreground" />
        </button>
        <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold px-6">
          Svuota Frigo
        </Button>
      </div>

    </header>
  );
}