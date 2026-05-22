"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Inserisci un indirizzo email valido (es. nome@dominio.it)"),
  password: z.string().min(6, "La password deve contenere almeno 6 caratteri"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Il nome deve contenere almeno 2 caratteri"),
  email: z.string().email("Inserisci un indirizzo email valido"),
  password: z
    .string()
    .min(8, "La password deve contenere almeno 8 caratteri")
    .regex(/[A-Z]/, "La password deve contenere almeno una lettera maiuscola")
    .regex(/[0-9]/, "La password deve contenere almeno un numero"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Autenticazione() {
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormValues>({
    // se r
    resolver: zodResolver(loginSchema as any),
  });

  const {
    register: registerAuth,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema as any),
  });

  const onLogin = (data: LoginFormValues) => {
    toast.success("Accesso effettuato", {
      description: `Bentornato nell'archivio, ${data.email}!`,
    });
  };

  const onRegister = (data: RegisterFormValues) => {
    toast.success("Account creato con successo", {
      description: "Benvenuto all'interno di SaporItaly!",
    });
  };

  return (
    <main className="container mx-auto max-w-md px-4 py-20 flex-1 flex flex-col justify-center">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-headline text-foreground mb-2">Area Riservata</h1>
        <p className="text-muted-foreground text-sm">Accedi ai manoscritti o gestisci l'archivio storico.</p>
      </div>

      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-none bg-muted/50 border border-border p-1">
          <TabsTrigger value="login" className="rounded-none data-[state=active]:bg-background data-[state=active]:text-foreground">
            Accedi
          </TabsTrigger>
          <TabsTrigger value="register" className="rounded-none data-[state=active]:bg-background data-[state=active]:text-foreground">
            Registrati
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <Card className="rounded-none border-border mt-4">
            <CardContent className="pt-6 flex flex-col gap-4">
              <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Email</label>
                  <Input
                    type="text"
                    placeholder="nome@esempio.com"
                    className={`bg-muted/10 rounded-none border-border ${loginErrors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    {...registerLogin("email")}
                  />
                  {loginErrors.email && <p className="text-xs text-destructive mt-1 font-medium">{loginErrors.email.message}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className={`bg-muted/10 rounded-none border-border ${loginErrors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    {...registerLogin("password")}
                  />
                  {loginErrors.password && <p className="text-xs text-destructive mt-1 font-medium">{loginErrors.password.message}</p>}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-secondary text-white hover:bg-secondary/90 rounded-none font-bold uppercase tracking-widest text-xs h-12 mt-2"
                >
                  Entra nell'Archivio
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="register">
          <Card className="rounded-none border-border mt-4">
            <CardContent className="pt-6">
              <form onSubmit={handleRegisterSubmit(onRegister)} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Nome Completo</label>
                  <Input
                    type="text"
                    placeholder="Mario Rossi"
                    className={`bg-muted/10 rounded-none border-border ${registerErrors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    {...registerAuth("name")}
                  />
                  {registerErrors.name && <p className="text-xs text-destructive mt-1 font-medium">{registerErrors.name.message}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Email</label>
                  <Input
                    type="text"
                    placeholder="mario.rossi@esempio.com"
                    className={`bg-muted/10 rounded-none border-border ${registerErrors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    {...registerAuth("email")}
                  />
                  {registerErrors.email && <p className="text-xs text-destructive mt-1 font-medium">{registerErrors.email.message}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Password</label>
                  <Input
                    type="password"
                    placeholder="Minimo 8 caratteri, 1 maiuscola, 1 numero"
                    className={`bg-muted/10 rounded-none border-border ${registerErrors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    {...registerAuth("password")}
                  />
                  {registerErrors.password && <p className="text-xs text-destructive mt-1 font-medium">{registerErrors.password.message}</p>}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary text-white hover:bg-primary/90 rounded-none font-bold uppercase tracking-widest text-xs h-12 mt-2"
                >
                  Crea Profilo Ricercatore
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
