import { Rider } from "@kascad-app/shared-types";
import { sendEmailToRider } from "@/src/lib/contact/contact.lib";
import { createDefaultEmailContent } from "@/src/lib/contact/contact.lib";
import { SerializedEditorState } from "lexical";

/**
 * Send a custom email to a rider
 * @param rider - The rider to send the email to
 * @param subject - The subject of the email
 * @param customContent - The content of the email
 * @param senderName - The name of the sender
 */
export const sendCustomEmail = async (
  rider: Rider,
  subject: string,
  customContent: string,
  senderName: string = "Kascad Team",
): Promise<void> => {
  try {
    await sendEmailToRider(rider, senderName, subject, customContent);
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    throw error;
  }
};

/**
 * Get the initial editor state send an email to a rider
 * @param rider - The rider to get the initial editor state for
 * @returns The initial editor state
 */
export const getInitialEditorState = (rider: Rider): SerializedEditorState => {
  if (!rider) {
    return {
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: "normal",
                style: "",
                text: "Bonjour,",
                type: "text",
                version: 1,
              },
            ],
            direction: "ltr",
            format: "",
            indent: 0,
            type: "paragraph",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "root",
        version: 1,
      },
    } as unknown as SerializedEditorState;
  }

  const defaultContent = createDefaultEmailContent(rider);

  // Créer l'état initial avec le contenu par défaut
  const paragraphs = defaultContent.split("\n\n").map((paragraph) => ({
    children: [
      {
        detail: 0,
        format: 0,
        mode: "normal" as const,
        style: "",
        text: paragraph,
        type: "text" as const,
        version: 1,
      },
    ],
    direction: "ltr" as const,
    format: "",
    indent: 0,
    type: "paragraph" as const,
    version: 1,
  }));

  return {
    root: {
      children: paragraphs,
      direction: "ltr",
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  } as unknown as SerializedEditorState;
};
