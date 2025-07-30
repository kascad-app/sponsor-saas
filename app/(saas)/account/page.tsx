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
  const { trigger: updateUserProfile, isMutating: loading, error } = useUpdateUserProfile();

  // Utiliser les données de l'utilisateur connecté
  const [firstname, setFirstname] = useState(user?.displayName || "");
  const [lastname, setLastname] = useState(user?.displayName || "");
  const [number, setNumber] = useState(user?.identifier.phoneNumber || "");
  const [address, setAddress] = useState(user?.displayName || "");
  const [city, setCity] = useState(user?.displayName || "");
  const [country, setCountry] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.identifier.email || "");

  const username = (user?.displayName || "");

  const handleSave = async () => {
    if (!user) return;

    try {
      // Créer un objet avec seulement les champs modifiés
      const updatedFields: Partial<typeof user> = {};
      
      if (firstname !== user.displayName) updatedFields.displayName = firstname;
      if (lastname !== user.displayName) updatedFields.displayName = lastname;
      if (address !== user.displayName) updatedFields.displayName = address;
      if (city !== user.displayName) updatedFields.displayName = city;
      if (country !== user.displayName) updatedFields.displayName = country;

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
          <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold">{user.displayName + '  ' + user.displayName}</h2>
          <p className="text-sm text-muted-foreground pt-2 cursor-pointer hover:underline" onClick={() => console.log("Edit profile picture")}>
           Edit profile picture
          </p>
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-1 sm:grid-cols-2 items-start gap-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-rows-1">
          {/* Last name */}
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-semibold">Last name</h2>
            <Input value={lastname} placeholder={user.displayName} type="text" onChange={(e) => setLastname(e.target.value)} />
          </div>
          {/* Address */}
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-semibold">First name</h2>
            <Input value={firstname} placeholder={user.displayName} type="text" onChange={(e) => setFirstname(e.target.value)} />
          </div>
          {/* Contact */}
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-semibold">Contact</h2>
            <Input value={number} placeholder={user.identifier.phoneNumber} type="text" onChange={(e) => setNumber(e.target.value)} />
          </div>

          {/* Save */}
          <Button className="w-1/4 px-[4rem] mt-2" onClick={handleSave} disabled={loading}>
            {loading ? "Sauvegarde..." : "Save changes"}
          </Button>
        </div>
        
        <div className="grid grid-rows-1 gap-4">
          {/* Address */}
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-semibold">Address</h2>
            <Input value={address} placeholder={user.displayName} type="text" onChange={(e) => setAddress(e.target.value)} />
          </div>
          {/* City */}
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-semibold">City</h2>
            <Input value={city} placeholder={user.displayName} type="text" onChange={(e) => setCity(e.target.value)} />
          </div>
         {/* Email */}
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-semibold">Email</h2>
            <Input value={email} placeholder={user.identifier.email} type="text" onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>

      </div>
    </>
  );
}
