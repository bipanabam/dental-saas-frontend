import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth/get-session";
import { TenantProvider } from "@/providers/tenant-provider";

import AppSidebar from "@/components/base/app-sidebar";
import TopBar from "@/components/base/topbar";

import { SidebarProvider } from "@/components/ui/sidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <TenantProvider session={session}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-brand-50">
          <AppSidebar />

          <div className="flex flex-1 flex-col min-w-0">
            <TopBar />

            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </TenantProvider>
  );
}