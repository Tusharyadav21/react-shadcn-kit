"use client";

import { ChevronDown, LogOut } from "lucide-react";
import { SidebarThemeToggle } from "../molecules/sidebar-theme-toggle";
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
import type {
  UserConfig,
  BrandingConfig,
  SidebarGroup as SidebarGroupType,
  MenuItem,
} from "@/default-layout";

interface SidebarLabels {
  logout?: string;
}

interface UserMenuItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  groups?: (SidebarGroupType & {
    items: (MenuItem & {
      icon?: React.ComponentType<{ className?: string }>;
      items?: MenuItem[];
    })[];
  })[];
  header?: React.ReactNode;
  footer?: React.ReactNode;
  user?: UserConfig;
  userMenuItems?: UserMenuItem[];
  branding?: BrandingConfig;
  labels?: SidebarLabels;
  fixed?: boolean;
  hideBranding?: boolean;
  showThemeToggle?: boolean;
  scrollable?: boolean;
}

export function AppSidebar({
  groups = [],
  header,
  footer,
  user,
  userMenuItems,
  branding,
  labels,
  fixed,
  hideBranding = false,
  showThemeToggle = true,
  className,
  style,
  side = "left",
  variant,
  collapsible,
  scrollable = false,
  ...props
}: AppSidebarProps) {
  const finalBranding = hideBranding ? undefined : branding;

  return (
    <Sidebar
      side={side}
      variant={variant}
      collapsible={collapsible}
      className={cn(!fixed ? "absolute h-full" : undefined, className)}
      style={style}
      {...props}
    >
      {header && <SidebarHeader>{header}</SidebarHeader>}

      {finalBranding && !header && (
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <a href="#">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    {finalBranding.logoUrl && (
                      <img
                        src={finalBranding.logoUrl}
                        alt={finalBranding.logoAlt || "Logo"}
                        className="size-4"
                      />
                    )}
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    {finalBranding.title && (
                      <span className="truncate font-semibold">{finalBranding.title}</span>
                    )}
                    {finalBranding.subtitle && (
                      <span className="truncate text-xs">{finalBranding.subtitle}</span>
                    )}
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
      )}

      <SidebarContent>
        {groups?.map((group, index) => (
          <SidebarGroup key={group.label || index}>
            {group.label &&
              (group.collapsible ? (
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
                        {group.items?.map((item) => {
                          const ItemIcon = item.icon;
                          return (
                            <SidebarMenuItem key={item.href}>
                              <SidebarMenuButton asChild>
                                <a href={item.href}>
                                  {ItemIcon && <ItemIcon />}
                                  <span>{item.label}</span>
                                </a>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          );
                        })}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              ))}
            {!group.collapsible && (
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items?.map((item) => {
                    const ItemIcon = item.icon;
                    const hasSubItems =
                      "items" in item && Array.isArray(item.items) && item.items.length > 0;
                    return (
                      <SidebarMenuItem key={item.href}>
                        {hasSubItems ? (
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
                                {("items" in item && Array.isArray(item.items)
                                  ? item.items
                                  : []
                                ).map((subItem: MenuItem) => (
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
                        ) : (
                          <SidebarMenuButton asChild>
                            <a href={item.href}>
                              {ItemIcon && <ItemIcon />}
                              <span>{item.label}</span>
                            </a>
                          </SidebarMenuButton>
                        )}
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        {showThemeToggle && <SidebarThemeToggle />}
        {user && (
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback className="rounded-lg">
                        {user.name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user.name}</span>
                      <span className="truncate text-xs">{user.email}</span>
                    </div>
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
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback className="rounded-lg">
                          {user.name?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{user.name}</span>
                        <span className="truncate text-xs">{user.email}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {userMenuItems?.map((item, index) => {
                    const MenuIcon = item.icon;
                    return (
                      <DropdownMenuItem key={index} asChild>
                        <a href={item.href || "#"} onClick={item.onClick}>
                          {MenuIcon && <MenuIcon className="mr-2 h-4 w-4" />}
                          <span>{item.label}</span>
                        </a>
                      </DropdownMenuItem>
                    );
                  })}
                  {!userMenuItems && (
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{labels?.logout || "Log out"}</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
        {footer}
      </SidebarFooter>
    </Sidebar>
  );
}
