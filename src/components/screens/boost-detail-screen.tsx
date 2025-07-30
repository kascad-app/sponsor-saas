"use client";

import { DollarSign, Users, Trophy, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Offer } from "@/src/entities/boosts/boosts.types";
import { formatDate, formatBudget } from "@/src/lib/boosts/boosts";

interface BoostDetailScreenProps {
  boost: Offer;
  onBoostUpdated?: () => void;
}

export const BoostDetailScreen = ({ boost }: BoostDetailScreenProps) => {
  return (
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
  );
};
