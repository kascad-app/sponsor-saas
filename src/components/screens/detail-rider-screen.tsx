"use client";

import { Rider } from "@kascad-app/shared-types";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import {
  Heart,
  Settings,
  Instagram,
  Facebook,
  Twitter,
  Trophy,
  MapPin,
  Users,
  Award,
  Mail,
  Youtube,
  MessageCircle,
  Gamepad2,
  Github,
  Linkedin,
  Video,
  Camera,
  ListPlus,
} from "lucide-react";
import Image from "next/image";
import { useFavorites } from "@/src/contexts/favorites-context";
import { Badge } from "@/src/components/ui/badge";
import { Skeleton } from "@/src/components/ui/skeleton";
import { RidersErrorCard } from "@/src/widget/rider/card";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { sendCustomEmail } from "@/src/lib/rider/rider.lib";
import { toast } from "sonner";
import { Editor } from "@/src/components/blocks/editor-00/editor";
import { SerializedEditorState } from "lexical";

// Composant de loading
const RiderDetailSkeleton = () => (
  <div>
    <div className="bg-white p-4 flex justify-between items-center">
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-8 w-8" />
    </div>

    <Skeleton className="w-full h-48" />

    <Card className="m-4 -mt-16 relative z-10">
      <CardContent className="p-4">
        <div className="flex justify-between">
          <div className="flex items-center space-x-4">
            <Skeleton className="w-20 h-20 rounded-full" />
            <div>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-8 w-8" />
        </div>

        <Skeleton className="h-16 w-full mt-4" />

        <div className="mt-4 flex space-x-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </CardContent>
    </Card>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 m-4">
      <Skeleton className="h-80" />
      <Skeleton className="h-80" />
    </div>
  </div>
);

interface DetailRiderScreenProps {
  rider?: Rider;
  isLoading?: boolean;
  error?: Error;
  onRetry?: () => void;
}

export default function DetailRiderScreen({
  rider,
  isLoading,
  error,
  onRetry,
}: DetailRiderScreenProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const [isClient, setIsClient] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [editorState, setEditorState] = useState<SerializedEditorState | null>(
    null,
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <RiderDetailSkeleton />;
  }

  const getInitialEditorState = (): SerializedEditorState => {
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

    const defaultContent = `Bonjour ${rider.identity.firstName},

Je vous contacte au sujet d'une opportunité de partenariat avec notre marque.

Votre profil ${rider.preferences.sports
      .map((sport) => sport.name)
      .join(
        ", ",
      )} correspond parfaitement à notre image et nous serions ravis de discuter d'une collaboration.

Pourriez-vous me faire savoir si vous seriez intéressé(e) par un partenariat ?

Je reste à votre disposition pour toute question.

Cordialement,`;

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

  // Fonction pour extraire le texte du contenu sérialisé
  const extractTextFromSerializedState = (
    serializedState: SerializedEditorState,
  ): string => {
    if (
      !serializedState ||
      !serializedState.root ||
      !serializedState.root.children
    ) {
      return "";
    }

    return serializedState.root.children
      .map((node: { type: string; children?: { text?: string }[] }) => {
        if (node.type === "paragraph" && node.children) {
          return node.children
            .map((child: { text?: string }) => child.text || "")
            .join("");
        }
        return "";
      })
      .join("\n\n");
  };

  // Fonction pour obtenir l'image de bannière selon le sport
  const getBannerImage = (sport: string) => {
    switch (sport) {
      case "BMX":
        return "/bannerBmx.jpg";
      case "VTT":
      case "VTT de descente":
      case "Cyclisme":
      case "Cyclisme sur route":
      case "Enduro":
      case "Freeride":
        return "/bannerMountainBike.png";
      case "Skateboard":
      case "Longboard":
      case "Roller":
      case "Trottinette":
        return "/bannerSkate.jpg";
      default:
        return "/bannerMountainBike.png";
    }
  };

  // le nom complet
  const getFullName = (rider: Rider) => {
    return `${rider.identity.firstName} ${rider.identity.lastName}`;
  };

  // Fonction pour obtenir l'âge avec protection hydratation
  const getAge = (birthDate: Date) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleSendEmail = () => {
    if (rider && editorState) {
      const textContent = extractTextFromSerializedState(editorState);

      if (textContent.trim()) {
        sendCustomEmail(rider, textContent);
        toast.success("Email envoyé avec succès!");
        setIsEmailDialogOpen(false);
        // Réinitialiser l'éditeur
        setEditorState(null);
      } else {
        toast.error("Veuillez saisir un message avant d'envoyer");
      }
    }
  };

  // Fonction pour initialiser l'éditeur quand la modale s'ouvre
  const handleDialogOpen = (open: boolean) => {
    setIsEmailDialogOpen(open);
    if (open && !editorState) {
      setEditorState(getInitialEditorState());
    }
  };

  // Configuration des réseaux sociaux
  const socialNetworkConfig = {
    instagram: { icon: Instagram, name: "Instagram" },
    facebook: { icon: Facebook, name: "Facebook" },
    twitter: { icon: Twitter, name: "Twitter" },
    youtube: { icon: Youtube, name: "YouTube" },
    linkedin: { icon: Linkedin, name: "LinkedIn" },
    github: { icon: Github, name: "GitHub" },
    tiktok: { icon: Video, name: "TikTok" },
    snapchat: { icon: Camera, name: "Snapchat" },
    discord: { icon: MessageCircle, name: "Discord" },
    telegram: { icon: MessageCircle, name: "Telegram" },
    whatsapp: { icon: MessageCircle, name: "WhatsApp" },
    twitch: { icon: Gamepad2, name: "Twitch" },
  };

  // Fonction pour obtenir les réseaux sociaux
  const getSocialNetworks = (networks: string[]) => {
    return networks.map((network) => {
      const config =
        socialNetworkConfig[
          network.toLowerCase() as keyof typeof socialNetworkConfig
        ];
      return config || { icon: Users, name: network };
    });
  };

  if (isLoading) {
    return <RiderDetailSkeleton />;
  }

  if (error) {
    return <RidersErrorCard onRetry={onRetry || (() => {})} />;
  }

  if (!rider) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Rider non trouvé</h3>
          <p className="text-muted-foreground">
            Ce rider n&apos;existe pas ou n&apos;est plus disponible.
          </p>
        </div>
      </div>
    );
  }

  const fullName = getFullName(rider);
  const age = isClient ? getAge(rider.identity.birthDate) : 0;
  const socialNetworks = getSocialNetworks(rider.preferences.networks);
  const primarySport =
    rider.preferences && rider.preferences.sports.length > 0
      ? rider.preferences.sports[0].name
      : "Sport";

  return (
    <div>
      <div className="bg-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Profile</h1>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* Banner Image */}
      <div className="relative w-full h-48">
        <Image
          src={getBannerImage(primarySport)}
          alt={`${primarySport} banner`}
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      {/* Profile Info */}
      <Card className="m-4 -mt-16 relative z-10">
        <CardContent className="p-4">
          <div className="flex justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20 border-4 border-white">
                <AvatarFallback>
                  {rider.identity.firstName[0]}
                  {rider.identity.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold">{fullName}</h2>
                <p className="text-sm text-gray-500">
                  {primarySport} • {age} ans
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {rider.identity.city}, {rider.identity.country}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  if (isFavorite(rider._id)) {
                    removeFavorite(rider._id);
                  } else {
                    addFavorite(rider._id);
                  }
                }}
              >
                <Heart
                  className={`h-4 w-4 ${
                    isFavorite(rider._id) ? "fill-red-500 text-red-500" : ""
                  }`}
                />
              </Button>
            </div>
          </div>

          {/* Bio */}
          <p className="mt-4 text-sm">
            {rider.identity.bio || "Aucune bio disponible pour ce rider."}
          </p>

          {/* Sports pratiqués */}
          <div className="mt-3 flex flex-wrap gap-1">
            {rider.preferences.sports.map((sport, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {sport.name}
              </Badge>
            ))}
          </div>

          {/* Social Media */}
          {socialNetworks.length > 0 && (
            <div className="mt-3 flex gap-2">
              {socialNetworks.map((social, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title={social.name}
                >
                  <social.icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
          )}

          <div className="mt-4 flex space-x-2">
            <Dialog open={isEmailDialogOpen} onOpenChange={handleDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex-1">
                  <Mail className="mr-2 h-4 w-4" />
                  Envoyer un mail
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
                <DialogHeader>
                  <DialogTitle>
                    Contacter {rider.identity.firstName}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 overflow-hidden">
                  <div className="text-sm text-muted-foreground">
                    <p>
                      <strong>À :</strong> {rider.identifier.email}
                    </p>
                    <p>
                      <strong>Objet :</strong> Prise de contact pour un
                      partenariat
                    </p>
                  </div>

                  <div
                    className="border rounded-lg overflow-hidden"
                    style={{ minHeight: "300px" }}
                  >
                    {editorState && (
                      <Editor
                        editorSerializedState={editorState}
                        onSerializedChange={setEditorState}
                      />
                    )}
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSendEmail} className="flex-1">
                      <Mail className="mr-2 h-4 w-4" />
                      Envoyer l&apos;email
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEmailDialogOpen(false)}
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              className="flex-1"
              variant="outline"
              onClick={() =>
                toast.info("Cette fonctionnalité est en cours de développement")
              }
            >
              <ListPlus className="mr-2 h-4 w-4" />
              Ajouter à une liste
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cards grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 m-4">
        {/* Rider info card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">Informations</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Disponibilité
                </h3>
                <p className="mt-1">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      rider.availibility.isAvailable
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {rider.availibility.isAvailable
                      ? "Disponible"
                      : "Indisponible"}
                  </span>
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Type de contrat souhaité
                </h3>
                <p className="mt-1">{rider.availibility.contractType}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Âge</h3>
                <p className="mt-1">{age} ans</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Localisation
                </h3>
                <p className="mt-1">
                  {rider.identity.city}, {rider.identity.country}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Lieu de pratique
                </h3>
                <p className="mt-1">{rider.identity.practiceLocation}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Langues parlées
                </h3>
                <div className="mt-1 flex flex-wrap gap-1">
                  {rider.identity.languageSpoken.map((lang, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Entraînement
                </h3>
                {/* <p className="mt-1 text-sm">
                  {rider.trainingFrequency.sessionsPerWeek} sessions/semaine •{" "}
                  {rider.trainingFrequency.hoursPerSession}h par session
                </p> */}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performances & Sponsoring */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium flex items-center">
              <Trophy className="h-4 w-4 mr-2" />
              Performances & Sponsoring
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Podiums</h3>
                <p className="mt-1 flex items-center">
                  <Award className="h-4 w-4 mr-2 text-yellow-500" />
                  {/* {rider.performanceSummary.totalPodiums} podiums */}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Sponsors actuels
                </h3>
                <p className="mt-1">
                  {rider.sponsorSummary.totalSponsors} sponsors
                </p>
                {rider.sponsorSummary.currentSponsors.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {rider.sponsorSummary.currentSponsors.map(
                      (sponsor, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {sponsor}
                        </Badge>
                      ),
                    )}
                  </div>
                )}
              </div>

              {rider.sponsorSummary.wishListSponsors.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Sponsors souhaités
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {rider.sponsorSummary.wishListSponsors.map(
                      (sponsor, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {sponsor}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>
              )}

              {rider.nonCompetitionAwards.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Récompenses
                  </h3>
                  <div className="mt-2 space-y-2">
                    {rider.nonCompetitionAwards
                      .slice(0, 3)
                      .map((award, index) => (
                        <div key={index} className="text-sm">
                          <p className="font-medium">{award.title}</p>
                          <p className="text-xs text-gray-500">
                            {award.source} •{" "}
                            {isClient
                              ? new Date(award.date).toLocaleDateString()
                              : ""}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
