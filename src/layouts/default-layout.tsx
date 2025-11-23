import { SidebarProvider, SidebarInset } from "@/atoms/sidebar";
import { AppSidebar } from "@/organisms/app-sidebar";
import { AppNavbar } from "@/organisms/app-navbar";
import { LayoutConfig } from "@/types/layout";
import { defaultSidebarConfig } from "@/config/default-Sidebar";
import { defaultLayoutConfig } from "@/config/default-layout"; // Assuming this import is needed for defaultLayoutConfig

export default function Layout({
  children,
  userConfig,
  scrollable = false,
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

  // Pass branding to navbar if it exists in sidebar config (for consistency)
  const navbarConfig = {
    ...config.navbar,
    branding: config.sidebar?.hasBranding ? defaultSidebarConfig.branding : undefined,
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
            config={navbarConfig}
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
              hideBranding={true} // Hide branding in sidebar since it's in navbar
              side={(config.sidebar?.placement as "left" | "right") || "left"}
              scrollable={scrollable}
              className="pt-14"
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
