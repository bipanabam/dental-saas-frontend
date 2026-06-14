"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarItems } from "@/lib/navigation/sidebar";
import { useTenant } from "@/providers/tenant-provider";
import { logout } from "@/app/actions/logout";

import {
  HeartPulse,
  HelpCircle,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Separator } from "@/components/ui/separator";

const AppSidebar = () => {
  const pathname = usePathname();
  const { session } = useTenant();

  const userRole = session?.user?.role || "receptionist";
  const tenantName = session?.user?.tenantName || "Clinic OS";

  const items = sidebarItems.filter((i) => i.roles.includes(userRole));

  return (
    <Sidebar className="border-r border-brand-800/40 bg-brand-900">
      <SidebarHeader className="bg-brand-900  px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-950/50">
            <HeartPulse size={22} className="animate-pulse-slow" />
          </div>

          <div className="min-w-0 flex-1">
            {/* Tenant Title */}
            <h1 className="font-bold tracking-tight text-white truncate">
              {tenantName}
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-wider text-brand-400">
              Dental Core OS
            </p>
          </div>
        </div>

        <Separator className="bg-brand-800 mt-4" />
      </SidebarHeader>

      <SidebarContent className="px-3 py-4 bg-brand-900 scrollbar-none">
        <p className="px-3 mb-2 text-xs font-bold uppercase tracking-widest text-brand-500 select-none">
          Main Menu
        </p>

        <SidebarMenu className="gap-1">
          {items.map((item) => {
            const active = item.url === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.url);
            const Icon = item.icon;

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={`h-11 rounded-xl text-sm transition-all duration-200 px-3
                ${
                  active
                    ? "bg-brand-600 text-white shadow-sm font-medium hover:bg-brand-600 hover:text-white"
                    : "text-brand-200/80 hover:bg-brand-800 hover:text-white"
                }`}
                >
                  <Link href={item.url}>
                    <Icon className={`h-4 w-4 shrink-0 transition-transform duration-200 ${active ? "scale-105" : "text-brand-300"}`} />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-brand-800 bg-brand-900 p-3 gap-1">
        <SidebarMenu>
          {/* Support Item */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-10 rounded-xl text-sm text-brand-200/80 hover:bg-brand-900 hover:text-white transition-all px-3"
            >
              <Link href="/help">
                <HelpCircle className="h-4 w-4 text-brand-300 shrink-0" />
                <span>Help & Support</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <form action={logout} className="w-full">
              <SidebarMenuButton
                type="submit"
                className="w-full h-10 rounded-xl text-sm font-medium text-red-300 hover:bg-red-600 hover:text-red-100 transition-all px-3"
              >
                <LogOut className="h-4 w-4 text-red-400 shrink-0" />
                <span>Logout</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
