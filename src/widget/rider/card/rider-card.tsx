"use client";

import { Card, CardContent } from "@/src/components/ui/card";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useFavorites } from "@/src/contexts/favorites-context";
import { Rider } from "@kascad-app/shared-types";
import { KascadLogo } from "@/src/shared/ui/Kascad-logo.ui";

// Rider Card Component
export const RiderCard = ({ rider }: { rider: Rider }) => {
  const { isFavorite } = useFavorites();

  return (
    <Link href={`/details-rider/${rider.identifier.slug}`}>
      <Card className="hover:shadow-md transition-shadow overflow-hidden h-full">
        <div className="relative h-40 w-full">
          {rider.avatarUrl ? (
            <Image
              src={rider.avatarUrl}
              alt={`Avatar de ${rider.identity?.firstName} ${rider.identity?.lastName}`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <KascadLogo />
            </div>
          )}

          {isFavorite(rider.identifier.slug) && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-red-500">Favoris</Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                {rider.identity?.firstName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">
                {rider.identity?.firstName} {rider.identity?.lastName}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline" className="text-xs">
                  {rider.preferences && rider.preferences.sports.length > 0
                    ? rider.preferences.sports[0].name
                    : "Aucun sport"}
                </Badge>
                <Badge
                  className={
                    rider.status?.status === "active"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : "bg-red-100 text-red-800 hover:bg-red-100"
                  }
                >
                  {rider.status?.status === "active" ? "Actif" : "Inactif"}
                </Badge>
              </div>
            </div>
          </div>

          {(rider.identity?.city || rider.identity?.country) && (
            <div className="flex items-center text-xs text-muted-foreground mt-2">
              <MapPin className="h-3 w-3 mr-1" />
              {rider.identity?.city && rider.identity?.country
                ? `${rider.identity?.city}, ${rider.identity?.country}`
                : rider.identity?.city || rider.identity?.country}
            </div>
          )}

          {rider.description && (
            <p className="mt-2 text-sm line-clamp-2">{rider.description}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
