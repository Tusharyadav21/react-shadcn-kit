import { LayoutConfig } from "@/types/layout";

export const defaultLayoutConfig: LayoutConfig = {
  sidebar: {
    visible: true,
    placement: "left",
    color: "#fff",
    transparent: false,
    hasBranding: true,
    width: "250px",
  },
  navbar: {
    visible: true,
    height: "60px",
    transparent: false,
    showBranding: true,
    position: "top",
    shadow: true,
  },
} as const satisfies LayoutConfig;
