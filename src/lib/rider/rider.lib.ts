import { Rider } from "@kascad-app/shared-types";

// Nouvelle fonction pour envoyer un email avec contenu personnalisé
export const sendCustomEmail = (rider: Rider, customContent: string) => {
  const subject = encodeURIComponent("Prise de contact pour un partenariat");
  const body = encodeURIComponent(customContent);

  const mailtoLink = `mailto:${rider.identifier.email}?subject=${subject}&body=${body}`;
  window.open(mailtoLink, "_self");
};
