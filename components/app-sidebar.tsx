"use client";
import {
  Home,
  Languages,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/modeToggle";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Chat",
    url: "/chat",
    icon: MessageSquare,
  },
  {
    title: "Translator",
    url: "/translator",
    icon: Languages,
  },
];

export function AppSidebar() {
  const { toggleSidebar, state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const pathName = usePathname();
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            Chat With Smart(Maybe? lol) Dempseek
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = item.url === pathName;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton isActive={isActive} asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className="mx-auto">
            <ModeToggle />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail className="items-start pt-8 pr-3 hover:cursor-default hover:border-0 hover:bg-transparent">
        <div className="z-10 flex h-4 w-4 justify-center rounded-full text-muted-foreground hover:cursor-pointer">
          {isCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" onClick={toggleSidebar} />
          )}
        </div>
      </SidebarRail>
    </Sidebar>
  );
}
