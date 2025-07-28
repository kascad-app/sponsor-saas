"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useCallback } from "react";
import {
  EnhancedFilterDrawer,
  EnhancedFilterDrawerRef,
} from "@/src/components/utils/enhanced-filter-drawer";
import { useSearchFilters } from "@/src/entities/scouting/use-search-filters";
import { AuthenticationHooks } from "@/src/entities/authentication";
import { SearchFilters } from "@/src/entities/scouting/scouting.types";
import { Input } from "@/src/components/ui/input";
import { Search } from "lucide-react";
import { NoResultsCard } from "@/src/widget/scouting/no-result-card";
import { EmptyStateCard } from "@/src/widget/scouting/empty-state-card";
import {
  getActiveFilters,
  filterRiders,
} from "@/src/lib/scouting/scouting.lib";
import { useGetRiders } from "@/src/entities/riders/riders.hook";
import { Skeleton } from "@/src/components/ui/skeleton";
import { RidersErrorCard, RiderCard } from "@/src/widget/rider/card";
import { RidersLoadingSkeleton } from "@/src/lib/rider/all-riders.skeleton";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: user } = AuthenticationHooks.useMe();
  const drawerRef = useRef<EnhancedFilterDrawerRef>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  console.log("user connectéd", user);

  const {
    data: riders,
    error: ridersError,
    isLoading: ridersLoading,
    mutate: retryRiders,
  } = useGetRiders();

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

  const updateUrl = useCallback(
    (searchFilters: typeof filters) => {
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
    },
    [router],
  );

  // Fonction pour appliquer automatiquement la recherche par nom
  const applySearchQuery = useCallback(
    (searchQuery: string) => {
      const newFilters = { ...filters, searchQuery };
      setFilters(newFilters);
      updateUrl(newFilters);
    },
    [filters, setFilters, updateUrl],
  );

  // Gestion de la recherche automatique avec debounce
  const handleSearchChange = useCallback(
    (value: string) => {
      updateTempFilter("searchQuery", value);

      // Clear le timeout précédent
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Déclencher la recherche après 300ms de pause
      searchTimeoutRef.current = setTimeout(() => {
        applySearchQuery(value);
      }, 300);
    },
    [updateTempFilter, applySearchQuery],
  );

  // Cleanup du timeout
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // removes URL params
  const resetFilters = () => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    originalResetFilters();
    router.replace("/search");
  };

  // updates URL pour les filtres du drawer (excluant la recherche par nom)
  const applyFilters = () => {
    originalApplyFilters();
    const filtersWithoutSearch = { ...tempFilters };
    // On garde la recherche actuelle qui a déjà été appliquée
    filtersWithoutSearch.searchQuery = filters.searchQuery;
    updateUrl(filtersWithoutSearch);
  };

  useEffect(() => {
    const urlFilters: Partial<SearchFilters> = {};

    searchParams?.forEach((value, key) => {
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
  }, [searchParams, setTempFilters, setFilters]);

  // Filtrage des riders avec gestion du loading
  const filteredRiders =
    riders && hasActiveFilters
      ? filterRiders(riders, filters, hasActiveFilters)
      : [];

  // Gestion des états de chargement et d'erreur
  if (ridersLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Rechercher des riders</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un rider..."
                disabled
                className="pl-8 w-64"
              />
            </div>
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
        <RidersLoadingSkeleton />
      </div>
    );
  }

  if (ridersError) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Rechercher des riders</h1>
        </div>
        <RidersErrorCard onRetry={() => retryRiders()} />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Rechercher des riders</h1>

        <div className="flex items-center gap-4">
          {/* Barre de recherche avec recherche automatique */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un rider..."
              value={tempFilters.searchQuery ?? ""}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-8 w-64"
            />
          </div>

          <EnhancedFilterDrawer
            ref={drawerRef}
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
            {filteredRiders.map((rider, index) => (
              <RiderCard key={index} rider={rider} />
            ))}
          </div>
        ) : (
          <NoResultsCard
            onModifySearch={() => {
              drawerRef.current?.openDrawer();
            }}
            onResetFilters={resetFilters}
            activeFilters={getActiveFilters(filters)}
          />
        )}
      </div>
    </div>
  );
}
