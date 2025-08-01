"use client";

import { useSession } from "@/src/shared/api";
import { LoadingScreen } from "@/src/components/ui/loading-screen";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/src/shared/constants/ROUTES";
import { useEffect, useRef } from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = useSession(false);
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Éviter les redirections multiples
    if (session.loggedIn && !session.loading && !hasRedirected.current) {
      hasRedirected.current = true;
      router.replace(ROUTES.APP.DASHBOARD);
    }
  }, [session.loggedIn, session.loading, router]);

  if (session.loading) {
    return <LoadingScreen />;
  }
  if (session.loggedIn && hasRedirected.current) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
