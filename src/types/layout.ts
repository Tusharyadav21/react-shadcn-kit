export type SidebarLayoutConfig = {
  visible?: boolean; // Should sidebar be shown, default true
  placement?: "left" | "right"; // Where sidebar appears, default "left"
  color?: string; // Background color of sidebar, default "#fff"
  transparent?: boolean; // Should sidebar background be transparent, default false
  hasBranding?: boolean; // Show branding/logo area in sidebar, default true
  width?: string; // Width CSS value, default "250px"
};

export type NavbarLayoutConfig = {
  visible?: boolean; // Show navbar, default true
  height?: string; // Navbar height, default "60px"
  color?: string; // Navbar background color, default "#f8f8f8"
  transparent?: boolean; // Should navbar background be transparent, default false
  showBranding?: boolean; // Show branding/logo in navbar, default true
  position?: "top" | "bottom"; // Navbar position, default "top"
  shadow?: boolean; // Show shadow under navbar, default true
};

export type LayoutConfig = {
  sidebar?: SidebarLayoutConfig;
  navbar?: NavbarLayoutConfig;
};
