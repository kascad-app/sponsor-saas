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
  password: z.string().min(6, "Password must be at least 6 characters"),
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
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
        toast.success("Registration successful");
        router.push(ROUTES.APP.DASHBOARD);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Registration failed");
      });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6")}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-2xl font-bold">Create your account</h2>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your details below to create your sponsor account
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

          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="company name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {registerMutation.error && (
            <div className="text-sm text-red-500 text-center">
              {registerMutation.error.message ||
                "An error occurred during registration, please contact support"}
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
              "Register"
            )}
          </Button>
        </div>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link
            href={ROUTES.AUTH.LOGIN}
            className="underline underline-offset-4"
          >
            Sign in
          </Link>
        </div>
      </form>
    </Form>
  );
};
