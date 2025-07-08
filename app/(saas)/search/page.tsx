"use client";

import { riders } from "@/src/lib/dashboard.lib";
import { Card, CardContent } from "@/src/components/ui/card";
import { KascadLogo } from "@/src/shared/ui/Kascad-logo.ui";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import RiderCard from "@/src/widget/rider/card";
import { EnhancedFilterDrawer } from "@/src/components/utils/enhanced-filter-drawer";
import { useSearchFilters } from "@/src/entities/scouting/use-search-filters";
import { AuthenticationHooks } from "@/src/entities/authentication";
import { SearchFilters } from "@/src/entities/scouting/scouting.types";

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
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: user } = AuthenticationHooks.useMe();
  // hook filters
  const {
    filters,
    tempFilters,
    setTempFilters,
    updateTempFilter,
    resetFilters: originalResetFilters,
    applyFilters: originalApplyFilters,
    hasActiveFilters,
    savedSearches,
    saveCurrentSearch,
    loadSavedSearch,
    deleteSavedSearchById,
    isCreatingSavedSearch,
    filterOptions,
    setFilters,
  } = useSearchFilters(user?._id);

  const updateUrl = (searchFilters: typeof filters) => {
    const params = new URLSearchParams();

    Object.entries(searchFilters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        params.set(key, value.join(","));
      } else if (typeof value === "string" && value) {
        params.set(key, value);
      } else if (typeof value === "boolean") {
        params.set(key, value.toString());
      }
    });

    const newUrl = params.toString()
      ? `/search?${params.toString()}`
      : "/search";
    router.replace(newUrl);
  };

  // removes URL params
  const resetFilters = () => {
    originalResetFilters();
    router.replace("/search");
  };

  // updates URL
  const applyFilters = () => {
    originalApplyFilters();
    updateUrl(tempFilters);
  };

  // TODO opti
  useEffect(() => {
    const urlFilters: Partial<SearchFilters> = {};

    searchParams.forEach((value, key) => {
      switch (key) {
        case "searchQuery":
        case "minBirthdate":
        case "maxBirthdate":
          urlFilters[key] = value;
          break;
        case "isBeenSponsored":
        case "isDisponible":
          urlFilters[key] = value === "true";
          break;
        case "sports":
        case "countries":
        case "gender":
        case "languages":
        case "socials":
        case "contractType":
          urlFilters[key] = value.split(",").filter(Boolean);
          break;
      }
    });

    if (Object.keys(urlFilters).length > 0) {
      setTempFilters(urlFilters);
      setFilters(urlFilters);
    }
  }, [searchParams, setTempFilters]);

  const filteredRiders = hasActiveFilters
    ? riders.filter((rider) => {
        if (
          filters.searchQuery &&
          !rider.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
        ) {
          return false;
        }

        if (
          filters.sports &&
          filters.sports.length > 0 &&
          !filters.sports.includes(rider.sport)
        ) {
          return false;
        }

        if (
          filters.countries &&
          filters.countries.length > 0 &&
          rider.country &&
          !filters.countries.includes(rider.country)
        ) {
          return false;
        }

        // TODO ajouter tous les filtres

        return true;
      })
    : [];

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Rechercher des riders</h1>

      <div className="flex justify-between items-center mb-6">
        <EnhancedFilterDrawer
          filters={filters}
          tempFilters={tempFilters}
          updateTempFilter={updateTempFilter}
          setTempFilters={setTempFilters}
          hasActiveFilters={hasActiveFilters}
          resetFilters={resetFilters}
          applyFilters={applyFilters}
          filterOptions={filterOptions}
          savedSearches={savedSearches}
          saveCurrentSearch={saveCurrentSearch}
          loadSavedSearch={loadSavedSearch}
          deleteSavedSearchById={deleteSavedSearchById}
          isCreatingSavedSearch={isCreatingSavedSearch}
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
