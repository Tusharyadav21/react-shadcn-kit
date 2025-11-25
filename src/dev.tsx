import { createRoot } from "react-dom/client";
import { useState, useCallback } from "react";
import { Button } from "./atoms/button";
import { Input } from "./atoms/input";
import { Label } from "./atoms/label";
import { Switch } from "./atoms/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./atoms/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./atoms/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./atoms/card";
import { Toaster } from "./atoms/sonner";
import { ThemeProvider } from "./atoms/theme-provider";
import DefaultLayout from "./default-layout";
import type { LayoutConfig } from "./default-layout";
import { toast } from "sonner";

import "./global.css";

// ============================================================================
// REUSABLE CONFIG CONTROL COMPONENTS
// ============================================================================

type ConfigControlProps = {
  label: string;
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

function ConfigSwitch({ label, id, checked, onChange }: ConfigControlProps) {
  return (
    <div className="flex items-center justify-between">
      <Label htmlFor={id}>{label}</Label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

type ConfigInputProps = {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

function ConfigInput({ label, id, value, onChange, placeholder }: ConfigInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

type ConfigSelectProps = {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
};

function ConfigSelect({ label, id, value, onChange, options }: ConfigSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// ============================================================================
// MENU EDITOR COMPONENTS
// ============================================================================

type MenuItemEditorProps = {
  item: { label: string; href: string; icon?: string };
  onChange: (item: { label: string; href: string; icon?: string }) => void;
  onRemove: () => void;
};

function MenuItemEditor({ item, onChange, onRemove }: MenuItemEditorProps) {
  return (
    <div className="border rounded-lg p-3 space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <Input
          placeholder="Label"
          value={item.label}
          onChange={(e) => onChange({ ...item, label: e.target.value })}
        />
        <Input
          placeholder="Href"
          value={item.href}
          onChange={(e) => onChange({ ...item, href: e.target.value })}
        />
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Icon (e.g., Home, User)"
          value={item.icon || ""}
          onChange={(e) => onChange({ ...item, icon: e.target.value })}
          className="flex-1"
        />
        <Button variant="destructive" size="sm" onClick={onRemove}>
          Remove
        </Button>
      </div>
    </div>
  );
}

type MenuEditorProps = {
  items: { label: string; href: string; icon?: string }[];
  onChange: (items: { label: string; href: string; icon?: string }[]) => void;
  title: string;
};

function MenuEditor({ items, onChange, title }: MenuEditorProps) {
  const addItem = () => {
    onChange([...items, { label: "New Item", href: "#", icon: "Circle" }]);
  };

  const updateItem = (index: number, item: { label: string; href: string; icon?: string }) => {
    const newItems = [...items];
    newItems[index] = item;
    onChange(newItems);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">{title}</Label>
        <Button size="sm" onClick={addItem}>
          Add Item
        </Button>
      </div>
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {items.map((item, index) => (
          <MenuItemEditor
            key={index}
            item={item}
            onChange={(updated) => updateItem(index, updated)}
            onRemove={() => removeItem(index)}
          />
        ))}
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No items. Click "Add Item" to create one.
          </p>
        )}
      </div>
    </div>
  );
}

type SidebarGroupEditorProps = {
  groups: {
    label?: string;
    items: { label: string; href: string; icon?: string }[];
    collapsible?: boolean;
  }[];
  onChange: (
    groups: {
      label?: string;
      items: { label: string; href: string; icon?: string }[];
      collapsible?: boolean;
    }[],
  ) => void;
};

function SidebarGroupEditor({ groups, onChange }: SidebarGroupEditorProps) {
  const addGroup = () => {
    onChange([
      ...groups,
      {
        label: "New Group",
        collapsible: true,
        items: [{ label: "New Item", href: "#", icon: "Circle" }],
      },
    ]);
  };

  const updateGroup = (
    index: number,
    group: {
      label?: string;
      items: { label: string; href: string; icon?: string }[];
      collapsible?: boolean;
    },
  ) => {
    const newGroups = [...groups];
    newGroups[index] = group;
    onChange(newGroups);
  };

  const removeGroup = (index: number) => {
    onChange(groups.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Sidebar Groups</Label>
        <Button size="sm" onClick={addGroup}>
          Add Group
        </Button>
      </div>
      <div className="space-y-4 max-h-[500px] overflow-y-auto">
        {groups.map((group, groupIndex) => (
          <div key={groupIndex} className="border rounded-lg p-4 space-y-3">
            <div className="flex gap-2 items-start">
              <Input
                placeholder="Group Label"
                value={group.label || ""}
                onChange={(e) => updateGroup(groupIndex, { ...group, label: e.target.value })}
                className="flex-1"
              />
              <div className="flex items-center gap-2">
                <Label htmlFor={`group-collapsible-${groupIndex}`} className="text-sm">
                  Collapsible
                </Label>
                <Switch
                  id={`group-collapsible-${groupIndex}`}
                  checked={group.collapsible ?? true}
                  onCheckedChange={(checked) =>
                    updateGroup(groupIndex, { ...group, collapsible: checked })
                  }
                />
              </div>
              <Button variant="destructive" size="sm" onClick={() => removeGroup(groupIndex)}>
                Remove Group
              </Button>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Items</Label>
              {group.items.map((item, itemIndex) => (
                <MenuItemEditor
                  key={itemIndex}
                  item={item}
                  onChange={(updated) => {
                    const newItems = [...group.items];
                    newItems[itemIndex] = updated;
                    updateGroup(groupIndex, { ...group, items: newItems });
                  }}
                  onRemove={() => {
                    updateGroup(groupIndex, {
                      ...group,
                      items: group.items.filter((_, i) => i !== itemIndex),
                    });
                  }}
                />
              ))}
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  updateGroup(groupIndex, {
                    ...group,
                    items: [...group.items, { label: "New Item", href: "#", icon: "Circle" }],
                  });
                }}
                className="w-full"
              >
                Add Item to Group
              </Button>
            </div>
          </div>
        ))}
        {groups.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No groups. Click "Add Group" to create one.
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// INITIAL CONFIG
// ============================================================================

const INITIAL_CONFIG: LayoutConfig = {
  showNavbar: true,
  showSidebar: true,
  navbar: {
    height: "64px",
    showThemeToggle: true,
    showUserMenu: true,
    showSidebarTrigger: true,
    blendWithBody: false,
    scrollBehavior: "sticky",
    showOnScrollUp: true,
    branding: {
      title: "React Shadcn Kit",
      subtitle: "Component Library",
    },
    notifications: {
      enabled: true,
      items: [
        {
          title: "New Message",
          description: "You have a new message from Jane",
          date: "2 mins ago",
          read: false,
        },
        {
          title: "System Update",
          description: "System update completed successfully",
          date: "1 hour ago",
          read: true,
        },
      ],
      onNotificationClick: (item) => toast.info(`Clicked: ${item.title}`),
    },
    userMenuItems: [
      { label: "Profile", href: "/profile", icon: "User" },
      { label: "Settings", href: "/settings", icon: "Settings" },
      { label: "Sign out", href: "/logout", icon: "LogOut" },
    ],
    search: {
      enabled: true,
      placeholder: "Search...",
      onSearch: (value: string) => toast.info(`Searching: ${value}`),
    },
    items: [
      { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
      { label: "Profile", href: "/profile", icon: "User" },
      { label: "Settings", href: "/settings", icon: "Settings" },
    ],
  },
  sidebar: {
    width: "250px",
    placement: "left",
    showThemeToggle: true,
    showUserMenu: true,
    fullHeight: false,
    blendWithBody: false,
    branding: {
      title: "Navigation",
    },
    groups: [
      {
        label: "Main",
        collapsible: true,
        items: [
          { label: "Home", href: "/", icon: "Home" },
          { label: "Reports", href: "/reports", icon: "BarChart2" },
        ],
      },
      {
        label: "Management",
        collapsible: true,
        items: [
          { label: "Users", href: "/users", icon: "Users" },
          { label: "Roles", href: "/roles", icon: "Shield" },
        ],
      },
    ],
    userMenuItems: [
      { label: "Profile", href: "/profile", icon: "User" },
      { label: "Billing", href: "/billing", icon: "CreditCard" },
      { label: "Sign out", href: "/logout", icon: "LogOut" },
    ],
  },
  user: {
    name: "John Doe",
    email: "john.doe@example.com",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    username: "johndoe",
    roles: ["admin"],
  },
  content: {
    padding: "16px",
    maxWidth: undefined,
  },
  sidebarDefaultOpen: true,
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

function Demo() {
  const [config, setConfig] = useState<LayoutConfig>(INITIAL_CONFIG);

  // Generic config updater
  const updateConfig = useCallback((path: string, value: any) => {
    setConfig((prev) => {
      const newConfig = { ...prev };
      const keys = path.split(".");
      let current: any = newConfig;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return newConfig;
    });
  }, []);

  // Navbar feature toggles config
  const navbarToggles = [
    { label: "Show Theme Toggle", path: "navbar.showThemeToggle" },
    { label: "Show User Menu", path: "navbar.showUserMenu" },
    { label: "Show Sidebar Trigger", path: "navbar.showSidebarTrigger" },
    { label: "Enable Search", path: "navbar.search.enabled" },
    { label: "Enable Notifications", path: "navbar.notifications.enabled" },
    { label: "Blend with Body", path: "navbar.blendWithBody" },
  ];

  // Sidebar feature toggles config
  const sidebarToggles = [
    { label: "Show Theme Toggle", path: "sidebar.showThemeToggle" },
    { label: "Show User Menu", path: "sidebar.showUserMenu" },
    { label: "Hide Branding", path: "sidebar.hideBranding" },
    { label: "Full Height (spans viewport)", path: "sidebar.fullHeight" },
    { label: "Blend with Body", path: "sidebar.blendWithBody" },
    { label: "Scrollable", path: "sidebar.scrollable" },
    { label: "Fixed Position", path: "sidebar.fixed" },
  ];

  // Helper to get nested config value
  const getConfigValue = (path: string): any => {
    return path.split(".").reduce((obj, key) => obj?.[key], config as any);
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <DefaultLayout config={config}>
        <main className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">React Shadcn Kit — Interactive Demo</h1>
            <p className="text-muted-foreground">
              Configure every aspect of the layout in real-time using the controls below.
            </p>
          </div>

          <Tabs defaultValue="navbar" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="navbar">Navbar</TabsTrigger>
              <TabsTrigger value="sidebar">Sidebar</TabsTrigger>
              <TabsTrigger value="layout">Layout</TabsTrigger>
              <TabsTrigger value="user">User</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            {/* Navbar Configuration */}
            <TabsContent value="navbar" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Navbar Configuration</CardTitle>
                  <CardDescription>
                    Control navbar appearance, features, and behavior
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <ConfigInput
                      label="Height"
                      id="navbar-height"
                      value={config.navbar?.height || ""}
                      onChange={(value) => updateConfig("navbar.height", value)}
                      placeholder="64px"
                    />
                    <ConfigInput
                      label="Brand Title"
                      id="navbar-brand-title"
                      value={config.navbar?.branding?.title || ""}
                      onChange={(value) => updateConfig("navbar.branding.title", value)}
                      placeholder="App Name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <ConfigSelect
                      label="Scroll Behavior"
                      id="navbar-scroll-behavior"
                      value={config.navbar?.scrollBehavior || "sticky"}
                      onChange={(value) => updateConfig("navbar.scrollBehavior", value)}
                      options={[
                        { value: "sticky", label: "Sticky (Default)" },
                        { value: "hide-on-scroll", label: "Hide on Scroll" },
                        { value: "static", label: "Static" },
                      ]}
                    />
                    {config.navbar?.scrollBehavior === "hide-on-scroll" && (
                      <div className="flex items-end pb-2">
                        <div className="w-full">
                          <ConfigSwitch
                            label="Show on Scroll Up"
                            id="navbar-show-on-scroll-up"
                            checked={config.navbar?.showOnScrollUp ?? true}
                            onChange={(checked) => updateConfig("navbar.showOnScrollUp", checked)}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {navbarToggles.map(({ label, path }) => (
                      <ConfigSwitch
                        key={path}
                        label={label}
                        id={path}
                        checked={getConfigValue(path) ?? false}
                        onChange={(checked) => updateConfig(path, checked)}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Navbar Menu Items</CardTitle>
                  <CardDescription>
                    Add, edit, or remove navigation items in the navbar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MenuEditor
                    title="Navigation Items"
                    items={config.navbar?.items || []}
                    onChange={(items) => updateConfig("navbar.items", items)}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sidebar Configuration */}
            <TabsContent value="sidebar" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sidebar Configuration</CardTitle>
                  <CardDescription>
                    Control sidebar appearance, placement, and features
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <ConfigInput
                      label="Width"
                      id="sidebar-width"
                      value={config.sidebar?.width || ""}
                      onChange={(value) => updateConfig("sidebar.width", value)}
                      placeholder="250px"
                    />
                    <ConfigSelect
                      label="Placement"
                      id="sidebar-placement"
                      value={config.sidebar?.placement || "left"}
                      onChange={(value) => updateConfig("sidebar.placement", value)}
                      options={[
                        { value: "left", label: "Left" },
                        { value: "right", label: "Right" },
                      ]}
                    />
                  </div>

                  <div className="space-y-3">
                    {sidebarToggles.map(({ label, path }) => (
                      <ConfigSwitch
                        key={path}
                        label={label}
                        id={path}
                        checked={getConfigValue(path) ?? false}
                        onChange={(checked) => updateConfig(path, checked)}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sidebar Menu</CardTitle>
                  <CardDescription>Manage sidebar navigation groups and items</CardDescription>
                </CardHeader>
                <CardContent>
                  <SidebarGroupEditor
                    groups={config.sidebar?.groups || []}
                    onChange={(groups) => updateConfig("sidebar.groups", groups)}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Layout Configuration */}
            <TabsContent value="layout" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Layout Configuration</CardTitle>
                  <CardDescription>Control overall layout behavior and visibility</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <ConfigSwitch
                      label="Show Navbar"
                      id="show-navbar"
                      checked={config.showNavbar ?? true}
                      onChange={(checked) => updateConfig("showNavbar", checked)}
                    />
                    <ConfigSwitch
                      label="Show Sidebar"
                      id="show-sidebar"
                      checked={config.showSidebar ?? true}
                      onChange={(checked) => updateConfig("showSidebar", checked)}
                    />
                    <ConfigSwitch
                      label="Sidebar Default Open"
                      id="sidebar-default-open"
                      checked={config.sidebarDefaultOpen ?? true}
                      onChange={(checked) => updateConfig("sidebarDefaultOpen", checked)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <ConfigInput
                      label="Content Padding"
                      id="content-padding"
                      value={config.content?.padding || ""}
                      onChange={(value) => updateConfig("content.padding", value)}
                      placeholder="16px"
                    />
                    <ConfigInput
                      label="Content Max Width"
                      id="content-max-width"
                      value={config.content?.maxWidth || ""}
                      onChange={(value) => updateConfig("content.maxWidth", value)}
                      placeholder="1200px or leave empty"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* User Configuration */}
            <TabsContent value="user" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Configuration</CardTitle>
                  <CardDescription>
                    Configure user profile displayed in navbar and sidebar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ConfigInput
                    label="Name"
                    id="user-name"
                    value={config.user?.name || ""}
                    onChange={(value) => updateConfig("user.name", value)}
                    placeholder="John Doe"
                  />
                  <ConfigInput
                    label="Email"
                    id="user-email"
                    value={config.user?.email || ""}
                    onChange={(value) => updateConfig("user.email", value)}
                    placeholder="john@example.com"
                  />
                  <ConfigInput
                    label="Avatar URL"
                    id="user-image"
                    value={config.user?.image || ""}
                    onChange={(value) => updateConfig("user.image", value)}
                    placeholder="https://..."
                  />
                  <ConfigInput
                    label="Username"
                    id="user-username"
                    value={config.user?.username || ""}
                    onChange={(value) => updateConfig("user.username", value)}
                    placeholder="johndoe"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preview/Export */}
            <TabsContent value="preview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Current Configuration</CardTitle>
                  <CardDescription>Copy this configuration to use in your app</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="rounded bg-muted p-4 text-sm overflow-auto max-h-[600px]">
                    <code>{JSON.stringify(config, null, 2)}</code>
                  </pre>
                  <Button
                    className="mt-4"
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(config, null, 2));
                      toast.success("Configuration copied to clipboard!");
                    }}
                  >
                    Copy Configuration
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Usage Example</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="rounded bg-muted p-4 text-sm overflow-auto">
                    <code>{`import DefaultLayout from 'react-shadcn-kit/layouts/default-layout'

const config = ${JSON.stringify(config, null, 2)}

export default function MyApp({ children }) {
  return (
    <DefaultLayout config={config}>
      {children}
    </DefaultLayout>
  )
}`}</code>
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2 flex-wrap">
              <Button variant="outline" onClick={() => toast.info("Test notification")}>
                Test Toast
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  document.documentElement.classList.toggle("dark");
                  toast.info("Theme toggled");
                }}
              >
                Toggle Theme
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  updateConfig("sidebar.fullHeight", !config.sidebar?.fullHeight);
                  toast.info("Sidebar full-height toggled");
                }}
              >
                Toggle Sidebar Full Height
              </Button>
            </CardContent>
          </Card>
        </main>
        <Toaster />
      </DefaultLayout>
    </ThemeProvider>
  );
}

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<Demo />);
}

export default Demo;
