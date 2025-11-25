"use client";

import { ChevronDown, LogOut } from "lucide-react";
import { SidebarThemeToggle } from "../molecules/sidebar-theme-toggle";
import { Button } from "@/atoms/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/atoms/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/atoms/collapsible";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/atoms/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/atoms/dropdown-menu";

type SidebarPlacement = "left" | "right";

type MenuItem = {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  items?: MenuItem[]; // Sub-items for nested navigation
};

type MenuGroup = {
  label?: string;
  items: MenuItem[];
  collapsible?: boolean;
};

type User = {
  name?: string;
  email?: string;
  image?: string;
  username?: string;
  roles?: string[];
};

type UserMenuItem = {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
};

type Branding = {
  logoUrl?: string;
  logoAlt?: string;
  title?: string;
  subtitle?: string;
};

type LoginButton = {
  label?: string;
  href?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  onClick?: () => void;
};

type Labels = {
  logout?: string;
};

export type AppSidebarProps = {
  // Layout
  side?: SidebarPlacement;
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
  fixed?: boolean;
  className?: string;
  style?: React.CSSProperties;

  // Branding
  branding?: Branding;
  hideBranding?: boolean;

  // Navigation
  groups?: MenuGroup[];

  // User
  user?: User;
  userMenuItems?: UserMenuItem[];
  showUserMenu?: boolean;
  loginButton?: LoginButton;

  // Features
  showThemeToggle?: boolean;
  scrollable?: boolean;

  header?: React.ReactNode;
  footer?: React.ReactNode;

  labels?: Labels;
};

function SidebarBrandingHeader({ branding }: { branding: Branding }) {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" asChild>
            <a href="#">
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                {branding.logoUrl && (
                  <img src={branding.logoUrl} alt={branding.logoAlt || "Logo"} className="size-4" />
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                {branding.title && <span className="truncate font-semibold">{branding.title}</span>}
                {branding.subtitle && <span className="truncate text-xs">{branding.subtitle}</span>}
              </div>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}

function SidebarNavigationItem({ item }: { item: MenuItem }) {
  const ItemIcon = item.icon;
  const hasSubItems = item.items && item.items.length > 0;

  if (hasSubItems) {
    return (
      <Collapsible className="group/collapsible">
        <SidebarMenuButton asChild>
          <CollapsibleTrigger>
            {ItemIcon && <ItemIcon />}
            <span>{item.label}</span>
            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </CollapsibleTrigger>
        </SidebarMenuButton>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items!.map((subItem) => (
              <SidebarMenuSubItem key={subItem.href}>
                <SidebarMenuSubButton asChild>
                  <a href={subItem.href}>
                    <span>{subItem.label}</span>
                  </a>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuButton asChild>
      <a href={item.href}>
        {ItemIcon && <ItemIcon />}
        <span>{item.label}</span>
      </a>
    </SidebarMenuButton>
  );
}

function SidebarNavigationGroup({ group }: { group: MenuGroup }) {
  if (group.collapsible && group.label) {
    return (
      <Collapsible defaultOpen className="group/collapsible">
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger>
            {group.label}
            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarNavigationItem item={item} />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <>
      {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {group.items.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarNavigationItem item={item} />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </>
  );
}

function SidebarUserProfile({ user }: { user: User }) {
  const initials = user.name?.[0] || "U";

  return (
    <>
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage src={user.image} alt={user.name} />
        <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">{user.name}</span>
        <span className="truncate text-xs">{user.email}</span>
      </div>
    </>
  );
}

function SidebarUserMenu({
  user,
  userMenuItems,
  labels,
}: {
  user: User;
  userMenuItems?: UserMenuItem[];
  labels?: Labels;
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <SidebarUserProfile user={user} />
              <ChevronDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side="bottom"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <SidebarUserProfile user={user} />
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {userMenuItems && userMenuItems.length > 0 ? (
              userMenuItems.map((item, index) => {
                const MenuIcon = item.icon;
                return (
                  <DropdownMenuItem key={index} asChild>
                    <a href={item.href || "#"} onClick={item.onClick}>
                      {MenuIcon && <MenuIcon className="mr-2 h-4 w-4" />}
                      <span>{item.label}</span>
                    </a>
                  </DropdownMenuItem>
                );
              })
            ) : (
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{labels?.logout || "Log out"}</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function SidebarLoginButton({ loginButton }: { loginButton: LoginButton }) {
  return (
    <div className="p-2">
      <Button
        variant={loginButton.variant || "default"}
        onClick={loginButton.onClick}
        asChild={!!loginButton.href}
        className="w-full justify-start"
      >
        {loginButton.href ? (
          <a href={loginButton.href}>{loginButton.label || "Login"}</a>
        ) : (
          loginButton.label || "Login"
        )}
      </Button>
    </div>
  );
}

export function AppSidebar({
  side = "left",
  variant,
  collapsible,
  fixed = false,
  className,
  style,
  branding,
  hideBranding = false,
  groups = [],
  user,
  userMenuItems,
  showUserMenu = false,
  loginButton,
  showThemeToggle = false,
  scrollable = false,
  header,
  footer,
  labels,
  ...props
}: AppSidebarProps) {
  const showBranding = !hideBranding && branding && !header;
  const showUser = showUserMenu && user;
  const showLogin = showUserMenu && !user && loginButton;

  return (
    <Sidebar
      side={side}
      variant={variant}
      collapsible={collapsible}
      className={cn(className)}
      style={style}
      scrollable={scrollable}
      {...props}
    >
      {/* Header */}
      {header && <SidebarHeader>{header}</SidebarHeader>}
      {showBranding && <SidebarBrandingHeader branding={branding!} />}

      {/* Navigation */}
      <SidebarContent className={cn(className)}>
        {groups.map((group, index) => (
          <SidebarGroup key={group.label || index}>
            <SidebarNavigationGroup group={group} />
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        {showThemeToggle && <SidebarThemeToggle />}
        {showUser && <SidebarUserMenu user={user!} userMenuItems={userMenuItems} labels={labels} />}
        {showLogin && <SidebarLoginButton loginButton={loginButton!} />}
        {footer}
      </SidebarFooter>
    </Sidebar>
  );
}
