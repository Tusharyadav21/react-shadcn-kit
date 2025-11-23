"use server";
// Dev entrypoint and documentation/demo for the component library
// This file is used by Vite during `npm run dev` and `npm run build:app`.
// It demonstrates how to import components from the packaged library
// and offers a minimal playground for library consumers.

import { createRoot } from "react-dom/client";

// Example imports from the local src. When published, these imports
// are available from the package entry (e.g. `react-shadcn-kit`).
import { Button } from "./atoms/button";
import { Input } from "./atoms/input";
import { Toaster } from "./atoms/sonner";
import { ThemeToggle } from "./molecules/theme-toggle";
import DefaultLayout from "./layouts/default-layout";
import { defaultLayoutConfig } from "./config/default-layout";
import { LayoutConfig } from "./types/layout";
import "./global.css";
import { toast } from "sonner";

/**
 * Dev Playground — comprehensive documentation and runnable examples.
 *
 * What this file shows:
 * - Quick import paths consumers will use (both subpath and package entry).
 * - Server vs client guidance: which pieces are client-only.
 * - Examples: Button variants, Input usage, Theme toggle, Toaster, and layout override.
 */

function Code({ children }: { children: React.ReactNode }) {
  return (
    <pre className="rounded bg-surface p-2 text-sm overflow-auto">
      <code>{children}</code>
    </pre>
  );
}

function Demo() {
  // Example: override a small piece of the layout defaults
  const myLayoutConfig: Partial<LayoutConfig> = {
    sidebar: { width: "200px", placement: "left" },
    navbar: { height: "64px" },
  };

  return (
    <DefaultLayout userConfig={myLayoutConfig}>
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
          <Code>{`import { defaultLayoutConfig } from 'react-shadcn-kit/config/default-layout'\n// then pass a Partial<LayoutConfig> to the DefaultLayout component via userConfig`}</Code>
          <p className="text-sm mt-2">Current applied override (shown as example):</p>
          <Code>{JSON.stringify({ ...defaultLayoutConfig, ...myLayoutConfig }, null, 2)}</Code>
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
  );
}

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<Demo />);
} else {
  console.error("No root element found for dev app");
}

export default Demo;
