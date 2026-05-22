import Link from "next/link";
import { LayoutDashboard, Utensils, Carrot, MapPin, Replace, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-muted/10 font-sans">
      {/* sidebar fissa a sx */}
      <aside className="w-64 bg-background border-r border-border flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-border">
          <h2 className="text-2xl font-headline text-primary">SaporItaly</h2>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Backoffice Admin</p>
        </div>

        {/* menu nav */}
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 bg-secondary/10 text-secondary font-bold rounded-none border-l-2 border-secondary">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link
            href="/admin/ricette"
            className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors rounded-none border-l-2 border-transparent"
          >
            <Utensils className="w-5 h-5" /> Ricette
          </Link>
          <Link
            href="/admin/ingredienti"
            className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors rounded-none border-l-2 border-transparent"
          >
            <Carrot className="w-5 h-5" /> Ingredienti & Alias
          </Link>
          <Link
            href="/admin/regioni"
            className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors rounded-none border-l-2 border-transparent"
          >
            <MapPin className="w-5 h-5" /> Regioni
          </Link>
          <Link
            href="/admin/regole"
            className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors rounded-none border-l-2 border-transparent"
          >
            <Replace className="w-5 h-5" /> Regole Sostituz.
          </Link>
        </nav>

        {/* bottom actions */}
        <div className="p-4 border-t border-border">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-destructive hover:bg-destructive/10 transition-colors rounded-none font-bold text-sm"
          >
            <LogOut className="w-4 h-4" /> Torna al Sito
          </Link>
        </div>
      </aside>

      {/* contenitore dinamico per le pagine admin */}
      <main className="flex-1 p-10 overflow-y-auto">{children}</main>
    </div>
  );
}
