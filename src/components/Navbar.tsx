import Link from "next/link";
import { User, ShieldAlert, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="relative flex items-center justify-between px-10 py-5 border-b border-border bg-[#E8E0D0] sticky top-0 z-50">
      {/*  logo */}
      <Link href="/">
        <div className="text-3xl font-bold text-primary font-headline cursor-pointer">SaporItaly</div>
      </Link>

      {/* centro */}
      <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex gap-8 text-sm font-medium text-muted-foreground uppercase tracking-widest">
        <Link href="/esplora" className="hover:text-foreground transition-colors">
          Nord
        </Link>
        <Link href="/esplora" className="text-secondary border-b-2 border-secondary pb-1">
          Centro
        </Link>
        <Link href="/esplora" className="hover:text-foreground transition-colors">
          Sud
        </Link>
        <Link href="/esplora" className="hover:text-foreground transition-colors">
          Isole
        </Link>
      </nav>

      {/* dx */}
      <div className="flex items-center gap-3">
        <Link href="/ingredienti" title="Catalogo Ingredienti">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground rounded-none">
            <BookOpen className="w-5 h-5" />
          </Button>
        </Link>

        {/* Link all'Hub dell'Admin */}
        <Link href="/admin" title="Pannello di Controllo (Admin)">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground rounded-none">
            <ShieldAlert className="w-5 h-5" />
          </Button>
        </Link>

        {/* Link Area Personale*/}
        <Link href="/auth" title="Area Personale">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground rounded-none">
            <User className="w-5 h-5" />
          </Button>
        </Link>

        {/* bottone Svuota Frigo */}
        <Link href="/svuota-frigo">
          <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold px-6 ml-2 rounded-none">Svuota Frigo</Button>
        </Link>
      </div>
    </header>
  );
}
