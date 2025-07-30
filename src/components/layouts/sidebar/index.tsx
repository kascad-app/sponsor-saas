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

import { user } from "@/src/config/user"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <AppSidebarHeader />
      <SidebarContent>
        <NavMain items={NAVIGATION.main} />
        <NavSecondary items={NAVIGATION.secondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
