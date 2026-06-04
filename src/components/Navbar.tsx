"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, User, ShieldAlert, LogOut, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, useLogout } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const links = [
  { href: "/esplora", label: "Esplora" },
  { href: "/regioni", label: "Regioni" },
  { href: "/ingredienti", label: "Ingredienti" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { isAuthenticated, isAdmin, username, hasHydrated } = useAuth();
  const logout = useLogout();

  const handleLogout = () => {
    logout();
    setOpen(false);
    router.push("/");
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface supports-backdrop-filter:bg-surface/80 supports-backdrop-filter:backdrop-blur-md">
      <div className="flex items-center justify-between px-5 sm:px-8 lg:px-10 py-4">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="rounded-none outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          <span className="text-2xl sm:text-3xl font-bold text-foreground font-headline transition-colors hover:text-secondary">
            Sapor<span className="text-secondary">Italy</span>
          </span>
        </Link>

        {/* nav desktop */}
        <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex gap-8 text-sm font-medium text-muted-foreground uppercase tracking-widest">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "transition-colors hover:text-foreground",
                isActive(l.href) && "text-secondary border-b-2 border-secondary pb-1",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* azioni desktop */}
        <div className="hidden md:flex items-center gap-2">
          {hasHydrated && isAuthenticated ? (
            <>
              <Link href="/profilo" title="Area personale">
                <Button variant="ghost" size="sm" className="rounded-none gap-2 text-muted-foreground hover:text-foreground">
                  <User className="w-4 h-4" /> {username}
                </Button>
              </Link>
              {isAdmin && (
                <Link href="/admin" title="Backoffice Admin">
                  <Button variant="ghost" size="icon" className="rounded-none text-muted-foreground hover:text-foreground">
                    <ShieldAlert className="w-5 h-5" />
                  </Button>
                </Link>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                title="Esci"
                className="rounded-none text-muted-foreground hover:text-destructive"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </>
          ) : (
            <Link href="/auth">
              <Button variant="ghost" size="sm" className="rounded-none gap-2 text-muted-foreground hover:text-foreground">
                <User className="w-4 h-4" /> Accedi
              </Button>
            </Link>
          )}

          <Link href="/svuota-frigo">
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold px-6 ml-1 rounded-none">
              Svuota Frigo
            </Button>
          </Link>
        </div>

        {/* toggle mobile */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* drawer mobile */}
      {open && (
        <div className="md:hidden border-t border-border bg-surface px-5 py-4 flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={cn(
                "py-3 text-sm font-medium uppercase tracking-widest border-b border-border/50",
                isActive(l.href) ? "text-secondary" : "text-muted-foreground",
              )}
            >
              {l.label}
            </Link>
          ))}

          <Link
            href="/svuota-frigo"
            onClick={() => setOpen(false)}
            className="py-3 text-sm font-bold uppercase tracking-widest text-secondary border-b border-border/50"
          >
            Svuota Frigo
          </Link>

          {hasHydrated && isAuthenticated ? (
            <>
              <Link
                href="/profilo"
                onClick={() => setOpen(false)}
                className="py-3 flex items-center gap-2 text-sm text-foreground"
              >
                <User className="w-4 h-4" /> {username}
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="py-3 flex items-center gap-2 text-sm text-foreground"
                >
                  <ShieldAlert className="w-4 h-4" /> Backoffice
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="py-3 flex items-center gap-2 text-sm text-destructive text-left"
              >
                <LogOut className="w-4 h-4" /> Esci
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              onClick={() => setOpen(false)}
              className="py-3 flex items-center gap-2 text-sm text-foreground"
            >
              <BookOpen className="w-4 h-4" /> Accedi / Registrati
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
