import useSWR, { mutate } from "swr";
import { requester } from "@/src/lib/requester/requester";
import { MESSAGES } from "@/src/shared/constants/MESSAGES";
import {
  Conversation,
  ConversationMessage,
  ConversationsResponse,
  ConversationMessagesResponse,
  CreateMessageInput,
  GetOrCreateConversationInput,
  MarkMessagesReadInput,
  UnreadCountResponse,
  UnreadCountsByConversationResponse,
} from "./messages.types";

// Récupérer toutes les conversations de l'utilisateur
export function useGetConversations() {
  const key = MESSAGES.GET_CONVERSATIONS;
  return useSWR<ConversationsResponse>(key, async () => {
    const response = await requester().get<ConversationsResponse>(key);
    return response;
  });
}

// Récupérer une conversation spécifique par ID
export function useGetConversationById(conversationId: string | null) {
  const key = conversationId
    ? MESSAGES.GET_CONVERSATION_BY_ID.replace(":id", conversationId)
    : null;
  return useSWR<Conversation>(key, async () => {
    const response = await requester().get<Conversation>(key!);
    return response;
  });
}

// Créer ou récupérer une conversation
export function useGetOrCreateConversation() {
  return {
    getOrCreateConversation: async (data: GetOrCreateConversationInput) => {
      try {
        const response = await requester().post<Conversation>(
          MESSAGES.GET_OR_CREATE_CONVERSATION,
          { data },
        );
        // Invalider le cache des conversations
        await mutate(MESSAGES.GET_CONVERSATIONS);
        return response;
      } catch (error) {
        console.error(
          "Erreur lors de la création/récupération de la conversation:",
          error,
        );
        throw error;
      }
    },
  };
}

// Supprimer une conversation
export function useDeleteConversation() {
  return {
    deleteConversation: async (conversationId: string) => {
      try {
        const endpoint = MESSAGES.DELETE_CONVERSATION.replace(
          ":id",
          conversationId,
        );
        await requester().delete(endpoint);

        // Invalider le cache des conversations
        await mutate(MESSAGES.GET_CONVERSATIONS);
        await mutate(endpoint);
        return true;
      } catch (error) {
        console.error(
          "Erreur lors de la suppression de la conversation:",
          error,
        );
        throw error;
      }
    },
  };
}

// Récupérer les messages d'une conversation
export function useGetConversationMessages(conversationId: string | null) {
  const key = conversationId
    ? MESSAGES.GET_CONVERSATION_MESSAGES.replace(
        ":conversationId",
        conversationId,
      )
    : null;
  return useSWR<ConversationMessagesResponse>(key, async () => {
    const response = await requester().get<ConversationMessagesResponse>(key!);
    return response;
  });
}

// Récupérer un message spécifique par ID
export function useGetMessageById(messageId: string | null) {
  const key = messageId
    ? MESSAGES.GET_MESSAGE_BY_ID.replace(":id", messageId)
    : null;
  return useSWR<ConversationMessage>(key, async () => {
    const response = await requester().get<ConversationMessage>(key!);
    return response;
  });
}

// Créer un nouveau message
export function useCreateMessage() {
  return {
    createMessage: async (data: CreateMessageInput) => {
      try {
        const response = await requester().post<ConversationMessage>(
          MESSAGES.CREATE_MESSAGE,
          { data },
        );

        // Invalider le cache des conversations et messages
        await mutate(MESSAGES.GET_CONVERSATIONS);
        const messagesKey = MESSAGES.GET_CONVERSATION_MESSAGES.replace(
          ":conversationId",
          data.conversationId,
        );
        await mutate(messagesKey);
        await mutate(MESSAGES.GET_UNREAD_COUNT);
        await mutate(MESSAGES.GET_UNREAD_COUNTS_BY_CONVERSATION);

        return response;
      } catch (error) {
        console.error("Erreur lors de la création du message:", error);
        throw error;
      }
    },
  };
}

// Supprimer un message
export function useDeleteMessage() {
  return {
    deleteMessage: async (messageId: string, conversationId: string) => {
      try {
        const endpoint = MESSAGES.DELETE_MESSAGE.replace(":id", messageId);
        await requester().delete(endpoint);

        // Invalider le cache
        await mutate(MESSAGES.GET_CONVERSATIONS);
        const messagesKey = MESSAGES.GET_CONVERSATION_MESSAGES.replace(
          ":conversationId",
          conversationId,
        );
        await mutate(messagesKey);

        return true;
      } catch (error) {
        console.error("Erreur lors de la suppression du message:", error);
        throw error;
      }
    },
  };
}

// Marquer des messages comme lus
export function useMarkMessagesRead() {
  return {
    markMessagesRead: async (data: MarkMessagesReadInput) => {
      try {
        const response = await requester().patch(MESSAGES.MARK_MESSAGES_READ, {
          data,
        });

        // Invalider le cache des compteurs non lus
        await mutate(MESSAGES.GET_UNREAD_COUNT);
        await mutate(MESSAGES.GET_UNREAD_COUNTS_BY_CONVERSATION);
        await mutate(MESSAGES.GET_CONVERSATIONS);

        return response;
      } catch (error) {
        console.error("Erreur lors du marquage des messages comme lus:", error);
        throw error;
      }
    },
  };
}

// Marquer tous les messages d'une conversation comme lus
export function useMarkAllConversationRead() {
  return {
    markAllConversationRead: async (conversationId: string) => {
      try {
        const endpoint = MESSAGES.MARK_ALL_CONVERSATION_READ.replace(
          ":conversationId",
          conversationId,
        );
        // Passer un objet vide pour éviter l'erreur de body vide
        const response = await requester().patch(endpoint, { data: {} });

        // Invalider le cache
        await mutate(MESSAGES.GET_CONVERSATIONS);
        const messagesKey = MESSAGES.GET_CONVERSATION_MESSAGES.replace(
          ":conversationId",
          conversationId,
        );
        await mutate(messagesKey);
        await mutate(MESSAGES.GET_UNREAD_COUNT);
        await mutate(MESSAGES.GET_UNREAD_COUNTS_BY_CONVERSATION);

        return response;
      } catch (error) {
        console.error(
          "Erreur lors du marquage de la conversation comme lue:",
          error,
        );
        throw error;
      }
    },
  };
}

// Récupérer le nombre total de messages non lus
export function useGetUnreadCount() {
  const key = MESSAGES.GET_UNREAD_COUNT;
  return useSWR<UnreadCountResponse>(key, async () => {
    const response = await requester().get<UnreadCountResponse>(key);
    return response;
  });
}

// Récupérer le nombre de messages non lus par conversation
export function useGetUnreadCountsByConversation() {
  const key = MESSAGES.GET_UNREAD_COUNTS_BY_CONVERSATION;
  return useSWR<UnreadCountsByConversationResponse>(key, async () => {
    const response = await requester().get<UnreadCountsByConversationResponse>(
      key,
    );
    return response;
  });
}

// Hook combiné pour toutes les actions de messages
export function useMessageActions() {
  const { getOrCreateConversation } = useGetOrCreateConversation();
  const { deleteConversation } = useDeleteConversation();
  const { createMessage } = useCreateMessage();
  const { deleteMessage } = useDeleteMessage();
  const { markMessagesRead } = useMarkMessagesRead();
  const { markAllConversationRead } = useMarkAllConversationRead();

  return {
    // Conversations
    getOrCreateConversation,
    deleteConversation,
    // Messages
    createMessage,
    deleteMessage,
    markMessagesRead,
    markAllConversationRead,
  };
}
