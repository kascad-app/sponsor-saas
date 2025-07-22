import { requester } from "@/src/lib/requester/requester";
import { Rider } from "@kascad-app/shared-types";

// Types for the Contact API
export interface ContactEmail {
  email: {
    name: string;
    toEmail: string;
    subject: string;
    message: string;
  };
  riderId: string;
}

export interface ContactResponse {
  id: string;
  from: string;
  to: string[];
  created_at: string;
}

export interface SponsorMessage {
  _id: string;
  sponsorId: string;
  riderId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  subject: string;
  message: string;
  senderEmail: string;
  recipientEmail: string;
  senderName: string;
  recipientName: string;
  status: "sent" | "delivered" | "failed";
  sentAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface SponsorMessagesResponse {
  messages: SponsorMessage[];
  total: number;
}

// Contact service functions
/**
 * Send an email to a rider
 * @param rider - The rider to send the email to
 * @param senderName - The name of the sender
 * @param subject - The subject of the email
 * @param message - The content of the email
 * @returns The contact response
 */
export const sendEmailToRider = async (
  rider: Rider,
  senderName: string,
  subject: string,
  message: string,
): Promise<ContactResponse> => {
  const riderId = rider._id;

  const contactData: ContactEmail = {
    email: {
      name: senderName,
      toEmail: rider.identifier.email,
      subject: subject,
      message: message,
    },
    riderId: riderId,
  };

  return requester().post<ContactResponse>("/mails/contact/send-one", {
    data: contactData,
  });
};

export const getSponsorMessages =
  async (): Promise<SponsorMessagesResponse> => {
    return requester().get<SponsorMessagesResponse>(
      "/contact/sponsor-messages",
    );
  };

// content email
export const createDefaultEmailContent = (rider: Rider): string => {
  const sportsText = rider.preferences.sports
    .map((sport) => sport.name)
    .join(", ");

  return `Bonjour ${rider.identity.firstName},

Je vous contacte au sujet d'une opportunité de partenariat avec notre marque.

Votre profil ${sportsText} correspond parfaitement à notre image et nous serions ravis de discuter d'une collaboration.

Pourriez-vous me faire savoir si vous seriez intéressé(e) par un partenariat ?

Je reste à votre disposition pour toute question.

Cordialement,`;
};
