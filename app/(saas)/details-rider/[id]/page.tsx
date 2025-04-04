import { riders, Rider } from "@/src/lib/dashboard.lib";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/src/components/ui/avatar";
import { Settings, UserPlus, MessageCircle, Trophy } from "lucide-react";
import Image from "next/image";
import { competitions } from "@/src/lib/competition.lib";

export default async function DetailRider({
  params,
}: {
  params: { id: string };
}) {
  const riderId = params.id;
  let rider: Rider | undefined;

  for (let i = 0; i < riders.length; i++) {
    if (riders[i].id === riderId) {
      rider = riders[i];
      break;
    }
  }

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

  // Affichage des détails du rider ou message si non trouvé
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
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20 border-4 border-white">
                  <AvatarImage
                    src={
                      rider.photo != null
                        ? rider.photo
                        : "/placeholder.svg?height=80&width=80"
                    }
                    alt="Profile Picture"
                  />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{rider.name}</h2>
                  <p className="text-sm text-gray-500">
                    {rider.sport} - {rider.level}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
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
                      Date d'inscription
                    </h3>
                    <p className="mt-1">
                      {new Date(rider.joinedDate).toLocaleDateString()}
                    </p>
                  </div>
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
