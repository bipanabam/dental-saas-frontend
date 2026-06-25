import type { ReactNode } from "react";

import { Settings } from "lucide-react";

import SettingsSidebar from "@/components/settings/settings-sidebar";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <Settings className="h-6 w-6 text-brand-700" />
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">
          Configure clinic operations, users, procedures and workspace
          preferences.
        </p>
      </div>

      {/* Settings Workspace */}
      <div className="flex gap-6 items-start w-full">
        <SettingsSidebar />
        <section className="min-w-0 flex-1">{children}</section>
      </div>
    </div>
  );
}
