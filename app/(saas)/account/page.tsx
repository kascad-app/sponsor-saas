"use client"

import { Separator } from "@/src/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { user } from "@/src/config/user"
import { Input } from "@/src/components/ui/input"

export default function Account() {
  return (
    <>
      <h1 className="text-2xl">Account</h1>
      <div className="flex items-center gap-4">
        <Avatar className="w-20 h-20">
          <AvatarImage src={user.avatar}/>
          <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-sm text-muted-foreground pt-2 cursor-pointer hover:underline" onClick={() => console.log("Edit profile picture")}>
           Edit profile picture
          </p>
        </div>
      </div>
      <Separator />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-base">Name</h2>
          <Input placeholder={user.name} type="text" onChange={(e) => console.log(e.target.value)} className="w-1/3" />
        </div>          
        <div className="flex flex-col gap-2">
          <h2 className="text-base">Email</h2>
          <Input placeholder={user.email} type="email" onChange={(e) => console.log(e.target.value)} className="w-1/3" />
        </div>
      </div>
    </>
  );
}
