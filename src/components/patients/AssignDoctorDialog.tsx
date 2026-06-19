"use client";

import { Loader2 } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";

import DoctorFilter from "../shared/DoctorFilter";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;

  value?: string;
  onChange: (doctorId?: string) => void;

  onSave: () => void;

  loading?: boolean;
};

const AssignDoctorDialog = ({
  open,
  onOpenChange,
  value,
  onChange,
  onSave,
  loading,
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Assign Primary Doctor</DialogTitle>
        </DialogHeader>

        <DoctorFilter value={value} onChange={onChange} />

        <div className="flex justify-end">
          <Button disabled={!value || loading} onClick={onSave}>
            {loading ? (
                <Loader2 className="animate-spin" />
            ) : (
                <span>
                Save
                </span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignDoctorDialog;
