import DefaultLayout, { LayoutConfig } from "./default-layout";

const config: LayoutConfig = {
  showNavbar: true,
  showSidebar: true,
  navbar: {
    height: "64px",
    showThemeToggle: true,
    showUserMenu: true,
    showSidebarTrigger: true,

    blendWithBody: false,
    branding: {
      title: "React Shadcn Kit",
      subtitle: "Component Library",
    },
    notifications: {
      enabled: true,
      items: [
        {
          title: "New Message",
          description: "You have a new message from Jane",
          date: "2 mins ago",
          read: false,
        },
        {
          title: "System Update",
          description: "System update completed successfully",
          date: "1 hour ago",
          read: true,
        },
      ],
    },
    userMenuItems: [
      {
        label: "Profile",
        href: "/profile",
        icon: "User",
      },
      {
        label: "Settings",
        href: "/settings",
        icon: "Settings",
      },
      {
        label: "Sign out",
        href: "/logout",
        icon: "LogOut",
      },
    ],
    search: {
      enabled: true,
      placeholder: "Search...",
    },
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: "LayoutDashboard",
      },
      {
        label: "Profile",
        href: "/profile",
        icon: "User",
      },
      {
        label: "Settings",
        href: "/settings",
        icon: "Settings",
      },
    ],
  },
  sidebar: {
    width: "250px",
    placement: "left",
    showThemeToggle: true,
    showUserMenu: true,
    fullHeight: false,
    blendWithBody: false,
    branding: {
      title: "Navigation",
    },
    groups: [
      {
        label: "Main",
        collapsible: true,
        items: [
          {
            label: "Home",
            href: "/",
            icon: "Home",
          },
          {
            label: "Reports",
            href: "/reports",
            icon: "BarChart2",
          },
        ],
      },
      {
        label: "Management",
        collapsible: true,
        items: [
          {
            label: "Users",
            href: "/users",
            icon: "Users",
          },
          {
            label: "Roles",
            href: "/roles",
            icon: "Shield",
          },
        ],
      },
    ],
    userMenuItems: [
      {
        label: "Profile",
        href: "/profile",
        icon: "User",
      },
      {
        label: "Billing",
        href: "/billing",
        icon: "CreditCard",
      },
      {
        label: "Sign out",
        href: "/logout",
        icon: "LogOut",
      },
    ],
  },
  user: {
    name: "John Doe",
    email: "john.doe@example.com",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    username: "johndoe",
    roles: ["admin"],
  },
  content: {
    padding: "16px",
  },
  sidebarDefaultOpen: true,
};

export default function TestLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-[600px] w-full border rounded-xl overflow-hidden shadow-sm bg-background isolate">
      <DefaultLayout config={config}>{children}</DefaultLayout>
    </div>
  );
}
