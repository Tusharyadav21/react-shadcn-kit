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

type Placement = "top" | "bottom";

type NavItem = {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
};

type User = {
  name: string;
  email: string;
  image?: string;
};

type UserMenuItem = {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
};

type Notification = {
  title: string;
  description: string;
  date: string;
  read: boolean;
};

type Branding = {
  logoUrl?: string;
  logoAlt?: string;
  title?: string;
  href?: string;
};

type LoginButton = {
  label?: string;
  href?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  onClick?: () => void;
};

type SearchConfig = {
  enabled?: boolean;
  placeholder?: string;
  onSearch?: (value: string) => void;
};

type NotificationsConfig = {
  enabled?: boolean;
  items?: Notification[];
  onNotificationClick?: (notification: Notification, index: number) => void;
};

type Labels = {
  notifications?: string;
  noNotifications?: string;
};

export type AppNavbarProps = {
  // Layout
  placement?: Placement;
  sticky?: boolean;
  className?: string;
  style?: React.CSSProperties;

  // Branding
  branding?: Branding;

  // Navigation
  items?: NavItem[];

  // Features
  search?: SearchConfig;
  notifications?: NotificationsConfig;
  showThemeToggle?: boolean;
  showSidebarTrigger?: boolean;

  // User
  user?: User;
  userMenuItems?: UserMenuItem[];
  loginButton?: LoginButton;
  showUserMenu?: boolean;

  // Customization
  labels?: Labels;
};

function NavbarBranding({ branding }: { branding: Branding }) {
  const Wrapper = branding.href ? "a" : "div";
  const wrapperProps = branding.href ? { href: branding.href } : {};

  return (
    <Wrapper {...wrapperProps} className="flex items-center gap-2 mr-4">
      {branding.logoUrl && (
        <img src={branding.logoUrl} alt={branding.logoAlt || "Logo"} className="h-6 w-6" />
      )}
      {branding.title && <span className="font-semibold">{branding.title}</span>}
    </Wrapper>
  );
}

function NavbarItems({ items }: { items: NavItem[] }) {
  return (
    <nav className="flex items-center gap-6 text-sm font-medium overflow-x-auto scrollbar-hide max-w-full">
      {items.map((item, index) => {
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
  );
}

function NavbarSearch({ config }: { config: SearchConfig }) {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={config.placeholder || "Search..."}
        className="pl-8 w-[200px] lg:w-[300px]"
        onChange={(e) => config.onSearch?.(e.target.value)}
      />
    </div>
  );
}

function NavbarNotifications({ config, labels }: { config: NotificationsConfig; labels?: Labels }) {
  const notifications = config.items || [];
  const hasUnread = notifications.some((n) => !n.read);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {hasUnread && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-600" />}
          <span className="sr-only">{labels?.notifications || "Notifications"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>{labels?.notifications || "Notifications"}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <DropdownMenuItem
              key={index}
              className="flex flex-col items-start gap-1 p-3 cursor-pointer"
              onClick={() => config.onNotificationClick?.(notification, index)}
            >
              <div className="flex w-full items-center justify-between">
                <span className="font-medium">{notification.title}</span>
                <span className="text-xs text-muted-foreground">{notification.date}</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {notification.description}
              </p>
            </DropdownMenuItem>
          ))
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">
            {labels?.noNotifications || "No new notifications"}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NavbarUserSection({
  user,
  userMenuItems,
  loginButton,
  showUserMenu,
}: {
  user?: User;
  userMenuItems?: UserMenuItem[];
  loginButton?: LoginButton;
  showUserMenu?: boolean;
}) {
  if (!showUserMenu) return null;

  if (user?.name && user?.email) {
    return (
      <UserMenu
        user={{ name: user.name, email: user.email, avatar: user.image }}
        items={userMenuItems}
      />
    );
  }

  if (loginButton) {
    return (
      <Button
        variant={loginButton.variant || "default"}
        onClick={loginButton.onClick}
        asChild={!!loginButton.href}
      >
        {loginButton.href ? (
          <a href={loginButton.href}>{loginButton.label || "Login"}</a>
        ) : (
          loginButton.label || "Login"
        )}
      </Button>
    );
  }

  return null;
}

export function AppNavbar({
  placement = "top",
  sticky = true,
  className,
  style,
  branding,
  items,
  search,
  notifications,
  showThemeToggle = false,
  showSidebarTrigger = false,
  user,
  userMenuItems,
  loginButton,
  labels,
  showUserMenu = false,
}: AppNavbarProps) {
  const baseClasses = "flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background";
  const positionClasses = sticky
    ? placement === "top"
      ? "sticky top-0 z-50"
      : "sticky bottom-0 z-50"
    : "";
  const combinedClasses = `${baseClasses} ${positionClasses} ${className || ""}`.trim();

  return (
    <header className={combinedClasses} style={style}>
      {/* Left Section */}
      {showSidebarTrigger && (
        <>
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </>
      )}

      {branding && <NavbarBranding branding={branding} />}

      {items && items.length > 0 && <NavbarItems items={items} />}

      {/* Right Section */}
      <div className="ml-auto flex items-center gap-2">
        {search?.enabled && <NavbarSearch config={search} />}

        {showThemeToggle && <ThemeToggle />}

        {notifications?.enabled && <NavbarNotifications config={notifications} labels={labels} />}

        <NavbarUserSection
          user={user}
          userMenuItems={userMenuItems}
          loginButton={loginButton}
          showUserMenu={showUserMenu}
        />
      </div>
    </header>
  );
}
