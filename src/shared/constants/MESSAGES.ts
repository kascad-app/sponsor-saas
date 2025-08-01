export const MESSAGES = {
  // Direct Messages - Conversations
  GET_CONVERSATIONS: "/dm/conversations",
  GET_OR_CREATE_CONVERSATION: "/dm/conversations/get-or-create",
  GET_CONVERSATION_BY_ID: "/dm/conversations/:id",
  DELETE_CONVERSATION: "/dm/conversations/:id",

  // Direct Messages - Messages
  CREATE_MESSAGE: "/dm/messages",
  GET_CONVERSATION_MESSAGES: "/dm/messages/conversations/:conversationId",
  GET_MESSAGE_BY_ID: "/dm/messages/:id",
  DELETE_MESSAGE: "/dm/messages/:id",
  MARK_MESSAGES_READ: "/dm/messages/mark-read",
  MARK_ALL_CONVERSATION_READ:
    "/dm/messages/conversations/:conversationId/mark-all-read",
  GET_UNREAD_COUNT: "/dm/messages/unread-count",
  GET_UNREAD_COUNTS_BY_CONVERSATION: "/dm/messages/conversations/unread-counts",
};
