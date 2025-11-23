import React from "react";
import ReactDOM from "react-dom/client";
import DefaultLayout from "./layouts/default-layout";
import BlogLayout from "./layouts/blog-layout";
import SidebarScrollLayout from "./layouts/sidebar-scroll-layout";
import "./global.css";
import { ThemeProvider } from "next-themes";

const Layouts = {
  Default: DefaultLayout,
  Blog: BlogLayout,
  "Sidebar Scroll": SidebarScrollLayout,
};

export function DevApp() {
  const [currentLayout, setCurrentLayout] = React.useState<keyof typeof Layouts>("Default");
  const LayoutComponent = Layouts[currentLayout];

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {/* Layout Switcher */}
      <div className="fixed bottom-4 right-4 z-50 flex gap-2 bg-background/80 p-2 rounded-lg border backdrop-blur-sm shadow-lg">
        {(Object.keys(Layouts) as Array<keyof typeof Layouts>).map((layout) => (
          <button
            key={layout}
            onClick={() => setCurrentLayout(layout)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              currentLayout === layout
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {layout}
          </button>
        ))}
      </div>

      <LayoutComponent>
        <div className="relative z-10 p-4 space-y-4">
          <h1 className="text-3xl font-bold">{currentLayout} Layout Demo</h1>
          <p className="text-lg text-muted-foreground">
            Verify the component library in different themes.
          </p>
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="aspect-video rounded-xl bg-muted/50 border shadow-sm flex items-center justify-center"
              >
                Item {i + 1}
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-32 rounded-xl bg-muted/50 border shadow-sm p-4">
                <h3 className="font-semibold">Section {i + 1}</h3>
                <p className="text-sm text-muted-foreground">
                  Content to verify scrolling behavior.
                </p>
              </div>
            ))}
          </div>
        </div>
      </LayoutComponent>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DevApp />
  </React.StrictMode>,
);
