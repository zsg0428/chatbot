import { AppSidebar } from "@/components/app-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full gap-2">
      <div>
        <AppSidebar />
        <SidebarTrigger className="md:hidden" />
      </div>
      <main className="flex h-screen w-full flex-1 overflow-hidden pl-2">
        {children}
      </main>
    </div>
  );
}
