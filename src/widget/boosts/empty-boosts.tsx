"use client";

import { Plus, Award } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";

export const EmptyBoostState = ({
  onCreateClick,
}: {
  onCreateClick: () => void;
}) => (
  <div className="flex flex-col items-center justify-center py-20">
    <Card className="w-full max-w-2xl">
      <CardContent className="flex flex-col items-center justify-center p-16 text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Award className="w-8 h-8 text-muted-foreground" />
          </div>
        </div>
        <h3 className="text-2xl font-semibold mb-4">Aucune offre créée</h3>
        <p className="text-muted-foreground text-lg max-w-md mb-8">
          Créez votre première offre pour commencer à sponsoriser des riders et
          développer votre marque.
        </p>
        <Button
          onClick={onCreateClick}
          size="lg"
          className="flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Créer ma première offre
        </Button>
      </CardContent>
    </Card>
  </div>
);
