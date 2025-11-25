"use client";

import React, { useState, useEffect, useRef } from "react";
import { SidebarProvider, SidebarInset } from "@/atoms/sidebar";
import { AppSidebar, type AppSidebarProps } from "@/organisms/app-sidebar";
import { AppNavbar, type AppNavbarProps } from "@/organisms/app-navbar";
import * as LucideIcons from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

export type User = {
  name: string;
  email: string;
  image?: string;
  username?: string;
  roles?: string[];
};

type MenuItem = {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  items?: MenuItem[];
};

type MenuGroup = {
  label?: string;
  items: MenuItem[];
  collapsible?: boolean;
};

type UserMenuItem = {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
};

export type Branding = {
  logoUrl?: string;
  logoAlt?: string;
  title?: string;
  subtitle?: string;
  href?: string;
};

export type LoginButton = {
  label?: string;
  href?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  onClick?: () => void;
};

export type SearchConfig = {
  enabled?: boolean;
  placeholder?: string;
  onSearch?: (value: string) => void;
};

export type NotificationItem = {
  title: string;
  description: string;
  date: string;
  read: boolean;
  image?: string;
};

export type NotificationsConfig = {
  enabled?: boolean;
  items?: NotificationItem[];
  onNotificationClick?: (notification: NotificationItem, index: number) => void;
};

export type NavbarConfig = {
  height?: string;
  items?: MenuItemInput[];
  search?: SearchConfig;
  notifications?: NotificationsConfig;
  showThemeToggle?: boolean;
  showUserMenu?: boolean;
  showSidebarTrigger?: boolean;
  branding?: Branding;
  userMenuItems?: UserMenuItemInput[];
  loginButton?: LoginButton;
  // Removed fullWidth option
  blendWithBody?: boolean;
  // New scroll behavior options
  scrollBehavior?: "sticky" | "hide-on-scroll" | "static";
  showOnScrollUp?: boolean;
};

export type SidebarConfig = {
  width?: string;
  placement?: "left" | "right";
  groups?: MenuGroupInput[];
  showThemeToggle?: boolean;
  showUserMenu?: boolean;
  branding?: Branding;
  hideBranding?: boolean;
  userMenuItems?: UserMenuItemInput[];
  loginButton?: LoginButton;
  scrollable?: boolean;
  fixed?: boolean;
  fullHeight?: boolean;
  blendWithBody?: boolean;
};

export type ContentConfig = {
  maxWidth?: string;
  padding?: string;
};

// Input types (with string icons)
export type MenuItemInput = {
  label: string;
  href: string;
  icon?: string;
  disabled?: boolean;
  items?: MenuItemInput[];
};

export type MenuGroupInput = {
  label?: string;
  items: MenuItemInput[];
  collapsible?: boolean;
};

export type UserMenuItemInput = {
  label: string;
  href?: string;
  icon?: string;
  onClick?: () => void;
};

export type LayoutConfig = {
  showNavbar?: boolean;
  showSidebar?: boolean;
  user?: User;
  navbar?: NavbarConfig;
  sidebar?: SidebarConfig;
  content?: ContentConfig;
  sidebarDefaultOpen?: boolean;
};

export type DefaultLayoutProps = {
  children: React.ReactNode;
  config: LayoutConfig;
};

// ============================================================================
// UTILITIES
// ============================================================================

const getIcon = (name: string): React.ComponentType<{ className?: string }> => {
  return (LucideIcons as any)[name] ?? (LucideIcons as any)["Circle"];
};

const mapMenuItems = (items?: MenuItemInput[]): MenuItem[] | undefined => {
  return items?.map((item) => ({
    ...item,
    icon: item.icon ? getIcon(item.icon) : undefined,
    items: item.items ? mapMenuItems(item.items) : undefined,
  }));
};

const mapUserMenuItems = (items?: UserMenuItemInput[]): UserMenuItem[] | undefined => {
  return items?.map((item) => ({
    ...item,
    icon: item.icon ? getIcon(item.icon) : undefined,
  }));
};

const mapSidebarGroups = (groups?: MenuGroupInput[]): MenuGroup[] | undefined => {
  return groups?.map((group) => ({
    ...group,
    items: mapMenuItems(group.items) || [],
  }));
};

// ============================================================================
// DEFAULTS
// ============================================================================

const DEFAULT_SIDEBAR_WIDTH = "250px";
const DEFAULT_NAVBAR_HEIGHT = "calc(var(--spacing, 14))";

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function DefaultLayout({ children, config }: DefaultLayoutProps) {
  const {
    showNavbar = true,
    showSidebar = true,
    user,
    navbar = {},
    sidebar = {},
    content = {},
    sidebarDefaultOpen = true,
  } = config;

  // Layout mode calculations
  const sidebarFullHeight = sidebar.fullHeight ?? false;

  // Scroll behavior logic
  const [navbarVisible, setNavbarVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (navbar.scrollBehavior !== "hide-on-scroll") {
      setNavbarVisible(true);
      return;
    }

    // Determine the scroll container based on layout variant
    const scrollContainer = sidebarFullHeight ? scrollContainerRef.current : window;

    if (!scrollContainer) return;

    const handleScroll = () => {
      const currentScrollY =
        scrollContainer === window ? window.scrollY : (scrollContainer as HTMLDivElement).scrollTop;

      // Show if scrolling up or at top, hide if scrolling down
      if (currentScrollY < lastScrollY.current || currentScrollY < 50) {
        if (navbar.showOnScrollUp !== false) {
          setNavbarVisible(true);
        }
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setNavbarVisible(false);
      }
      lastScrollY.current = currentScrollY;
    };

    if (scrollContainer === window) {
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [navbar.scrollBehavior, navbar.showOnScrollUp, sidebarFullHeight]);

  // Prepare navbar props
  const navbarProps: AppNavbarProps = {
    placement: "top",
    sticky: navbar.scrollBehavior === "sticky" || navbar.scrollBehavior === "hide-on-scroll",
    branding: navbar.branding,
    items: mapMenuItems(navbar.items),
    search: navbar.search,
    notifications: navbar.notifications,
    showThemeToggle: navbar.showThemeToggle ?? false,
    showSidebarTrigger: showSidebar && !sidebarFullHeight && (navbar.showSidebarTrigger ?? true),
    showUserMenu: navbar.showUserMenu ?? false,
    user: user,
    userMenuItems: mapUserMenuItems(navbar.userMenuItems),
    loginButton: navbar.loginButton,
    style: {
      ...(navbar.height ? { height: navbar.height } : {}),
      ...(navbar.scrollBehavior === "hide-on-scroll"
        ? {
            transform: navbarVisible ? "translateY(0)" : "translateY(-100%)",
            transition: "transform 0.3s ease-in-out",
          }
        : {}),
    },
    className: navbar.blendWithBody ? "border-0 bg-transparent" : undefined,
  };

  // Prepare sidebar props - convert User to match sidebar's optional fields
  const sidebarUser = user
    ? {
        name: user.name,
        email: user.email,
        image: user.image,
        username: user.username,
        roles: user.roles,
      }
    : undefined;

  const sidebarProps: AppSidebarProps = {
    side: sidebar.placement ?? "left",
    fixed: sidebar.fixed ?? true,
    scrollable: sidebar.scrollable ?? true,
    groups: mapSidebarGroups(sidebar.groups),
    showThemeToggle: sidebar.showThemeToggle ?? false,
    showUserMenu: sidebar.showUserMenu ?? false,
    user: sidebarUser,
    userMenuItems: mapUserMenuItems(sidebar.userMenuItems),
    branding: sidebar.branding,
    hideBranding: sidebar.hideBranding ?? false,
    loginButton: sidebar.loginButton,
    className: sidebar.blendWithBody ? "border-0 bg-transparent" : undefined,
  };

  // Sidebar provider styles
  const sidebarProviderStyle: React.CSSProperties = {
    "--sidebar-width": sidebar.width || DEFAULT_SIDEBAR_WIDTH,
  } as React.CSSProperties;

  // Content styles
  const contentStyle: React.CSSProperties = {
    padding: content.padding,
    maxWidth: content.maxWidth,
  };

  const containerStyle: React.CSSProperties = {
    "--header-height": navbar.height || DEFAULT_NAVBAR_HEIGHT,
  } as React.CSSProperties;

  // ============================================================================
  // LAYOUT VARIANTS
  // ============================================================================

  // Variant 1: Full-height sidebar (sidebar spans entire viewport, navbar is indented)
  if (sidebarFullHeight && showSidebar) {
    return (
      <div style={containerStyle} className="flex h-screen">
        <SidebarProvider defaultOpen={sidebarDefaultOpen} style={sidebarProviderStyle}>
          <AppSidebar {...sidebarProps} className={`h-screen ${sidebarProps.className || ""}`} />

          <div className="flex flex-col flex-1 overflow-hidden">
            {showNavbar && <AppNavbar {...navbarProps} />}

            <SidebarInset ref={scrollContainerRef} className="flex-1 overflow-auto">
              <div className="p-4 mx-auto w-full" style={contentStyle}>
                {children}
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    );
  }

  // Variant 3: Default (navbar and sidebar share space)
  return (
    <div style={containerStyle}>
      <SidebarProvider
        defaultOpen={sidebarDefaultOpen}
        className="flex flex-col"
        style={sidebarProviderStyle}
      >
        {showNavbar && <AppNavbar {...navbarProps} />}

        <div className="flex flex-1">
          {showSidebar && <AppSidebar {...sidebarProps} />}

          <SidebarInset>
            <div className="p-4 mx-auto w-full" style={contentStyle}>
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
