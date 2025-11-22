import { LayoutDashboard, Folder, Settings, Users, BarChart } from "lucide-react";
import { NavbarConfig, SidebarConfig } from "@/types/navigation";

export const defaultSidebarConfig: SidebarConfig = {
  groups: [
    {
      label: "Platform",
      items: [
        {
          label: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
          isActive: true,
        },
        {
          label: "Analytics",
          href: "/analytics",
          icon: BarChart,
        },
        {
          label: "Settings",
          href: "/settings",
          icon: Settings,
          items: [
            {
              label: "General",
              href: "/settings/general",
            },
            {
              label: "Security",
              href: "/settings/security",
            },
          ],
        },
      ],
    },
    {
      label: "Projects",
      items: [
        {
          label: "All Projects",
          href: "/projects",
          icon: Folder,
        },
        {
          label: "Team",
          href: "/team",
          icon: Users,
        },
      ],
    },
  ],
  user: {
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://github.com/shadcn.png",
  },
  branding: {
    name: "Acme Inc",
    logo: LayoutDashboard,
    href: "/",
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
      icon: Users, // Using Users as placeholder for LogOut since we need to import it
    },
  ],
  fixed: false,
};

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
