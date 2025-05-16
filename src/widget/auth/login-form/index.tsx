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

import { useSession } from "@/src/shared/api";
import { useEffect } from "react";
import { useLogin } from "@/src/entities/authentication/authentication.hooks";
import { Loader2 } from "lucide-react";

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const LoginFormWidget: React.FC = () => {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  const loginMutation = useLogin();
  const session = useSession();

  useEffect(() => {
    if (session.loggedIn) {
      router.push(ROUTES.APP.DASHBOARD);
    }
  }, [session.loggedIn, router]);

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    loginMutation
      .trigger({
        email: values.email,
        password: values.password,
      })
      .then(async (res) => {
        console.log(res);
        toast.success("Login successful");
        await session.mutate();
        router.push(ROUTES.APP.DASHBOARD);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Login failed");
      });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6")}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-2xl font-bold">Login to your account</h2>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>

        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email" type="email" {...field} />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="password" type="password" {...field} />
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
              "Login"
            )}
          </Button>
        </div>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href={ROUTES.AUTH.REGISTER}
            className="underline underline-offset-4"
          >
            Sign up
          </Link>
        </div>
      </form>
    </Form>
  );
};
