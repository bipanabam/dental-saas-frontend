import AppSidebar from "@/components/base/app-sidebar";
import TopBar from "@/components/base/topbar";

import { SidebarProvider } from "@/components/ui/sidebar"


export default function DashboardLayout({
   children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    
  return (
    <SidebarProvider>
        <div className="flex min-h-screen w-full bg-brand-50">
            <AppSidebar/>
            <div className="flex flex-1 flex-col">

                <TopBar/>

                <main className="flex-1 p-6">
                    {children}
                </main>

            </div>
        </div>
    </SidebarProvider>
  );
}