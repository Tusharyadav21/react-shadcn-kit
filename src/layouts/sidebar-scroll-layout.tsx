import { SidebarProvider, SidebarInset } from "@/atoms/sidebar";
import { AppSidebar } from "@/organisms/app-sidebar";
import { AppNavbar } from "@/organisms/app-navbar";
import { LayoutConfig } from "@/types/layout";
import { defaultLayoutConfig } from "@/config/default-layout";

export default function SidebarScrollLayout({
  children,
  userConfig,
  scrollable = true, // Default to true for this specific layout variation
  maxWidth,
}: {
  children: React.ReactNode;
  userConfig?: Partial<LayoutConfig>;
  scrollable?: boolean;
  maxWidth?: string;
}) {
  const config: LayoutConfig = {
    ...defaultLayoutConfig,
    ...userConfig,
    sidebar: { ...defaultLayoutConfig.sidebar, ...(userConfig?.sidebar || {}) },
    navbar: { ...defaultLayoutConfig.navbar, ...(userConfig?.navbar || {}) },
  };

  // SidebarProvider expects a style object where we can define --sidebar-width
  const sidebarProviderStyle: React.CSSProperties = {
    ...(config.sidebar?.width ? { ["--sidebar-width"]: config.sidebar.width } : {}),
  } as React.CSSProperties;

  const showSidebar = config.sidebar?.visible ?? true;
  const showNavbar = config.navbar?.visible ?? true;

  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col" style={sidebarProviderStyle}>
        {showNavbar && (
          <AppNavbar
            className={config.navbar?.transparent ? "bg-transparent" : undefined}
            style={{
              backgroundColor: config.navbar?.transparent ? "transparent" : config.navbar?.color,
              height: config.navbar?.height,
              boxShadow: config.navbar?.shadow ? undefined : "none",
            }}
            showSidebarTrigger={showSidebar}
          />
        )}

        <div className="flex flex-1">
          {showSidebar && (
            <AppSidebar
              hideBranding={config.sidebar?.hasBranding === false}
              side={(config.sidebar?.placement as "left" | "right") || "left"}
              scrollable={scrollable}
            />
          )}
          <SidebarInset>
            <div className="p-4 mx-auto w-full" style={maxWidth ? { maxWidth } : undefined}>
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
