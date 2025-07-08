import { useState, useCallback } from "react";

// Hook pour le dashboard qui maintient l'ancienne interface
export const useDashboardFilters = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Tous les genres");
  const [selectedSport, setSelectedSport] = useState("Tous les sports");
  const [selectedCountry, setSelectedCountry] = useState("Tous les pays");
  const [selectedLanguage, setSelectedLanguage] =
    useState("Toutes les langues");

  // États temporaires pour le drawer
  const [tempGenre, setTempGenre] = useState("Tous les genres");
  const [tempSport, setTempSport] = useState("Tous les sports");
  const [tempCountry, setTempCountry] = useState("Tous les pays");
  const [tempLanguage, setTempLanguage] = useState("Toutes les langues");

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedGenre("Tous les genres");
    setSelectedSport("Tous les sports");
    setSelectedCountry("Tous les pays");
    setSelectedLanguage("Toutes les langues");
    setTempGenre("Tous les genres");
    setTempSport("Tous les sports");
    setTempCountry("Tous les pays");
    setTempLanguage("Toutes les langues");
  }, []);

  const applyFilters = useCallback(() => {
    setSelectedGenre(tempGenre);
    setSelectedSport(tempSport);
    setSelectedCountry(tempCountry);
    setSelectedLanguage(tempLanguage);
  }, [tempGenre, tempSport, tempCountry, tempLanguage]);

  const hasAnyFilter =
    searchQuery !== "" ||
    selectedGenre !== "Tous les genres" ||
    selectedSport !== "Tous les sports" ||
    selectedCountry !== "Tous les pays" ||
    selectedLanguage !== "Toutes les langues";

  return {
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
    setSelectedGenre,
    setSelectedSport,
    setSelectedCountry,
    setSelectedLanguage,
  };
};
