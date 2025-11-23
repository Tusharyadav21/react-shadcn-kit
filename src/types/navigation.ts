import { LucideIcon } from "lucide-react";

export type NavItem = {
  label: string;
  icon?: LucideIcon;
  href: string;
  isActive?: boolean;
  items?: NavItem[];
};

export type NavGroup = {
  label?: string;
  items: NavItem[];
  collapsible?: boolean;
};

export type User = {
  name: string;
  email: string;
  avatar?: string;
};

export type BrandingConfig = {
  name: string;
  logo?: LucideIcon;
  href?: string;
};

export type UserMenuItem = {
  label: string;
  icon?: LucideIcon;
  href?: string;
  onClick?: () => void;
};

export type SidebarConfig = {
  groups: NavGroup[];
  header?: React.ReactNode;
  footer?: React.ReactNode;
  user?: User;
  userMenuItems?: UserMenuItem[];
  branding?: BrandingConfig;
  fixed?: boolean;
  style?: React.CSSProperties;
  className?: string;
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
  scrollable?: boolean;
};

export type Notification = {
  title: string;
  description: string;
  date: string;
  read?: boolean;
  href?: string;
};

export type NavbarConfig = {
  items: NavItem[];
  searchPlaceholder?: string;
  user?: User;
  userMenuItems?: UserMenuItem[];
  notifications?: Notification[];
  branding?: BrandingConfig;
};
