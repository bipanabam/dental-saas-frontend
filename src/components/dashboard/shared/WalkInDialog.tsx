"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Footprints, Search, Loader2, X } from "lucide-react";
import { z } from "zod";

import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from "@/components/ui/select";

import { useSearchPatients } from "@/hooks/patients/use-patients";
import { useDoctors } from "@/hooks/users/use-doctors";
import { useWalkInAppointment } from "@/hooks/appointments/use-appointment-workflow";

const walkInSchema = z.object({
    patient_id: z.string().uuid("Select a patient"),
    doctor_id: z.string().uuid().optional(),
    chief_complaint: z.string().optional(),
});

type WalkInInput = z.output<typeof walkInSchema>;

export default function WalkInDialog({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
}) {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [selectedPatient, setSelectedPatient] = useState<{ id: string; name: string } | null>(null);

    const { data: searchResults } = useSearchPatients(query);
    const { data: doctorsData } = useDoctors();
    const walkIn = useWalkInAppointment();

    const patients = (searchResults as any)?.items ?? searchResults ?? [];
    const doctors = (doctorsData as any) ?? [];

    const { register, handleSubmit, setValue, reset, formState: { errors } } =
        useForm<WalkInInput>({ resolver: zodResolver(walkInSchema) });

    useEffect(() => {
        if (!open) {
            setQuery("");
            setSelectedPatient(null);
            reset();
        }
    }, [open]);

    const handleSelectPatient = (p: any) => {
        const name = `${p.first_name} ${p.last_name}`;
        setSelectedPatient({ id: p.id, name });
        setValue("patient_id", p.id);
        setQuery("");
    };

    const onSubmit = async (values: WalkInInput) => {
        const res = await walkIn.mutateAsync({
            patient_id: values.patient_id,
            doctor_id: values.doctor_id || undefined,
            chief_complaint: values.chief_complaint || undefined,
        });
        onOpenChange(false);
        // toast already shown in mutation hook
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md rounded-3xl p-0 gap-0 overflow-hidden">
                <DialogHeader className="p-5 pb-4 border-b border-slate-100">
                    <DialogTitle className="flex items-center gap-2 text-base">
                        <Footprints className="h-5 w-5 text-brand-700" />
                        Walk-in Patient
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        Immediately assigns a queue token. No appointment date required.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
                    {/* Patient search */}
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold text-slate-600">
                            Patient <span className="text-red-500">*</span>
                        </Label>

                        {selectedPatient ? (
                            <div className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-brand-200 bg-brand-50">
                                <span className="text-sm font-semibold text-brand-800">
                                    {selectedPatient.name}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => { setSelectedPatient(null); setValue("patient_id", "" as any); }}
                                    className="text-brand-400 hover:text-brand-700"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-1.5">
                                <div className="relative">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Search patient..."
                                        className="pl-9 bg-slate-50"
                                        autoFocus
                                    />
                                </div>

                                {query.length >= 2 && patients.length > 0 && (
                                    <div className="rounded-xl border border-slate-200 overflow-hidden">
                                        <ScrollArea className="max-h-40">
                                            {patients.map((p: any) => (
                                                <button
                                                    type="button"
                                                    key={p.id}
                                                    onClick={() => handleSelectPatient(p)}
                                                    className="w-full text-left px-3 py-2.5 text-sm hover:bg-brand-50 transition-colors border-b border-slate-50 last:border-0"
                                                >
                                                    <span className="font-semibold text-slate-800">
                                                        {p.first_name} {p.last_name}
                                                    </span>
                                                    {p.phone && (
                                                        <span className="text-[11px] text-slate-400 ml-2 font-mono">
                                                            {p.phone}
                                                        </span>
                                                    )}
                                                </button>
                                            ))}
                                        </ScrollArea>
                                    </div>
                                )}
                            </div>
                        )}
                        {errors.patient_id && (
                            <p className="text-[11px] text-red-500">{errors.patient_id.message}</p>
                        )}
                    </div>

                    {/* Doctor select */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-600">
                            Assign Doctor (optional)
                        </Label>
                        <Select onValueChange={(v) => setValue("doctor_id", v)}>
                            <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Any available doctor" />
                            </SelectTrigger>
                            <SelectContent>
                                {doctors.map((d: any) => (
                                    <SelectItem key={d.id} value={d.id}>
                                        {d.username ?? d.email}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Chief complaint */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-600">
                            Chief Complaint (optional)
                        </Label>
                        <Input
                            {...register("chief_complaint")}
                            placeholder="e.g. Toothache, routine checkup..."
                            className="bg-white"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-xs">
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={!selectedPatient || walkIn.isPending}
                            className="bg-brand-700 text-xs rounded-xl gap-1.5 min-w-36"
                        >
                            {walkIn.isPending ? (
                                <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Creating...</>
                            ) : (
                                <><Footprints className="h-3.5 w-3.5" /> Check In & Assign Token</>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}