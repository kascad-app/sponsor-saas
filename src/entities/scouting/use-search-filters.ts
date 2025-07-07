import { useState, useCallback, useMemo } from "react";
import { SearchFilters, FILTER_OPTIONS, SavedSearch } from "./scouting.types";
import { useSavedSearches, useCreateSavedSearch } from "./scouting.hooks";
import { requester } from "@/src/lib/requester/requester";
import { SCOUTING } from "@/src/shared/constants/SCOUTING";
import { mutate } from "swr";
import { toast } from "sonner";

export const useSearchFilters = (userId?: string) => {
  // filtres actuels
  const [filters, setFilters] = useState<SearchFilters>({});
  const [tempFilters, setTempFilters] = useState<SearchFilters>({});

  const { data: rawSavedSearches, isLoading } = useSavedSearches(userId || "");
  const { trigger: createSavedSearch, isMutating: isCreating } =
    useCreateSavedSearch();

  const savedSearches = useMemo(() => {
    if (!rawSavedSearches) return [];

    return rawSavedSearches.map((search) => ({
      ...search,
      id: search._id || search.id,
    }));
  }, [rawSavedSearches]);

  const resetFilters = useCallback(() => {
    const emptyFilters: SearchFilters = {};
    setFilters(emptyFilters);
    setTempFilters(emptyFilters);
  }, []);

  const applyFilters = useCallback(() => {
    setFilters({ ...tempFilters });
  }, [tempFilters]);

  const updateTempFilter = useCallback(
    <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
      setTempFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [],
  );

  const hasActiveFilters = useCallback(() => {
    return Object.values(filters).some((value) => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === "boolean") return value !== undefined;
      if (typeof value === "string") return value !== "";
      return false;
    });
  }, [filters]);

  const saveCurrentSearch = useCallback(
    async (name: string) => {
      if (!userId || !hasActiveFilters()) {
        toast.error("Impossible de sauvegarder la recherche");
        return;
      }

      try {
        await createSavedSearch({
          name,
          filters,
          sponsorId: userId,
        });
        toast.success("Recherche sauvegardée avec succès");
      } catch (error) {
        console.error("Failed to save search:", error);
        toast.error("Erreur lors de la sauvegarde de la recherche");
        throw error;
      }
    },
    [userId, filters, hasActiveFilters, createSavedSearch],
  );

  const loadSavedSearch = useCallback((savedSearch: SavedSearch) => {
    try {
      setFilters(savedSearch.filters);
      setTempFilters(savedSearch.filters);
      toast.success(`Recherche "${savedSearch.name}" chargée`);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors du chargement de la recherche");
    }
  }, []);

  const deleteSavedSearchById = useCallback(
    async (searchId: string) => {
      if (!userId) {
        toast.error("Utilisateur non connecté");
        return;
      }

      if (!searchId || searchId === "undefined" || searchId === "null") {
        toast.error("ID de recherche invalide");
        console.error("Invalid searchId:", searchId);
        return;
      }

      try {
        const url = SCOUTING.DELETE_SAVED_SEARCH.replace(
          ":userId",
          userId,
        ).replace(":savedSearchId", searchId);

        console.log("Deleting search at URL:", url); // Debug log

        await requester().delete(url);

        // Invalidate le cache
        const cacheKey = SCOUTING.GET_SAVED_SEARCH.replace(":userId", userId);
        mutate(cacheKey);

        toast.success("Recherche supprimée avec succès");
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Failed to delete search:", error);
        } else {
          console.error("Failed to delete search:", error);
        }
      }
    },
    [userId],
  );

  return {
    filters,
    tempFilters,
    setTempFilters,
    setFilters,
    updateTempFilter,
    resetFilters,
    applyFilters,
    hasActiveFilters: hasActiveFilters(),
    savedSearches: savedSearches || [],
    isLoadingSavedSearches: isLoading,
    saveCurrentSearch,
    loadSavedSearch,
    deleteSavedSearchById,
    isCreatingSavedSearch: isCreating,
    filterOptions: FILTER_OPTIONS,
  };
};
