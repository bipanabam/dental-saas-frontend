"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { settingsNav } from "@/lib/navigation/settings-nav";

import { Card, CardContent } from "@/components/ui/card";

export default function SettingsSidebar() {
  const pathname = usePathname();
  return (
    <aside className="sticky top-24 xl:block hidden">
      <Card className="rounded-2xl border-slate-200 shadow-xs">
        <CardContent className="p-3">
          <div className="mb-3 px-3">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Workspace Settings
            </p>
          </div>

          <nav className="space-y-1">
            {settingsNav.map((item) => {
              const active = pathname.startsWith(item.href);;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 rounded-xl px-3 py-3 transition
                    ${
                      active
                        ? "bg-brand-50 text-brand-800 border border-brand-100"
                        : "hover:bg-slate-50 text-slate-600"
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </CardContent>
      </Card>
    </aside>
  );
}
