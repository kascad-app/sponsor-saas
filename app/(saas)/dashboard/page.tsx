"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Heart, Search, Users, Bike, Zap, Target } from "lucide-react";
import Link from "next/link";
import { useFavorites } from "@/src/contexts/favorites-context";
import { riders } from "@/src/lib/dashboard.lib";
import { sports } from "@/src/components/utils/filters-datatable";
import Image from "next/image";
import RiderCard from "@/src/widget/rider/card";

// Simuler user connecté replace avec l'auth
const currentUser = {
  name: "Lucas Huerta",
};

// TODO a retravailler
const SportCard = ({ sport }: { sport: string }) => {
  const getSportImage = (sportName: string) => {
    switch (sportName.toLowerCase()) {
      case "bmx":
        return "/bannerBmx.jpg";
      case "mountain biking":
        return "/bannerMountainBike.png";
      case "skateboard":
      case "skate":
        return "/bannerSkate.jpg";
      default:
        return "/bannerMountainBike.jpg";
    }
  };

  const getSportIcon = (sportName: string) => {
    switch (sportName.toLowerCase()) {
      case "bmx":
      case "mountain biking":
      case "road cycling":
        return Bike;
      case "skateboard":
      case "skate":
        return Zap;
      default:
        return Target;
    }
  };

  const getSportColor = (sportName: string) => {
    switch (sportName.toLowerCase()) {
      case "bmx":
        return "text-orange-600";
      case "mountain biking":
        return "text-green-600";
      case "road cycling":
        return "text-blue-600";
      case "skateboard":
      case "skate":
        return "text-purple-600";
      case "surf":
        return "text-cyan-600";
      default:
        return "text-gray-600";
    }
  };

  const ridersCount = riders.filter((rider) => rider.sport === sport).length;
  const SportIcon = getSportIcon(sport);

  return (
    <Link href={`/search?sport=${encodeURIComponent(sport)}`}>
      <Card className="hover:shadow-md transition-shadow overflow-hidden h-full cursor-pointer">
        <div className="relative h-24 w-full">
          <Image
            src={getSportImage(sport)}
            alt={sport}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-2 left-2 text-white">
            <SportIcon className="h-6 w-6" />
          </div>
        </div>
        <CardContent className="p-4">
          <div className="text-center">
            <h3 className={`font-semibold text-lg ${getSportColor(sport)}`}>
              {sport}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {ridersCount} rider{ridersCount > 1 ? "s" : ""} disponible
              {ridersCount > 1 ? "s" : ""}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default function Dashboard() {
  const { favorites } = useFavorites();

  // Calculer les riders signés (actifs)
  const signedRiders = riders.filter((rider) => rider.status === "active");

  // Obtenir les riders favoris
  const favoriteRiders = riders.filter((rider) => favorites.includes(rider.id));

  // Obtenir les nouveaux riders (les plus récemment inscrits)
  const newRiders = riders
    .sort(
      (a, b) =>
        new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime(),
    )
    .slice(0, 4);

  // Filtrer les sports pour exclure "Tous les sports"
  const availableSports = sports.filter((sport) => sport !== "Tous les sports");

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b">
        <h1 className="text-xl font-semibold">
          Bienvenu sur Kascad, {currentUser.name}
        </h1>
        <Link href="/search">
          <Button size="sm" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Rechercher
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col space-y-4 pt-4 overflow-auto">
        {/* Statistics Cards - Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card Riders Signés */}
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Riders Signés
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 flex-1 flex flex-col justify-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {signedRiders.length}
              </div>
              <p className="text-sm text-muted-foreground">
                Riders actifs sur la plateforme
              </p>
            </CardContent>
          </Card>

          {/* Card Riders Favoris */}
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-600" />
                Riders en Favoris
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 flex-1 flex flex-col justify-center">
              <div className="text-4xl font-bold text-red-600 mb-2">
                {favoriteRiders.length}
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Riders dans vos favoris
              </p>
              {favoriteRiders.length === 0 && (
                <Link href="/search">
                  <Button size="sm" variant="outline" className="w-full">
                    Découvrir des riders
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Section Sports Disponibles */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Sports Disponibles</h2>
            <Link
              href={`/search?sport=${encodeURIComponent(
                availableSports.join(","),
              )}`}
            >
              <Button variant="outline" size="sm">
                Voir tous
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {availableSports.map((sport) => (
              <SportCard key={sport} sport={sport} />
            ))}
          </div>
        </div>

        {/* Section Nouveaux Riders */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Nouveaux Riders</h2>
            <Link href="/search?showAll=true">
              <Button variant="outline" size="sm">
                Voir tous
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {newRiders.map((rider) => (
              <RiderCard key={rider.id} rider={rider} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
