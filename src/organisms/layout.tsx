import { SidebarProvider, SidebarInset } from "@/atoms/sidebar";
import { AppSidebar } from "@/molecules/app-sidebar";
import { AppNavbar } from "@/molecules/app-navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppNavbar />
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
