"use client";

import { Trash2, Loader2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "../ui/button";
import { useRemoveFamilyMember } from "@/hooks/patients/use-family-member";

const RemoveFamilyDialog = ({ patientId, familyMemberId }: any) => {
  const remove = useRemoveFamilyMember(patientId);

  const handleRemove = () => {
    remove.mutate(familyMemberId);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 opacity-30 group-hover:opacity-100 transition-all duration-150 shrink-0"
          title="Remove relation link"
          disabled={remove.isPending}
        >
          {remove.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Trash2 className="h-3.5 w-3.5" />
          )}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove family member?</AlertDialogTitle>

          <AlertDialogDescription>
            This removes the relationship between both profiles. Medical records
            remain unchanged.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex justify-end gap-2">
          <AlertDialogCancel disabled={remove.isPending}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={remove.isPending}
            onClick={handleRemove}
          >
            {remove.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Removing...
              </>
            ) : (
              "Remove"
            )}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RemoveFamilyDialog;