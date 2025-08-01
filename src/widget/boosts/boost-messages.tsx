"use client";

import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { Avatar } from "@/src/components/ui/avatar";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import {
  MessageSquare,
  Search,
  Send,
  User,
  Plus,
  Clock,
  Check,
  CheckCheck,
} from "lucide-react";
import {
  useGetConversations,
  useGetConversationMessages,
  useCreateMessage,
  useGetOrCreateConversation,
  useMarkAllConversationRead,
} from "@/src/entities/messages/messages.hooks";
import { Offer } from "@/src/entities/boosts/boosts.types";
import { toast } from "sonner";

interface BoostMessagesProps {
  boost: Offer;
  applications?: any[]; // Applications pour pouvoir contacter les candidats
}

export const BoostMessages = ({
  boost,
  applications = [],
}: BoostMessagesProps) => {
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Hooks pour les conversations et messages
  const {
    data: conversationsData,
    isLoading: conversationsLoading,
    mutate: mutateConversations,
  } = useGetConversations();
  const {
    data: messagesData,
    isLoading: messagesLoading,
    mutate: mutateMessages,
  } = useGetConversationMessages(selectedConversation);
  const { createMessage } = useCreateMessage();
  const { getOrCreateConversation } = useGetOrCreateConversation();
  const { markAllConversationRead } = useMarkAllConversationRead();

  console.log("conversationsData", conversationsData);
  const conversations = conversationsData?.conversations || [];
  const messages = messagesData?.data || [];

  // Filtrer les conversations par recherche
  const filteredConversations = conversations.filter((conversation) => {
    if (!searchQuery) return true;
    // Filtrer par le contenu du dernier message ou participants
    return conversation.lastMessage?.content
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
  });

  // Marquer la conversation comme lue quand elle est sélectionnée
  useEffect(() => {
    if (selectedConversation) {
      markAllConversationRead(selectedConversation).catch(console.error);
    }
  }, [selectedConversation, markAllConversationRead]);

  // Envoyer un message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || isSending) return;

    setIsSending(true);
    try {
      await createMessage({
        conversationId: selectedConversation,
        content: newMessage.trim(),
        authorMail: "current-user@example.com", // À remplacer par l'email de l'utilisateur connecté
        authorType: "sponsor",
      });
      setNewMessage("");
      mutateMessages();
      mutateConversations();
      toast.success("Message envoyé !");
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setIsSending(false);
    }
  };

  // Créer une nouvelle conversation avec un candidat
  const handleCreateConversation = async (candidateEmail: string) => {
    try {
      const conversation = await getOrCreateConversation({
        participantMail: candidateEmail,
      });
      setSelectedConversation(conversation._id);
      mutateConversations();
      toast.success("Conversation créée !");
    } catch (error) {
      console.error("Erreur lors de la création de la conversation:", error);
      toast.error("Erreur lors de la création de la conversation");
    }
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "À l'instant";
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    if (diffInHours < 48) return "Hier";
    if (diffInHours < 24 * 30)
      return `Il y a ${Math.floor(diffInHours / 24)} jours`;
    return `Il y a ${Math.floor(diffInHours / (24 * 30))} mois`;
  };

  return (
    <div className="flex h-[600px] border rounded-lg bg-background">
      {/* Sidebar - Liste des conversations */}
      <div className="w-1/3 border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-5 h-5" />
            <h3 className="font-semibold">Messages</h3>
          </div>

          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une conversation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Actions pour créer des conversations avec les candidats */}
          {applications.length > 0 && (
            <div className="mt-3">
              <div className="text-xs text-muted-foreground mb-2">
                Contacter les candidats :
              </div>
              <div className="flex flex-wrap gap-1">
                {applications.slice(0, 3).map((application, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleCreateConversation(
                        application.candidateEmail ||
                          `candidate${index}@example.com`,
                      )
                    }
                    className="text-xs"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Candidat {index + 1}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Liste des conversations */}
        <ScrollArea className="flex-1">
          {conversationsLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              Chargement des conversations...
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <div className="text-sm">Aucune conversation</div>
              <div className="text-xs">Commencez par contacter un candidat</div>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation._id}
                  onClick={() => setSelectedConversation(conversation._id)}
                  className={`p-3 rounded-lg cursor-pointer hover:bg-muted transition-colors ${
                    selectedConversation === conversation._id ? "bg-muted" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-sm truncate">
                          {conversation.otherParticipant?.fullName ||
                            conversation.otherParticipant?.firstName ||
                            "Participant anonyme"}
                        </div>
                        {conversation.unreadCount &&
                          conversation.unreadCount > 0 && (
                            <Badge variant="default" className="text-xs">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                      </div>
                      {conversation.lastMessage && (
                        <div className="text-xs text-muted-foreground truncate mt-1">
                          {conversation.lastMessage.content}
                        </div>
                      )}
                      {conversation.lastMessageAt && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatDate(conversation.lastMessageAt)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Zone de messages */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Header de la conversation */}
            <div className="p-4 border-b bg-muted/50">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                </Avatar>
                <div>
                  <div className="font-medium text-sm">Conversation</div>
                  <div className="text-xs text-muted-foreground">
                    À propos de : {boost.title}
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              {messagesLoading ? (
                <div className="text-center text-muted-foreground">
                  Chargement des messages...
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <div className="text-sm">Aucun message</div>
                  <div className="text-xs">Commencez la conversation !</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex ${
                        message.authorType === "sponsor"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          message.authorType === "sponsor"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <div className="text-sm">{message.content}</div>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3 opacity-70" />
                          <span className="text-xs opacity-70">
                            {formatDate(message.createdAt)}
                          </span>
                          {message.authorType === "sponsor" && (
                            <div className="ml-1">
                              {message.isRead ? (
                                <CheckCheck className="w-3 h-3 opacity-70" />
                              ) : (
                                <Check className="w-3 h-3 opacity-70" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Zone de saisie */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Tapez votre message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={isSending}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isSending}
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* État par défaut */
          <div className="flex-1 flex items-center justify-center text-center">
            <div>
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <div className="text-lg font-medium mb-2">
                Sélectionnez une conversation
              </div>
              <p className="text-muted-foreground">
                Choisissez une conversation dans la liste pour commencer à
                discuter
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
