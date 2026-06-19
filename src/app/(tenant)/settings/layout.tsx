import type { ReactNode } from "react";

import { Settings } from "lucide-react";

import SettingsSidebar from "@/components/settings/settings-sidebar";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8 text-brand-700" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
          Configure clinic operations, users, procedures and workspace
          preferences.
        </p>
      </div>

      {/* Settings Workspace */}
      <div className="flex xl:grid grid-cols-[260px_minmax(0,1fr)] gap-8 items-start">
        <>
            <SettingsSidebar />
        </>

        <section className="min-w-0">{children}</section>
      </div>
    </div>
  );
}
