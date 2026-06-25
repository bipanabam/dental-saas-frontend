"use client";

import { useState } from "react";
import { Shield, Check, Loader2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { SectionLoader } from "@/components/base/loading-view";

import { useUserAccess, useUpdateUserAccess } from "@/hooks/users/use-staff-detail";
import { useRoles } from "@/hooks/roles/use-roles";

export default function AccessTab({ userId }: { userId: string }) {
    const { data: access, isLoading } = useUserAccess(userId);
    const { data: rolesData } = useRoles();
    const updateAccess = useUpdateUserAccess(userId);

    const [selectedRoleId, setSelectedRoleId] = useState<string>("");
    const [editing, setEditing] = useState(false);

    const roles = (rolesData as any)?.items ?? [];

    if (isLoading) return <SectionLoader message="Loading access..." />;
    if (!access) return null;

    const handleSave = async () => {
        if (!selectedRoleId || selectedRoleId === access.role_id) {
            setEditing(false);
            return;
        }
        await updateAccess.mutateAsync(selectedRoleId);
        setEditing(false);
    };

    // Group permissions by prefix
    const grouped = (access.permissions ?? []).reduce<Record<string, string[]>>(
        (acc, p) => {
            const parts = p.split("_");
            const group = parts.slice(1).join("_").replace(/_/g, " ") || parts[0];
            const cap = group.charAt(0).toUpperCase() + group.slice(1);
            if (!acc[cap]) acc[cap] = [];
            acc[cap].push(p);
            return acc;
        },
        {}
    );

    return (
        <div className="space-y-4">
            {/* Role assignment */}
            <Card className="rounded-2xl border-slate-200 shadow-sm p-0">
                <CardContent className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                            Assigned Role
                        </p>
                        {!editing ? (
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-7 rounded-lg text-xs gap-1.5"
                                onClick={() => { setSelectedRoleId(access.role_id); setEditing(true); }}
                            >
                                Change Role
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 rounded-lg text-xs"
                                    onClick={() => setEditing(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    size="sm"
                                    className="h-7 rounded-lg text-xs bg-brand-700 gap-1"
                                    onClick={handleSave}
                                    disabled={updateAccess.isPending}
                                >
                                    {updateAccess.isPending
                                        ? <Loader2 className="h-3 w-3 animate-spin" />
                                        : <Check className="h-3 w-3" />
                                    }
                                    Save
                                </Button>
                            </div>
                        )}
                    </div>

                    {editing ? (
                        <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                            <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Select role..." />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((r: any) => (
                                    <SelectItem key={r.id} value={r.id}>
                                        <span className="capitalize">{r.name}</span>
                                        {r.is_system && (
                                            <span className="ml-2 text-[10px] text-slate-400">System</span>
                                        )}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ) : (
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                                <Shield className="h-5 w-5 text-slate-500" />
                            </div>
                            <div>
                                <Badge
                                    variant="outline"
                                    className="text-xs font-bold px-3 py-1 capitalize bg-brand-50 text-brand-700 border-brand-200"
                                >
                                    {access.role_name}
                                </Badge>
                                <p className="text-[11px] text-slate-400 mt-1">
                                    {access.permissions?.length ?? 0} permissions inherited
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Permission matrix */}
            <Card className="rounded-2xl border-slate-200 shadow-sm">
                <CardContent className="p-5 space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        Permission Matrix
                    </p>

                    {Object.keys(grouped).length === 0 ? (
                        <p className="text-xs text-slate-400">No permissions assigned.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {Object.entries(grouped).map(([group, perms]) => (
                                <div key={group} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                                        {group}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {perms.map((p) => {
                                            const verb = p.split("_")[0];
                                            const verbColor: Record<string, string> = {
                                                create: "bg-emerald-50 text-emerald-700 border-emerald-200",
                                                read: "bg-sky-50 text-sky-700 border-sky-200",
                                                update: "bg-amber-50 text-amber-700 border-amber-200",
                                                delete: "bg-red-50 text-red-600 border-red-200",
                                            };
                                            return (
                                                <Badge
                                                    key={p}
                                                    variant="outline"
                                                    className={`text-[9px] font-bold px-1.5 py-0 h-4 ${verbColor[verb] ?? "bg-slate-50 text-slate-500 border-slate-200"}`}
                                                >
                                                    {verb}
                                                </Badge>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Account status */}
            <Card className="rounded-2xl border-slate-200 shadow-sm p-0">
                <CardContent className="p-5">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-3">
                        Membership Status
                    </p>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-slate-700">Tenant Access</p>
                            <p className="text-xs text-slate-400">Whether this user can access the clinic workspace</p>
                        </div>
                        <Badge
                            variant="outline"
                            className={`text-xs font-bold px-3 py-1 ${access.is_active
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-red-50 text-red-600 border-red-200"
                                }`}
                        >
                            {access.is_active ? "Active" : "Revoked"}
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}