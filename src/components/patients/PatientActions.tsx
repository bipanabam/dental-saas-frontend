"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Eye, CalendarPlus, MoreHorizontal, Pencil, UserX } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { ConfirmActionDialog } from "@/components/shared/dialogs/ConfirmActionDialog";
import PatientEditFormSheet from "./forms/PatientEditFormSheet";
import { usePatientDetail } from "@/hooks/patients/use-patients";
import { useDeactivatePatient } from "@/hooks/patients/use-delete-patient";

interface PatientTableActionsProps {
  patient: any;
}

export function PatientTableActions({ patient }: PatientTableActionsProps) {
  const router = useRouter();
  const [openEdit, setOpenEdit] = useState(false);
  const [open, setOpen] = useState(false);

  const { data: patientDetail } = usePatientDetail(patient.id);

  const deactivatePatient = useDeactivatePatient();

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();

    setOpen(false);

    action();
  };

  return (
    <>
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()} className="cursor-pointer">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={(e) =>
            handleAction(e, () => router.push(`/patients/${patient.id}`))
          }
        >
          <Eye className="mr-2 h-4 w-4" />
          Open Chart
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={(e) =>
            handleAction(e, () =>
              router.push(`/appointments/new?patientId=${patient.id}`),
            )
          }
        >
          <CalendarPlus className="mr-2 h-4 w-4" />
          New Appointment
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={(e) => handleAction(e, () => setOpenEdit(true))
          }
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit Details
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <ConfirmActionDialog
          title="Delete patient record?"
          description={`${patient.first_name} will become inactive.`}
          confirmLabel="Delete Patient"
          destructive
          loading={deactivatePatient.isPending}
          onConfirm={async () => {
            await deactivatePatient.mutateAsync(patient.id);

            // close dropdown AFTER success
            setOpen(false);
          }}
          onClose={() => setOpen(false)}
        >
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="text-red-600"
          >
            <UserX className="mr-2 h-4 w-4" />
            Delete Record
          </DropdownMenuItem>
        </ConfirmActionDialog>
      </DropdownMenuContent>
    </DropdownMenu>

    <PatientEditFormSheet
        patient={patientDetail}
        open={openEdit}
        onOpenChange={setOpenEdit}
    />
    </>
  );
}
