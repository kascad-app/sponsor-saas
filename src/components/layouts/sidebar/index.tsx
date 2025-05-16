"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/src/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { NavSecondary } from "./nav-secondary";
import { NavMain } from "./nav-main";
import { AppSidebarHeader } from "./header";
import { NAVIGATION } from "@/src/shared/constants/NAVIGATION";

const data = {
  user: {
    name: "testUser",
    email: "email@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <AppSidebarHeader />
      <SidebarContent>
        <NavMain items={NAVIGATION.main} />
        <NavSecondary items={NAVIGATION.secondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
