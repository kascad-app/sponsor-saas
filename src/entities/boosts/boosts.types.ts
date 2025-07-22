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
  sport: string;
  contractType: string;
  currency: string;
};
