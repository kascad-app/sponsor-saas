import useSWR, { mutate } from "swr";
import { requester } from "@/src/lib/requester/requester";
import { BOOSTS } from "@/src/shared/constants/BOOSTS";
import { Offer, CreateOfferInput } from "./boosts.types";

// Récupérer tous les boosts/offres
export function useGetBoosts() {
  const key = BOOSTS.GET_BOOSTS;
  return useSWR<Offer[]>(key, async () => {
    const response = await requester().get<Offer[]>(key);
    return response;
  });
}

// Récupérer un boost spécifique par ID
export function useGetBoostById(offerId: string | null) {
  const key = offerId ? `${BOOSTS.GET_BOOSTS}/${offerId}` : null;
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
        const response = await requester().post<Offer>(endpoint, { data });
        // Invalider le cache pour refetch les boosts
        await mutate(BOOSTS.GET_BOOSTS);
        await mutate(`${BOOSTS.GET_BOOSTS}/${offerId}`);
        return response;
      } catch (error) {
        console.error("Erreur lors de la mise à jour du boost:", error);
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
        await requester().delete(endpoint);
        // Invalider le cache pour refetch les boosts
        await mutate(BOOSTS.GET_BOOSTS);
        await mutate(`${BOOSTS.GET_BOOSTS}/${offerId}`);
        return true;
      } catch (error) {
        console.error("Erreur lors de la suppression du boost:", error);
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
        await mutate(`${BOOSTS.GET_BOOSTS}/${offerId}`);
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
        await mutate(`${BOOSTS.GET_BOOSTS}/${offerId}`);
        return response;
      } catch (error) {
        console.error("Erreur lors du rejet du boost:", error);
        throw error;
      }
    },
  };
}

// Créer un profil custom de rider selon une offre
export function useCreateCustomProfileRider() {
  return {
    createCustomProfile: async (offerId: string, profileData: any) => {
      try {
        const endpoint = BOOSTS.CREATE_CUSTOM_PROFIL_RIDER.replace(
          ":offerId",
          offerId,
        );
        const response = await requester().post(endpoint, {
          data: profileData,
        });
        return response;
      } catch (error) {
        console.error("Erreur lors de la création du profil custom:", error);
        throw error;
      }
    },
  };
}

// Hook pour les actions sur les boosts (combiné pour faciliter l'utilisation)
export function useBoostActions() {
  const { createBoost } = useCreateBoost();
  const { updateBoost } = useUpdateBoost();
  const { deleteBoost } = useDeleteBoost();
  const { acceptBoost } = useAcceptBoost();
  const { rejectBoost } = useRejectBoost();
  const { createCustomProfile } = useCreateCustomProfileRider();

  return {
    createBoost,
    updateBoost,
    deleteBoost,
    acceptBoost,
    rejectBoost,
    createCustomProfile,
  };
}
