"use client";

import { riders } from "@/src/lib/dashboard.lib";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  FilterDrawer,
  useFilters,
  genres,
  sports,
  countries,
  languages,
} from "@/src/components/utils/filters-datatable";
import { KascadLogo } from "@/src/shared/ui/Kascad-logo.ui";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import RiderCard from "@/src/widget/rider/card";

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
  const showAllParam = searchParams.get("showAll");

  const {
    searchQuery,
    setSearchQuery,
    selectedGenres,
    selectedSports,
    selectedCountries,
    selectedLanguages,
    tempGenres,
    setTempGenres,
    tempSports,
    setTempSports,
    tempCountries,
    setTempCountries,
    tempLanguages,
    setTempLanguages,
    hasAnyFilter,
    resetFilters: originalResetFilters,
    applyFilters: originalApplyFilters,
    setSelectedGenres,
    setSelectedSports,
    setSelectedCountries,
    setSelectedLanguages,
  } = useFilters();

  // Helper functions to convert between URL params and arrays
  const parseUrlParam = (param: string | null): string[] => {
    if (!param) return [];
    return param.split(",").filter(Boolean);
  };

  const arrayToUrlParam = (arr: string[]): string => {
    return arr.filter((item) => !item.startsWith("Tous")).join(",");
  };

  // Update URL when filters change
  const updateUrl = (
    genres: string[],
    sports: string[],
    countries: string[],
    languages: string[],
    query: string = "",
  ) => {
    const params = new URLSearchParams();

    const genreParam = arrayToUrlParam(genres);
    const sportParam = arrayToUrlParam(sports);
    const countryParam = arrayToUrlParam(countries);
    const languageParam = arrayToUrlParam(languages);

    if (genreParam) params.set("genre", genreParam);
    if (sportParam) params.set("sport", sportParam);
    if (countryParam) params.set("country", countryParam);
    if (languageParam) params.set("language", languageParam);
    if (query) params.set("q", query);

    const newUrl = params.toString()
      ? `/search?${params.toString()}`
      : "/search";
    router.replace(newUrl);
  };

  // Custom reset function that also removes URL params
  const resetFilters = () => {
    originalResetFilters();
    router.replace("/search");
  };

  // Custom apply function that updates URL
  const applyFilters = () => {
    originalApplyFilters();
    updateUrl(
      tempGenres,
      tempSports,
      tempCountries,
      tempLanguages,
      searchQuery,
    );
  };

  // Load filters from URL on mount
  useEffect(() => {
    const genreParam = parseUrlParam(searchParams.get("genre"));
    const sportParam = parseUrlParam(searchParams.get("sport"));
    const countryParam = parseUrlParam(searchParams.get("country"));
    const languageParam = parseUrlParam(searchParams.get("language"));
    const queryParam = searchParams.get("q") || "";

    // Handle showAll param by converting it to all sports
    if (showAllParam === "true") {
      const allSports = sports.filter((sport) => sport !== "Tous les sports");
      setSelectedSports(allSports);
      setTempSports(allSports);

      // Update URL to remove showAll and add all sports
      const params = new URLSearchParams(searchParams);
      params.delete("showAll");
      params.set("sport", allSports.join(","));
      router.replace(`/search?${params.toString()}`);
      return;
    }

    // Set initial values if URL params exist
    if (genreParam.length > 0) {
      setSelectedGenres(genreParam);
      setTempGenres(genreParam);
    }
    if (sportParam.length > 0) {
      setSelectedSports(sportParam);
      setTempSports(sportParam);
    }
    if (countryParam.length > 0) {
      setSelectedCountries(countryParam);
      setTempCountries(countryParam);
    }
    if (languageParam.length > 0) {
      setSelectedLanguages(languageParam);
      setTempLanguages(languageParam);
    }
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, [
    searchParams,
    showAllParam,
    setSelectedGenres,
    setSelectedSports,
    setSelectedCountries,
    setSelectedLanguages,
    setSearchQuery,
    setTempGenres,
    setTempSports,
    setTempCountries,
    setTempLanguages,
    router,
  ]);

  // Check if any filters are applied (excluding default values)
  const hasActiveFilters =
    searchQuery !== "" ||
    (selectedGenres.length > 0 &&
      !selectedGenres.includes("Tous les genres")) ||
    (selectedSports.length > 0 &&
      !selectedSports.includes("Tous les sports")) ||
    (selectedCountries.length > 0 &&
      !selectedCountries.includes("Tous les pays")) ||
    (selectedLanguages.length > 0 &&
      !selectedLanguages.includes("Toutes les langues"));

  // Filter riders based on search and filters
  const filteredRiders = hasActiveFilters
    ? riders.filter((rider) => {
        const matchesSearch = rider.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

        const matchesGenre =
          selectedGenres.includes("Tous les genres") ||
          selectedGenres.length === 0; // Genre matching would need rider.genre property

        const matchesSport =
          selectedSports.includes("Tous les sports") ||
          selectedSports.length === 0 ||
          selectedSports.includes(rider.sport);

        const matchesCountry =
          selectedCountries.includes("Tous les pays") ||
          selectedCountries.length === 0; // Country matching would need rider.country property

        const matchesLanguage =
          selectedLanguages.includes("Toutes les langues") ||
          selectedLanguages.length === 0; // Language matching would need rider.language property

        return (
          matchesSearch &&
          matchesGenre &&
          matchesSport &&
          matchesCountry &&
          matchesLanguage
        );
      })
    : [];

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Rechercher des riders</h1>

      <div className="flex justify-between items-center mb-6">
        <FilterDrawer
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedGenres={tempGenres}
          setSelectedGenres={setTempGenres}
          selectedSports={tempSports}
          setSelectedSports={setTempSports}
          selectedCountries={tempCountries}
          setSelectedCountries={setTempCountries}
          selectedLanguages={tempLanguages}
          setSelectedLanguages={setTempLanguages}
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
            {selectedSports.length > 0 &&
              !selectedSports.includes("Tous les sports") && (
                <span className="ml-1">pour {selectedSports.join(", ")}</span>
              )}
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
