"use client";

import { Search, Bell } from "lucide-react";
import { Input } from "@/atoms/input";
import { Button } from "@/atoms/button";
import { SidebarTrigger } from "@/atoms/sidebar";
import { Separator } from "@/atoms/separator";
import { ThemeToggle } from "@/molecules/theme-toggle";
import { UserMenu } from "@/molecules/user-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/atoms/dropdown-menu";
import type { UserConfig, BrandingConfig, MenuItem, NotificationsList } from "@/default-layout";

interface NavbarLabels {
  profile?: string;
  notifications?: string;
  noNotifications?: string;
}

interface UserMenuItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
}

interface AppNavbarProps {
  items?: (MenuItem & { icon?: React.ComponentType<{ className?: string }> })[];
  searchPlaceholder?: string;
  user?: UserConfig;
  userMenuItems?: UserMenuItem[];
  notifications?: NotificationsList[];
  branding?: BrandingConfig;
  labels?: NavbarLabels;
  showSearch?: boolean;
  showSidebarTrigger?: boolean;
  showUserMenu?: boolean;
  showThemeToggle?: boolean;
  showNotifications?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function AppNavbar({
  items = [],
  searchPlaceholder = "Search...",
  user,
  userMenuItems,
  notifications = [],
  branding,
  labels,
  showSearch = true,
  showSidebarTrigger = true,
  showUserMenu = true,
  showThemeToggle = true,
  showNotifications = true,
  className,
  style,
}: AppNavbarProps) {
  return (
    <header
      className={
        "flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background sticky top-0 z-50" +
        (className ? ` ${className}` : "")
      }
      style={style}
    >
      {showSidebarTrigger && (
        <>
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </>
      )}

      {branding && (
        <a href="#" className="flex items-center gap-2 mr-4">
          {branding.logoUrl && (
            <img src={branding.logoUrl} alt={branding.logoAlt || "Logo"} className="h-6 w-6" />
          )}
          {branding.title && <span className="font-semibold">{branding.title}</span>}
        </a>
      )}

      <nav className="flex items-center gap-6 text-sm font-medium">
        {items?.map((item, index) => {
          const Icon = item.icon;
          return (
            <a
              key={index}
              href={item.href}
              className={`transition-colors hover:text-foreground/80 ${
                item.disabled ? "pointer-events-none opacity-50" : "text-foreground/60"
              }`}
            >
              {Icon && <Icon className="inline-block mr-1 h-4 w-4" />}
              {item.label}
            </a>
          );
        })}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        {showSearch && (
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder={searchPlaceholder} className="pl-8 w-[200px] lg:w-[300px]" />
          </div>
        )}

        {showThemeToggle && <ThemeToggle />}
        {showUserMenu && user && user.name && user.email && (
          <UserMenu
            user={{ name: user.name, email: user.email, avatar: user.image }}
            items={userMenuItems}
          />
        )}

        {showNotifications && notifications && notifications.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications.some((n) => !n.read) && (
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-600" />
                )}
                <span className="sr-only">{labels?.notifications || "Notifications"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>{labels?.notifications || "Notifications"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((notification, index) => (
                <DropdownMenuItem
                  key={index}
                  className="flex flex-col items-start gap-1 p-3 cursor-pointer"
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="font-medium">{notification.title}</span>
                    <span className="text-xs text-muted-foreground">{notification.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {notification.description}
                  </p>
                </DropdownMenuItem>
              ))}
              {notifications.length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  {labels?.noNotifications || "No new notifications"}
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
