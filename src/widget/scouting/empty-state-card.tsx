"use client";

import { Card, CardContent } from "@/src/components/ui/card";
import { KascadLogo } from "@/src/shared/ui/Kascad-logo.ui";

export const EmptyStateCard = () => (
  <div className="flex flex-col items-center justify-center py-20">
    <Card className="w-full max-w-2xl">
      <CardContent className="flex flex-col items-center justify-center p-16 text-center">
        <div className="mb-8">
          <KascadLogo />
        </div>
        <h3 className="text-2xl font-semibold mb-4">Appliquer des filtres</h3>
        <p className="text-muted-foreground text-lg max-w-md">
          Utilisez les filtres pour découvrir des riders qui correspondent à vos
          critères
        </p>
      </CardContent>
    </Card>
  </div>
);
