"use client";
import { Calendar, DollarSign, Users, Trophy } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { IOffer } from "@kascad-app/shared-types";

export const BoostCard = ({ boost }: { boost: IOffer }) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg">{boost.title}</CardTitle>
      </div>
      <CardDescription className="line-clamp-2">
        {boost.description}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <DollarSign className="w-4 h-4" />
          <span>Budget: {boost.budgetMin?.toLocaleString()}€</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Trophy className="w-4 h-4" />
          <span>Sport: {boost.sports.join(", ")}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>Cible: {boost.contractType}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Durée: {boost.contractType}</span>
        </div>
      </div>
    </CardContent>
  </Card>
);
