"use client";

import { Card, CardContent } from "@/src/components/ui/card";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useFavorites } from "@/src/contexts/favorites-context";
import { Rider } from "@/src/lib/dashboard.lib";

// Rider Card Component
const RiderCard = ({ rider }: { rider: Rider }) => {
  const { isFavorite } = useFavorites();

  const getSportImage = (sport: string) => {
    switch (sport.toLowerCase()) {
      case "bmx":
        return "/bannerBmx.jpg";
      case "mountain biking":
        return "/bannerMountainBike.png";
      case "skate":
        return "/bannerSkate.jpg";
      default:
        return "/bannerMountainBike.png";
    }
  };

  return (
    <Link href={`/details-rider/${rider.id}`}>
      <Card className="hover:shadow-md transition-shadow overflow-hidden h-full">
        <div className="relative h-40 w-full">
          <Image
            src={getSportImage(rider.sport)}
            alt={rider.name}
            fill
            className="object-cover"
          />
          {isFavorite(rider.id) && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-red-500">Favoris</Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                {rider.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{rider.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline" className="text-xs">
                  {rider.sport}
                </Badge>
                <Badge
                  className={
                    rider.status === "active"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : "bg-red-100 text-red-800 hover:bg-red-100"
                  }
                >
                  {rider.status === "active" ? "Actif" : "Inactif"}
                </Badge>
              </div>
            </div>
          </div>

          {(rider.city || rider.country) && (
            <div className="flex items-center text-xs text-muted-foreground mt-2">
              <MapPin className="h-3 w-3 mr-1" />
              {rider.city && rider.country
                ? `${rider.city}, ${rider.country}`
                : rider.city || rider.country}
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

export default RiderCard;
