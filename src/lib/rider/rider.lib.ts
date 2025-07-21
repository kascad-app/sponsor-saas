import { Rider } from "@kascad-app/shared-types";
import { sendEmailToRider } from "../contact/contact.lib";

export const sendCustomEmail = async (
  rider: Rider,
  customContent: string,
  senderName: string = "Kascad Team",
): Promise<void> => {
  const subject = "Prise de contact pour un partenariat";

  try {
    await sendEmailToRider(rider, senderName, subject, customContent);
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    throw error;
  }
};
