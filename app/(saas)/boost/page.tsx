"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { EmptyBoostState } from "@/src/widget/boosts/empty-boosts";
import { BoostCard } from "@/src/widget/boosts/boosts-card";
import { CreateBoostDrawer } from "@/src/widget/boosts/boost-drawer";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { CreateOfferInput } from "@/src/entities/boosts/boosts.types";
import {
  useGetBoosts,
  useCreateBoost,
} from "@/src/entities/boosts/boosts.hook";

export default function BoostPage() {
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Utiliser les hooks pour récupérer et créer les boosts
  const { data: boosts = [], isLoading, error, mutate } = useGetBoosts();
  const { createBoost } = useCreateBoost();

  const handleCreateBoost = async (newBoostData: CreateOfferInput) => {
    setIsCreating(true);
    try {
      await createBoost(newBoostData);
      toast.success("Offre créée avec succès !");
      setIsCreateDrawerOpen(false);
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      toast.error("Erreur lors de la création de l'offre. Veuillez réessayer.");
    } finally {
      setIsCreating(false);
    }
  };

  const hasBoosts = boosts && boosts.length > 0;

  // Affichage du loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Affichage en cas d'erreur
  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Mes offres de sponsoring</h1>
        </div>
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="flex flex-col items-center justify-center p-16 text-center">
            <div className="text-destructive text-lg font-medium mb-4">
              Erreur lors du chargement des offres
            </div>
            <p className="text-muted-foreground mb-4">
              Impossible de récupérer vos offres. Veuillez réessayer.
            </p>
            <Button onClick={() => mutate()} variant="outline">
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      {/* Header avec titre et bouton conditionnel */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mes offres de sponsoring</h1>

        {/* Bouton en haut à droite quand il y a des boosts */}
        {hasBoosts && (
          <Button
            onClick={() => setIsCreateDrawerOpen(true)}
            className="flex items-center gap-2"
            disabled={isCreating}
          >
            <Plus className="w-4 h-4" />
            Nouvelle offre
          </Button>
        )}
      </div>

      {/* Contenu principal */}
      {!hasBoosts ? (
        /* Empty state avec bouton au centre */
        <EmptyBoostState onCreateClick={() => setIsCreateDrawerOpen(true)} />
      ) : (
        /* Liste des boosts */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boosts.map((boost) => (
            <BoostCard key={boost._id} boost={boost} />
          ))}
        </div>
      )}

      {/* Drawer de création */}
      <CreateBoostDrawer
        open={isCreateDrawerOpen}
        onOpenChange={(open) => {
          if (!isCreating) {
            setIsCreateDrawerOpen(open);
          }
        }}
        onCreateBoost={handleCreateBoost}
        isCreating={isCreating}
      />
    </div>
  );
}
