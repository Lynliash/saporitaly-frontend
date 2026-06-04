"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLogin, useRegister } from "@/hooks/useAuth";
import { apiError } from "@/lib/api";

const loginSchema = z.object({
  email: z.string().email("Inserisci un indirizzo email valido (es. nome@dominio.it)"),
  password: z.string().min(1, "Inserisci la tua password"),
});

const registerSchema = z.object({
  email: z.string().email("Inserisci un indirizzo email valido"),
  username: z.string().min(3, "Lo username deve contenere almeno 3 caratteri"),
  password: z.string().min(8, "La password deve contenere almeno 8 caratteri"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const labelClass = "text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block";
const inputClass = "bg-muted/10 rounded-none border-border";
const errorInputClass = "border-destructive focus-visible:ring-destructive";

export default function Autenticazione() {
  const router = useRouter();
  const login = useLogin();
  const registerUser = useRegister();

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: registerAuth,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onLogin = (data: LoginFormValues) => {
    login.mutate(data, {
      onSuccess: (res) => {
        toast.success("Accesso effettuato", {
          description: `Bentornato nell'archivio, ${res.username}!`,
        });
        router.push("/");
      },
      onError: (err) => toast.error(apiError(err)),
    });
  };

  const onRegister = (data: RegisterFormValues) => {
    registerUser.mutate(data, {
      onSuccess: () => {
        toast.success("Account creato con successo", {
          description: "Benvenuto all'interno di SaporItaly!",
        });
        router.push("/");
      },
      onError: (err) => toast.error(apiError(err)),
    });
  };

  return (
    <main className="container mx-auto max-w-md px-5 sm:px-8 py-12 sm:py-20 min-h-screen flex flex-col justify-center">
      <div className="text-center mb-8">
        <p className="text-secondary text-xs font-bold tracking-widest uppercase mb-2">Area Riservata</p>
        <h1 className="text-3xl sm:text-4xl font-headline text-foreground mb-2 leading-tight">
          L&apos;Archivio dei Sapori
        </h1>
        <p className="text-muted-foreground text-sm">Accedi ai manoscritti o registrati per iniziare a cucinare.</p>
      </div>

      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-none bg-muted/50 border border-border p-1">
          <TabsTrigger
            value="login"
            className="rounded-none data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
            Accedi
          </TabsTrigger>
          <TabsTrigger
            value="register"
            className="rounded-none data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
            Registrati
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <Card className="rounded-none border-border mt-4">
            <CardContent className="pt-6">
              <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4" noValidate>
                <div>
                  <label className={labelClass}>Email</label>
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="nome@esempio.com"
                    className={`${inputClass} ${loginErrors.email ? errorInputClass : ""}`}
                    {...registerLogin("email")}
                  />
                  {loginErrors.email && (
                    <p className="text-xs text-destructive mt-1 font-medium">{loginErrors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Password</label>
                  <Input
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className={`${inputClass} ${loginErrors.password ? errorInputClass : ""}`}
                    {...registerLogin("password")}
                  />
                  {loginErrors.password && (
                    <p className="text-xs text-destructive mt-1 font-medium">{loginErrors.password.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={login.isPending}
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-none font-bold uppercase tracking-widest text-xs h-12 mt-2"
                >
                  {login.isPending ? "Accesso in corso..." : "Entra nell'Archivio"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="register">
          <Card className="rounded-none border-border mt-4">
            <CardContent className="pt-6">
              <form onSubmit={handleRegisterSubmit(onRegister)} className="space-y-4" noValidate>
                <div>
                  <label className={labelClass}>Email</label>
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="mario.rossi@esempio.com"
                    className={`${inputClass} ${registerErrors.email ? errorInputClass : ""}`}
                    {...registerAuth("email")}
                  />
                  {registerErrors.email && (
                    <p className="text-xs text-destructive mt-1 font-medium">{registerErrors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Username</label>
                  <Input
                    type="text"
                    autoComplete="username"
                    placeholder="mario_rossi"
                    className={`${inputClass} ${registerErrors.username ? errorInputClass : ""}`}
                    {...registerAuth("username")}
                  />
                  {registerErrors.username && (
                    <p className="text-xs text-destructive mt-1 font-medium">{registerErrors.username.message}</p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Password</label>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    placeholder="Minimo 8 caratteri"
                    className={`${inputClass} ${registerErrors.password ? errorInputClass : ""}`}
                    {...registerAuth("password")}
                  />
                  {registerErrors.password && (
                    <p className="text-xs text-destructive mt-1 font-medium">{registerErrors.password.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={registerUser.isPending}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none font-bold uppercase tracking-widest text-xs h-12 mt-2"
                >
                  {registerUser.isPending ? "Creazione in corso..." : "Crea il tuo Profilo"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
