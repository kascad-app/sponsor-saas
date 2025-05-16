import {
  House,
  LifeBuoy,
  type LucideIcon,
  Search,
  Send,
  File,
  Heart,
} from "lucide-react";

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
    {
      title: "My contracts",
      url: "/contracts",
      icon: File,
    },
    {
      title: "Favorites",
      url: "/favorites",
      icon: Heart,
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
