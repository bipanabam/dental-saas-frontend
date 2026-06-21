"use client";

import { useState, useEffect } from "react";
import { UserCheck } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useRescheduleAppointment } from "@/hooks/appointments/use-appointment-workflow";
import { useDoctors } from "@/hooks/users/use-doctors";

type Props = {
    appointmentId?: string;
    currentDoctorId?: string;     // pre-fill with existing assignment
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function RescheduleDialog({
    appointmentId,
    currentDoctorId,
    open,
    onOpenChange,
}: Props) {
    const [date, setDate] = useState("");
    const [doctorId, setDoctorId] = useState<string | undefined>(currentDoctorId);
    const [notes, setNotes] = useState("");

    const reschedule = useRescheduleAppointment();
    const { data: doctors, isLoading: isDoctorsLoading } = useDoctors();

    // re-sync when a different appointment is targeted
    useEffect(() => {
        if (open) setDoctorId(currentDoctorId);
    }, [open, currentDoctorId]);

    const handleSubmit = async () => {
        if (!appointmentId || !date) return;

        await reschedule.mutateAsync({
            appointmentId,
            payload: {
                appointment_date: new Date(date).toISOString(),
                // only send if it actually changed from the current assignment
                assigned_doctor_id:
                    doctorId && doctorId !== currentDoctorId ? doctorId : undefined,
                notes: notes || undefined,
            },
        });

        setDate("");
        setNotes("");
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Reschedule Appointment</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="reschedule-date">New Date & Time</Label>
                        <Input
                            id="reschedule-date"
                            type="datetime-local"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                            <UserCheck className="h-3.5 w-3.5 text-slate-400" />
                            Assigned Dentist
                        </Label>
                        <Select
                            value={doctorId}
                            onValueChange={setDoctorId}
                            disabled={isDoctorsLoading}
                        >
                            <SelectTrigger className="border-slate-200 focus:ring-brand-500 h-10 text-sm bg-white">
                                <SelectValue
                                    placeholder={isDoctorsLoading ? "Loading providers..." : "Keep current doctor"}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {doctors?.length ? (
                                    doctors.map((doctor: any) => (
                                        <SelectItem key={doctor.id} value={doctor.id}>
                                            {doctor.username ?? doctor.email}
                                            {doctor.specialization ? ` (${doctor.specialization})` : ""}
                                        </SelectItem>
                                    ))
                                ) : (
                                    !isDoctorsLoading && (
                                        <div className="px-2 py-1.5 text-xs text-slate-400">
                                            No providers available
                                        </div>
                                    )
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="reschedule-notes">Notes (optional)</Label>
                        <Textarea
                            id="reschedule-notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Reason for rescheduling..."
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={!date || reschedule.isPending}>
                        {reschedule.isPending ? "Rescheduling..." : "Confirm Reschedule"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}