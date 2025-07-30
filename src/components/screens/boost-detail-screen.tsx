"use client";

import { useState } from "react";
import {
  ArrowLeft,
  DollarSign,
  Users,
  Trophy,
  Clock,
  Edit,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Offer, CreateOfferInput } from "@/src/entities/boosts/boosts.types";
import { formatDate, formatBudget } from "@/src/lib/boosts/boosts";
import { DeleteBoostDialog } from "@/src/widget/boosts/delete-boost-dialog";
import { EditBoostDrawer } from "@/src/widget/boosts/edit-boost-drawer";
import { useUpdateBoost } from "@/src/entities/boosts/boosts.hook";

interface BoostDetailScreenProps {
  boost: Offer;
  onBoostUpdated?: () => void;
}

export const BoostDetailScreen = ({
  boost,
  onBoostUpdated,
}: BoostDetailScreenProps) => {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { updateBoost } = useUpdateBoost();
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
      if (onBoostUpdated) {
        onBoostUpdated();
      }
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
      toast.error(
        "Erreur lors de la modification de l'offre. Veuillez réessayer.",
      );
    } finally {
      setIsUpdating(false);
    }
  };

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
          </div>
        </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description de l&apos;offre</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap break-words">
                {boost.description}
              </p>
            </CardContent>
          </Card>

          {/* Critères */}
          <Card>
            <CardHeader>
              <CardTitle>Critères de l&apos;offre</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Trophy className="w-4 h-4 text-blue-600" />
                    Sports
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {boost.sports.map((sport) => (
                      <Badge key={sport} variant="outline">
                        {sport}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Users className="w-4 h-4 text-green-600" />
                    Type de contrat
                  </div>
                  <Badge variant="secondary">{boost.contractType}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Métadonnées */}
          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Créée le:</span>
                  <span>
                    {formatDate(new Date(boost.createdAt).toISOString())}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Budget
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatBudget(boost)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

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
};
