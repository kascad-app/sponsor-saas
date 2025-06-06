"use client";

import { Button } from "@/src/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { cn } from "@/src/lib/utils";
import { ROUTES } from "@/src/shared/constants/ROUTES";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useLogin } from "@/src/entities/authentication/authentication.hooks";
import { Loader2 } from "lucide-react";
import { LoadingScreen } from "@/src/components/ui/loading-screen";
import { useState } from "react";

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const LoginFormWidget: React.FC = () => {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  const loginMutation = useLogin();

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    loginMutation
      .trigger({
        email: values.email,
        password: values.password,
      })
      .then(async (res) => {
        console.log(res);
        toast.success("La connexion a été réussie");
        setIsRedirecting(true);
        router.push(ROUTES.APP.DASHBOARD);
      })
      .catch((err) => {
        console.error(err);
        toast.error("La connexion a échoué");
      });
  }

  // Afficher l'écran de chargement si on est en train de rediriger
  if (isRedirecting) {
    return <LoadingScreen />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6")}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-2xl font-bold">Se connecter à votre compte</h2>
          <p className="text-balance text-sm text-muted-foreground">
            Entrez votre email ci-dessous pour vous connecter à votre compte
          </p>
        </div>

        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel>Adresse email</FormLabel>
                <FormControl>
                  <Input placeholder="Adresse email" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Mot de passe"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {loginMutation.error && (
            <div className="text-sm text-red-500 text-center">
              {loginMutation.error.message ||
                "An error occurred during login, please contact support"}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loginMutation.isMutating}
          >
            {loginMutation.isMutating ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Se connecter"
            )}
          </Button>
        </div>
        <div className="text-center text-sm">
          Vous n&apos;avez pas de compte ?{" "}
          <Link
            href={ROUTES.AUTH.REGISTER}
            className="underline underline-offset-4"
          >
            S&apos;inscrire
          </Link>
        </div>
      </form>
    </Form>
  );
};
