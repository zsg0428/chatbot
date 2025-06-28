import { AppSidebar } from "@/components/app-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full">
      {/* Sidebar - hidden on mobile, shown on md and up */}
      <div className="hidden md:block">
        <AppSidebar />
      </div>

      {/* Mobile sidebar trigger - shown only on mobile */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <SidebarTrigger />
      </div>

      {/* Main content */}
      <main className="h-full w-full flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
