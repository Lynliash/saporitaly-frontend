"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Pencil, Trash2, Check, X, MapPin } from "lucide-react";
import { toast } from "sonner";

import { AuthGuard } from "@/components/AuthGuard";
import { Loading, ErrorState, EmptyState } from "@/components/states";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { apiError } from "@/lib/api";
import { useRegions, useCreateRegion, useUpdateRegion, useDeleteRegion } from "@/hooks/useRegions";
import type { Region } from "@/lib/types";

// Codice regione: 2-5 caratteri maiuscoli (es. "SIC")
const regionSchema = z.object({
  name: z.string().trim().min(1, "Il nome è obbligatorio"),
  code: z
    .string()
    .trim()
    .min(2, "Minimo 2 caratteri")
    .max(5, "Massimo 5 caratteri")
    .regex(/^[A-Z]+$/, "Solo lettere maiuscole (es. SIC)"),
  description: z.string().trim().optional(),
});

type RegionFormValues = z.infer<typeof regionSchema>;

const inputBase = "bg-muted/10 rounded-none border-border uppercase";
const labelBase = "text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block";

function RegioniContent() {
  const { data: regions, isLoading, isError } = useRegions();
  const createRegion = useCreateRegion();
  const updateRegion = useUpdateRegion();
  const deleteRegion = useDeleteRegion();

  // id della regione in modifica inline (null = nessuna)
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState({ name: "", code: "", description: "" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegionFormValues>({
    resolver: zodResolver(regionSchema),
    defaultValues: { name: "", code: "", description: "" },
  });

  const onCreate = handleSubmit((values) => {
    createRegion.mutate(
      { name: values.name, code: values.code, description: values.description || undefined },
      {
        onSuccess: () => {
          toast.success("Regione aggiunta", { description: `${values.name} è ora nell'archivio.` });
          reset();
        },
        onError: (err) => toast.error(apiError(err)),
      },
    );
  });

  const startEdit = (region: Region) => {
    setEditingId(region.id);
    setEditValues({ name: region.name, code: region.code, description: region.description ?? "" });
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = (id: number) => {
    const name = editValues.name.trim();
    const code = editValues.code.trim().toUpperCase();
    if (!name || code.length < 2 || code.length > 5 || !/^[A-Z]+$/.test(code)) {
      toast.error("Dati non validi: controlla nome e codice (2-5 lettere maiuscole).");
      return;
    }
    updateRegion.mutate(
      { id, body: { name, code, description: editValues.description.trim() || undefined } },
      {
        onSuccess: () => {
          toast.success("Regione aggiornata");
          setEditingId(null);
        },
        onError: (err) => toast.error(apiError(err)),
      },
    );
  };

  const onDelete = (region: Region) => {
    if (!window.confirm(`Eliminare la regione "${region.name}"? L'operazione è irreversibile.`)) return;
    deleteRegion.mutate(region.id, {
      onSuccess: () => toast.success("Regione eliminata"),
      // Il BE blocca l'eliminazione se ci sono ricette associate
      onError: (err) => toast.error(apiError(err)),
    });
  };

  return (
    <div>
      <div className="mb-8 sm:mb-10 border-b border-border pb-6">
        <p className="text-secondary text-xs font-bold tracking-widest uppercase mb-2">Backoffice</p>
        <h1 className="text-3xl sm:text-4xl font-headline text-foreground mb-2">Gestione Regioni</h1>
        <p className="text-muted-foreground max-w-2xl">
          Censisci i territori a cui associare i manoscritti culinari.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-1">
          <Card className="rounded-none border-border lg:sticky lg:top-6">
            <CardContent className="p-6">
              <form onSubmit={onCreate} className="flex flex-col gap-4" noValidate>
                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Aggiungi Regione</h3>

                <div>
                  <label htmlFor="name" className={labelBase}>
                    Nome
                  </label>
                  <Input
                    id="name"
                    placeholder="Es. Sicilia"
                    className={`bg-muted/10 rounded-none border-border ${errors.name ? "border-destructive" : ""}`}
                    {...register("name")}
                  />
                  {errors.name && <p className="text-xs text-destructive mt-1 font-medium">{errors.name.message}</p>}
                </div>

                <div>
                  <label htmlFor="code" className={labelBase}>
                    Codice (2-5 lettere)
                  </label>
                  <Input
                    id="code"
                    placeholder="Es. SIC"
                    maxLength={5}
                    className={`${inputBase} ${errors.code ? "border-destructive" : ""}`}
                    {...register("code")}
                  />
                  {errors.code && <p className="text-xs text-destructive mt-1 font-medium">{errors.code.message}</p>}
                </div>

                <div>
                  <label htmlFor="description" className={labelBase}>
                    Descrizione (opzionale)
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    placeholder="Breve descrizione del territorio..."
                    className="w-full bg-muted/10 rounded-none border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 resize-none"
                    {...register("description")}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={createRegion.isPending}
                  className="bg-secondary text-white hover:bg-secondary/90 rounded-none font-bold text-xs uppercase tracking-widest h-12 mt-2"
                >
                  {createRegion.isPending ? "Salvataggio..." : "Salva Regione"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {isLoading ? (
            <Loading label="Carico le regioni..." />
          ) : isError ? (
            <ErrorState message="Impossibile caricare le regioni." />
          ) : !regions || regions.length === 0 ? (
            <EmptyState
              icon={<MapPin className="w-10 h-10" />}
              title="Nessuna regione"
              description="Aggiungi la prima regione usando il modulo a sinistra."
            />
          ) : (
            <Card className="rounded-none border-border">
              <CardContent className="p-0">
                <table className="hidden sm:table w-full text-left border-collapse text-sm text-foreground">
                  <thead>
                    <tr className="border-b border-border bg-muted/30 uppercase text-[10px] tracking-widest font-bold text-muted-foreground">
                      <th className="p-4">Regione</th>
                      <th className="p-4">Codice</th>
                      <th className="p-4 text-right">Azioni</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {regions.map((region) => {
                      const isEditing = editingId === region.id;
                      return (
                        <tr key={region.id} className="hover:bg-muted/20 transition-colors align-top">
                          <td className="p-4 font-bold w-1/2">
                            {isEditing ? (
                              <div className="flex flex-col gap-2">
                                <Input
                                  value={editValues.name}
                                  onChange={(e) => setEditValues((v) => ({ ...v, name: e.target.value }))}
                                  className="bg-background rounded-none border-border h-9"
                                  placeholder="Nome"
                                />
                                <textarea
                                  value={editValues.description}
                                  onChange={(e) => setEditValues((v) => ({ ...v, description: e.target.value }))}
                                  rows={2}
                                  placeholder="Descrizione (opzionale)"
                                  className="w-full bg-background rounded-none border border-border px-3 py-2 text-xs font-normal text-foreground resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
                                />
                              </div>
                            ) : (
                              <>
                                <span className="block">{region.name}</span>
                                {region.description && (
                                  <span className="block font-normal text-muted-foreground text-xs mt-1 line-clamp-2">
                                    {region.description}
                                  </span>
                                )}
                              </>
                            )}
                          </td>
                          <td className="p-4">
                            {isEditing ? (
                              <Input
                                value={editValues.code}
                                onChange={(e) =>
                                  setEditValues((v) => ({ ...v, code: e.target.value.toUpperCase() }))
                                }
                                maxLength={5}
                                className="bg-background rounded-none border-border h-9 w-24 uppercase"
                                placeholder="SIC"
                              />
                            ) : (
                              <Badge variant="secondary" className="rounded-none font-bold tracking-wider">
                                {region.code}
                              </Badge>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <div className="inline-flex gap-2">
                              {isEditing ? (
                                <>
                                  <Button
                                    size="icon"
                                    onClick={() => saveEdit(region.id)}
                                    disabled={updateRegion.isPending}
                                    title="Salva"
                                    className="rounded-none h-8 w-8 bg-secondary text-white hover:bg-secondary/90"
                                  >
                                    <Check className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={cancelEdit}
                                    title="Annulla"
                                    className="rounded-none border-border h-8 w-8"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => startEdit(region)}
                                    title="Modifica"
                                    className="rounded-none border-border h-8 w-8 hover:border-secondary hover:text-secondary"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => onDelete(region)}
                                    disabled={deleteRegion.isPending}
                                    title="Elimina"
                                    className="rounded-none border-border h-8 w-8 text-destructive hover:bg-destructive hover:text-white"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <ul className="sm:hidden divide-y divide-border/50">
                  {regions.map((region) => {
                    const isEditing = editingId === region.id;
                    return (
                      <li key={region.id} className="p-4">
                        {isEditing ? (
                          <div className="flex flex-col gap-3">
                            <Input
                              value={editValues.name}
                              onChange={(e) => setEditValues((v) => ({ ...v, name: e.target.value }))}
                              className="bg-background rounded-none border-border"
                              placeholder="Nome"
                            />
                            <Input
                              value={editValues.code}
                              onChange={(e) =>
                                setEditValues((v) => ({ ...v, code: e.target.value.toUpperCase() }))
                              }
                              maxLength={5}
                              className="bg-background rounded-none border-border uppercase"
                              placeholder="SIC"
                            />
                            <textarea
                              value={editValues.description}
                              onChange={(e) => setEditValues((v) => ({ ...v, description: e.target.value }))}
                              rows={2}
                              placeholder="Descrizione (opzionale)"
                              className="w-full bg-background rounded-none border border-border px-3 py-2 text-xs text-foreground resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
                            />
                            <div className="flex gap-2">
                              <Button
                                onClick={() => saveEdit(region.id)}
                                disabled={updateRegion.isPending}
                                className="flex-1 rounded-none bg-secondary text-white hover:bg-secondary/90 font-bold text-xs uppercase tracking-widest"
                              >
                                <Check className="w-4 h-4" /> Salva
                              </Button>
                              <Button
                                variant="outline"
                                onClick={cancelEdit}
                                className="rounded-none border-border"
                              >
                                <X className="w-4 h-4" /> Annulla
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-foreground">{region.name}</span>
                                <Badge variant="secondary" className="rounded-none font-bold tracking-wider">
                                  {region.code}
                                </Badge>
                              </div>
                              {region.description && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{region.description}</p>
                              )}
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => startEdit(region)}
                                title="Modifica"
                                className="rounded-none border-border h-8 w-8 hover:border-secondary hover:text-secondary"
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => onDelete(region)}
                                disabled={deleteRegion.isPending}
                                title="Elimina"
                                className="rounded-none border-border h-8 w-8 text-destructive hover:bg-destructive hover:text-white"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminRegioniPage() {
  return (
    <AuthGuard adminOnly>
      <RegioniContent />
    </AuthGuard>
  );
}
