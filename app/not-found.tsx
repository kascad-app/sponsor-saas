import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { KascadLogo } from "@/src/shared/ui/Kascad-logo.ui";
import { ROUTES } from "@/src/shared/constants/ROUTES";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="transform hover:scale-105 transition-transform duration-300">
            <KascadLogo />
          </div>
        </div>

        {/* Error Code */}
        <div className="space-y-4">
          <h1 className="text-8xl font-bold text-primary/80 select-none">
            404
          </h1>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">
              Page introuvable
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Désolé, la page que vous recherchez n&apos;existe pas ou a été
              déplacée. Retournez à la page d&apos;accueil pour continuer votre
              navigation.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button asChild variant="outline" size="lg" className="w-full">
            <Link href={ROUTES.APP.DASHBOARD}>Aller au tableau de bord</Link>
          </Button>
        </div>

        {/* Additional Help */}
        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Besoin d&apos;aide ? Contactez notre équipe de support.
          </p>
        </div>
      </div>
    </div>
  );
}
