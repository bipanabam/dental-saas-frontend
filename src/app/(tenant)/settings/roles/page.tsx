"use client";

import { useState } from "react";
import {
    Shield, Plus, Trash2, Check, Loader2,
    AlertTriangle, Lock, ToggleLeft, ChevronRight,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
    AlertDialog, AlertDialogContent, AlertDialogHeader,
    AlertDialogTitle, AlertDialogDescription,
    AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { toast } from "sonner";

import { SectionLoader } from "@/components/base/loading-view";
import SettingsHeader from "@/components/settings/SettingHeader";

import {
    useRoles,
    useRoleDetail,
    usePermissions,
    useCreateRole,
    useDeleteRole,
    useReplaceRolePermissions,
} from "@/hooks/roles/use-roles";

//  Types
type Permission = { id: string; name: string; description?: string | null };
type Role = {
    id: string;
    name: string;
    is_system: boolean;
    is_active: boolean;
    permission_count: number;
    tenant_id?: string | null;
};
type RoleDetail = Role & { permissions: Permission[] };
const RESERVED = new Set(["superadmin", "super_admin"]);

// Permission group parser
// Groups "create_appointments", "view_appointments" → { appointments: [...] }
function groupPermissions(permissions: Permission[]): Record<string, Permission[]> {
    return permissions.reduce<Record<string, Permission[]>>((acc, p) => {
        const parts = p.name.split("_");
        // convention: verb_resource or verb_resource_sub
        const resource = parts.slice(1).join("_") || parts[0];
        const group = resource
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
        if (!acc[group]) acc[group] = [];
        acc[group].push(p);
        return acc;
    }, {});
}


// Permission checkbox group
function PermissionGroup({
    group,
    permissions,
    selected,
    onToggle,
    disabled,
}: {
    group: string;
    permissions: Permission[];
    selected: Set<string>;
    onToggle: (id: string) => void;
    disabled?: boolean;
}) {
    const checkedCount = permissions.filter((p) => selected.has(p.id)).length;

    return (
        <div>
            <div className="flex items-center justify-between px-1 mb-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    {group}
                </span>
                {checkedCount > 0 && (
                    <Badge className="text-[10px] h-4 px-1.5 bg-brand-50 text-brand-700 border-brand-100 font-bold">
                        {checkedCount}/{permissions.length}
                    </Badge>
                )}
            </div>

            <div className="rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-50">
                {permissions.map((p) => {
                    const checked = selected.has(p.id);
                    return (
                        <label
                            key={p.id}
                            className={`
                                flex items-center gap-3 px-3 py-2.5 cursor-pointer
                                transition-colors select-none
                                ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-50"}
                                ${checked ? "bg-brand-50/40" : ""}
                            `}
                        >
                            <div
                                className={`
                                h-4 w-4 rounded border flex items-center justify-center shrink-0
                                transition-colors
                                ${checked
                                        ? "bg-brand-600 border-brand-600"
                                        : "bg-white border-slate-300"
                                    }`}
                            >
                                {checked && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                            </div>
                            <div className="min-w-0">
                                <p className={`text-xs font-semibold ${checked ? "text-slate-900" : "text-slate-700"}`}>
                                    {p.name}
                                </p>
                                {p.description && (
                                    <p className="text-[11px] text-slate-400">{p.description}</p>
                                )}
                            </div>
                            <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => !disabled && onToggle(p.id)}
                                className="sr-only"
                                aria-label={p.name}
                            />
                        </label>
                    );
                })}
            </div>
        </div>
    );
}


// Role list item
function RoleListItem({
    role,
    selected,
    onClick,
    onDelete,
}: {
    role: Role;
    selected: boolean;
    onClick: () => void;
    onDelete: () => void;
}) {
    const [confirmDelete, setConfirmDelete] = useState(false);

    return (
        <>
            <button
                onClick={onClick}
                className={`
                w-full text-left rounded-xl px-4 py-3 flex items-center gap-3 transition-all
                ${selected
                        ? "bg-brand-50 border border-brand-200"
                        : "border border-transparent hover:bg-slate-50 hover:border-slate-200"
                    }`}
            >
                <div className={`
                    h-8 w-8 rounded-lg flex items-center justify-center shrink-0
                    ${role.is_system ? "bg-slate-100" : "bg-brand-50"}
                    `}>
                    {role.is_system
                        ? <Lock className="h-4 w-4 text-slate-500" />
                        : <Shield className="h-4 w-4 text-brand-600" />
                    }
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-800 capitalize">
                            {role.name}
                        </span>
                        {role.is_system && (
                            <Badge className="text-[9px] px-1.5 py-0 h-4 bg-slate-100 text-slate-500 border-slate-200 font-bold">
                                System
                            </Badge>
                        )}
                        {!role.is_active && (
                            <Badge className="text-[9px] px-1.5 py-0 h-4 bg-red-50 text-red-600 border-red-200 font-bold">
                                Inactive
                            </Badge>
                        )}
                    </div>
                    <p className="text-[11px] text-slate-400">
                        {role.permission_count} permission{role.permission_count !== 1 ? "s" : ""}
                    </p>
                </div>

                {!role.is_system && (
                    <button
                        onClick={(e) => { e.stopPropagation(); setConfirmDelete(true); }}
                        className="text-slate-300 hover:text-red-400 transition-colors p-1 shrink-0"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                )}

                <ChevronRight className={`h-4 w-4 shrink-0 transition-colors ${selected ? "text-brand-500" : "text-slate-300"
                    }`} />
            </button>

            <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete "{role.name}"?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will soft-delete the role. Users currently assigned this role
                            will keep their membership but the role will be inactive.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={onDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete Role
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}


// Permission editor panel
function PermissionEditor({ role }: { role: RoleDetail }) {
    const { data: permissionsData } = usePermissions();
    const replacePermissions = useReplaceRolePermissions();

    const allPermissions: Permission[] = (permissionsData as any) ?? [];
    const grouped = groupPermissions(allPermissions);

    const [selected, setSelected] = useState<Set<string>>(
        () => new Set(role.permissions.map((p) => p.id))
    );

    const originalIds = new Set(role.permissions.map((p) => p.id));
    const isDirty =
        selected.size !== originalIds.size ||
        [...selected].some((id) => !originalIds.has(id)) ||
        [...originalIds].some((id) => !selected.has(id));

    const toggle = (id: string) =>
        setSelected((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });

    const handleSave = () =>
        replacePermissions.mutateAsync({
            roleId: role.id,
            permissionIds: [...selected],
        });

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-bold text-slate-800 capitalize">
                        {role.name}
                    </h3>
                    <p className="text-xs text-slate-400">
                        {selected.size} of {allPermissions.length} permissions granted
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {isDirty && (
                        <span className="text-xs font-semibold text-amber-600">Unsaved</span>
                    )}
                    <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={!isDirty || replacePermissions.isPending || role.is_system}
                        className="rounded-xl bg-brand-600 gap-1.5"
                    >
                        {replacePermissions.isPending ? (
                            <><Loader2 className="h-3.5 w-3.5 animate-spin" />Saving...</>
                        ) : (
                            <><Check className="h-3.5 w-3.5" />Save Permissions</>
                        )}
                    </Button>
                </div>
            </div>

            {role.is_system && (
                <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">
                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                    <p className="text-xs text-amber-700 font-medium">
                        System roles are read-only. Clone this role to customize permissions.
                    </p>
                </div>
            )}

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                {Object.entries(grouped).map(([group, perms]) => (
                    <PermissionGroup
                        key={group}
                        group={group}
                        permissions={perms}
                        selected={selected}
                        onToggle={toggle}
                        disabled={role.is_system}
                    />
                ))}
            </div>
        </div>
    );
}


// Create role dialog
function CreateRoleInline({ onCreated }: { onCreated: (id: string) => void }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const create = useCreateRole();

    const handleCreate = async () => {
        if (!name.trim()) return;

        if (RESERVED.has(name.trim().toLowerCase())) {
            toast.error("That role name is reserved.");
            return;
        }

        const role = await create.mutateAsync({
            name: name.trim().toLowerCase(),
            permission_ids: [],
        });
        setName("");
        setOpen(false);
        if (role?.id) onCreated(role.id);
    };

    if (!open) {
        return (
            <Button
                size="sm"
                variant="outline"
                className="rounded-xl w-full gap-1.5 border-dashed"
                onClick={() => setOpen(true)}
            >
                <Plus className="h-3.5 w-3.5" /> New Role
            </Button>
        );
    }

    return (
        <div className="rounded-xl border border-brand-200 bg-brand-50/40 p-3 space-y-2">
            <Input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. nurse, lab_technician"
                className="bg-white h-8 text-sm"
                onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreate();
                    if (e.key === "Escape") setOpen(false);
                }}
            />
            <div className="flex gap-2">
                <Button
                    size="sm"
                    onClick={handleCreate}
                    disabled={!name.trim() || create.isPending}
                    className="flex-1 rounded-lg bg-brand-600 h-7 text-xs"
                >
                    {create.isPending ? "Creating..." : "Create"}
                </Button>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setOpen(false)}
                    className="rounded-lg h-7 text-xs"
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
}


function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <Shield className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-700">
                Select a role to edit permissions
            </p>
            <p className="text-xs text-slate-400 mt-1">
                Click any role on the left to configure its access rights.
            </p>
        </div>
    );
}

// Page
export default function RolesSettingsPage() {
    const { data: rolesData, isLoading } = useRoles();
    const deleteRole = useDeleteRole();

    const roles: Role[] = ((rolesData as any)?.items ?? []).filter(
        (r: Role) => !RESERVED.has(r.name.toLowerCase())
    );
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Fires automatically whenever selectedId changes
    const {
        data: roleDetail,
        isLoading: detailLoading,
    } = useRoleDetail(selectedId ?? undefined);


    if (isLoading) return <SectionLoader message="Loading roles..." />;

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Header */}
            <SettingsHeader
                title="Roles & Permissions"
                description="Define what each role can do across the platform."
                icon={Shield}
            />

            <div className="grid grid-cols-[280px_1fr] gap-6 items-start">

                {/* Left — role list */}
                <Card className="rounded-2xl border-slate-200 shadow-sm">
                    <CardContent className="p-3 space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 pt-1">
                            Roles ({roles.length})
                        </p>

                        {roles.map((role) => (
                            <RoleListItem
                                key={role.id}
                                role={role}
                                selected={selectedId === role.id}
                                onClick={() => setSelectedId(role.id)}
                                onDelete={() => deleteRole.mutate(role.id)}
                            />
                        ))}

                        <Separator className="my-2" />

                        <CreateRoleInline onCreated={(id) => setSelectedId(id)} />
                    </CardContent>
                </Card>

                {/* Right — permission editor */}
                <Card className="rounded-2xl border-slate-200 shadow-sm">
                    <CardContent className="p-6">
                        {!selectedId ? (
                            <EmptyState />
                        ) : detailLoading ? (
                            <SectionLoader message="Loading permissions..." />
                        ) : roleDetail ? (
                            <PermissionEditor
                                key={roleDetail.id}
                                role={roleDetail as RoleDetail}
                            />
                        ) : null}
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}