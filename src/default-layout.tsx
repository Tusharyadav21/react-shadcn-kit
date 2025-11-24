import React from "react";
import { SidebarProvider, SidebarInset } from "@/atoms/sidebar";
import { AppSidebar } from "@/organisms/app-sidebar";
import { AppNavbar } from "@/organisms/app-navbar";
import * as LucideIcons from "lucide-react";

export type Placement = "left" | "right" | "top" | "bottom";
export type NavbarHeight = "sm" | "md" | "lg" | string;
export type RouteType = "public" | "auth" | "private";
export type HttpMethod = "GET" | "POST";

export type LayoutRules = {
  [key in RouteType]?: { navbar?: boolean; sidebar?: boolean };
};

export type UserConfig = {
  name?: string;
  image?: string;
  username?: string;
  email?: string;
  roles?: string[];
};

export type SearchConfig = {
  enabled?: boolean;
  placeholder?: string;
  action?: string;
  method?: HttpMethod;
  debounceTimeMs?: number;
  suggestionsApi?: string;
};

export type NotificationsList = {
  title: string;
  image?: string;
  description: string;
  date: string;
  read: boolean;
};

export type NotificationConfig = {
  enabled?: boolean;
  isNewNotification?: boolean;
  count?: number;
  showBadge?: boolean;
  notifications?: NotificationsList[];
};

export type MenuItem = {
  label: string;
  href: string;
  icon?: string;
  disabled?: boolean;
};

export type BrandingConfig = {
  logoUrl?: string;
  logoAlt?: string;
  title?: string;
  subtitle?: string;
};

export type LoginButtonConfig = {
  label?: string;
  href?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  onClick?: () => void;
};

export type BaseComponentConfig = {
  showThemeToggle?: boolean;
  showUserMenu?: boolean;
  loginButton?: LoginButtonConfig;
  search?: SearchConfig;
  scrollable?: boolean;
  branding?: BrandingConfig;
  showSidebarTrigger?: boolean;
  customContent?: React.ReactNode;
  notifications?: NotificationConfig;
};

export type NavbarConfig = BaseComponentConfig & {
  height?: NavbarHeight;
  items?: MenuItem[];
  userMenuItems?: { label: string; href?: string; icon?: string; onClick?: () => void }[];
};

export type SidebarGroup = {
  label: string;
  items: MenuItem[];
  collapsible?: boolean;
};

export type SidebarConfig = BaseComponentConfig & {
  width?: string;
  placement?: Placement;
  groups?: SidebarGroup[];
  userMenuItems?: { label: string; href?: string; icon?: string; onClick?: () => void }[];
};

export type ComponentConfig = {
  navbar?: NavbarConfig;
  sidebar?: SidebarConfig;
};

export type LayoutConfig = {
  layoutRules?: LayoutRules;
  user?: UserConfig;
  search?: SearchConfig;
  components?: ComponentConfig;
  appName?: string;
  theme?: "light" | "dark" | "system";
};

const getIcon = (name: string) => {
  // @ts-ignore – dynamic access to lucide icons
  return (LucideIcons as any)[name] ?? (LucideIcons as any)["Circle"];
};

export default function DefaultLayout({
  children,
  layoutConfig,
}: {
  children: React.ReactNode;
  layoutConfig: LayoutConfig;
}) {
  const { navbar = {}, sidebar = {} } = layoutConfig.components || {};

  const navbarItems = navbar.items?.map((item) => ({
    ...item,
    icon: getIcon(item.icon || ""),
  }));

  const navbarUserMenuItems = navbar.userMenuItems?.map((item) => ({
    ...item,
    icon: item.icon ? getIcon(item.icon) : undefined,
  }));

  const sidebarGroups = sidebar.groups?.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
      ...item,
      icon: getIcon(item.icon || ""),
    })),
  }));

  const sidebarUserMenuItems = sidebar.userMenuItems?.map((item) => ({
    ...item,
    icon: item.icon ? getIcon(item.icon) : undefined,
  }));

  const sidebarProviderStyle: React.CSSProperties = {
    "--sidebar-width": sidebar.width || "250px",
  } as React.CSSProperties;

  const layoutRules = layoutConfig.layoutRules || {
    public: { navbar: true, sidebar: true },
    auth: { navbar: true, sidebar: true },
    private: { navbar: true, sidebar: true },
  };

  const showSidebar = layoutRules.public?.sidebar ?? true;
  const showNavbar = layoutRules.public?.navbar ?? true;

  const notifications =
    navbar.notifications?.enabled && navbar.notifications.count
      ? Array.from({ length: navbar.notifications.count }).map(() => ({
          title: "New Notification",
          description: "You have a new notification.",
          date: "Just now",
          read: !navbar.notifications?.isNewNotification,
        }))
      : [];

  const scrollable = sidebar.scrollable ?? true;
  const maxWidth = undefined;

  return (
    <div style={{ "--header-height": "calc(var(--spacing, 14))" } as React.CSSProperties}>
      <SidebarProvider defaultOpen={true} className="flex flex-col" style={sidebarProviderStyle}>
        {showNavbar && (
          <AppNavbar
            items={navbarItems}
            searchPlaceholder={navbar.search?.placeholder}
            showSearch={navbar.search?.enabled ?? false}
            showThemeToggle={navbar.showThemeToggle}
            showUserMenu={navbar.showUserMenu}
            showNotifications={navbar.notifications?.enabled}
            notifications={notifications}
            user={layoutConfig.user}
            userMenuItems={navbarUserMenuItems}
            branding={navbar.branding}
            labels={undefined}
            style={{ height: navbar.height }}
            showSidebarTrigger={showSidebar && (navbar.showSidebarTrigger ?? true)}
            loginButton={navbar.loginButton}
          />
        )}
        <div className="flex flex-1">
          {showSidebar && (
            <AppSidebar
              side={sidebar.placement === "right" ? "right" : "left"}
              scrollable={scrollable}
              fixed={true}
              groups={sidebarGroups}
              showThemeToggle={sidebar.showThemeToggle}
              user={layoutConfig.user}
              userMenuItems={sidebarUserMenuItems}
              branding={sidebar.branding}
              labels={undefined}
              hideBranding={false}
              showUserMenu={sidebar.showUserMenu}
              loginButton={sidebar.loginButton}
            />
          )}
          <SidebarInset>
            <div className="p-4 mx-auto w-full" style={maxWidth ? { maxWidth } : undefined}>
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
