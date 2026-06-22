"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useCreateFollowUp } from "@/hooks/appointments/use-appointment-workflow";

type Props = {
    appointmentId?: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function FollowUpDialog({ appointmentId, open, onOpenChange }: Props) {
    const [date, setDate] = useState("");
    const [complaint, setComplaint] = useState("");
    const [notes, setNotes] = useState("");

    const createFollowUp = useCreateFollowUp();

    const handleSubmit = async () => {
        if (!appointmentId || !date) return;

        await createFollowUp.mutateAsync({
            appointmentId,
            payload: {
                appointment_date: new Date(date).toISOString(),
                chief_complaint: complaint || undefined,
                notes: notes || undefined,
            },
        });

        setDate("");
        setComplaint("");
        setNotes("");
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Schedule Follow-up Visit</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="followup-date">Follow-up Date & Time</Label>
                        <Input
                            id="followup-date"
                            type="datetime-local"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="followup-complaint">Chief Complaint (optional)</Label>
                        <Input
                            id="followup-complaint"
                            value={complaint}
                            onChange={(e) => setComplaint(e.target.value)}
                            placeholder="Defaults to original complaint if left blank"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="followup-notes">Notes (optional)</Label>
                        <Textarea
                            id="followup-notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={!date || createFollowUp.isPending}>
                        {createFollowUp.isPending ? "Creating..." : "Create Follow-up"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}