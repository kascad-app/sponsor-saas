import { House, LifeBuoy, type LucideIcon, Search, Send } from "lucide-react";

type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

type Navigation = {
  main: NavItem[];
  secondary: NavItem[];
};

type AppNavigation = Navigation;

export const NAVIGATION: AppNavigation = {
  main: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: House,
    },
    {
      title: "Find a rider",
      url: "/search",
      icon: Search,
    },
  ],
  secondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
};
