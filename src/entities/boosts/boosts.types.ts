import { IOffer } from "@kascad-app/shared-types";

export type Offer = IOffer;
export type CreateOfferInput = Omit<
  IOffer,
  "_id" | "createdAt" | "updatedAt" | "sponsorId" | "status"
>;

export type OfferFormData = {
  title: string;
  description: string;
  budgetMin: string;
  budgetMax: string;
  sports: string[];
  contractType: string;
  currency: string;
};

export type OfferApplication = {
  _id: string;
  offerId: string;
  riderId: string;
  rider: {
    _id: string;
    identifier: {
      firstName: string;
      lastName: string;
      slug: string;
    };
    identity: {
      profilePicture?: string;
      country: string;
    };
    preferences: {
      networks: Array<{
        platform: string;
        followers: number;
      }>;
    };
  };
  status: "pending" | "accepted" | "rejected";
  appliedAt: string;
  message?: string;
};

// TODO déplacer dans shared
export type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
};

export type BoostsApiResponse = {
  data: Offer[];
  pagination: PaginationInfo;
};
