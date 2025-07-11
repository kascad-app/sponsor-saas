"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Heart, Search, Users } from "lucide-react";
import Link from "next/link";
import { useFavorites } from "@/src/contexts/favorites-context";
import { RiderCard, RidersLoadingSkeleton } from "@/src/widget/rider/card";
import { useGetRiders } from "@/src/entities/riders/riders.hook";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useMemo } from "react";

// Simuler user connecté replace avec l'auth
const currentUser = {
  name: "Lucas Huerta",
};

export default function Dashboard() {
  const { favorites } = useFavorites();
  const {
    data: riders,
    isLoading: ridersLoading,
    error: ridersError,
  } = useGetRiders();

  // Calculer les stats
  const dashboardStats = useMemo(() => {
    if (!riders)
      return {
        signedRiders: 0,
        favoriteRiders: 0,
        newRiders: [],
        sportsCounts: {},
      };

    // Riders disponibles
    const availableRiders = riders.filter(
      (rider) => rider.availibility.isAvailable,
    );

    // Riders favoris
    const favoriteRiders = riders.filter((rider) =>
      favorites.includes(rider._id),
    );

    // Les 3 riders les plus récents createdA
    const newRiders = riders
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime(),
      )
      .slice(0, 3);

    const sportsCounts: Record<string, number> = {};
    riders.forEach((rider) => {
      rider.preferences.sports.forEach((sport) => {
        const sportName = typeof sport === "string" ? sport : sport.name;
        sportsCounts[sportName] = (sportsCounts[sportName] || 0) + 1;
      });
    });

    return {
      signedRiders: availableRiders.length,
      favoriteRiders: favoriteRiders.length,
      newRiders,
      sportsCounts,
    };
  }, [riders, favorites]);

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
                Riders Disponibles
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 flex-1 flex flex-col justify-center">
              {ridersLoading ? (
                <Skeleton className="h-12 w-20 mb-2" />
              ) : (
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {dashboardStats.signedRiders}
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                Riders disponibles sur la plateforme
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
              {ridersLoading ? (
                <Skeleton className="h-12 w-20 mb-2" />
              ) : (
                <div className="text-4xl font-bold text-red-600 mb-2">
                  {dashboardStats.favoriteRiders}
                </div>
              )}
              <p className="text-sm text-muted-foreground mb-3">
                Riders dans vos favoris
              </p>
              {!ridersLoading && dashboardStats.favoriteRiders === 0 && (
                <Link href="/search">
                  <Button size="sm" variant="outline" className="w-full">
                    Découvrir des riders
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Section Nouveaux Riders - Limité à 3 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Nouveaux Riders</h2>
            <Link href="/search">
              <Button variant="outline" size="sm">
                Voir tous
              </Button>
            </Link>
          </div>

          {ridersLoading ? (
            <RidersLoadingSkeleton />
          ) : ridersError ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Erreur lors du chargement des riders
              </p>
            </div>
          ) : dashboardStats.newRiders.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {dashboardStats.newRiders.map((rider, key) => (
                <RiderCard key={key} rider={rider} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Aucun nouveau rider récemment
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
