import { Message } from "@kascad-app/shared-types";

export type MessageType = Message;

// Participant type
export interface Participant {
  userId: string;
  userType: "sponsor" | "rider";
}

// Other participant with additional info
export interface OtherParticipant extends Participant {
  firstName?: string;
  lastName?: string;
  fullName?: string;
}

// Conversation types
export interface Conversation {
  _id: string;
  participants: Participant[];
  context: {
    type: string;
  };
  status: string;
  lastMessage?: MessageType;
  lastMessageAt?: string;
  unreadCount?: number;
  createdAt: string;
  updatedAt: string;
  otherParticipant?: OtherParticipant;
}

// Extended Message type with conversation context
export interface ConversationMessage extends MessageType {
  _id: string;
  conversationId: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Input types for creation
export type CreateMessageInput = {
  conversationId: string;
  content: string;
  authorMail: string;
  authorType: ProfileType;
};

export type GetOrCreateConversationInput = {
  participantMail: string;
};

export type MarkMessagesReadInput = {
  messageIds: string[];
};

// Response types
export type ConversationsResponse = {
  conversations: Conversation[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
};

export type ConversationMessagesResponse = {
  data: ConversationMessage[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
};

export type UnreadCountResponse = {
  totalUnreadCount: number;
};

export type UnreadCountsByConversationResponse = {
  [conversationId: string]: number;
};

// ProfileType (should ideally come from shared-types but defining here for now)
export type ProfileType = "sponsor" | "rider";
