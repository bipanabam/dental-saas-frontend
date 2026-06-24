"use client";

import { KeyRound, Loader2 } from "lucide-react";

import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { useRestoreUser } from "@/hooks/users/use-staffs-mutations";

export function RestoreUserDialog({
    userId,
    open,
    onOpenChange,
}: {
    userId: string;
    open: boolean;
    onOpenChange: (v: boolean) => void;
}) {
    const restore = useRestoreUser();

    const handleSubmit = async () => {
        await restore.mutateAsync(userId);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm rounded-3xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <KeyRound className="h-4 w-4 text-emerald-500" />
                        Disable User?
                    </DialogTitle>
                    <DialogDescription>
                        Restore system credentials
                        and permissions for given user.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={restore.isPending}
                        className="bg-emerald-500 hover:bg-emerald-600"
                    >
                        {restore.isPending ? (
                            <><Loader2 className="h-4 w-4 animate-spin mr-2" />Restoring...</>
                        ) : (
                            "Restore User"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}