# React Shadcn Kit Component Library

A comprehensive, atomic design-based component library built with React, TypeScript, Tailwind CSS v4, and shadcn/ui.

## Features

- **Atomic Design Structure**: Components organized into atoms, molecules, and organisms.
- **Configurable Navigation**: `AppSidebar` and `AppNavbar` driven by JSON configuration.
- **Responsive Layout**: Built-in `Layout` component handling mobile and desktop views.
- **Theming**: Integrated dark mode support.
- **TypeScript Support**: Fully typed components and configurations.

## Installation

```bash
npm install react-shadcn-kit
# or
yarn add react-shadcn-kit
```

## Usage

### Basic Layout

Wrap your application with the `Layout` component to get the sidebar and navbar structure automatically.

```tsx
import { Layout } from "react-shadcn-kit";

export default function App() {
  return (
    <Layout>
      <div className="p-4">
        <h1>My App Content</h1>
      </div>
    </Layout>
  );
}
```

### Configuration

The navigation components are highly configurable. You can pass a `config` prop to `AppSidebar` and `AppNavbar` (via `Layout` props if exposed, or by using them directly).

#### Sidebar Configuration (`SidebarConfig`)

```tsx
import { AppSidebar } from "react-shadcn-kit";
import { LayoutDashboard, Settings } from "lucide-react";

const sidebarConfig = {
  branding: {
    name: "My App",
    logo: LayoutDashboard,
    href: "/",
  },
  fixed: true, // Set to false to make sidebar scroll with page
  groups: [
    {
      label: "Platform",
      items: [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "Settings", href: "/settings", icon: Settings },
      ],
    },
  ],
  user: {
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://github.com/shadcn.png",
  },
  userMenuItems: [
    { label: "Profile", href: "/profile" },
    { label: "Log out", onClick: () => console.log("Logout") },
  ],
};

<AppSidebar config={sidebarConfig} />;
```

#### Navbar Configuration (`NavbarConfig`)

```tsx
import { AppNavbar } from "react-shadcn-kit";

const navbarConfig = {
  items: [
    { label: "Overview", href: "/overview" },
    { label: "Docs", href: "/docs" },
  ],
  searchPlaceholder: "Search docs...",
  userMenuItems: [
    { label: "Profile", href: "/profile" },
    { label: "Settings", href: "/settings" },
  ],
};

<AppNavbar config={navbarConfig} />;
```

## Development

To run the local development application:

```bash
npm run dev
```

To build the library:

```bash
npm run build
```
