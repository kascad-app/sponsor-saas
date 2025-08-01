"use client";

import { use, useState } from "react";
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
  Edit,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { OfferApplications } from "@/src/widget/boosts/boost-application";
import {
  useGetOfferApplications,
  useUpdateBoost,
} from "@/src/entities/boosts/boosts.hook";
import { DeleteBoostDialog } from "@/src/widget/boosts/delete-boost-dialog";
import { EditBoostDrawer } from "@/src/widget/boosts/edit-boost-drawer";
import { CreateOfferInput } from "@/src/entities/boosts/boosts.types";
import { toast } from "sonner";
import { BoostMessages } from "@/src/widget/boosts/boost-messages";

interface BoostDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function BoostDetailPage({ params }: BoostDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { updateBoost } = useUpdateBoost();

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

  const handleDeleteSuccess = () => {
    router.push("/boost");
  };

  const handleEditBoost = async (
    boostId: string,
    data: Partial<CreateOfferInput>,
  ) => {
    setIsUpdating(true);
    try {
      await updateBoost(boostId, data);
      toast.success("Offre modifiée avec succès !");
      setShowEditDrawer(false);
      handleBoostUpdated();
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
      toast.error(
        "Erreur lors de la modification de l'offre. Veuillez réessayer.",
      );
    } finally {
      setIsUpdating(false);
    }
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
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

        {/* Boutons d'action */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEditDrawer(true)}
            disabled={isUpdating}
          >
            <Edit className="w-4 h-4 mr-2" />
            Modifier
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Supprimer
          </Button>
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
          <BoostMessages boost={boost} applications={applications} />
        </TabsContent>
      </Tabs>

      {/* Modale de suppression */}
      <DeleteBoostDialog
        boost={boost}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onDeleteSuccess={handleDeleteSuccess}
      />

      {/* Drawer de modification */}
      <EditBoostDrawer
        boost={boost}
        open={showEditDrawer}
        onOpenChange={setShowEditDrawer}
        onEditBoost={handleEditBoost}
        isEditing={isUpdating}
      />
    </div>
  );
}
