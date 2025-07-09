"use client";

import { Card, CardContent } from "@/src/components/ui/card";
import { X } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { KascadLogo } from "@/src/shared/ui/Kascad-logo.ui";

export const NoResultsCard = ({
  onResetFilters,
  onModifySearch,
  activeFilters,
}: {
  onResetFilters: () => void;
  onModifySearch: () => void;
  activeFilters: string[];
}) => (
  <div className="flex flex-col items-center justify-center py-20">
    <Card className="w-full max-w-2xl">
      <CardContent className="flex flex-col items-center justify-center p-16 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <KascadLogo />
          </div>
        </div>

        <h3 className="text-2xl font-semibold mb-4">Aucun rider trouvé</h3>
        <p className="text-muted-foreground text-lg mb-6 max-w-md">
          Votre recherche ne correspond à aucun rider dans notre base de
          données.
        </p>

        {activeFilters.length > 0 && (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-3">
              Filtres actifs :{" "}
              <span className="font-medium">{activeFilters.join(", ")}</span>
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onResetFilters}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Réinitialiser les filtres
          </Button>
          <Button variant="default" onClick={onModifySearch}>
            Modifier la recherche
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
);
