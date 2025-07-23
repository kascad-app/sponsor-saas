"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { EmptyBoostState } from "@/src/widget/boosts/empty-boosts";
import { BoostCard } from "@/src/widget/boosts/boosts-card";
import { CreateBoostDrawer } from "@/src/widget/boosts/boost-drawer";
import { Card, CardContent } from "@/src/components/ui/card";
import { CreateOfferInput } from "@/src/entities/boosts/boosts.types";
import {
  useGetBoosts,
  useCreateBoost,
} from "@/src/entities/boosts/boosts.hook";
import { SkeletonAllBoost } from "@/src/widget/boosts/skeleton-all-boost";

export default function BoostPage() {
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { data: boostsResponse, isLoading, error, mutate } = useGetBoosts();
  const { createBoost } = useCreateBoost();

  const boosts = boostsResponse?.data || [];
  const pagination = boostsResponse?.pagination;

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

  // loading state
  if (isLoading) {
    return <SkeletonAllBoost />;
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Mes offres de sponsoring</h1>
          {pagination && (
            <p className="text-sm text-muted-foreground mt-1">
              {pagination.totalItems} offre
              {pagination.totalItems > 1 ? "s" : ""} • Page{" "}
              {pagination.currentPage} sur {pagination.totalPages}
            </p>
          )}
        </div>
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

      {!hasBoosts ? (
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
