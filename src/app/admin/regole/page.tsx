"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Trash2, ArrowRight } from "lucide-react";

const regolaSchema = z.object({
  ingredienteMancante: z.string().min(2, "Inserisci il nome dell'ingrediente mancante"),
  ingredienteSostituto: z.string().min(2, "Inserisci il nome dell'ingrediente sostituto"),
  punteggio: z.coerce
    .number({ invalid_type_error: "Il punteggio deve essere obbligatoriamente un numero" })
    .min(1, "Il punteggio minimo consentito è 1")
    .max(100, "Il punteggio massimo consentito è 100"),
});

type RegolaFormValues = z.infer<typeof regolaSchema>;

export default function AdminRegoleSostituzione() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegolaFormValues>({
    resolver: zodResolver(regolaSchema as any),
  });

  const onSubmit = (data: RegolaFormValues) => {
    toast.success("Regola registrata", {
      description: `Sostituzione configurata al ${data.punteggio}% di compatibilità.`,
    });
    reset();
  };

  return (
    <div>
      <div className="mb-10 border-b border-border pb-6">
        <h1 className="text-4xl font-headline text-foreground mb-2">Regole di Sostituzione</h1>
        <p className="text-muted-foreground">Configura le logiche di rimpiazzo ingredienti per lo Svuota Frigo.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="rounded-none border-border bg-muted/10">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Nuova Regola</h3>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Se manca (Originale)</label>
                  <Input
                    placeholder="Es. Guanciale"
                    className={`bg-background rounded-none border-border ${errors.ingredienteMancante ? "border-destructive" : ""}`}
                    {...register("ingredienteMancante")}
                  />
                  {errors.ingredienteMancante && <p className="text-xs text-destructive mt-1 font-medium">{errors.ingredienteMancante.message}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Sostituiscilo con</label>
                  <Input
                    placeholder="Es. Pancetta Tesa"
                    className={`bg-background rounded-none border-border ${errors.ingredienteSostituto ? "border-destructive" : ""}`}
                    {...register("ingredienteSostituto")}
                  />
                  {errors.ingredienteSostituto && <p className="text-xs text-destructive mt-1 font-medium">{errors.ingredienteSostituto.message}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Compatibilità (1-100)</label>
                  <Input
                    type="number"
                    placeholder="Es. 80"
                    className={`bg-background rounded-none border-border ${errors.punteggio ? "border-destructive" : ""}`}
                    {...register("punteggio")}
                  />
                  {errors.punteggio && <p className="text-xs text-destructive mt-1 font-medium">{errors.punteggio.message}</p>}
                </div>

                <Button
                  type="submit"
                  className="bg-secondary text-white hover:bg-secondary/90 rounded-none font-bold text-xs uppercase tracking-widest h-12 mt-2"
                >
                  Aggiungi Regola
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="rounded-none border-border">
            <CardContent className="p-0">
              <table className="w-full text-left border-collapse text-sm text-foreground">
                <thead>
                  <tr className="border-b border-border bg-muted/30 uppercase text-[10px] tracking-widest font-bold text-muted-foreground">
                    <th className="p-4">Regola Logica</th>
                    <th className="p-4">Punteggio Match</th>
                    <th className="p-4 text-right">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <tr className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 flex items-center gap-3 font-medium">
                      Guanciale <ArrowRight className="w-4 h-4 text-muted-foreground" /> Pancetta Tesa
                    </td>
                    <td className="p-4 font-bold text-secondary">80%</td>
                    <td className="p-4 text-right">
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-none border-border h-8 w-8 text-destructive hover:bg-destructive hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
