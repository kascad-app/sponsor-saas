"use client";

import { use } from "react";
import { useGetBoostById } from "@/src/entities/boosts/boosts.hook";
import { BoostDetailScreen } from "@/src/components/screens/boost-detail-screen";
import { SkeletonBoostDetail } from "@/src/widget/boosts/skeleton-boost-detail";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface BoostDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function BoostDetailPage({ params }: BoostDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const { data: boost, isLoading, error, mutate } = useGetBoostById(id);

  const handleBoostUpdated = () => {
    mutate();
  };

  if (isLoading) {
    return <SkeletonBoostDetail />;
  }

  // État d'erreur
  if (error || !boost) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold">Offre non trouvée</h1>
        </div>

        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="flex flex-col items-center justify-center p-16 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mb-4" />
            <div className="text-destructive text-lg font-medium mb-4">
              {error ? "Erreur lors du chargement" : "Offre introuvable"}
            </div>
            <p className="text-muted-foreground mb-4">
              {error
                ? "Impossible de récupérer les détails de cette offre. Veuillez réessayer."
                : "Cette offre n'existe pas ou a été supprimée."}
            </p>
            <div className="flex gap-2">
              <Button onClick={() => router.back()} variant="outline">
                Retour
              </Button>
              {error && <Button onClick={() => mutate()}>Réessayer</Button>}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <BoostDetailScreen boost={boost} onBoostUpdated={handleBoostUpdated} />
  );
}
