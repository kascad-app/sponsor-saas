import { KascadLogo } from "@/src/shared/ui/Kascad-logo.ui";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Welcome back on Kascad",
  description: "Find the best rider for your marketing campaign",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <KascadLogo />
          </div>
          Kascad
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">{children}</div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="/auth/kascad_login.webp"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          width={1000}
          height={1000}
        />
      </div>
    </div>
  );
}
