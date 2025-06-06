"use client";

import { useSession } from "@/src/shared/api";
import { LoadingScreen } from "@/src/components/ui/loading-screen";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/src/shared/constants/ROUTES";
import { useEffect } from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = useSession(false); // Ne pas rediriger automatiquement
  const router = useRouter();

  useEffect(() => {
    // Si l'utilisateur est connecté, le rediriger vers le dashboard
    if (session.loggedIn) {
      router.push(ROUTES.APP.DASHBOARD);
    }
  }, [session.loggedIn, router]);

  // Afficher l'écran de chargement pendant la vérification de la session
  if (session.loading) {
    return <LoadingScreen />;
  }

  // Si l'utilisateur est connecté, afficher l'écran de chargement pendant la redirection
  if (session.loggedIn) {
    return <LoadingScreen />;
  }

  // Sinon, afficher les pages d'authentification
  return <>{children}</>;
}
