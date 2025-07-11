import { Rider } from "@kascad-app/shared-types";

export const sendEmail = (rider: Rider) => {
  const subject = encodeURIComponent("Prise de contact pour un partenariat");
  const body = encodeURIComponent(`Bonjour ${rider.identity.firstName},

Je vous contacte au sujet d'une opportunité de partenariat avec notre marque.

Votre profil ${rider.preferences.sports
    .map((sport) => sport.name)
    .join(
      ", ",
    )} correspond parfaitement à notre image et nous serions ravis de discuter d'une collaboration.

Pourriez-vous me faire savoir si vous seriez intéressé(e) par un partenariat ?

Je reste à votre disposition pour toute question.

Cordialement,`);

  const mailtoLink = `mailto:${rider.identifier.email}?subject=${subject}&body=${body}`;
  window.open(mailtoLink, "_self");
};
