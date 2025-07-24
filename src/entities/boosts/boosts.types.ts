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
