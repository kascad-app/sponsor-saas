"use client"

import React, { useState } from "react";
import { Separator } from "@/src/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Input } from "@/src/components/ui/input"
import { Button } from "@/src/components/ui/button"
import { useUpdateUserProfile } from "@/src/entities/authentication/authentication.hooks";
import useSession from "@/src/shared/api/use-session";

export default function Account() {
  const { user } = useSession();
  const { trigger: updateUserProfile, isMutating: loading} = useUpdateUserProfile();

  // Utiliser les données de l'utilisateur connecté par défaut
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.identifier.phoneNumber || "");
  const [companyName, setCompanyName] = useState(user?.identity.companyName || "");
  const [website, setWebsite] = useState(user?.identity.website || "");
  const [logo, setLogo] = useState(user?.identity.logo || "");
  const [description, setDescription] = useState(user?.description|| "");
  const [email, setEmail] = useState(user?.identifier.email || "")

  const username = (user?.displayName || "");

  const handleSave = async () => {
    if (!user) return;

    try {
      // Créer un objet avec seulement les champs modifiés
      const updatedFields: Partial<typeof user> = {};

      // Champs à la racine
      if (displayName !== user.displayName) updatedFields.displayName = displayName;
      if (description !== user.description) updatedFields.description = description;

      // Champs imbriqués dans identity{}
      if (companyName !== user.identity.companyName ||
        website !== user.identity.website ||
        logo !== user.identity.logo) {
          updatedFields.identity = {
            companyName: companyName,
            website: website,
            logo: logo,
          };
      }

      // Champs imbriqués dans identifier{}
      if (phoneNumber !== user.identifier.phoneNumber || email !== user.identifier.email) {
        updatedFields.identifier = {
          phoneNumber: phoneNumber,
          email: email
        };
      }

      // Ne faire la requête que s'il y a des changements
      if (Object.keys(updatedFields).length > 0) {
        await updateUserProfile(updatedFields);
        alert("Profil mis à jour !");
      } else {
        alert("Aucune modification détectée");
      }
    } catch (error) {
      alert(error || "Erreur lors de la mise à jour");
    }
  };

  // Actualise avec les valeurs de user (celles modifiées)
  React.useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setPhoneNumber(user.identifier.phoneNumber || "");
      setEmail(user.identifier.email || "");
      setCompanyName(user.identity.companyName || "");
      setWebsite(user.identity.website || "");
      setLogo(user.identity.logo || "");
      setDescription(user.description || "");
    }
  }, [user]);

  // Si l'utilisateur n'est pas chargé, afficher un loading
  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <>
      <h1 className="text-2xl">Account</h1>
      <div className="flex items-center gap-4">
        <Avatar className="w-20 h-20">
          <AvatarImage src={user.avatarUrl}/>
          <AvatarFallback>{username}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold">{user.displayName}</h2>
          <p className="text-sm text-muted-foreground pt-2 cursor-pointer hover:underline" onClick={() => console.log("Edit profile picture")}>
           Edit profile picture
          </p>
        </div>
      </div>

      <Separator />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 items-start gap-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-rows-1">
          {/* Display name */}
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-semibold">Name</h2>
            <Input value={displayName} placeholder={user.displayName} type="text" onChange={(e) => setDisplayName(e.target.value)} />
          </div>
          
          {/* Phone number */}
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-semibold">Number</h2>
            <Input value={phoneNumber} placeholder={user.identifier.phoneNumber} type="text" onChange={(e) => setPhoneNumber(e.target.value)} />
          </div>

          {/* Company name */}
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-semibold">Company name</h2>
            <Input value={companyName} placeholder={user.identity.companyName} type="text" onChange={(e) => setCompanyName(e.target.value)} />
          </div>

          {/* Save */}
          <Button className="w-1/4 px-[4rem] mt-2" onClick={handleSave} disabled={loading}>
            {loading ? "Sauvegarde..." : "Save changes"}
          </Button>
        </div>
        
        <div className="grid grid-rows-1 gap-4">
          {/* Website */}
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-semibold">Website</h2>
            <Input value={website} placeholder={user.identity.website} type="text" onChange={(e) => setWebsite(e.target.value)} />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-semibold">Email</h2>
            <Input value={email} placeholder={user.identifier.email} type="text" onChange={(e) => setEmail(e.target.value)} />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-semibold">Description</h2>
            <Input value={description} placeholder={user.description} type="text" onChange={(e) => setDescription(e.target.value)} />
          </div>
        </div>

      </div>
    </>
  );
}
