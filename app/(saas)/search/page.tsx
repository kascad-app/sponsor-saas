"use client";

import { Rider, riders } from "@/src/lib/dashboard.lib";
import { Card, CardContent } from "@/src/components/ui/card";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { MapPin } from "lucide-react";
import {
  useFilters,
  Filters,
  sports,
  statuses,
} from "@/src/components/utils/filters-datatable";
import Image from "next/image";
import Link from "next/link";
import { useFavorites } from "@/src/contexts/favorites-context";

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

export default function Search() {
  const {
    searchQuery,
    setSearchQuery,
    selectedSport,
    setSelectedSport,
    selectedStatus,
    setSelectedStatus,
    hasAnyFilter,
    resetFilters,
  } = useFilters();

  // Filter riders based on search and filters
  const filteredRiders = riders.filter((rider) => {
    const matchesSearch = rider.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesSport =
      selectedSport === "All Sports" || rider.sport === selectedSport;
    const matchesStatus =
      selectedStatus === "All Statuses" ||
      (selectedStatus === "Active" && rider.status === "active") ||
      (selectedStatus === "Inactive" && rider.status === "inactive");

    return matchesSearch && matchesSport && matchesStatus;
  });

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Rechercher des riders</h1>

      <Filters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedSport={selectedSport}
        setSelectedSport={setSelectedSport}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        sportOptions={sports}
        statusOptions={statuses}
        hasAnyFilter={hasAnyFilter}
        resetFilters={resetFilters}
      />

      <div className="mt-6">
        <p className="text-muted-foreground mb-4">
          {filteredRiders.length} riders trouvés
        </p>

        {filteredRiders.length > 0 ? (
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
