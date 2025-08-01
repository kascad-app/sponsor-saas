"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { useDeleteBoost } from "@/src/entities/boosts/boosts.hook";
import { Offer } from "@/src/entities/boosts/boosts.types";

interface DeleteBoostDialogProps {
  boost: Offer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleteSuccess: () => void;
}

export const DeleteBoostDialog = ({
  boost,
  open,
  onOpenChange,
  onDeleteSuccess,
}: DeleteBoostDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteBoost } = useDeleteBoost();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteBoost(boost._id);
      toast.success("Offre supprimée avec succès");
      onDeleteSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error(
        "Erreur lors de la suppression de l'offre. Veuillez réessayer.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Supprimer l&apos;offre</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer l&apos;offre &quot;{boost.title}
            &quot; ? Cette action est irréversible et supprimera également
            toutes les candidatures associées.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Annuler
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            variant="destructive"
          >
            {isDeleting ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
