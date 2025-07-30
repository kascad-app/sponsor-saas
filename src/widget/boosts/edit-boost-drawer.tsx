"use client";

import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/src/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { ContractType, Currency, SportName } from "@kascad-app/shared-types";
import {
  CreateOfferInput,
  OfferFormData,
  Offer,
} from "@/src/entities/boosts/boosts.types";
import { MultiSportSelect } from "./multi-sport-select";

interface EditBoostDrawerProps {
  boost: Offer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditBoost: (boostId: string, data: Partial<CreateOfferInput>) => void;
  isEditing?: boolean;
}

export const EditBoostDrawer = ({
  boost,
  open,
  onOpenChange,
  onEditBoost,
  isEditing = false,
}: EditBoostDrawerProps) => {
  const [formData, setFormData] = useState<OfferFormData>({
    title: "",
    description: "",
    budgetMin: "",
    budgetMax: "",
    sports: [],
    contractType: "",
    currency: "",
  });

  // Initialiser le formulaire avec les données de l'offre
  useEffect(() => {
    if (boost && open) {
      setFormData({
        title: boost.title || "",
        description: boost.description || "",
        budgetMin: boost.budgetMin?.toString() || "",
        budgetMax: boost.budgetMax?.toString() || "",
        sports: boost.sports || [],
        contractType: boost.contractType || "",
        currency: boost.currency || "",
      });
    }
  }, [boost, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.title &&
      formData.description &&
      formData.sports.length > 0 &&
      formData.contractType &&
      !isEditing
    ) {
      // Créer l'objet de mise à jour
      const updateData: Partial<CreateOfferInput> = {
        title: formData.title,
        description: formData.description,
        contractType: formData.contractType as ContractType,
        sports: formData.sports as SportName[],
        budgetMin: formData.budgetMin
          ? parseInt(formData.budgetMin)
          : undefined,
        budgetMax: formData.budgetMax
          ? parseInt(formData.budgetMax)
          : undefined,
        currency: (formData.currency as Currency) || undefined,
      };

      onEditBoost(boost._id, updateData);
    }
  };

  const handleCancel = () => {
    // Réinitialiser le formulaire avec les données originales
    if (boost) {
      setFormData({
        title: boost.title || "",
        description: boost.description || "",
        budgetMin: boost.budgetMin?.toString() || "",
        budgetMax: boost.budgetMax?.toString() || "",
        sports: boost.sports || [],
        contractType: boost.contractType || "",
        currency: boost.currency || "",
      });
    }
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Modifier l&apos;offre</SheetTitle>
          <SheetDescription>
            Modifiez les détails de votre offre de sponsoring.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="title">Titre de l&apos;offre *</Label>
            <Input
              id="title"
              placeholder="Ex: Sponsoring pour événement BMX"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              disabled={isEditing}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <textarea
              id="description"
              placeholder="Décrivez votre offre de sponsoring..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              disabled={isEditing}
              className="w-full min-h-[100px] px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border border-input bg-background rounded-md"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>
              Sports *{" "}
              <span className="text-sm text-muted-foreground">
                (Sélectionnez un ou plusieurs sports)
              </span>
            </Label>
            <MultiSportSelect
              selectedSports={formData.sports}
              onSportsChange={(sports) => setFormData({ ...formData, sports })}
              disabled={isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contractType">Type de contrat *</Label>
            <Select
              value={formData.contractType}
              onValueChange={(value) =>
                setFormData({ ...formData, contractType: value })
              }
              disabled={isEditing}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un type de contrat" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ContractType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budgetMin">Budget minimum (€)</Label>
              <Input
                id="budgetMin"
                type="number"
                placeholder="1000"
                value={formData.budgetMin}
                onChange={(e) =>
                  setFormData({ ...formData, budgetMin: e.target.value })
                }
                disabled={isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budgetMax">Budget maximum (€)</Label>
              <Input
                id="budgetMax"
                type="number"
                placeholder="5000"
                value={formData.budgetMax}
                onChange={(e) =>
                  setFormData({ ...formData, budgetMax: e.target.value })
                }
                disabled={isEditing}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Devise</Label>
            <Select
              value={formData.currency}
              onValueChange={(value) =>
                setFormData({ ...formData, currency: value })
              }
              disabled={isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une devise" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Currency).map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <SheetFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isEditing}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isEditing || formData.sports.length === 0}
            >
              {isEditing ? "Modification..." : "Modifier l'offre"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};
