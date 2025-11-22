"use client";

import { Search } from "lucide-react";
import { Input } from "@/atoms/input";
import { SidebarTrigger } from "@/atoms/sidebar";
import { Separator } from "@/atoms/separator";
import { NavbarConfig } from "@/types/navigation";
import { defaultNavbarConfig } from "@/config/default-navigation";

import { Bell, LogOut, Moon, Settings, Sun, User } from "lucide-react";
import { Button } from "@/atoms/button";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/atoms/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/atoms/avatar";

interface AppNavbarProps {
  config?: Partial<NavbarConfig>;
  showSearch?: boolean;
  showSidebarTrigger?: boolean;
  showThemeToggle?: boolean;
  showUserMenu?: boolean;
  showNotifications?: boolean;
}

export function AppNavbar({
  config,
  showSearch = true,
  showSidebarTrigger = true,
  showThemeToggle = true,
  showUserMenu = true,
  showNotifications = true,
}: AppNavbarProps) {
  const { setTheme } = useTheme();
  const finalConfig: NavbarConfig = {
    items: config?.items || defaultNavbarConfig.items,
    searchPlaceholder: config?.searchPlaceholder || defaultNavbarConfig.searchPlaceholder,
    user: config?.user || defaultNavbarConfig.user,
    userMenuItems: config?.userMenuItems || defaultNavbarConfig.userMenuItems,
    notifications: config?.notifications || defaultNavbarConfig.notifications,
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background sticky top-0 z-50">
      {showSidebarTrigger && (
        <>
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </>
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

        {showThemeToggle && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {showUserMenu && finalConfig.user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={finalConfig.user.avatar} alt={finalConfig.user.name} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{finalConfig.user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {finalConfig.user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {finalConfig.userMenuItems?.map((item, index) => (
                <DropdownMenuItem key={index} asChild>
                  <a href={item.href || "#"} onClick={item.onClick}>
                    {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                    <span>{item.label}</span>
                  </a>
                </DropdownMenuItem>
              ))}
              {!finalConfig.userMenuItems && (
                <>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
