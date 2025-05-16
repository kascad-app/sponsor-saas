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
import useSession from "@/src/shared/api/use-session";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/src/shared/constants/ROUTES";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (!session.loggedIn) {
      router.push(ROUTES.HOMEPAGE);
    }
  }, [session.loggedIn, router]);

  if (!session.loggedIn) {
    return null;
  }

  return (
    <Sidebar variant="inset" {...props}>
      <AppSidebarHeader />
      <SidebarContent>
        <NavMain items={NAVIGATION.main} />
        <NavSecondary items={NAVIGATION.secondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
