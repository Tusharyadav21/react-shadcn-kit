import React from "react";
import ReactDOM from "react-dom/client";
import Layout from "./organisms/layout";
import "./global.css";
import { ThemeProvider } from "next-themes";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Layout>
        <div className="relative z-10 p-4 space-y-4">
          <h1 className="text-3xl font-bold">Component Library Demo</h1>
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
      </Layout>
    </ThemeProvider>
  </React.StrictMode>,
);
