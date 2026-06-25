"use client";

import { useState, useEffect } from "react";
import {
    Bell, CalendarClock, Users, FlaskConical,
    FileText, BarChart2, Shield, Loader2, Save,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SectionLoader } from "@/components/base/loading-view";

import { useUserPreferences, useUpdateUserPreferences } from "@/hooks/users/use-staff-detail";

type PrefsState = {
    notify_appointment: boolean;
    notify_waiting: boolean;
    notify_lab_results: boolean;
    notify_draft_reminder: boolean;
    notify_daily_summary: boolean;
    require_otp: boolean;
};

const NOTIFICATION_PREFS = [
    {
        key: "notify_appointment" as const,
        icon: CalendarClock,
        label: "Appointment Alerts",
        desc: "New, rescheduled, or cancelled appointments",
    },
    {
        key: "notify_waiting" as const,
        icon: Users,
        label: "Waiting Queue Alerts",
        desc: "Patient enters the queue",
    },
    {
        key: "notify_lab_results" as const,
        icon: FlaskConical,
        label: "Lab Result Notifications",
        desc: "Investigation results become available",
    },
    {
        key: "notify_draft_reminder" as const,
        icon: FileText,
        label: "Draft Reminders",
        desc: "Incomplete encounters pending documentation",
    },
    {
        key: "notify_daily_summary" as const,
        icon: BarChart2,
        label: "Daily Summary",
        desc: "End-of-day report with patient stats",
    },
];

function PrefRow({
    icon: Icon,
    label,
    desc,
    checked,
    onChange,
    disabled,
}: {
    icon: any;
    label: string;
    desc: string;
    checked: boolean;
    onChange: (v: boolean) => void;
    disabled?: boolean;
}) {
    return (
        <label className="flex items-center justify-between gap-4 py-3 cursor-pointer group">
            <div className="flex items-start gap-3 min-w-0">
                <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="h-4 w-4 text-slate-500" />
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-700">{label}</p>
                    <p className="text-xs text-slate-400">{desc}</p>
                </div>
            </div>
            <Switch
                checked={checked}
                onCheckedChange={onChange}
                disabled={disabled}
                className="shrink-0"
            />
        </label>
    );
}

export default function PreferencesTab({ userId }: { userId: string }) {
    const { data: prefs, isLoading } = useUserPreferences(userId);
    const update = useUpdateUserPreferences(userId);

    const [form, setForm] = useState<PrefsState>({
        notify_appointment: false,
        notify_waiting: false,
        notify_lab_results: false,
        notify_draft_reminder: false,
        notify_daily_summary: false,
        require_otp: false,
    });
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        if (prefs) {
            setForm({
                notify_appointment: (prefs as any).notify_appointment ?? false,
                notify_waiting: (prefs as any).notify_waiting ?? false,
                notify_lab_results: (prefs as any).notify_lab_results ?? false,
                notify_draft_reminder: (prefs as any).notify_draft_reminder ?? false,
                notify_daily_summary: (prefs as any).notify_daily_summary ?? false,
                require_otp: (prefs as any).require_otp ?? false,
            });
            setIsDirty(false);
        }
    }, [prefs]);

    const set = (key: keyof PrefsState) => (v: boolean) => {
        setForm((f) => ({ ...f, [key]: v }));
        setIsDirty(true);
    };

    const handleSave = async () => {
        await update.mutateAsync(form);
        setIsDirty(false);
    };

    if (isLoading) return <SectionLoader message="Loading preferences..." />;

    return (
        <div className="space-y-4">
            {/* Notifications */}
            <Card className="rounded-2xl border-slate-200 shadow-sm">
                <CardContent className="p-5 space-y-1">
                    <div className="flex items-center gap-2 mb-3">
                        <Bell className="h-4 w-4 text-slate-400" />
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                            Notification Preferences
                        </p>
                    </div>

                    {NOTIFICATION_PREFS.map((pref, i) => (
                        <div key={pref.key}>
                            <PrefRow
                                icon={pref.icon}
                                label={pref.label}
                                desc={pref.desc}
                                checked={form[pref.key]}
                                onChange={set(pref.key)}
                                disabled={update.isPending}
                            />
                            {i < NOTIFICATION_PREFS.length - 1 && (
                                <Separator className="border-slate-50" />
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Security */}
            <Card className="rounded-2xl border-slate-200 shadow-sm p-0">
                <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <Shield className="h-4 w-4 text-slate-400" />
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                            Security
                        </p>
                    </div>
                    <PrefRow
                        icon={Shield}
                        label="Require OTP on Login"
                        desc="User must verify a one-time code each session"
                        checked={form.require_otp}
                        onChange={set("require_otp")}
                        disabled={update.isPending}
                    />
                </CardContent>
            </Card>

            <div className="flex items-center justify-between">
                {isDirty && (
                    <span className="text-xs font-semibold text-amber-600">Unsaved changes</span>
                )}
                <Button
                    onClick={handleSave}
                    disabled={!isDirty || update.isPending}
                    className="ml-auto rounded-xl bg-brand-700 gap-2"
                >
                    {update.isPending ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                    ) : (
                        <><Save className="h-4 w-4" /> Save Preferences</>
                    )}
                </Button>
            </div>
        </div>
    );
}