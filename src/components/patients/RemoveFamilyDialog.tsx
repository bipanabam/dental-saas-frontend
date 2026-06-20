"use client";

import { Trash2 } from "lucide-react";

import { Button } from "../ui/button";

import { ConfirmActionDialog } from "../shared/dialogs/ConfirmActionDialog";

import { useRemoveFamilyMember } from "@/hooks/patients/use-family-member";

const RemoveFamilyDialog = ({
  patientId,
  familyMemberId,
}: any) => {
  const remove =
    useRemoveFamilyMember(patientId);

  return (
    <ConfirmActionDialog
      title="Remove family member?"
      description="
        This only removes the relationship link.
        Medical records remain unchanged.
        "
      confirmLabel="Remove"
      destructive
      loading={remove.isPending}
      onConfirm={async () => {
        await remove.mutateAsync(
          familyMemberId
        );
      }}
    >
      <Button
        variant="ghost"
        size="icon"
        disabled={remove.isPending}
        className="h-8 w-8 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </ConfirmActionDialog>
  );
}

export default RemoveFamilyDialog;