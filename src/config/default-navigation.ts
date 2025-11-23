import { Settings, Users } from "lucide-react";
import { NavbarConfig } from "@/types/navigation";

export const defaultNavbarConfig: NavbarConfig = {
  items: [
    {
      label: "Overview",
      href: "/overview",
    },
    {
      label: "Documentation",
      href: "/docs",
    },
    {
      label: "Support",
      href: "/support",
    },
  ],
  searchPlaceholder: "Search...",
  user: {
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://github.com/shadcn.png",
  },
  userMenuItems: [
    {
      label: "Profile",
      href: "/profile",
      icon: Users,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
    },
    {
      label: "Log out",
      href: "/logout",
      icon: Users,
    },
  ],
  notifications: [
    {
      title: "New Message",
      description: "You have a new message from Jane.",
      date: "2 min ago",
      href: "/messages/1",
    },
    {
      title: "System Update",
      description: "System update completed successfully.",
      date: "1 hour ago",
      href: "/system/updates",
    },
  ],
};
