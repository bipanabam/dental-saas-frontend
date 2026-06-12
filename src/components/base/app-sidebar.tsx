"use client"

import Link from "next/link";
import {usePathname} from "next/navigation";

import {
  HeartPulse,
  Users,
  CalendarDays,
  Receipt,
  Settings,
  LayoutDashboard,
  ListOrdered,
  Shield,
  Globe,
  HelpCircle,
  LogOut,
  ChartNoAxesCombined
} from "lucide-react"


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



const items = [
  {
  title:"Dashboard",
  url:"/",
  icon:LayoutDashboard,
  roles:["ADMIN","RECEPTIONIST"]
  },

  {
  title:"Patients",
  url:"/patients",
  icon:Users,
  roles:["ADMIN","RECEPTIONIST"]
  },

  {
  title:"Appointments",
  url:"/appointments",
  icon:CalendarDays,
  roles:["ADMIN","RECEPTIONIST"]
  },

  {
  title:"Queue",
  url:"/doctor/clinical-workspace",
  icon:ListOrdered,
  roles:["DOCTOR","ADMIN"]
  },

  {
  title:"Billing",
  url:"/billing",
  icon:Receipt,
  roles:["ADMIN"]
  },

  {
  title:"Reports",
  url:"/admin/reports",
  icon:ChartNoAxesCombined,
  roles:["ADMIN"]
  },

  {
  title:"Settings",
  url:"/settings",
  icon:Settings,
  roles:["ADMIN","DOCTOR"]
  },

]



const AppSidebar = () => {

  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-brand-600 bg-brand-900">
      <SidebarHeader className="bg-brand-900">
        <div className="flex items-center gap-3 px-4 py-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-800 text-brand-200">
          <HeartPulse size={28}/>
          </div>

          <div>
            <h1 className="font-bold text-brand-100">
            Buddha Dental
            </h1>

            <p className="text-xs text-brand-300">
            Clinic OS
            </p>
          </div>
        </div>

        <Separator className="bg-brand-800"/>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4 bg-brand-900">
        <p className="px-3 mb-3 text-xs uppercase tracking-widest text-brand-400">
        Main Menu
        </p>

        <SidebarMenu>
        {items.map(item=>{

        const active = pathname===item.url;
        const Icon=item.icon;

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild 
              className={`h-11 rounded-xl text-sm hover:text-brand-100
                ${active ? "bg-brand-800 text-brand-100"
                  : "text-slate-200 hover:bg-brand-800"}`}
            >
              <Link href={item.url}>
                <Icon className="h-5 w-5"/>
                <span>
                  {item.title}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
        })}
        </SidebarMenu>
        
      </SidebarContent>

      <SidebarFooter className="p-3 bg-brand-900 border-t border-brand-800">
        
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-slate-200 hover:bg-brand-800 hover:text-brand-100">
              <HelpCircle/>
              Help & Support
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton className="text-red-300 hover:bg-red-600 hover:text-red-100">
              <LogOut/>
              Logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;