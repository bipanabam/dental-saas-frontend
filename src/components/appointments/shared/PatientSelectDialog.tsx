"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Search, UserPlus, ArrowRight, X,
    User, Phone, ChevronLeft, Loader2,
    Clock, Calendar,
} from "lucide-react";
import { z } from "zod";
import { format } from "date-fns";

import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useSearchPatients, usePatients } from "@/hooks/patients/use-patients";
import { useCreatePatient } from "@/hooks/patients/use-create-patient";

import {
    type PatientCreateInputs,
} from "@/lib/schemas/patient";



// Minimal quick-create schema
// Only the fields required by the backend — full profile filled later
const quickPatientSchema = z.object({
    first_name: z.string().trim().min(1, "Required"),
    last_name: z.string().trim().min(1, "Required"),
    phone: z
        .string()
        .regex(/^\+?[0-9\s-]+$/, "Digits only")
        .refine((v) => v.replace(/[\s-]/g, "").length >= 10, "Min 10 digits"),
    date_of_birth: z.string().min(1, "Required"),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]).default("OTHER"),
});

type QuickPatientInput = z.input<typeof quickPatientSchema>;
type QuickPatientOutput = z.output<typeof quickPatientSchema>;


// Patient result row
function PatientRow({
    patient,
    onSelect,
}: {
    patient: any;
    onSelect: (id: string) => void;
}) {
    const age = patient.date_of_birth
        ? Math.floor(
            (Date.now() - new Date(patient.date_of_birth).getTime()) /
            (1000 * 60 * 60 * 24 * 365.25)
        )
        : null;

    return (
        <button
            onClick={() => onSelect(patient.id)}
            className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-brand-50 hover:text-brand-800 transition-colors group border-b border-slate-50 last:border-0"
        >
            <div className="h-9 w-9 rounded-xl bg-slate-100 group-hover:bg-brand-100 flex items-center justify-center text-xs font-bold text-slate-600 group-hover:text-brand-700 uppercase shrink-0 transition-colors">
                {patient.first_name?.[0]}{patient.last_name?.[0]}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-slate-800 group-hover:text-brand-800">
                        {patient.first_name} {patient.last_name}
                    </span>
                    {age && (
                        <Badge variant="outline" className="text-[9px] h-4 px-1.5 text-slate-400 font-semibold">
                            {age}y
                        </Badge>
                    )}
                    {patient.visit_count > 0 && (
                        <Badge variant="outline" className="text-[9px] h-4 px-1.5 bg-emerald-50 text-emerald-600 border-emerald-200 font-semibold">
                            {patient.visit_count} visit{patient.visit_count > 1 ? "s" : ""}
                        </Badge>
                    )}
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-[11px] text-slate-400">
                    {patient.phone && (
                        <span className="flex items-center gap-1 font-mono">
                            <Phone className="h-2.5 w-2.5" /> {patient.phone}
                        </span>
                    )}
                    {patient.last_visit_at && (
                        <span className="flex items-center gap-1">
                            <Clock className="h-2.5 w-2.5" />
                            Last visit {new Date(patient.last_visit_at).toLocaleDateString()}
                        </span>
                    )}
                </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-brand-500 shrink-0 transition-colors" />
        </button>
    );
}


// Quick patient create
function QuickCreateForm({
    onCreated,
    onBack,
}: {
    onCreated: (id: string) => void;
    onBack: () => void;
}) {
    const createPatient = useCreatePatient();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<QuickPatientInput, any, QuickPatientOutput>({
        resolver: zodResolver(quickPatientSchema),
        defaultValues: { gender: "OTHER" },
    });

    const disabled = isSubmitting || createPatient.isPending;

    const onSubmit = async (values: QuickPatientOutput) => {
        const res = await createPatient.mutateAsync({
            ...values,
            category: "NEW",
        } as PatientCreateInputs);
        if (res?.id) onCreated(res.id);
    };

    return (
        <div className="space-y-5">
            <div className="flex items-center gap-2">
                <button
                    onClick={onBack}
                    className="text-slate-400 hover:text-slate-700 transition-colors"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>
                <div>
                    <p className="text-sm font-bold text-slate-800">Register New Patient</p>
                    <p className="text-xs text-slate-400">Minimum details to proceed — full profile can be completed later</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-600">
                            First Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            {...register("first_name")}
                            disabled={disabled}
                            placeholder="John"
                            className="bg-white h-9"
                            autoFocus
                        />
                        {errors.first_name && (
                            <p className="text-[11px] text-red-500">{errors.first_name.message}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-600">
                            Last Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            {...register("last_name")}
                            disabled={disabled}
                            placeholder="Doe"
                            className="bg-white h-9"
                        />
                        {errors.last_name && (
                            <p className="text-[11px] text-red-500">{errors.last_name.message}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-600">
                            Phone <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            {...register("phone")}
                            disabled={disabled}
                            placeholder="98XXXXXXXX"
                            className="bg-white h-9"
                            type="tel"
                        />
                        {errors.phone && (
                            <p className="text-[11px] text-red-500">{errors.phone.message}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-600">
                            Date of Birth <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            {...register("date_of_birth")}
                            disabled={disabled}
                            type="date"
                            className="bg-white h-9"
                        />
                        {errors.date_of_birth && (
                            <p className="text-[11px] text-red-500">{errors.date_of_birth.message}</p>
                        )}
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-600">Gender</Label>
                    <div className="flex gap-2">
                        {(["MALE", "FEMALE", "OTHER"] as const).map((g) => (
                            <label key={g} className="flex-1">
                                <input type="radio" {...register("gender")} value={g} className="sr-only peer" />
                                <div className="text-center text-xs font-semibold py-2 rounded-lg border border-slate-200 cursor-pointer transition-colors peer-checked:border-brand-500 peer-checked:bg-brand-50 peer-checked:text-brand-700 hover:bg-slate-50">
                                    {g === "MALE" ? "Male" : g === "FEMALE" ? "Female" : "Other"}
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <Button type="button" variant="ghost" onClick={onBack} disabled={disabled} className="text-xs">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={disabled}
                        className="bg-brand-700 text-xs rounded-xl gap-1.5 min-w-36"
                    >
                        {disabled ? (
                            <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Registering...</>
                        ) : (
                            <><UserPlus className="h-3.5 w-3.5" /> Register & Book</>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}


// Main dialog
type View = "search" | "create";

type Props = {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    initialDate?: Date;
};

export default function PatientSelectDialog({ open, onOpenChange, initialDate }: Props) {
    const router = useRouter();
    const [view, setView] = useState<View>("search");
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const { data: searchResults, isLoading: searching } = useSearchPatients(query);
    const { data: recentData } = usePatients({ limit: 5 });

    const searchPatients = (searchResults as any)?.items ?? searchResults ?? [];
    const recentPatients = (recentData as any)?.items ?? [];

    const showSearch = query.length >= 2;
    const patients = showSearch ? searchPatients : recentPatients;

    // Reset state on open
    useEffect(() => {
        if (open) {
            setView("search");
            setQuery("");
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [open]);

    const handleSelect = (patientId: string) => {
        onOpenChange(false);
        const params = new URLSearchParams({ patientId });
        if (initialDate) {
            params.set("date", format(initialDate, "yyyy-MM-dd"));
        }
        router.push(`/appointments/new?${params.toString()}`);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md rounded-3xl p-0 gap-0 overflow-hidden">
                <DialogHeader className="p-5 pb-4 border-b border-slate-100">
                    <DialogTitle className="flex items-center gap-2 text-base">
                        <Calendar className="h-5 w-5 text-brand-700" />
                        Book Appointment
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        {view === "search"
                            ? initialDate
                                ? `Booking for ${format(initialDate, "EEEE, MMM d")}. Search for an existing patient or register a new one.`
                                : "Search for an existing patient or register a new one."
                            : "Enter minimum details to register and proceed."}
                    </DialogDescription>
                </DialogHeader>

                <div className="p-5">
                    {view === "search" ? (
                        <div className="space-y-4">
                            {/* Search input */}
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                {query && (
                                    <button
                                        onClick={() => setQuery("")}
                                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                                <Input
                                    ref={inputRef}
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search by name or phone..."
                                    className="pl-9 pr-8 bg-slate-50 border-slate-200 focus-visible:ring-brand-500"
                                />
                            </div>

                            {/* Results area */}
                            <div className="rounded-xl border border-slate-200 overflow-hidden">
                                {/* Section label */}
                                <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
                                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                        {showSearch
                                            ? searching
                                                ? "Searching..."
                                                : `${patients.length} result${patients.length !== 1 ? "s" : ""}`
                                            : "Recent Patients"}
                                    </p>
                                </div>

                                <ScrollArea className="max-h-64">
                                    {patients.length === 0 && !searching ? (
                                        <div className="px-4 py-8 text-center">
                                            <User className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                                            <p className="text-xs text-slate-400">
                                                {showSearch
                                                    ? "No patients found. Try a different search or register below."
                                                    : "No recent patients."}
                                            </p>
                                        </div>
                                    ) : (
                                        patients.map((p: any) => (
                                            <PatientRow key={p.id} patient={p} onSelect={handleSelect} />
                                        ))
                                    )}
                                </ScrollArea>
                            </div>

                            <Separator />

                            {/* New patient CTA */}
                            <button
                                onClick={() => setView("create")}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-slate-300 hover:border-brand-400 hover:bg-brand-50/40 transition-colors group"
                            >
                                <div className="h-9 w-9 rounded-xl bg-slate-100 group-hover:bg-brand-100 flex items-center justify-center shrink-0 transition-colors">
                                    <UserPlus className="h-4 w-4 text-slate-500 group-hover:text-brand-600" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-slate-700 group-hover:text-brand-700">
                                        Register New Patient
                                    </p>
                                    <p className="text-[11px] text-slate-400">
                                        New to the clinic? Add minimum details to proceed.
                                    </p>
                                </div>
                                <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-brand-500 ml-auto transition-colors" />
                            </button>
                        </div>
                    ) : (
                        <QuickCreateForm
                            onCreated={handleSelect}
                            onBack={() => setView("search")}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}