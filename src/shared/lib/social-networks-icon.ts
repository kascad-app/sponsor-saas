import {
  Instagram,
  Facebook,
  Twitter,
  Users,
  Youtube,
  MessageCircle,
  Gamepad2,
  Github,
  Linkedin,
  Video,
  Camera,
} from "lucide-react";

/**
 * Social networks configuration
 */
export const socialNetworkConfig = {
  instagram: { icon: Instagram, name: "Instagram" },
  facebook: { icon: Facebook, name: "Facebook" },
  twitter: { icon: Twitter, name: "Twitter" },
  youtube: { icon: Youtube, name: "YouTube" },
  linkedin: { icon: Linkedin, name: "LinkedIn" },
  github: { icon: Github, name: "GitHub" },
  tiktok: { icon: Video, name: "TikTok" },
  snapchat: { icon: Camera, name: "Snapchat" },
  discord: { icon: MessageCircle, name: "Discord" },
  telegram: { icon: MessageCircle, name: "Telegram" },
  whatsapp: { icon: MessageCircle, name: "WhatsApp" },
  twitch: { icon: Gamepad2, name: "Twitch" },
};

/**
 * Get the social networks icons
 * @param networks - The networks to get the icons for
 * @returns The social networks icons
 */
export const getSocialNetworks = (networks: string[]) => {
  return networks.map((network) => {
    const config =
      socialNetworkConfig[
        network.toLowerCase() as keyof typeof socialNetworkConfig
      ];
    return config || { icon: Users, name: network };
  });
};
