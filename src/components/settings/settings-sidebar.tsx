"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { settingsNav } from "@/lib/navigation/settings-nav";

export default function SettingsSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`sticky top-24 hidden xl:block select-none transition-all duration-200 ease-in-out shrink-0 ${isCollapsed ? "w-16" : "w-65"
        }`}
    >
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col p-2">

        {/* Toggle / Header Controller Line */}
        <div className={`flex items-center mb-2 px-2 py-1.5 ${isCollapsed ? "justify-center" : "justify-between"}`}>
          {!isCollapsed && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">
              Workspace
            </span>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {settingsNav.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 rounded-lg py-2.5 transition-all duration-150 relative group
                  ${isCollapsed ? "justify-center px-0" : "px-3"}
                  ${active
                    ? "bg-brand-50 border border-brand-100/60 text-brand-800 font-bold"
                    : "hover:bg-slate-50/80 text-slate-600 border border-transparent"
                  }
                `}
              >
                <Icon className={`h-4 w-4 shrink-0 ${active ? "text-brand-700" : "text-slate-400 group-hover:text-slate-600"}`} />
                {/* Nav Label */}
                {!isCollapsed ? (
                  <span className="text-xs font-semibold tracking-tight truncate">{item.title}</span>
                ) : (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-[10px] font-bold rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap tracking-wide uppercase font-mono shadow-md">
                    {item.title}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}