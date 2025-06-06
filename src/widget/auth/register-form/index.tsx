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
import { useRegister } from "@/src/entities/authentication/authentication.hooks";
import { Loader2 } from "lucide-react";

const registerFormSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  companyName: z
    .string()
    .min(2, "Le nom de la société doit contenir au moins 2 caractères"),
});

export const RegisterFormWidget: React.FC = () => {
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
      companyName: "",
    },
  });

  const router = useRouter();
  const registerMutation = useRegister();

  async function onSubmit(values: z.infer<typeof registerFormSchema>) {
    registerMutation
      .trigger({
        email: values.email,
        password: values.password,
        companyName: values.companyName,
      })
      .then(() => {
        toast.success("Votre compte a été créé avec succès");
        router.push(ROUTES.APP.DASHBOARD);
      })
      .catch((err) => {
        console.error(err);
        toast.error(
          "Une erreur est survenue lors de la création de votre compte, veuillez réessayer",
        );
      });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6")}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-2xl font-bold">Créer votre compte</h2>
          <p className="text-balance text-sm text-muted-foreground">
            Entrez vos informations ci-dessous pour créer votre compte sponsor
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

          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel>Nom de la société</FormLabel>
                <FormControl>
                  <Input placeholder="Nom de la société" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {registerMutation.error && (
            <div className="text-sm text-red-500 text-center">
              {registerMutation.error.message ||
                "Une erreur est survenue lors de la création de votre compte, veuillez contacter le support"}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={registerMutation.isMutating}
          >
            {registerMutation.isMutating ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Créer un compte"
            )}
          </Button>
        </div>
        <div className="text-center text-sm">
          Vous avez déjà un compte ?{" "}
          <Link
            href={ROUTES.AUTH.LOGIN}
            className="underline underline-offset-4"
          >
            Se connecter
          </Link>
        </div>
      </form>
    </Form>
  );
};
