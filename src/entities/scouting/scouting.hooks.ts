import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import { requester } from "@/src/lib/requester/requester";
import { sendSWRRequest } from "@/src/lib/swr/use-swr";
import { SCOUTING } from "@/src/shared/constants/SCOUTING";
import {
  SavedSearch,
  CreateSavedSearchDto,
  UpdateSavedSearchDto,
  SearchResponse,
  SearchParams,
} from "./scouting.types";

// Hook pour récupérer les recherches sauvegardées d'un utilisateur
export function useSavedSearches(sponsorId: string) {
  const key = sponsorId
    ? SCOUTING.GET_SAVED_SEARCH.replace(":userId", sponsorId)
    : null;
  return useSWR<SavedSearch[]>(key, () => requester().get<SavedSearch[]>(key!));
}

// Hook pour créer une nouvelle recherche sauvegardée
export function useCreateSavedSearch() {
  return useSWRMutation<SavedSearch, Error, string, CreateSavedSearchDto>(
    SCOUTING.POST_SAVED_SEARCH,
    sendSWRRequest,
    {
      rollbackOnError: true,
      onError(error) {
        console.error("Error creating saved search:", error);
      },
      onSuccess(data, key) {
        console.log("Successfully created saved search:", data, key);
        mutate(
          (key) => typeof key === "string" && key.includes("/saved-search/"),
          undefined,
          { revalidate: true },
        );
      },
    },
  );
}

// Hook pour mettre à jour une recherche sauvegardée
export function useUpdateSavedSearch(userId: string, savedSearchId: string) {
  const key = SCOUTING.PATCH_SAVED_SEARCH.replace(":userId", userId).replace(
    ":savedSearchId",
    savedSearchId,
  );

  return useSWRMutation<SavedSearch, Error, string, UpdateSavedSearchDto>(
    key,
    sendSWRRequest,
    {
      rollbackOnError: true,
      onError(error) {
        console.error("Error updating saved search:", error);
      },
      onSuccess(data) {
        console.log("Successfully updated saved search:", data);
        mutate(
          (key) => typeof key === "string" && key.includes("/saved-search/"),
          undefined,
          { revalidate: true },
        );
      },
    },
  );
}

// Hook pour supprimer une recherche sauvegardée
export function useDeleteSavedSearch(userId: string, savedSearchId: string) {
  const key = SCOUTING.DELETE_SAVED_SEARCH.replace(":userId", userId).replace(
    ":savedSearchId",
    savedSearchId,
  );

  return useSWRMutation<void, Error, string>(key, sendSWRRequest, {
    rollbackOnError: true,
    onError(error) {
      console.error("Error deleting saved search:", error);
    },
    onSuccess() {
      console.log("Successfully deleted saved search");
      mutate(
        (key) => typeof key === "string" && key.includes("/saved-search/"),
        undefined,
        { revalidate: true },
      );
    },
  });
}

// Hook pour effectuer une recherche de riders
export function useSearchRiders(params?: SearchParams) {
  const searchKey = params
    ? `${SCOUTING.SEARCH_RIDERS}?${new URLSearchParams(
        params as string,
      ).toString()}`
    : null;

  return useSWR<SearchResponse>(
    searchKey,
    () => requester().get<SearchResponse>(searchKey!),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );
}
