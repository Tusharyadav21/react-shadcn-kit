"use client";

import { Search } from "lucide-react";
import { Input } from "@/atoms/input";
import { SidebarTrigger } from "@/atoms/sidebar";
import { Separator } from "@/atoms/separator";
import { NavbarConfig } from "@/types/navigation";
import { defaultNavbarConfig } from "@/config/default-navigation";

import { Bell } from "lucide-react";
import { Button } from "@/atoms/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/atoms/dropdown-menu";
import { ThemeToggle } from "@/molecules/theme-toggle";
import { UserMenu } from "@/molecules/user-menu";

interface AppNavbarProps {
  config?: Partial<NavbarConfig>;
  showSearch?: boolean;
  showSidebarTrigger?: boolean;
  showUserMenu?: boolean;
  showThemeToggle?: boolean;
  showNotifications?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function AppNavbar({
  config,
  showSearch = true,
  showSidebarTrigger = true,
  showUserMenu = true,
  showThemeToggle = true,
  showNotifications = true,
  className,
  style,
}: AppNavbarProps) {
  const finalConfig: NavbarConfig = {
    items: config?.items || defaultNavbarConfig.items,
    searchPlaceholder: config?.searchPlaceholder || defaultNavbarConfig.searchPlaceholder,
    user: config?.user || defaultNavbarConfig.user,
    userMenuItems: config?.userMenuItems || defaultNavbarConfig.userMenuItems,
    notifications: config?.notifications || defaultNavbarConfig.notifications,
    branding: config?.branding || defaultNavbarConfig.branding,
  };

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

      {finalConfig.branding && (
        <a href={finalConfig.branding.href || "#"} className="flex items-center gap-2 mr-4">
          {finalConfig.branding.logo && <finalConfig.branding.logo className="h-6 w-6" />}
          <span className="font-semibold">{finalConfig.branding.name}</span>
        </a>
      )}

      <div className="ml-auto flex items-center gap-2">
        {showSearch && (
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={finalConfig.searchPlaceholder}
              className="pl-8 w-[200px] lg:w-[300px]"
            />
          </div>
        )}

        {showThemeToggle && <ThemeToggle />}
        {showUserMenu && finalConfig.user && (
          <UserMenu user={finalConfig.user} items={finalConfig.userMenuItems} />
        )}

        {showNotifications && finalConfig.notifications && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {finalConfig.notifications.some((n) => !n.read) && (
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-600" />
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {finalConfig.notifications.map((notification, index) => (
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
              {finalConfig.notifications.length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No new notifications
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
