"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarItems } from "@/lib/navigation/sidebar";
import { useTenant } from "@/providers/tenant-provider";
import { logout } from "@/app/actions/logout";

import {
  HeartPulse,
  HelpCircle,
  LogOut,
  ChevronDown,
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


const SECTIONS: { label: string; titles: string[] }[] = [
  { label: "Operations", titles: ["Dashboard", "Patients", "Appointments"] },
  { label: "Clinical", titles: ["Encounters", "Queue", "Guidelines"] },
  { label: "Administration", titles: ["Staff", "Billing", "Reports", "Settings"] },
];

function isPathActive(pathname: string, url: string): boolean {
  return pathname === url || pathname.startsWith(`${url}/`);
}

const AppSidebar = () => {
  const pathname = usePathname();
  const { session } = useTenant();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const role = session?.user?.role;
  const tenantName = session?.user?.tenantName ?? "Clinic OS";

  const items = role ? sidebarItems.filter((i) => i.roles.includes(role)) : [];

  const itemsByTitle = new Map(items.map((item) => [item.title, item]));

  const toggleGroup = (title: string) =>
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));

  return (
    <Sidebar className="border-r border-brand-800/40 bg-brand-900">
      <SidebarHeader className="bg-brand-900 px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-950/50">
            <HeartPulse size={22} />
          </div>
          <div className="min-w-0 flex-1">
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
        {SECTIONS.map((section) => {
          const sectionItems = section.titles
            .map((title) => itemsByTitle.get(title))
            .filter((item): item is NonNullable<typeof item> => !!item);

          if (sectionItems.length === 0) return null;

          return (
            <div key={section.label} className="mb-5 last:mb-0">
              <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-brand-500 select-none">
                {section.label}
              </p>

              <SidebarMenu className="gap-0.5">
                {sectionItems.map((item) => {
                  const Icon = item.icon;

                  if (item.children) {
                    const childActive = item.children.some((child) =>
                      isPathActive(pathname, child.url)
                    );
                    const isOpen = openGroups[item.title] ?? childActive;

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          onClick={() => toggleGroup(item.title)}
                          className={`w-full h-10 rounded-lg text-sm transition-colors duration-150 px-3 flex items-center justify-between cursor-pointer
                            ${childActive
                              ? "text-white font-medium"
                              : "text-brand-200/80 hover:bg-brand-800/50 hover:text-white"
                            }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon
                              className={`h-4 w-4 shrink-0 ${childActive ? "text-brand-300" : "text-brand-400"
                                }`}
                            />
                            <span>{item.title}</span>
                          </div>
                          <ChevronDown
                            className={`h-3.5 w-3.5 text-brand-400 transition-transform duration-150 ${isOpen ? "rotate-180" : ""
                              }`}
                          />
                        </SidebarMenuButton>

                        {isOpen && (
                          <div className="ml-6.75 pl-3 border-l border-brand-800 mt-0.5 flex flex-col gap-0.5">
                            {item.children.map((child) => {
                              const isChildActive = isPathActive(pathname, child.url);
                              return (
                                <Link
                                  key={child.url}
                                  href={child.url}
                                  className={`rounded-md px-3 py-1.5 text-xs transition-colors duration-150
                                    ${isChildActive
                                      ? "bg-brand-700 text-white font-medium"
                                      : "text-brand-300/70 hover:bg-brand-800/50 hover:text-white"
                                    }`}
                                >
                                  {child.title}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </SidebarMenuItem>
                    );
                  }

                  const active = isPathActive(pathname, item.url!);

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`h-10 rounded-lg text-sm transition-colors duration-150 px-3
                          ${active
                            ? "bg-brand-700 text-white font-medium hover:bg-brand-700 hover:text-white"
                            : "text-brand-200/80 hover:bg-brand-800/50 hover:text-white"
                          }`}
                      >
                        <Link href={item.url!} className="flex items-center gap-2.5">
                          <Icon
                            className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-brand-400"
                              }`}
                          />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </div>
          );
        })}
      </SidebarContent>

      <SidebarFooter className="border-t border-brand-800 bg-brand-900 p-3 gap-0.5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-10 rounded-lg text-sm text-brand-200/80 hover:bg-brand-800/50 hover:text-white transition-colors duration-150 px-3"
            >
              <Link href="/help">
                <HelpCircle className="h-4 w-4 text-brand-400 shrink-0" />
                <span>Help and support</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <form action={logout} className="w-full">
              <SidebarMenuButton
                type="submit"
                className="w-full h-10 rounded-lg text-sm font-medium text-tertiary hover:bg-tertiary-50 hover:text-on-tertiary transition-colors duration-150 px-3"
              >
                <LogOut className="h-4 w-4 text-tertiary shrink-0" />
                <span>Log out</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;