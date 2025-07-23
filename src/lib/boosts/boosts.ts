import { Offer } from "@/src/entities/boosts/boosts.types";

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const formatBudget = (offer: Offer) => {
  if (offer.budgetMin && offer.budgetMax) {
    if (offer.budgetMin === offer.budgetMax) {
      return `${offer.budgetMin.toLocaleString()} ${offer.currency || "EUR"}`;
    }
    return `${offer.budgetMin.toLocaleString()} - ${offer.budgetMax.toLocaleString()} ${
      offer.currency || "EUR"
    }`;
  }
  if (offer.budgetMin) {
    return `À partir de ${offer.budgetMin.toLocaleString()} ${
      offer.currency || "EUR"
    }`;
  }
  if (offer.budgetMax) {
    return `Jusqu'à ${offer.budgetMax.toLocaleString()} ${
      offer.currency || "EUR"
    }`;
  }
  return "Budget à discuter";
};
