"use client";

import { useMemo, useState } from "react";
import {
    Users,
    UserX,
    UserCheck,
    UserPlus,
    RotateCcw,
    Search,
    Settings2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

import UserFilterSelect from "@/components/settings/users/UserFilterSelect";
import UserTable from "@/components/settings/users/UserTable";
import { SectionLoader } from "@/components/base/loading-view";

import { useGetAllUsers } from "@/hooks/users/use-staffs";
import { roleFilters } from "@/types/user";

export default function UsersSettingsPage() {
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    const { data, isLoading } = useGetAllUsers();
    const users = data?.users ?? [];

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchesRole = roleFilter === "ALL" || user.role === roleFilter;

            const matchesSearch =
                user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesRole && matchesSearch;
        });
    }, [users, roleFilter, searchQuery]);

    const activeUsers = useMemo(
        () => filteredUsers.filter((u) => u.is_active),
        [filteredUsers],
    );

    const disabledUsers = useMemo(
        () => filteredUsers.filter((u) => !u.is_active),
        [filteredUsers],
    );

    const resetFilters = () => {
        setRoleFilter("ALL");
        setSearchQuery("");
    };

    if (isLoading) {
        return <SectionLoader message="Loading users" />;
    }

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Header */}
            <section className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div className="space-y-1">
                    <h1 className="flex items-center gap-2 text-xl font-black text-slate-800 tracking-tight">
                        <Settings2 className="h-5 w-5 text-brand-700" />
                        Clinic Membership & Access Controls
                    </h1>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
                        Manage access, invitations and staff permissions.
                    </p>
                </div>

                <Button className="rounded-xl bg-brand-700 hover:bg-brand-800 font-bold text-xs shadow-3xs px-4 h-10 gap-1.5">
                    <UserPlus className="h-4 w-4 stroke-[2.5]" />
                    Invite User
                </Button>
            </section>

            {/* Stats Cards */}
            <section className="grid sm:grid-cols-3 gap-4">
                <StatCard
                    icon={<Users className="h-5 w-5 text-brand-700" />}
                    iconBg="bg-brand-50"
                    title="Total Accounts"
                    value={users.length}
                />
                <StatCard
                    icon={<UserCheck className="h-5 w-5 text-emerald-600" />}
                    iconBg="bg-emerald-50"
                    title="Active Users"
                    value={activeUsers.length}
                />
                <StatCard
                    icon={<UserX className="h-5 w-5 text-slate-500" />}
                    iconBg="bg-slate-100"
                    title="Disabled Users"
                    value={disabledUsers.length}
                />
            </section>

            {/* Filters */}
            <Card className="rounded-2xl border-slate-100 shadow-3xs bg-slate-50/40 overflow-hidden">
                <CardContent className="p-3 flex flex-col md:flex-row gap-3 justify-between items-center">
                    {/* Left Side: Search query */}
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            className="pl-9 h-10 rounded-xl border-slate-200/70 bg-white text-xs font-medium text-slate-700 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-slate-200 focus-visible:border-slate-300"
                            placeholder="Search by name or email details..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Right Side: Select dropdown filter */}
                    <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                        <UserFilterSelect
                            field={roleFilters}
                            value={roleFilter}
                            onChange={setRoleFilter}
                        />

                        <Button
                            variant="outline"
                            onClick={resetFilters}
                            className="h-10 rounded-xl border-slate-200 bg-white text-slate-600 font-bold text-xs tracking-wide hover:bg-slate-50 hover:text-slate-700 transition-colors shadow-3xs px-4 gap-1.5"
                        >
                            <RotateCcw className="h-3.5 w-3.5 stroke-[2.5]" />
                            Reset Filters
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Tables Display Area */}
            <section className="space-y-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 pl-0.5">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        <h2 className="text-xs font-black uppercase text-slate-800 tracking-wider">
                            Active Users ({activeUsers.length})
                        </h2>
                    </div>
                    <UserTable data={activeUsers} />
                </div>

                {!!disabledUsers.length && (
                    <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-2 pl-0.5">
                            <div className="h-2 w-2 rounded-full bg-slate-400" />
                            <h2 className="text-xs font-black uppercase text-slate-500 tracking-wider">
                                Disabled Users ({disabledUsers.length})
                            </h2>
                        </div>
                        <UserTable data={disabledUsers} />
                    </div>
                )}
            </section>
        </div>
    );
}

function StatCard({
    icon,
    iconBg,
    title,
    value,
}: {
    icon: React.ReactNode;
    iconBg: string;
    title: string;
    value: number;
}) {
    return (
        <Card className="rounded-2xl border-slate-100 shadow-3xs bg-white overflow-hidden transition-all duration-200 hover:border-slate-200/80">
            <CardContent className="p-4 flex items-center gap-4">
                <div
                    className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 shadow-4xs ${iconBg}`}
                >
                    {icon}
                </div>

                <div className="space-y-0.5 min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 block truncate">
                        {title}
                    </p>
                    <p className="text-2xl font-black text-slate-800 font-mono tracking-tight leading-none">
                        {value}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
