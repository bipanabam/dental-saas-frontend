"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
    ArrowLeft, User, Shield, Stethoscope,
    MonitorSmartphone, Bell, Mail, Phone,
    Check, X, MailCheck, MailX, Wifi,
    Settings, KeyRound, UserX, UserCheck,
    Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SectionLoader } from "@/components/base/loading-view";

import { UserEditDialog } from "@/components/staff/forms/UserFormSheet";
import { ResetPasswordDialog } from "@/components/staff/forms/ResetPasswordDialog";
import { DisableUserDialog } from "@/components/staff/forms/DisableUserDialog";
import { RestoreUserDialog } from "@/components/staff/forms/RestoreUserDialog";

import StaffProfilePanel from "@/components/staff/StaffProfilePanel";
import AccessTab from "@/components/staff/tabs/AccessTab";
import SessionsTab from "@/components/staff/tabs/SessionsTab";
import PreferencesTab from "@/components/staff/tabs/PreferencesTab";
import OverviewTab from "@/components/staff/tabs/OverviewTab";

import { useGetAllUsers } from "@/hooks/users/use-staffs";

import { ROLE_BADGE_THEMES } from "@/types/user";

import type { UserListItem } from "@/lib/api";


// Page header
function StaffDetailHeader({ user }: { user: UserListItem }) {
    const [editOpen, setEditOpen] = useState(false);
    const [resetOpen, setResetOpen] = useState(false);
    const [disableOpen, setDisableOpen] = useState(false);
    const [restoreOpen, setRestoreOpen] = useState(false);

    const roleStyle = ROLE_BADGE_THEMES[user.role] ?? "bg-slate-50 text-slate-600 border-slate-200";

    return (
        <>
            <Card className="rounded-2xl border-slate-200 shadow-sm p-0">
                <CardContent className="p-5">
                    <div className="flex items-start gap-4 flex-wrap">
                        {/* Avatar */}
                        <div className="h-16 w-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-xl font-black text-brand-700 uppercase shrink-0">
                            {user.username.slice(0, 1)}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-lg font-black text-slate-800">{user.username}</h1>
                                <Badge variant="outline" className={`text-[9px] font-black px-2 uppercase ${roleStyle}`}>
                                    {user.role}
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className={`text-[9px] font-bold px-2 ${user.is_active
                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                            : "bg-red-50 text-red-600 border-red-200"
                                        }`}
                                >
                                    {user.is_active ? "Active" : "Disabled"}
                                </Badge>
                            </div>
                            <p className="text-sm text-slate-400 mt-0.5">{user.email}</p>
                            {user.phone_number && (
                                <p className="text-xs text-slate-400 font-mono">{user.phone_number}</p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0 flex-wrap">
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl gap-1.5 text-xs"
                                onClick={() => setResetOpen(true)}
                            >
                                <KeyRound className="h-3.5 w-3.5 text-amber-500" />
                                Reset Password
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl gap-1.5 text-xs"
                                onClick={() => setEditOpen(true)}
                            >
                                <Settings className="h-3.5 w-3.5" />
                                Edit Account
                            </Button>

                            {user.is_active ? (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-xl gap-1.5 text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
                                    onClick={() => setDisableOpen(true)}
                                >
                                    <UserX className="h-3.5 w-3.5" />
                                    Disable
                                </Button>
                            ) : (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-xl gap-1.5 text-xs text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                                    onClick={() => setRestoreOpen(true)}
                                >
                                    <UserCheck className="h-3.5 w-3.5" />
                                    Restore
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <UserEditDialog user={user} open={editOpen} onOpenChange={setEditOpen} />
            <ResetPasswordDialog user={user} open={resetOpen} onOpenChange={setResetOpen} />
            <DisableUserDialog userId={user.id} open={disableOpen} onOpenChange={setDisableOpen} />
            <RestoreUserDialog userId={user.id} open={restoreOpen} onOpenChange={setRestoreOpen} />
        </>
    );
}


// Page
export default function StaffDetailPage() {
    const { id } = useParams();
    const router = useRouter();

    const { data, isLoading } = useGetAllUsers();
    const users: UserListItem[] = data?.users ?? [];
    const user = users.find((u) => u.id === id);

    if (isLoading) return <SectionLoader message="Loading staff detail..." />;

    if (!user) {
        return (
            <div className="text-center py-16">
                <p className="text-sm text-slate-400">Staff member not found.</p>
                <Button variant="ghost" className="mt-3" onClick={() => router.back()}>
                    Go Back
                </Button>
            </div>
        );
    }

    const isDoctor = user.role.toLowerCase() === "doctor";

    return (
        <div className="space-y-5">
            <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-slate-500 -ml-1"
                onClick={() => router.push("/staff")}
            >
                <ArrowLeft className="h-4 w-4" /> Back to Directory
            </Button>

            <StaffDetailHeader user={user} />

            <Tabs defaultValue="overview">
                <TabsList className="bg-slate-100 rounded-xl p-1 h-10 flex-wrap gap-1">
                    <TabsTrigger value="overview" className="rounded-lg text-xs gap-1.5">
                        <User className="h-3.5 w-3.5" /> Overview
                    </TabsTrigger>
                    <TabsTrigger value="access" className="rounded-lg text-xs gap-1.5">
                        <Shield className="h-3.5 w-3.5" /> Access
                    </TabsTrigger>
                    {isDoctor && (
                        <TabsTrigger value="clinical" className="rounded-lg text-xs gap-1.5">
                            <Stethoscope className="h-3.5 w-3.5" /> Clinical
                        </TabsTrigger>
                    )}
                    <TabsTrigger value="sessions" className="rounded-lg text-xs gap-1.5">
                        <MonitorSmartphone className="h-3.5 w-3.5" /> Sessions
                    </TabsTrigger>
                    <TabsTrigger value="prefs" className="rounded-lg text-xs gap-1.5">
                        <Bell className="h-3.5 w-3.5" /> Preferences
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4"><OverviewTab user={user} /></TabsContent>
                <TabsContent value="access" className="mt-4"><AccessTab userId={user.id} /></TabsContent>
                {isDoctor && (
                    <TabsContent value="clinical" className="mt-4">
                        <StaffProfilePanel userId={user.id} username={user.username} role={user.role} />
                    </TabsContent>
                )}
                <TabsContent value="sessions" className="mt-4"><SessionsTab userId={user.id} /></TabsContent>
                <TabsContent value="prefs" className="mt-4"><PreferencesTab userId={user.id} /></TabsContent>
            </Tabs>
        </div>
    );
}