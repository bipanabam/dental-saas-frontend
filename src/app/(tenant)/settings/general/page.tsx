"use client";

import { useEffect, useState } from "react";
import {
    Building2, Globe,
    Save, Loader2, Settings2, FlaskConical,
    MessageSquare, Clock, Hash, Users,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import SettingsHeader from "@/components/settings/SettingHeader";
import { SectionLoader } from "@/components/base/loading-view";

import {
    useTenantIdentity,
    useTenantSettings,
    useUpdateTenantIdentity,
    useUpdateTenantSettings,
} from "@/hooks/tenant/use-tenant";


// Shared primitives
function SectionHeading({
    icon: Icon,
    title,
    description,
}: {
    icon: any;
    title: string;
    description?: string;
}) {
    return (
        <div className="flex items-start gap-3 pb-4 border-b border-slate-100">
            <div className="h-8 w-8 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                <Icon className="h-4 w-4 text-brand-700" />
            </div>
            <div>
                <h2 className="text-sm font-bold text-slate-800">{title}</h2>
                {description && (
                    <p className="text-xs text-slate-400 mt-0.5">{description}</p>
                )}
            </div>
        </div>
    );
}

function Field({
    label,
    hint,
    error,
    children,
}: {
    label: string;
    hint?: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700">{label}</Label>
            {children}
            {hint && !error && <p className="text-[11px] text-slate-400">{hint}</p>}
            {error && <p className="text-[11px] text-red-500 font-medium">{error}</p>}
        </div>
    );
}

function ToggleRow({
    icon: Icon,
    label,
    description,
    checked,
    onChange,
    disabled,
}: {
    icon: any;
    label: string;
    description: string;
    checked: boolean;
    onChange: (v: boolean) => void;
    disabled?: boolean;
}) {
    return (
        <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
                <Icon className="h-4 w-4 text-slate-400 shrink-0" />
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-700">{label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{description}</p>
                </div>
            </div>
            <Switch
                checked={checked}
                onCheckedChange={onChange}
                disabled={disabled}
                className="shrink-0 ml-4"
            />
        </label>
    );
}


// Identity section
function IdentitySection() {
    const { data: tenant, isLoading } = useTenantIdentity();
    const update = useUpdateTenantIdentity();

    const [form, setForm] = useState({
        name: "",
        legal_name: "",
        registration_number: "",
        tax_number: "",
        billing_email: "",
        country_code: "",
        currency: "",
        timezone: "",
        language: "",
        logo_url: "",
    });

    useEffect(() => {
        if (tenant) {
            setForm({
                name: tenant.name ?? "",
                legal_name: tenant.legal_name ?? "",
                registration_number: tenant.registration_number ?? "",
                tax_number: tenant.tax_number ?? "",
                billing_email: tenant.billing_email ?? "",
                country_code: tenant.country_code ?? "",
                currency: tenant.currency ?? "",
                timezone: tenant.timezone ?? "",
                language: tenant.language ?? "",
                logo_url: tenant.logo_url ?? "",
            });
        }
    }, [tenant]);

    if (isLoading) return <SectionLoader message="Loading clinic profile..." />;
    if (!tenant) return null;

    const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((f) => ({ ...f, [key]: e.target.value }));

    const handleSave = () =>
        update.mutateAsync(
            Object.fromEntries(
                Object.entries(form).map(([k, v]) => [k, v || null])
            ) as any
        );

    return (
        <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-6 space-y-6">
                <SectionHeading
                    icon={Building2}
                    title="Clinic Identity"
                    description="Public profile and legal information for this clinic."
                />

                {/* Plan badge */}
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Current plan:</span>
                    <Badge className="bg-brand-50 text-brand-700 border-brand-200 text-xs font-bold capitalize">
                        {tenant.plan ?? "—"}
                    </Badge>
                    <Badge
                        variant="outline"
                        className={`text-xs font-bold ${tenant.status === "active"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                    >
                        {tenant.status}
                    </Badge>
                </div>

                <Separator />

                {/* Core identity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Clinic Name" hint="Shown to patients and on receipts">
                        <Input value={form.name} onChange={set("name")} disabled={update.isPending} />
                    </Field>
                    <Field label="Legal Name" hint="Registered legal entity name">
                        <Input value={form.legal_name} onChange={set("legal_name")} disabled={update.isPending} placeholder="Optional" />
                    </Field>
                    <Field label="Registration Number">
                        <Input value={form.registration_number} onChange={set("registration_number")} disabled={update.isPending} placeholder="Optional" />
                    </Field>
                    <Field label="Tax / VAT Number">
                        <Input value={form.tax_number} onChange={set("tax_number")} disabled={update.isPending} placeholder="Optional" />
                    </Field>
                    <Field label="Billing Email">
                        <Input type="email" value={form.billing_email} onChange={set("billing_email")} disabled={update.isPending} placeholder="billing@clinic.com" />
                    </Field>
                    <Field label="Logo URL">
                        <Input value={form.logo_url} onChange={set("logo_url")} disabled={update.isPending} placeholder="https://..." />
                    </Field>
                </div>

                <Separator />

                {/* Locale */}
                <SectionHeading
                    icon={Globe}
                    title="Locale & Region"
                    description="Controls date formats, currency display, and timezone."
                />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <Field label="Country Code">
                        <Input value={form.country_code} onChange={set("country_code")} disabled={update.isPending} placeholder="NP" maxLength={2} />
                    </Field>
                    <Field label="Currency">
                        <Input value={form.currency} onChange={set("currency")} disabled={update.isPending} placeholder="NPR" maxLength={3} />
                    </Field>
                    <Field label="Timezone">
                        <Input value={form.timezone} onChange={set("timezone")} disabled={update.isPending} placeholder="Asia/Kathmandu" />
                    </Field>
                    <Field label="Language">
                        <Input value={form.language} onChange={set("language")} disabled={update.isPending} placeholder="en" maxLength={5} />
                    </Field>
                </div>

                <div className="flex justify-end">
                    <Button
                        onClick={handleSave}
                        disabled={update.isPending}
                        className="rounded-xl bg-brand-700 gap-2"
                    >
                        {update.isPending ? (
                            <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                        ) : (
                            <><Save className="h-4 w-4" /> Save Profile</>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

// Operational settings section

function OperationalSettingsSection() {
    const { data: settings, isLoading } = useTenantSettings();
    const update = useUpdateTenantSettings();

    const [form, setForm] = useState({
        appointment_duration_minutes: 30,
        enable_waitlist: false,
        enable_sms: false,
        enable_lab: false,
        patient_code_prefix: "",
        encounter_number_prefix: "",
    });

    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        if (settings) {
            setForm({
                appointment_duration_minutes: settings.appointment_duration_minutes ?? 30,
                enable_waitlist: settings.enable_waitlist ?? false,
                enable_sms: settings.enable_sms ?? false,
                enable_lab: settings.enable_lab ?? false,
                patient_code_prefix: settings.patient_code_prefix ?? "",
                encounter_number_prefix: settings.encounter_number_prefix ?? "",
            });
            setIsDirty(false);
        }
    }, [settings]);

    const setField = (key: string, value: any) => {
        setForm((f) => ({ ...f, [key]: value }));
        setIsDirty(true);
    };

    const handleSave = async () => {
        await update.mutateAsync({
            appointment_duration_minutes: form.appointment_duration_minutes,
            enable_waitlist: form.enable_waitlist,
            enable_sms: form.enable_sms,
            enable_lab: form.enable_lab,
            patient_code_prefix: form.patient_code_prefix || null,
            encounter_number_prefix: form.encounter_number_prefix || null,
        });
        setIsDirty(false);
    };

    if (isLoading) return <SectionLoader message="Loading settings..." />;
    if (!settings) return null;

    return (
        <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-6 space-y-6">
                <SectionHeading
                    icon={Settings2}
                    title="Clinic Configuration"
                    description="Operational defaults that affect appointments, records, and modules."
                />

                {/* Feature toggles */}
                <div className="space-y-2">
                    <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                        Modules
                    </p>
                    <ToggleRow
                        icon={Users}
                        label="Waitlist"
                        description="Allow patients to join a waitlist when slots are full"
                        checked={form.enable_waitlist}
                        onChange={(v) => setField("enable_waitlist", v)}
                        disabled={update.isPending}
                    />
                    <ToggleRow
                        icon={MessageSquare}
                        label="SMS Notifications"
                        description="Send appointment reminders and updates via SMS"
                        checked={form.enable_sms}
                        onChange={(v) => setField("enable_sms", v)}
                        disabled={update.isPending}
                    />
                    <ToggleRow
                        icon={FlaskConical}
                        label="Lab Module"
                        description="Enable investigation ordering and lab result tracking"
                        checked={form.enable_lab}
                        onChange={(v) => setField("enable_lab", v)}
                        disabled={update.isPending}
                    />
                </div>

                <Separator />

                {/* Numeric + prefix config */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Field
                        label="Default Appointment Duration"
                        hint="Minutes per slot"
                    >
                        <div className="relative">
                            <Clock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                type="number"
                                min={5}
                                step={5}
                                value={form.appointment_duration_minutes}
                                onChange={(e) => setField("appointment_duration_minutes", Number(e.target.value))}
                                disabled={update.isPending}
                                className="pl-9"
                            />
                        </div>
                    </Field>

                    <Field label="Patient Code Prefix" hint="e.g. PT → PT-0001">
                        <div className="relative">
                            <Hash className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                value={form.patient_code_prefix}
                                onChange={(e) => setField("patient_code_prefix", e.target.value.toUpperCase())}
                                disabled={update.isPending}
                                placeholder="PT"
                                maxLength={10}
                                className="pl-9 font-mono uppercase"
                            />
                        </div>
                    </Field>

                    <Field label="Encounter Number Prefix" hint="e.g. ENC → ENC-2024-001">
                        <div className="relative">
                            <Hash className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                value={form.encounter_number_prefix}
                                onChange={(e) => setField("encounter_number_prefix", e.target.value.toUpperCase())}
                                disabled={update.isPending}
                                placeholder="ENC"
                                maxLength={10}
                                className="pl-9 font-mono uppercase"
                            />
                        </div>
                    </Field>
                </div>

                <div className="flex items-center justify-between">
                    {isDirty && (
                        <span className="text-xs font-semibold text-amber-600">
                            Unsaved changes
                        </span>
                    )}
                    <div className="ml-auto">
                        <Button
                            onClick={handleSave}
                            disabled={!isDirty || update.isPending}
                            className="rounded-xl bg-brand-700 gap-2"
                        >
                            {update.isPending ? (
                                <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                            ) : (
                                <><Save className="h-4 w-4" /> Save Settings</>
                            )}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Page
export default function GeneralSettingsPage() {
    return (
        <div className="space-y-6 mx-auto p-5">
            <SettingsHeader 
                title="General Settings"
                description="Manage your clinic's identity, locale, and operational configuration."
                icon={Settings2}
            />
            <IdentitySection />
            <OperationalSettingsSection />
        </div>
    );
}