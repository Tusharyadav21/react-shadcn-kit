"use client";

import { ChevronDown, LogOut } from "lucide-react";
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
import { SidebarConfig } from "@/types/navigation";
import { defaultSidebarConfig } from "@/config/default-navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/atoms/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/atoms/dropdown-menu";

interface AppSidebarProps {
  config?: Partial<SidebarConfig>;
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
}

export function AppSidebar({
  config,
  side = "left",
  variant = "sidebar",
  collapsible = "icon",
}: AppSidebarProps) {
  // Merge with defaults
  const finalConfig: SidebarConfig = {
    groups: config?.groups || defaultSidebarConfig.groups,
    header: config?.header || defaultSidebarConfig.header,
    footer: config?.footer || defaultSidebarConfig.footer,
    user: config?.user || defaultSidebarConfig.user,
    userMenuItems: config?.userMenuItems || defaultSidebarConfig.userMenuItems,
    branding: config?.branding || defaultSidebarConfig.branding,
    fixed: config?.fixed ?? defaultSidebarConfig.fixed,
  };

  return (
    <Sidebar
      side={side}
      variant={variant}
      collapsible={collapsible}
      className={!finalConfig.fixed ? "absolute h-full" : undefined}
    >
      {finalConfig.header && <SidebarHeader>{finalConfig.header}</SidebarHeader>}

      {finalConfig.branding && !finalConfig.header && (
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <a href={finalConfig.branding.href || "#"}>
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    {finalConfig.branding.logo && <finalConfig.branding.logo className="size-4" />}
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{finalConfig.branding.name}</span>
                    <span className="truncate text-xs">Enterprise</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
      )}

      <SidebarContent>
        {finalConfig.groups.map((group, index) => (
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
                        {group.items.map((item) => (
                          <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton asChild isActive={item.isActive}>
                              <a href={item.href}>
                                {item.icon && <item.icon />}
                                <span>{item.label}</span>
                              </a>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
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
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      {item.items && item.items.length > 0 ? (
                        <Collapsible className="group/collapsible">
                          <SidebarMenuButton asChild isActive={item.isActive}>
                            <CollapsibleTrigger>
                              {item.icon && <item.icon />}
                              <span>{item.label}</span>
                              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                            </CollapsibleTrigger>
                          </SidebarMenuButton>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.items.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.href}>
                                  <SidebarMenuSubButton asChild isActive={subItem.isActive}>
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
                        <SidebarMenuButton asChild isActive={item.isActive}>
                          <a href={item.href}>
                            {item.icon && <item.icon />}
                            <span>{item.label}</span>
                          </a>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        {finalConfig.user && (
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={finalConfig.user.avatar} alt={finalConfig.user.name} />
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{finalConfig.user.name}</span>
                      <span className="truncate text-xs">{finalConfig.user.email}</span>
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
                        <AvatarImage src={finalConfig.user.avatar} alt={finalConfig.user.name} />
                        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{finalConfig.user.name}</span>
                        <span className="truncate text-xs">{finalConfig.user.email}</span>
                      </div>
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
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
        {finalConfig.footer}
      </SidebarFooter>
    </Sidebar>
  );
}
