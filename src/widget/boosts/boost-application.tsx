"use client";

import { useState } from "react";
import {
  User,
  MapPin,
  Users,
  Check,
  X,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { OfferApplication } from "@/src/entities/boosts/boosts.types";
import {
  useAcceptBoost,
  useRejectBoost,
} from "@/src/entities/boosts/boosts.hook";
import { toast } from "sonner";

interface OfferApplicationsProps {
  applications: OfferApplication[];
  isLoading: boolean;
  onApplicationUpdate?: () => void;
}

export function OfferApplications({
  applications,
  isLoading,
  onApplicationUpdate,
}: OfferApplicationsProps) {
  const { acceptBoost } = useAcceptBoost();
  const { rejectBoost } = useRejectBoost();
  const [loadingActions, setLoadingActions] = useState<Record<string, boolean>>(
    {},
  );

  const handleAccept = async (application: OfferApplication) => {
    const actionKey = `accept-${application._id}`;
    setLoadingActions((prev) => ({ ...prev, [actionKey]: true }));

    try {
      await acceptBoost(application.offerId, application.riderId);
      toast.success("Candidature acceptée avec succès !");
      onApplicationUpdate?.();
    } catch (error) {
      console.error("Erreur lors de l'acceptation:", error);
      toast.error("Erreur lors de l'acceptation de la candidature");
    } finally {
      setLoadingActions((prev) => ({ ...prev, [actionKey]: false }));
    }
  };

  const handleReject = async (application: OfferApplication) => {
    const actionKey = `reject-${application._id}`;
    setLoadingActions((prev) => ({ ...prev, [actionKey]: true }));

    try {
      await rejectBoost(application.offerId, application.riderId);
      toast.success("Candidature rejetée");
      onApplicationUpdate?.();
    } catch (error) {
      console.error("Erreur lors du rejet:", error);
      toast.error("Erreur lors du rejet de la candidature");
    } finally {
      setLoadingActions((prev) => ({ ...prev, [actionKey]: false }));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return <Badge className="bg-green-100 text-green-800">Accepté</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejeté</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800">En attente</Badge>;
    }
  };

  const getMainNetwork = (
    networks: Array<{ platform: string; followers: number }>,
  ) => {
    if (!networks || networks.length === 0) return null;
    return networks.reduce((prev, current) =>
      current.followers > prev.followers ? current : prev,
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Users className="w-12 h-12 text-muted-foreground mb-4" />
          <div className="text-lg font-medium mb-2">Aucune candidature</div>
          <p className="text-muted-foreground">
            Cette offre n'a pas encore reçu de candidatures.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {applications.length} candidature{applications.length > 1 ? "s" : ""}
        </div>
      </div>

      {applications.map((application) => {
        const mainNetwork = getMainNetwork(
          application.rider.preferences.networks,
        );
        const acceptLoading = loadingActions[`accept-${application._id}`];
        const rejectLoading = loadingActions[`reject-${application._id}`];

        return (
          <Card
            key={application._id}
            className="hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      src={application.rider.identity.profilePicture}
                      alt={`${application.rider.identifier.firstName} ${application.rider.identifier.lastName}`}
                    />
                    <AvatarFallback>
                      <User className="w-6 h-6" />
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">
                        {application.rider.identifier.firstName}{" "}
                        {application.rider.identifier.lastName}
                      </h3>
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {application.rider.identity.country}
                      </div>

                      {mainNetwork && (
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {mainNetwork.followers.toLocaleString()} sur{" "}
                          {mainNetwork.platform}
                        </div>
                      )}

                      <div>
                        Candidature le{" "}
                        {new Date(application.appliedAt).toLocaleDateString(
                          "fr-FR",
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(application.status)}

                  {application.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAccept(application)}
                        disabled={acceptLoading || rejectLoading}
                        className="text-green-600 border-green-200 hover:bg-green-50"
                      >
                        {acceptLoading ? (
                          <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(application)}
                        disabled={acceptLoading || rejectLoading}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        {rejectLoading ? (
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  )}

                  <Button variant="ghost" size="sm">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
