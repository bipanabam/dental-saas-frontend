"use client";

import { useState } from "react";
import { Plus, UserPlus } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import PatientCreateForm from "./forms/PatientCreateForm";

export default function PatientFormSheet() {
    const [open, setOpen] =
        useState(false);

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger asChild>
                <Button className="bg-brand-700 hover:bg-brand-800">
                    <Plus className="h-4 w-4" />
                    Add New Patient
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-brand-700" />
                        Intake Profile
                    </DialogTitle>

                    <DialogDescription>
                        Register a patient
                    </DialogDescription>
                </DialogHeader>

                <PatientCreateForm
                    onSuccess={() =>
                        setOpen(false)
                    }
                    onCancel={() =>
                        setOpen(false)
                    }
                />
            </DialogContent>
        </Dialog>
    );
}