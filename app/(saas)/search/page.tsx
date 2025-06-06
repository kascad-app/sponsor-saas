"use client";

import { Rider, riders } from "@/src/lib/dashboard.lib";
import { Card, CardContent } from "@/src/components/ui/card";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { MapPin } from "lucide-react";
import {
  FilterDrawer,
  useFilters,
  genres,
  sports,
  countries,
  languages,
} from "@/src/components/utils/filters-datatable";
import Image from "next/image";
import Link from "next/link";
import { useFavorites } from "@/src/contexts/favorites-context";
import { KascadLogo } from "@/src/shared/ui/Kascad-logo.ui";

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
        return "/bannerMountainBike.jpg";
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

// Empty State Card Component
const EmptyStateCard = () => (
  <div className="flex flex-col items-center justify-center py-20">
    <Card className="w-full max-w-2xl">
      <CardContent className="flex flex-col items-center justify-center p-16 text-center">
        <div className="mb-8">
          <KascadLogo />
        </div>
        <h3 className="text-2xl font-semibold mb-4">Appliquer des filtres</h3>
        <p className="text-muted-foreground text-lg max-w-md">
          Utilisez les filtres pour découvrir des riders qui correspondent à vos
          critères
        </p>
      </CardContent>
    </Card>
  </div>
);

export default function Search() {
  const {
    searchQuery,
    setSearchQuery,
    selectedGenre,
    selectedSport,
    selectedCountry,
    selectedLanguage,
    tempGenre,
    setTempGenre,
    tempSport,
    setTempSport,
    tempCountry,
    setTempCountry,
    tempLanguage,
    setTempLanguage,
    hasAnyFilter,
    resetFilters,
    applyFilters,
  } = useFilters();

  // Check if any filters are applied (excluding default values)
  const hasActiveFilters =
    searchQuery !== "" ||
    selectedGenre !== "Tous les genres" ||
    selectedSport !== "Tous les sports" ||
    selectedCountry !== "Tous les pays" ||
    selectedLanguage !== "Toutes les langues";

  // Filter riders based on search and filters - only if filters are applied
  const filteredRiders = hasActiveFilters
    ? riders.filter((rider) => {
        const matchesSearch = rider.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesSport =
          selectedSport === "Tous les sports" || rider.sport === selectedSport;
        // Note: Add genre, country, language filtering when these properties are available in Rider type

        return matchesSearch && matchesSport;
      })
    : [];

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Rechercher des riders</h1>

      <div className="flex justify-between items-center mb-6">
        <FilterDrawer
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedGenre={tempGenre}
          setSelectedGenre={setTempGenre}
          selectedSport={tempSport}
          setSelectedSport={setTempSport}
          selectedCountry={tempCountry}
          setSelectedCountry={setTempCountry}
          selectedLanguage={tempLanguage}
          setSelectedLanguage={setTempLanguage}
          genreOptions={genres}
          sportOptions={sports}
          countryOptions={countries}
          languageOptions={languages}
          hasAnyFilter={hasAnyFilter}
          resetFilters={resetFilters}
          applyFilters={applyFilters}
        />
      </div>

      <div className="mt-6">
        {hasActiveFilters && (
          <p className="text-muted-foreground mb-4">
            {filteredRiders.length} riders trouvés
          </p>
        )}

        {!hasActiveFilters ? (
          <EmptyStateCard />
        ) : filteredRiders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredRiders.map((rider) => (
              <RiderCard key={rider.id} rider={rider} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">
              Aucun rider ne correspond à votre recherche
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
