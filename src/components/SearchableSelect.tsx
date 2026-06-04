"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface SearchableOption {
  value: number;
  label: string;
}

interface SearchableSelectProps {
  options: SearchableOption[];
  value?: number;
  onChange: (value: number) => void;
  placeholder?: string;
  disabled?: boolean;
  hasError?: boolean;
}

// Select con ricerca: input che filtra le opzioni per nome + lista scrollabile.
export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Scegli...",
  disabled = false,
  hasError = false,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return options
      .filter((o) => o.label.toLowerCase().includes(q))
      .sort((a, b) => a.label.localeCompare(b.label, "it"));
  }, [options, query]);

  // Chiude al click fuori.
  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const handleSelect = (val: number) => {
    onChange(val);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          "flex h-10 w-full items-center justify-between gap-2 border border-border bg-white px-3 text-sm text-foreground transition-colors hover:border-secondary disabled:pointer-events-none disabled:opacity-50",
          hasError && "border-destructive"
        )}
      >
        <span className={cn("truncate", !selected && "text-muted-foreground")}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={cn("w-4 h-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full border border-border bg-white shadow-lg">
          <div className="relative border-b border-border">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cerca ingrediente..."
              className="h-10 rounded-none border-0 bg-transparent pl-9 pr-8 focus-visible:ring-0"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                title="Pulisci ricerca"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <ul className="max-h-60 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-muted-foreground">Nessun risultato</li>
            ) : (
              filtered.map((o) => {
                const isSelected = o.value === value;
                return (
                  <li key={o.value}>
                    <button
                      type="button"
                      onClick={() => handleSelect(o.value)}
                      className={cn(
                        "flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-muted/40",
                        isSelected && "bg-muted/30 font-bold text-secondary"
                      )}
                    >
                      <span className="truncate">{o.label}</span>
                      {isSelected && <Check className="w-4 h-4 shrink-0 text-secondary" />}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
