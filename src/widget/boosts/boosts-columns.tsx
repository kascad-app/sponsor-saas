"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { Offer } from "@/src/entities/boosts/boosts.types";
import { formatDate, formatBudget } from "@/src/lib/boosts/boosts";

interface BoostsColumnsProps {
  onDelete?: (offer: Offer) => void;
  onEdit?: (offer: Offer) => void;
}

export const createBoostsColumns = ({
  onDelete,
  onEdit,
}: BoostsColumnsProps = {}): ColumnDef<Offer>[] => [
  {
    accessorKey: "title",
    header: "Offres",
    cell: ({ row }) => {
      const offer = row.original;
      return (
        <div className="max-w-[300px]">
          <div className="font-medium text-sm leading-tight mb-1">
            {offer.title}
          </div>
          <div className="text-xs text-muted-foreground line-clamp-2">
            {offer.description}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "budget",
    header: "Budget",
    cell: ({ row }) => {
      const offer = row.original;
      return <div className="font-medium text-sm">{formatBudget(offer)}</div>;
    },
  },
  {
    accessorKey: "sports",
    header: "Sports",
    cell: ({ row }) => {
      const sports = row.original.sports;
      if (sports.length === 1) {
        return (
          <Badge variant="outline" className="font-normal">
            {sports[0]}
          </Badge>
        );
      }
      return (
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="font-normal">
            {sports[0]}
          </Badge>
          {sports.length > 1 && (
            <Badge variant="secondary" className="font-normal">
              +{sports.length - 1}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "contractType",
    header: "Type de contrat",
    cell: ({ row }) => (
      <div className="text-sm">{row.original.contractType}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Créée le",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {formatDate(new Date(row.original.createdAt).toISOString())}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const offer = row.original;

      const handleAction = (action: () => void, event: React.MouseEvent) => {
        event.stopPropagation(); // Empêche la navigation vers le détail
        action();
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={(e) => e.stopPropagation()} // Empêche la navigation
            >
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) =>
                handleAction(() => {
                  // Navigation vers le détail (comportement par défaut)
                  window.location.href = `/boost/${offer._id}`;
                }, e)
              }
            >
              <Eye className="mr-2 h-4 w-4" />
              Voir les détails
            </DropdownMenuItem>

            {onEdit && (
              <DropdownMenuItem
                onClick={(e) => handleAction(() => onEdit(offer), e)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </DropdownMenuItem>
            )}

            {onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => handleAction(() => onDelete(offer), e)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Export de l'ancienne fonction pour la compatibilité
export const boostsColumns = createBoostsColumns();
