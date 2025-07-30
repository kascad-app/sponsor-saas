"use client"

import React, { useState } from "react";
import { Separator } from "@/src/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { user } from "@/src/config/user"
import { Input } from "@/src/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"
import { Button } from "@/src/components/ui/button"

const username = user.firstname + ' ' + user.lastname;

const capitalize = (val: string) => {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export default function Account() {
  const [firstname, setFirstname] = useState(user.firstname);
  const [lastname, setLastname] = useState(user.lastname);
  const [number, setNumber] = useState(user.number);
  const [address, setAddress] = useState(user.address);
  const [city, setCity] = useState(user.city);
  const [country, setCountry] = useState(user.country);
  const [email, setEmail] = useState(user.email);
  const [timezone, setTimezone] = useState("cet"); // ou user.timezone si dispo

  const handleSave = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8080/sponsors/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname,
          lastname,
          number,
          address,
          city,
          country,
          email,
          timezone,
        }),
      });

      if (response.ok) {
        alert("Profil mis à jour !");
        // Optionnel : rafraîchir les infos utilisateur
      } else {
        alert("Erreur lors de la mise à jour");
      }
    } catch (error) {
      alert("Erreur serveur");
    }
  };

  return (
    <>
      <h1 className="text-2xl">Account</h1>
      <div className="flex items-center gap-4">
        <Avatar className="w-20 h-20">
          <AvatarImage src={user.avatar}/>
          <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold">{capitalize(user.firstname) + '  ' + capitalize(user.lastname)}</h2>
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
            <Input value={lastname} placeholder={user.lastname} type="text" onChange={(e) => setLastname(e.target.value)} />
          </div>
          {/* Address */}
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-semibold">First name</h2>
            <Input value={firstname} placeholder={user.firstname} type="text" onChange={(e) => setFirstname(e.target.value)} />
          </div>
          {/* Contact */}
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-semibold">Contact</h2>
            <Input value={number} placeholder={user.number} type="text" onChange={(e) => setNumber(e.target.value)} />
          </div>
          {/* Timezone */}
          <div>
            <h2 className="text-sm font-semibold">Timezone</h2>
            <Select value={timezone} onValueChange={(value) => setTimezone(value)}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select a timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>North America</SelectLabel>
                  <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                  <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
                  <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
                  <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                  <SelectItem value="akst">Alaska Standard Time (AKST)</SelectItem>
                  <SelectItem value="hst">Hawaii Standard Time (HST)</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Europe & Africa</SelectLabel>
                  <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                  <SelectItem value="cet">Central European Time (CET)</SelectItem>
                  <SelectItem value="eet">Eastern European Time (EET)</SelectItem>
                  <SelectItem value="west">
                    Western European Summer Time (WEST)
                  </SelectItem>
                  <SelectItem value="cat">Central Africa Time (CAT)</SelectItem>
                  <SelectItem value="eat">East Africa Time (EAT)</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Asia</SelectLabel>
                  <SelectItem value="msk">Moscow Time (MSK)</SelectItem>
                  <SelectItem value="ist">India Standard Time (IST)</SelectItem>
                  <SelectItem value="cst_china">China Standard Time (CST)</SelectItem>
                  <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
                  <SelectItem value="kst">Korea Standard Time (KST)</SelectItem>
                  <SelectItem value="ist_indonesia">
                    Indonesia Central Standard Time (WITA)
                  </SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Australia & Pacific</SelectLabel>
                  <SelectItem value="awst">
                    Australian Western Standard Time (AWST)
                  </SelectItem>
                  <SelectItem value="acst">
                    Australian Central Standard Time (ACST)
                  </SelectItem>
                  <SelectItem value="aest">
                    Australian Eastern Standard Time (AEST)
                  </SelectItem>
                  <SelectItem value="nzst">New Zealand Standard Time (NZST)</SelectItem>
                  <SelectItem value="fjt">Fiji Time (FJT)</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>South America</SelectLabel>
                  <SelectItem value="art">Argentina Time (ART)</SelectItem>
                  <SelectItem value="bot">Bolivia Time (BOT)</SelectItem>
                  <SelectItem value="brt">Brasilia Time (BRT)</SelectItem>
                  <SelectItem value="clt">Chile Standard Time (CLT)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>          
          </div>

          {/* Save */}
          <Button className="w-1/4 px-[4rem] mt-2" onClick={handleSave}>
            Save changes
          </Button>
        </div>
        
        <div className="grid grid-rows-1 gap-4">
          {/* Address */}
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-semibold">Address</h2>
            <Input value={address} placeholder={user.address} type="text" onChange={(e) => setAddress(e.target.value)} />
          </div>
          {/* City */}
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-semibold">City</h2>
            <Input value={city + ', ' + country} placeholder={user.city + ', ' + user.country} type="text" onChange={(e) => setCity(e.target.value)} />
          </div>
         {/* Email */}
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-semibold">Email</h2>
            <Input value={email} placeholder={user.email} type="text" onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>

      </div>
    </>
  );
}
