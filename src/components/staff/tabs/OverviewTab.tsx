import { Mail, Phone, User, Shield, Clock, Check, X } from "lucide-react";
import type { UserListItem } from "@/lib/api";

function InfoRow({ label, value, icon: Icon, isMono = false }: { label: string; value?: string | null; icon?: any; isMono?: boolean }) {
    return (
        <div className="grid grid-cols-[130px_1fr] py-2 border-b border-slate-100 last:border-0 items-baseline gap-2">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {Icon && <Icon className="h-3.5 w-3.5 text-slate-300 shrink-0" />}
                {label}
            </div>
            <span className={`text-xs font-semibold text-slate-700 truncate ${isMono ? "font-mono" : ""}`}>
                {value ?? "—"}
            </span>
        </div>
    );
}

export default function OverviewTab({ user }: { user: UserListItem }) {
    return (
        <div className="bg-white border border-slate-200/80 rounded-xl divide-y divide-slate-100 shadow-sm overflow-hidden">

            <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">

                {/* Contact Segment */}
                <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-brand-700 font-mono">
                        [ Contact Profile ]
                    </p>
                    <div className="pt-1">
                        <InfoRow label="Email Address" value={user.email} icon={Mail} />
                        <InfoRow label="Phone Contact" value={user.phone_number} icon={Phone} />
                    </div>
                </div>

                {/* Account Segment */}
                <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        System Credentials
                    </p>
                    <div className="pt-1">
                        <InfoRow label="Username" value={user.username} icon={User} isMono />
                        <InfoRow label="Assigned Role" value={user.role} icon={Shield} />
                        <InfoRow
                            label="Last Active"
                            value={user.last_active_at ? new Date(user.last_active_at).toLocaleString() : "Never"}
                            icon={Clock}
                            isMono
                        />
                    </div>
                </div>
            </div>

            <div className="px-4 py-3 sm:px-5 bg-slate-50/40 flex flex-wrap items-center gap-x-6 gap-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Security Flags:
                </span>

                <div className="flex items-center gap-4 text-xs font-semibold">
                    {/* Email Verification State */}
                    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded border ${user.is_verified
                            ? "bg-emerald-50/40 border-emerald-200/60 text-emerald-800"
                            : "bg-slate-50 border-slate-200 text-slate-500"
                        }`}>
                        {user.is_verified ? <Check className="h-3 w-3 text-emerald-600" /> : <X className="h-3 w-3 text-slate-400" />}
                        <span>Email {user.is_verified ? "Verified" : "Unverified"}</span>
                    </div>

                    {/* Account Status */}
                    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded border ${user.is_active
                            ? "bg-brand-50 border-brand-200/60 text-brand-800"
                            : "bg-red-50/40 border-red-200 text-red-800"
                        }`}>
                        {user.is_active ? <Check className="h-3 w-3 text-brand-600" /> : <X className="h-3 w-3 text-red-500" />}
                        <span>Status: {user.is_active ? "Active" : "Disabled"}</span>
                    </div>
                </div>
            </div>

        </div>
    );
}