"use client";

import { useState } from "react";

import {
    Pencil,
    Trash2,
    UserPlus,
    RotateCcw,
    MoreVertical
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import PatientEditFormSheet from "./forms/PatientEditFormSheet";
import { ConfirmActionDialog } from "@/components/shared/dialogs/ConfirmActionDialog";
import AssignDoctorDialog from "./AssignDoctorDialog";

import { usePatientDetail } from "@/hooks/patients/use-patients";
import { useDeactivatePatient } from "@/hooks/patients/use-delete-patient";
import { useAssignPrimaryDoctor } from "@/hooks/patients/use-patient-doctor";

const PatientActionsMenu = ({ patient }: any) => {
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openAssignDoctor, setAssignDoctor] = useState(false);

    const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>(
        patient.assigned_doctor_id ?? patient.primary_doctor_id ?? undefined,
    );

    const { data: patientDetail } = usePatientDetail(patient.id);

    const deactivatePatient = useDeactivatePatient();
    const assignDoctor = useAssignPrimaryDoctor(patient.id);

    const handleAction = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        setOpen(false);
        action();
    };

    async function handleSaveDoctor() {
        if (!selectedDoctorId) return;

        await assignDoctor.mutateAsync({
            path: { patient_id: patient.id },
            query: { doctor_id: selectedDoctorId },
        });

        setAssignDoctor(false);
    }

    return (
        <>
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline" className="rounded-lg">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="rounded-xl w-52">
                    <DropdownMenuItem onClick={(e) => handleAction(e, () => setOpenEdit(true))}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Details
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={(e) => handleAction(e, () => setAssignDoctor(true))}
                    >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Assign Doctor
                    </DropdownMenuItem>

                    {patient.status === "ARCHIVED" && (
                        <DropdownMenuItem>
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Restore
                        </DropdownMenuItem>
                    )}

                    <ConfirmActionDialog
                        title="Delete patient record?"
                        description={`${patient.first_name} will become inactive.`}
                        confirmLabel="Delete Patient"
                        destructive
                        loading={deactivatePatient.isPending}
                        onConfirm={async () => {
                            await deactivatePatient.mutateAsync(patient.id);
                            setOpen(false);
                        }}
                        onClose={() => setOpen(false)}
                    >
                        <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="text-red-600"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </ConfirmActionDialog>
                </DropdownMenuContent>
            </DropdownMenu>

            <PatientEditFormSheet
                patient={patientDetail}
                open={openEdit}
                onOpenChange={setOpenEdit}
            />

            <AssignDoctorDialog
                open={openAssignDoctor}
                onOpenChange={setAssignDoctor}
                value={selectedDoctorId}
                onChange={setSelectedDoctorId}
                onSave={handleSaveDoctor}
                loading={assignDoctor.isPending}
            />
        </>
    );
};

export default PatientActionsMenu;