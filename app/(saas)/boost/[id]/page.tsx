"use client";

import { use } from "react";
import { useGetBoostById } from "@/src/entities/boosts/boosts.hook";
import { BoostDetailScreen } from "@/src/components/screens/boost-detail-screen";
import { SkeletonBoostDetail } from "@/src/widget/boosts/skeleton-boost-detail";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import {
  ArrowLeft,
  AlertCircle,
  FileText,
  Users,
  MessageSquare,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { OfferApplications } from "@/src/widget/boosts/boost-application";
import { useGetOfferApplications } from "@/src/entities/boosts/boosts.hook";

interface BoostDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function BoostDetailPage({ params }: BoostDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const { data: boost, isLoading, error, mutate } = useGetBoostById(id);
  const {
    data: applications = [],
    isLoading: applicationsLoading,
    mutate: mutateApplications,
  } = useGetOfferApplications(id);

  const handleBoostUpdated = () => {
    mutate();
  };

  const handleApplicationUpdate = () => {
    mutateApplications();
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
    <div className="container mx-auto py-6">
      {/* Header avec bouton retour */}
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
        <div>
          <h1 className="text-2xl font-bold">{boost.title}</h1>
          <p className="text-muted-foreground">
            {applications?.length || 0} candidature
            {(applications?.length || 0) > 1 ? "s" : ""} reçue
            {(applications?.length || 0) > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Interface avec onglets */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Aperçu
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Candidatures ({applications?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Messages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <BoostDetailScreen
            boost={boost}
            onBoostUpdated={handleBoostUpdated}
          />
        </TabsContent>

        <TabsContent value="applications" className="mt-6">
          <OfferApplications
            applications={applications}
            isLoading={applicationsLoading}
            onApplicationUpdate={handleApplicationUpdate}
          />
        </TabsContent>

        <TabsContent value="messages" className="mt-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
              <div className="text-lg font-medium mb-2">Messagerie</div>
              <p className="text-muted-foreground">
                La fonctionnalité de messagerie sera bientôt disponible.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
