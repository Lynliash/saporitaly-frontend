"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Utensils, Carrot, MapPin, Replace, ArrowLeft } from "lucide-react";
import { AuthGuard } from "@/components/AuthGuard";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/ricette", label: "Ricette", icon: Utensils },
  { href: "/admin/ingredienti", label: "Ingredienti & Alias", icon: Carrot },
  { href: "/admin/regioni", label: "Regioni", icon: MapPin },
  { href: "/admin/regole", label: "Regole Sostituz.", icon: Replace },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // La dashboard combacia solo esattamente, gli altri anche sulle sottopagine.
  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <AuthGuard adminOnly>
      <div className="flex min-h-screen flex-col bg-muted/10 font-sans lg:flex-row">
        {/* sidebar: verticale e sticky da lg, su mobile diventa una barra orizzontale scrollabile */}
        <aside className="border-b border-border bg-background lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-r lg:border-b-0">
          <div className="flex items-center justify-between gap-4 border-border p-5 lg:flex-col lg:items-start lg:gap-1 lg:border-b lg:p-6">
            <div>
              <h2 className="font-headline text-2xl text-primary">SaporItaly</h2>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Backoffice Admin</p>
            </div>
            {/* link rapido al sito, visibile solo su mobile (su desktop è in fondo) */}
            <Link
              href="/"
              className="flex shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary transition-colors hover:text-secondary/80 lg:hidden"
            >
              <ArrowLeft className="h-4 w-4" /> Sito
            </Link>
          </div>

          {/* menu: scroll orizzontale su mobile, colonna su desktop */}
          <nav className="flex gap-1 overflow-x-auto p-3 lg:flex-1 lg:flex-col lg:gap-2 lg:overflow-x-visible lg:p-4">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex shrink-0 items-center gap-3 whitespace-nowrap rounded-none border-l-2 px-4 py-3 text-sm font-bold transition-colors",
                    active
                      ? "border-secondary bg-secondary/10 text-secondary"
                      : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="h-5 w-5" /> {label}
                </Link>
              );
            })}
          </nav>

          {/* azione in fondo: solo su desktop */}
          <div className="hidden border-t border-border p-4 lg:block">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-none px-4 py-3 text-sm font-bold text-secondary transition-colors hover:bg-secondary/10"
            >
              <ArrowLeft className="h-4 w-4" /> Torna al Sito
            </Link>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto px-5 py-8 sm:px-8 sm:py-10 lg:px-10">{children}</main>
      </div>
    </AuthGuard>
  );
}
