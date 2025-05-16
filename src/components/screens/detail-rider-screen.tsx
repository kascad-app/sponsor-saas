"use client";

import { Rider } from "@/src/lib/dashboard.lib";
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
  UserPlus,
  MessageCircle,
  Instagram,
  Facebook,
  Twitter,
  Trophy,
} from "lucide-react";
import Image from "next/image";
import { useFavorites } from "@/src/contexts/favorites-context";
import { competitions } from "@/src/lib/competition.lib";

export default function DetailRiderScreen({ rider }: { rider?: Rider }) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  // Fonction pour obtenir l'image de bannière selon le sport
  const getBannerImage = (sport: string) => {
    switch (sport.toLowerCase()) {
      case "bmx":
        return "/bannerBmx.jpg";
      case "mountain biking":
        return "/bannerMountainBike.png";
      case "skate":
        return "/bannerSkate.jpg";
      default:
        return "/bannerMountainBike.jpg";
    }
  };

  return (
    <div>
      {rider ? (
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
              src={getBannerImage(rider.sport)}
              alt={`${rider.sport} banner`}
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
                      {rider.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold">{rider.name}</h2>
                    <p className="text-sm text-gray-500">
                      {rider.sport} - {rider.level}
                    </p>
                  </div>
                </div>
                <div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      if (isFavorite(rider.id)) {
                        removeFavorite(rider.id);
                      } else {
                        console.log("addFavorite", rider.id);
                        addFavorite(rider.id);
                      }
                    }}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        isFavorite(rider.id)
                          ? "fill-red-500 border-red-500"
                          : ""
                      }`}
                    />
                  </Button>
                </div>
              </div>

              {/* Description */}
              <p className="mt-4 text-sm">
                {rider.description ||
                  "Aucune description disponible pour ce rider."}
              </p>

              {/* Social Media */}
              {rider.socialMedia &&
                Object.keys(rider.socialMedia).length > 0 && (
                  <div className="mt-3 flex gap-2">
                    {rider.socialMedia.instagram && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Instagram className="h-4 w-4" />
                      </Button>
                    )}
                    {rider.socialMedia.facebook && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Facebook className="h-4 w-4" />
                      </Button>
                    )}
                    {rider.socialMedia.twitter && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Twitter className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}

              <div className="mt-4 flex space-x-2">
                <Button className="flex-1">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Follow
                </Button>
                <Button variant="outline" className="flex-1">
                  <MessageCircle className="mr-2 h-4 w-4" /> Message
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cards grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 m-4">
            {/* Rider info card */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Statut
                    </h3>
                    <p className="mt-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          rider.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {rider.status === "active" ? "Actif" : "Inactif"}
                      </span>
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Date d&apos;inscription
                    </h3>
                    <p className="mt-1">
                      {new Date(rider.joinedDate).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Information supplémentaire */}
                  {rider.age && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Âge</h3>
                      <p className="mt-1">{rider.age} ans</p>
                    </div>
                  )}

                  {(rider.country || rider.city) && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Localisation
                      </h3>
                      <p className="mt-1">
                        {rider.city && rider.country
                          ? `${rider.city}, ${rider.country}`
                          : rider.city || rider.country}
                      </p>
                    </div>
                  )}

                  {rider.socialMedia &&
                    Object.keys(rider.socialMedia).length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Réseaux sociaux
                        </h3>
                        <div className="mt-1 space-y-1">
                          {rider.socialMedia.instagram && (
                            <p className="text-sm flex items-center">
                              <Instagram className="h-3 w-3 mr-2" />
                              {rider.socialMedia.instagram}
                            </p>
                          )}
                          {rider.socialMedia.facebook && (
                            <p className="text-sm flex items-center">
                              <Facebook className="h-3 w-3 mr-2" />
                              {rider.socialMedia.facebook}
                            </p>
                          )}
                          {rider.socialMedia.twitter && (
                            <p className="text-sm flex items-center">
                              <Twitter className="h-3 w-3 mr-2" />
                              {rider.socialMedia.twitter}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium flex items-center">
                  <Trophy className="h-4 w-4 mr-2" />
                  Compétitions Récentes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-3">
                  {competitions.map((competition) => (
                    <div
                      key={competition.id}
                      className="flex items-center gap-3 border-b pb-2 last:border-0"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <Image
                          src={
                            competition.logo != null || competition.logo !== ""
                              ? competition.logo
                              : "/circle-user-round.svg"
                          }
                          alt={competition.name}
                          width={24}
                          height={24}
                        />
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-sm font-medium">
                          {competition.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {competition.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div>Rider non trouvé</div>
      )}
    </div>
  );
}
