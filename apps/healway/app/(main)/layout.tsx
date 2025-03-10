import { AppSidebar } from "@/core/components/navigation/app-sidebar";
import { SidebarProvider } from "@/core/components/ui/sidebar";
import { SessionProvider } from "@/core/provider/session-provider";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <SidebarProvider>
        <AppSidebar />
        {children}
      </SidebarProvider>
    </SessionProvider>
  );
}
