import * as React from "react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "../primitives/sidebar";

export interface SidebarWrapperProps extends React.ComponentPropsWithoutRef<typeof Sidebar> {
  /**
   * Optional custom trigger component. If not provided, a default trigger button is rendered.
   */
  trigger?: React.ReactNode;
  /**
   * Children rendered inside the SidebarContent area.
   */
  children: React.ReactNode;
}

/**
 * SidebarWrapper
 *
 * A composable wrapper around the shadcn/ui `Sidebar` components tailored for the
 * `mcomposites` package. It provides a ready‑to‑use layout consisting of a
 * `SidebarProvider`, a `Sidebar` with optional custom trigger, and a content
 * area. The wrapper can be dropped into any page to instantly gain a fully
 * functional, accessible sidebar.
 *
 * Example usage:
 * ```tsx
 * <SidebarWrapper trigger={<MyTrigger />}>...</SidebarWrapper>
 * ```
 */
export function SidebarWrapper({
  trigger,
  children,
  className,
  ...sidebarProps
}: SidebarWrapperProps) {
  return (
    <SidebarProvider>
      <Sidebar className={className} {...sidebarProps}>
        {/* Header can be customized by the consumer via children or by extending this component */}
        <SidebarHeader />
        <SidebarContent>{children}</SidebarContent>
        {/* Optional trigger – falls back to the default button when omitted */}
        {trigger ?? <SidebarTrigger />}
      </Sidebar>
      {/* Inset provides the main content area next to the sidebar */}
      <SidebarInset />
    </SidebarProvider>
  );
}
