import { SidebarConfig } from "@/types/navigation";
import { defaultSidebarConfig } from "@/config/default-Sidebar";

export const blogLayoutConfig: SidebarConfig = {
  ...defaultSidebarConfig,
  variant: "sidebar",
  collapsible: "icon",
  header: undefined, // No header for blog layout
  branding: {
    ...defaultSidebarConfig.branding!,
    name: "My Blog",
  },
  style: {
    "--sidebar-width": "18rem",
    "--sidebar-width-mobile": "100%",
  } as React.CSSProperties,
};
