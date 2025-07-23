"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { Offer } from "@/src/entities/boosts/boosts.types";
import { formatBudget } from "@/src/lib/boosts/boosts";

export const boostsColumns: ColumnDef<Offer>[] = [
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
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const offer = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => console.log("Voir", offer._id)}>
              <Eye className="mr-2 h-4 w-4" />
              Voir
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log("Modifier", offer._id)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log("Supprimer", offer._id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
