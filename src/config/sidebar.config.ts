import { SidebarConfig } from "@/types/navigation";

export const defaultSidebarStyles: Partial<SidebarConfig> = {
  variant: "sidebar",
  collapsible: "icon",
  style: {
    "--sidebar-width": "16rem",
    "--sidebar-width-mobile": "18rem",
  } as React.CSSProperties,
} as const;
