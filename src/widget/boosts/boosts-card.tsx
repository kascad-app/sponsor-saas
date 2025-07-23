"use client";
import { DollarSign, Users, Trophy, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { IOffer } from "@kascad-app/shared-types";

// Fonction pour formater la date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const BoostCard = ({ boost }: { boost: IOffer }) => {
  // Formatage du budget
  const formatBudget = () => {
    if (boost.budgetMin && boost.budgetMax) {
      if (boost.budgetMin === boost.budgetMax) {
        return `${boost.budgetMin.toLocaleString()}${boost.currency || "€"}`;
      }
      return `${boost.budgetMin.toLocaleString()} - ${boost.budgetMax.toLocaleString()}${
        boost.currency || "€"
      }`;
    }
    if (boost.budgetMin) {
      return `À partir de ${boost.budgetMin.toLocaleString()}${
        boost.currency || "€"
      }`;
    }
    if (boost.budgetMax) {
      return `Jusqu'à ${boost.budgetMax.toLocaleString()}${
        boost.currency || "€"
      }`;
    }
    return "Budget à discuter";
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg leading-tight">{boost.title}</CardTitle>
        <CardDescription className="line-clamp-2 text-sm">
          {boost.description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {/* Budget - Information principale */}
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="font-medium">{formatBudget()}</span>
          </div>

          {/* Sports */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Trophy className="w-4 h-4" />
            <span>
              Sport{boost.sports.length > 1 ? "s" : ""}:{" "}
              {boost.sports.join(", ")}
            </span>
          </div>

          {/* Type de contrat */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>Type: {boost.contractType}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>
              Créée le {formatDate(new Date(boost.createdAt).toISOString())}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
