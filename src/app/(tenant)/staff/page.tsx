"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Users, UserCheck, UserX, Stethoscope,
    Wifi, Search, RotateCcw, ArrowRight,
    MoreVertical, Settings, KeyRound, Shield,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

import { AddUserButton, UserEditDialog } from "@/components/staff/forms/UserFormSheet";
import { ResetPasswordDialog } from "@/components/staff/forms/ResetPasswordDialog";
import { DisableUserDialog } from "@/components/staff/forms/DisableUserDialog";
import { RestoreUserDialog } from "@/components/staff/forms/RestoreUserDialog";

import PageHeader from "@/components/shared/page/PageHeader";
import { SectionLoader } from "@/components/base/loading-view";

import { useGetAllUsers, useGetAllUserSessions } from "@/hooks/users/use-staffs";
import { ROLE_BADGE_THEMES } from "@/types/user";

import type { UserListItem } from "@/lib/api";

// KPI card
function KpiCard({
    icon: Icon,
    iconColor,
    iconBg,
    label,
    value,
}: {
    icon: any;
    iconColor: string;
    iconBg: string;
    label: string;
    value: number;
}) {
    return (
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
                <Icon className={`h-5 w-5 ${iconColor}`} />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{label}</p>
                <p className="text-2xl font-black text-slate-800 leading-tight">{value}</p>
            </div>
        </div>
    );
}


// Table row actions
function StaffRowActions({ user }: { user: UserListItem }) {
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [resetOpen, setResetOpen] = useState(false);
    const [disableOpen, setDisableOpen] = useState(false);
    const [restoreOpen, setRestoreOpen] = useState(false);

    return (
        <>
            <div className="flex items-center gap-1 justify-end">
                <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 rounded-lg text-xs gap-1 text-slate-500"
                    onClick={() => router.push(`/staff/${user.id}`)}
                >
                    View <ArrowRight className="h-3 w-3" />
                </Button>

                <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-7 w-7 p-0 rounded-lg text-slate-400">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                            Actions
                        </DropdownMenuLabel>

                        <DropdownMenuItem
                            onSelect={(e) => { e.preventDefault(); setDropdownOpen(false); setEditOpen(true); }}
                            className="gap-2 text-xs cursor-pointer"
                        >
                            <Settings className="h-3.5 w-3.5" /> Edit Account
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onSelect={(e) => { e.preventDefault(); setDropdownOpen(false); setResetOpen(true); }}
                            className="gap-2 text-xs cursor-pointer"
                        >
                            <KeyRound className="h-3.5 w-3.5 text-amber-500" /> Reset Password
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        {user.is_active ? (
                            <DropdownMenuItem
                                onSelect={(e) => { e.preventDefault(); setDropdownOpen(false); setDisableOpen(true); }}
                                className="gap-2 text-xs text-rose-600 focus:text-rose-700 focus:bg-rose-50 cursor-pointer"
                            >
                                <UserX className="h-3.5 w-3.5" /> Disable
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem
                                onSelect={(e) => { e.preventDefault(); setDropdownOpen(false); setRestoreOpen(true); }}
                                className="gap-2 text-xs text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50 cursor-pointer"
                            >
                                <UserCheck className="h-3.5 w-3.5" /> Restore
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <UserEditDialog user={user} open={editOpen} onOpenChange={setEditOpen} />
            <ResetPasswordDialog user={user} open={resetOpen} onOpenChange={setResetOpen} />
            <DisableUserDialog userId={user.id} open={disableOpen} onOpenChange={setDisableOpen} />
            <RestoreUserDialog userId={user.id} open={restoreOpen} onOpenChange={setRestoreOpen} />
        </>
    );
}


// Staff table
function StaffTable({
    users,
    onlineUserIds,
}: {
    users: UserListItem[];
    onlineUserIds: Set<string>;
}) {
    if (!users.length) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-400">
                No staff found matching your filters.
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-50 border-b border-slate-100 select-none">
                        <TableHead className="w-12" />
                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                            Staff Member
                        </TableHead>
                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                            Role
                        </TableHead>
                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                            Status
                        </TableHead>
                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                            Last Active
                        </TableHead>
                        <TableHead className="text-right text-[10px] font-black text-slate-400 uppercase tracking-wider">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-slate-50">
                    {users.map((user) => {
                        const roleStyle = ROLE_BADGE_THEMES[user.role] ?? "bg-slate-50 text-slate-600 border-slate-200";
                        const initials = user.username.slice(0, 1).toUpperCase();
                        const isOnline = onlineUserIds.has(user.id);

                        return (
                            <TableRow key={user.id} className="hover:bg-slate-50/50">
                                <TableCell>
                                    <div className="relative">
                                        <div className="h-9 w-9 rounded-xl bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center justify-center uppercase">
                                            {initials}
                                        </div>
                                        {isOnline && (
                                            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                                        )}
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-bold text-slate-800">{user.username}</p>
                                        <p className="text-[11px] text-slate-400">{user.email}</p>
                                        {user.phone_number && (
                                            <p className="text-[10px] font-mono text-slate-400">
                                                {user.phone_number}
                                            </p>
                                        )}
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={`text-[9px] font-black px-2 py-0.5 uppercase tracking-wide ${roleStyle}`}
                                    >
                                        {user.role}
                                    </Badge>
                                </TableCell>

                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <Badge
                                            variant="outline"
                                            className={`w-fit text-[10px] font-bold px-2 py-0.5 ${user.is_active
                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                    : "bg-slate-50 text-slate-400 border-slate-200"
                                                }`}
                                        >
                                            {user.is_active ? "Active" : "Inactive"}
                                        </Badge>
                                        {isOnline && (
                                            <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                                                <Wifi className="h-2.5 w-2.5" /> Online
                                            </span>
                                        )}
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <p className="text-xs text-slate-500">
                                        {user.last_active_at
                                            ? new Date(user.last_active_at).toLocaleDateString(undefined, {
                                                month: "short", day: "numeric"
                                            })
                                            : "Never"}
                                    </p>
                                </TableCell>

                                <TableCell>
                                    <StaffRowActions user={user} />
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}


// Page
export default function StaffPage() {
    const router = useRouter();
    const { data, isLoading } = useGetAllUsers();
    const { data: sessionsData } = useGetAllUserSessions();

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const users: UserListItem[] = data?.users ?? [];
    const sessions = (sessionsData as any[]) ?? [];

    // Who has an active session right now
    const onlineUserIds = useMemo(
        () => new Set(sessions.map((s: any) => s.user_id)),
        [sessions]
    );

    const filtered = useMemo(() => {
        return users.filter((u) => {
            const matchSearch =
                u.username.toLowerCase().includes(search.toLowerCase()) ||
                u.email.toLowerCase().includes(search.toLowerCase());
            const matchRole = roleFilter === "ALL" || u.role === roleFilter;
            const matchStatus =
                statusFilter === "ALL" ||
                (statusFilter === "active" && u.is_active) ||
                (statusFilter === "inactive" && !u.is_active) ||
                (statusFilter === "online" && onlineUserIds.has(u.id));
            return matchSearch && matchRole && matchStatus;
        });
    }, [users, search, roleFilter, statusFilter, onlineUserIds]);

    const roles = useMemo(
        () => [...new Set(users.map((u) => u.role))].sort(),
        [users]
    );

    const doctorCount = users.filter((u) => u.role === "doctor").length;
    const activeCount = users.filter((u) => u.is_active).length;

    if (isLoading) return <SectionLoader message="Loading staff directory..." />;

    const hasFilters = search || roleFilter !== "ALL" || statusFilter !== "ALL";

    return (
        <div className="space-y-6">
            <PageHeader
                title="Staff Directory"
                description="Manage clinic workforce, roles and access."
                icon={Users}
                actions={<AddUserButton />}
            />

            {/* KPI row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <KpiCard icon={Users} iconColor="text-brand-700" iconBg="bg-brand-50"
                    label="Total Staff" value={users.length} />
                <KpiCard icon={UserCheck} iconColor="text-emerald-600" iconBg="bg-emerald-50"
                    label="Active" value={activeCount} />
                <KpiCard icon={Stethoscope} iconColor="text-indigo-600" iconBg="bg-indigo-50"
                    label="Doctors" value={doctorCount} />
                <KpiCard icon={Wifi} iconColor="text-sky-600" iconBg="bg-sky-50"
                    label="Online Now" value={onlineUserIds.size} />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or email..."
                        className="pl-9 bg-white"
                    />
                </div>

                <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-40 bg-white">
                        <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Roles</SelectItem>
                        {roles.map((r) => (
                            <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40 bg-white">
                        <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="online">Online Now</SelectItem>
                    </SelectContent>
                </Select>

                {hasFilters && (
                    <Button
                        variant="outline"
                        className="gap-1.5 text-xs"
                        onClick={() => { setSearch(""); setRoleFilter("ALL"); setStatusFilter("ALL"); }}
                    >
                        <RotateCcw className="h-3.5 w-3.5" /> Clear
                    </Button>
                )}

                <p className="text-xs text-slate-400 ml-auto self-center shrink-0">
                    {filtered.length} of {users.length}
                </p>
            </div>

            <StaffTable users={filtered} onlineUserIds={onlineUserIds} />
        </div>
    );
}