import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/atoms/sidebar";
import { AppSidebar } from "@/organisms/app-sidebar";
import { blogLayoutConfig } from "@/config/blog-layout.config";
import { SidebarConfig } from "@/types/navigation";

export default function BlogLayout({
  children,
  userConfig,
  scrollable = false,
  maxWidth,
}: {
  children: React.ReactNode;
  userConfig?: Partial<SidebarConfig>;
  scrollable?: boolean;
  maxWidth?: string;
}) {
  const config = { ...blogLayoutConfig, ...userConfig };

  return (
    <SidebarProvider style={config.style}>
      <AppSidebar config={config} scrollable={scrollable} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <div
          className="flex flex-1 flex-col gap-4 p-4 mx-auto w-full"
          style={maxWidth ? { maxWidth } : undefined}
        >
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
