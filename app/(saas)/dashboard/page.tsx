"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Heart, Search, Users, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useFavorites } from "@/src/contexts/favorites-context";
import { RiderCard, RidersErrorCard } from "@/src/widget/rider/card";
import { useGetRiders } from "@/src/entities/riders/riders.hook";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useMemo, Suspense } from "react";
import { Rider } from "@kascad-app/shared-types";
import { RidersLoadingSkeleton } from "@/src/lib/rider/all-riders.skeleton";

// Simuler user connecté replace avec l'auth
const currentUser = {
  name: "Lucas Huerta",
};

// Composant pour les statistiques avec gestion d'erreur
const DashboardStats = ({
  riders,
  favorites,
  isLoading,
  error,
  onRetry,
}: {
  riders?: Rider[];
  favorites: string[];
  isLoading: boolean;
  error?: Error;
  onRetry: () => void;
}) => {
  const dashboardStats = useMemo(() => {
    // Valeurs par défaut si pas de données
    const defaultStats = {
      signedRiders: 0,
      favoriteRiders: 0,
      newRiders: [],
      sportsCounts: {},
    };

    if (!riders || !Array.isArray(riders)) {
      return defaultStats;
    }

    try {
      // Riders disponibles avec vérification de sécurité
      const availableRiders = riders.filter(
        (rider) => rider?.availibility?.isAvailable === true,
      );

      // Riders favoris - utilise identifier.slug au lieu de _id
      const favoriteRiders = riders.filter(
        (rider) =>
          rider?.identifier?.slug && favorites.includes(rider.identifier.slug),
      );

      // Les 3 riders les plus récents avec gestion d'erreur
      let newRiders: Rider[] = [];
      try {
        newRiders = [...riders]
          .filter((rider) => rider?.createdAt) // Filtrer ceux qui ont une date
          .sort((a, b) => {
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return dateB - dateA;
          })
          .slice(0, 3);
      } catch (sortError) {
        console.warn("Erreur lors du tri des riders:", sortError);
        newRiders = riders.slice(0, 3); // Fallback: prendre les 3 premiers
      }

      // Compter les sports avec gestion d'erreur
      const sportsCounts: Record<string, number> = {};
      riders.forEach((rider) => {
        try {
          if (
            rider?.preferences?.sports &&
            Array.isArray(rider.preferences.sports)
          ) {
            rider.preferences.sports.forEach((sport) => {
              const sportName = typeof sport === "string" ? sport : sport?.name;
              if (sportName) {
                sportsCounts[sportName] = (sportsCounts[sportName] || 0) + 1;
              }
            });
          }
        } catch (sportError) {
          console.warn("Erreur lors du comptage des sports:", sportError);
        }
      });

      return {
        signedRiders: availableRiders.length,
        favoriteRiders: favoriteRiders.length,
        newRiders,
        sportsCounts,
      };
    } catch (error) {
      console.error("Erreur lors du calcul des statistiques:", error);
      return defaultStats;
    }
  }, [riders, favorites]);

  if (error) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Erreur de chargement
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 flex-1 flex flex-col justify-center">
              <p className="text-sm text-muted-foreground mb-3">
                Impossible de charger les données
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={onRetry}
                className="w-full"
              >
                Réessayer
              </Button>
            </CardContent>
          </Card>
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-600" />
                Riders en Favoris
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 flex-1 flex flex-col justify-center">
              <div className="text-4xl font-bold text-red-600 mb-2">
                {favorites.length}
              </div>
              <p className="text-sm text-muted-foreground">
                Riders dans vos favoris (local)
              </p>
            </CardContent>
          </Card>
        </div>
        <RidersErrorCard onRetry={onRetry} />
      </div>
    );
  }

  return (
    <>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card Riders Disponibles */}
        <Card className="h-full flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Riders Disponibles
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 flex-1 flex flex-col justify-center">
            {isLoading ? (
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
            {isLoading ? (
              <Skeleton className="h-12 w-20 mb-2" />
            ) : (
              <div className="text-4xl font-bold text-red-600 mb-2">
                {dashboardStats.favoriteRiders}
              </div>
            )}
            <p className="text-sm text-muted-foreground mb-3">
              Riders dans vos favoris
            </p>
            {!isLoading && dashboardStats.favoriteRiders === 0 && (
              <Link href="/search">
                <Button size="sm" variant="outline" className="w-full">
                  Découvrir des riders
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Section Nouveaux Riders */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Nouveaux Riders</h2>
          <Link href="/search">
            <Button variant="outline" size="sm">
              Voir tous
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <RidersLoadingSkeleton />
        ) : dashboardStats.newRiders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {dashboardStats.newRiders.map((rider, index) => (
              <RiderCard
                key={rider.identifier?.slug || `rider-${index}`}
                rider={rider}
              />
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
    </>
  );
};

// Composant principal avec Suspense
export default function Dashboard() {
  const { favorites } = useFavorites();
  const {
    data: riders,
    isLoading: ridersLoading,
    error: ridersError,
    mutate: retryRiders,
  } = useGetRiders();

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

      {/* Main Content avec Suspense */}
      <div className="flex-1 flex flex-col space-y-4 pt-4 overflow-auto">
        <Suspense
          fallback={
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="h-32">
                  <CardContent className="pt-6">
                    <Skeleton className="h-8 w-20 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </CardContent>
                </Card>
                <Card className="h-32">
                  <CardContent className="pt-6">
                    <Skeleton className="h-8 w-20 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </CardContent>
                </Card>
              </div>
              <RidersLoadingSkeleton />
            </div>
          }
        >
          <DashboardStats
            riders={riders}
            favorites={favorites}
            isLoading={ridersLoading}
            error={ridersError}
            onRetry={() => retryRiders()}
          />
        </Suspense>
      </div>
    </div>
  );
}
