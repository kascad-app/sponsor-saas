import useSWR, { mutate } from "swr";
import { requester } from "@/src/lib/requester/requester";
import { BOOSTS } from "@/src/shared/constants/BOOSTS";
import {
  Offer,
  CreateOfferInput,
  BoostsApiResponse,
  OfferApplication,
} from "./boosts.types";

export function useGetBoosts() {
  const key = BOOSTS.GET_BOOSTS;
  return useSWR<BoostsApiResponse>(key, async () => {
    const response = await requester().get<BoostsApiResponse>(key);
    return response;
  });
}

// Récupérer un boost spécifique par ID
export function useGetBoostById(offerId: string | null) {
  const key = offerId ? `${BOOSTS.GET_BOOST_BY_ID}/${offerId}` : null;
  return useSWR<Offer>(key, async () => {
    const response = await requester().get<Offer>(key!);
    return response;
  });
}

// Créer un nouveau boost
export function useCreateBoost() {
  return {
    createBoost: async (data: CreateOfferInput) => {
      try {
        const response = await requester().post<Offer>(BOOSTS.POST_BOOST, {
          data,
        });
        // Invalider le cache pour refetch les boosts
        await mutate(BOOSTS.GET_BOOSTS);
        return response;
      } catch (error) {
        console.error("Erreur lors de la création du boost:", error);
        throw error;
      }
    },
  };
}

// Mettre à jour un boost
export function useUpdateBoost() {
  return {
    updateBoost: async (offerId: string, data: Partial<CreateOfferInput>) => {
      try {
        const endpoint = BOOSTS.PATCH_BOOST.replace(":offerId", offerId);
        const response = await requester().put<Offer>(endpoint, { data });

        // Invalider le cache pour refetch les boosts
        await mutate(BOOSTS.GET_BOOSTS);
        await mutate(`${BOOSTS.GET_BOOST_BY_ID}/${offerId}`);
        return response;
      } catch (error) {
        console.error("❌ Erreur lors de la mise à jour du boost:", error);
        throw error;
      }
    },
  };
}

// Supprimer un boost
export function useDeleteBoost() {
  return {
    deleteBoost: async (offerId: string) => {
      try {
        const endpoint = BOOSTS.DELETE_BOOST.replace(":offerId", offerId);
        await requester().delete(endpoint, {
          data: {},
          headers: {
            "Content-Type": "application/json",
          },
        });

        return true;
      } catch (error) {
        console.error("❌ Erreur lors de la suppression du boost:", error);
        throw error;
      }
    },
  };
}

// Accepter un boost pour un rider spécifique
export function useAcceptBoost() {
  return {
    acceptBoost: async (offerId: string, riderId: string) => {
      try {
        const endpoint = BOOSTS.ACCEPT_BOOST.replace(
          ":offerId",
          offerId,
        ).replace(":riderId", riderId);
        const response = await requester().post(endpoint);
        // Invalider le cache pour refetch les boosts
        await mutate(BOOSTS.GET_BOOSTS);
        await mutate(`${BOOSTS.GET_BOOST_BY_ID}/${offerId}`);
        return response;
      } catch (error) {
        console.error("Erreur lors de l'acceptation du boost:", error);
        throw error;
      }
    },
  };
}

// Rejeter un boost pour un rider spécifique
export function useRejectBoost() {
  return {
    rejectBoost: async (offerId: string, riderId: string) => {
      try {
        const endpoint = BOOSTS.REJECT_BOOST.replace(
          ":offerId",
          offerId,
        ).replace(":riderId", riderId);
        const response = await requester().post(endpoint);
        // Invalider le cache pour refetch les boosts
        await mutate(BOOSTS.GET_BOOSTS);
        await mutate(`${BOOSTS.GET_BOOST_BY_ID}/${offerId}`);
        return response;
      } catch (error) {
        console.error("Erreur lors du rejet du boost:", error);
        throw error;
      }
    },
  };
}

export function useBoostApplication() {
  return {
    boostApplication: async (offerId: string, riderId: string) => {
      try {
        const endpoint = BOOSTS.BOOST_APPLICATION.replace(":offerId", offerId);
        const response = await requester().post(endpoint);
        return response;
      } catch (error) {
        console.error("Erreur lors de l'application du boost:", error);
        throw error;
      }
    },
  };
}

export function useGetOfferApplications(offerId: string | null) {
  const key = offerId ? `/offers/${offerId}/applications` : null;
  return useSWR<OfferApplication[]>(key, async () => {
    const response = await requester().get<OfferApplication[]>(key!);
    return response;
  });
}

// ... existing code ...

export function useBoostActions() {
  const { createBoost } = useCreateBoost();
  const { updateBoost } = useUpdateBoost();
  const { deleteBoost } = useDeleteBoost();
  const { acceptBoost } = useAcceptBoost();
  const { rejectBoost } = useRejectBoost();
  const { boostApplication } = useBoostApplication();

  return {
    createBoost,
    updateBoost,
    deleteBoost,
    acceptBoost,
    rejectBoost,
    boostApplication,
  };
}
