"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import Link from "next/link";

// validazione piu rigida
const ricettaSchema = z.object({
  titolo: z.string().min(3, "Il titolo deve avere almeno 3 caratteri"),
  regione: z.string().min(2, "Inserisci la regione di provenienza"),
  categoria: z.string().min(2, "Inserisci la categoria (es. Primo Piatto)"),
  tempoPrep: z.coerce.number({ invalid_type_error: "Il tempo deve essere un numero" }).min(1, "Il tempo minimo è 1 minuto"),
  procedimento: z.string().min(20, "Scrivi un procedimento dettagliato (min. 20 caratteri)"),
});

type RicettaFormValues = z.infer<typeof ricettaSchema>;

export default function NuovaRicetta() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RicettaFormValues>({
    resolver: zodResolver(ricettaSchema as any),
  });

  const onSubmit = (data: RicettaFormValues) => {
    toast.success("Manoscritto Archiviato", {
      description: `${data.titolo} è stato salvato nel database.`,
    });
    reset();
  };

  return (
    <main className="container mx-auto px-10 py-12 min-h-screen">
      <div className="flex justify-between items-end mb-10 border-b border-border pb-6">
        <div>
          <h1 className="text-4xl font-headline text-foreground mb-2">Archivia Nuovo Manoscritto</h1>
          <p className="text-muted-foreground">Compila i dati storici e le dosi precise per il database.</p>
        </div>
        <Link href="/admin">
          <Button variant="outline" className="rounded-none border-border">
            Annulla e Torna indietro
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* COLONNA SX: dati base */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-none border-border">
            <CardContent className="p-8 flex flex-col gap-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Titolo Ricetta</label>
                <Input
                  placeholder="Es. Spaghetti alla Carbonara"
                  className={`bg-muted/10 rounded-none border-border ${errors.titolo ? "border-destructive" : ""}`}
                  {...register("titolo")}
                />
                {errors.titolo && <p className="text-xs text-destructive mt-1 font-medium">{errors.titolo.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Regione</label>
                  <Input
                    placeholder="Es. Lazio"
                    className={`bg-muted/10 rounded-none border-border ${errors.regione ? "border-destructive" : ""}`}
                    {...register("regione")}
                  />
                  {errors.regione && <p className="text-xs text-destructive mt-1 font-medium">{errors.regione.message}</p>}
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Categoria</label>
                  <Input
                    placeholder="Es. Primo Piatto"
                    className={`bg-muted/10 rounded-none border-border ${errors.categoria ? "border-destructive" : ""}`}
                    {...register("categoria")}
                  />
                  {errors.categoria && <p className="text-xs text-destructive mt-1 font-medium">{errors.categoria.message}</p>}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Tempo Totale (Minuti)</label>
                <Input
                  type="number"
                  placeholder="Es. 25"
                  className={`bg-muted/10 rounded-none border-border ${errors.tempoPrep ? "border-destructive" : ""}`}
                  {...register("tempoPrep")}
                />
                {errors.tempoPrep && <p className="text-xs text-destructive mt-1 font-medium">{errors.tempoPrep.message}</p>}
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Procedimento Storico</label>
                <textarea
                  className={`w-full h-48 bg-muted/10 border border-border p-4 text-sm focus:outline-none focus:ring-1 focus:ring-secondary ${errors.procedimento ? "border-destructive" : ""}`}
                  placeholder="Scrivi i passaggi dettagliati..."
                  {...register("procedimento")}
                ></textarea>
                {errors.procedimento && <p className="text-xs text-destructive mt-1 font-medium">{errors.procedimento.message}</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* COLONNA DX: Gestione Ingredienti & Essenzialità */}
        <div className="lg:col-span-1">
          <div className="bg-muted/20 p-6 border border-border sticky top-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Distinta Ingredienti</h3>
              <Button type="button" variant="outline" size="sm" className="rounded-none border-border h-8">
                <Plus className="w-3 h-3 mr-2" /> Aggiungi
              </Button>
            </div>

            <div className="space-y-4 mb-8">
              <div className="bg-background border border-border p-3">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-sm">Guanciale</span>
                  <Trash2 className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-destructive" />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    Q.tà: <strong className="text-foreground">150g</strong>
                  </span>
                  <span className="text-destructive font-bold uppercase tracking-widest text-[10px]">Essenziale</span>
                </div>
              </div>

              <div className="bg-background border border-border p-3">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-sm">Pepe Nero</span>
                  <Trash2 className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-destructive" />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    Q.tà: <strong className="text-foreground">q.b.</strong>
                  </span>
                  <span className="text-secondary font-bold uppercase tracking-widest text-[10px]">Sostituibile</span>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-secondary text-white hover:bg-secondary/90 rounded-none font-bold text-xs uppercase tracking-widest h-14"
            >
              Salva nel Database
            </Button>
          </div>
        </div>
      </form>
    </main>
  );
}
