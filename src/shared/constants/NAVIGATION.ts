import {
  House,
  LifeBuoy,
  type LucideIcon,
  Search,
  Send,
  Heart,
  Award,
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
      title: "Scouting",
      url: "/search",
      icon: Search,
    },
    {
      title: "Boost",
      url: "/boost",
      icon: Award,
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
