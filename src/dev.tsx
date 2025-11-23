import { createRoot } from "react-dom/client";
import { Button } from "./atoms/button";
import { Input } from "./atoms/input";
import { Toaster } from "./atoms/sonner";
import { ThemeToggle } from "./molecules/theme-toggle";
import DefaultLayout from "./default-layout";
import type { LayoutConfig } from "./default-layout";

import "./global.css";
import { toast } from "sonner";
import { ThemeProvider } from "./atoms/theme-provider";

function Code({ children }: { children: React.ReactNode }) {
  return (
    <pre className="rounded bg-surface p-2 text-sm overflow-auto">
      <code>{children}</code>
    </pre>
  );
}

function Demo() {
  const dummyLayoutConfig: LayoutConfig = {
    layoutRules: {
      public: { navbar: true, sidebar: true },
      auth: { navbar: true, sidebar: true },
      private: { navbar: true, sidebar: true },
    },
    user: {
      name: "John Doe",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      username: "johndoe",
      email: "john.doe@example.com",
      roles: ["admin", "editor"],
    },
    search: {
      enabled: true,
      placeholder: "Search the site...",
      action: "/search",
      method: "GET",
      debounceTimeMs: 300,
      suggestionsApi: "/api/search/suggestions",
    },
    components: {
      navbar: {
        height: "64px",
        showThemeToggle: true,
        showUserMenu: true,
        showSidebarTrigger: true,
        branding: {
          title: "React Shadcn Kit",
          subtitle: "Component Library",
        },
        notifications: {
          enabled: true,
          isNewNotification: true,
          count: 3,
          showBadge: true,
        },
        search: {
          enabled: true,
          placeholder: "Search navbar...",
          action: "/navbar-search",
          method: "GET",
        },
        items: [
          { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
          { label: "Profile", href: "/profile", icon: "User", disabled: false },
          { label: "Settings", href: "/settings", icon: "Settings" },
        ],
      },
      sidebar: {
        width: "250px",
        placement: "left",
        showThemeToggle: true,
        showUserMenu: true,
        showSidebarTrigger: true,
        branding: {
          title: "Navigation",
        },
        search: {
          enabled: true,
          placeholder: "Search sidebar...",
          action: "/sidebar-search",
          method: "GET",
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
        notifications: {
          enabled: false,
        },
      },
    },
    appName: "MyApp",
    theme: "system",
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <DefaultLayout layoutConfig={dummyLayoutConfig}>
        <main className="p-4 ml-14">
          <h1 className="text-2xl font-bold mb-4">react-shadcn-kit — Dev Playground</h1>

          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Quick Start</h2>
            <p className="text-sm text-muted-foreground mb-2">
              Install and import components in your app. Example subpath imports (tree-shakable):
            </p>
            <Code>{`import { Button } from 'react-shadcn-kit/atoms/button'\nimport DefaultLayout from 'react-shadcn-kit/layouts/default-layout'`}</Code>
            <p className="text-sm mt-2">Or import from the package entry:</p>
            <Code>{`import { Button, AppNavbar } from 'react-shadcn-kit'`}</Code>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Server vs Client</h2>
            <ul className="list-disc ml-5 text-sm mb-2">
              <li>Prefer server components by default for layouts and content.</li>
              <li>
                Mark components that use browser APIs or React hooks with <code>"use client"</code>.
              </li>
              <li>
                Examples of client-only components: Carousel, ThemeToggle, Toaster. They are safe to
                render inside server layouts because they isolate client logic.
              </li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Interactive Examples</h2>

            <div className="mb-4">
              <h3 className="font-medium">Buttons</h3>
              <div className="flex gap-2 mt-2">
                <Button>Default</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-medium">Input</h3>
              <p className="text-sm text-muted-foreground">Use the Input atom inside forms:</p>
              <div className="mt-2 max-w-sm">
                <Input placeholder="Your email" />
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-medium">Theme + Toaster</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Theme toggle and toast notifications:
              </p>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <Button onClick={() => toast.info("Replace with sonner toast in real use")}>
                  Show Toast
                </Button>
                <Toaster />
              </div>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Layout Overrides</h2>
            <p className="text-sm text-muted-foreground mb-2">
              Default layout config is exported so you can inspect and override defaults:
            </p>
            <Code>{`// Pass a custom layoutConfig directly to DefaultLayout
// Example: <DefaultLayout layoutConfig={customConfig} />`}</Code>
            <p className="text-sm mt-2">Current applied override (shown as example):</p>
            <Code>{JSON.stringify(dummyLayoutConfig, null, 2)}</Code>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">Notes & Best Practices</h2>
            <ul className="list-disc ml-5 text-sm">
              <li>Keep server components free of browser globals (window/document).</li>
              <li>
                Isolate client-only behavior behind small client wrappers (e.g. `*-client.tsx`).
              </li>
              <li>
                Import types from `react-shadcn-kit/types/*` when you need TypeScript interfaces.
              </li>
            </ul>
          </section>
        </main>
      </DefaultLayout>
    </ThemeProvider>
  );
}

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<Demo />);
} else {
  console.error("No root element found for dev app");
}

export default Demo;
