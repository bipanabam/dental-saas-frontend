"use client";

import { KeyRound, Loader2 } from "lucide-react";

import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { useDisableUser } from "@/hooks/users/use-staffs-mutations";

export function DisableUserDialog({
    userId,
    open,
    onOpenChange,
}: {
    userId: string;
    open: boolean;
    onOpenChange: (v: boolean) => void;
}) {
    const disable = useDisableUser();

    const handleSubmit = async () => {
        await disable.mutateAsync(userId);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm rounded-3xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <KeyRound className="h-4 w-4 text-red-500" />
                        Disable User?
                    </DialogTitle>
                    <DialogDescription>
                        This will disable all the system's credentials
                        and permissions for given user.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={disable.isPending}
                        className="bg-red-500 hover:bg-red-600"
                    >
                        {disable.isPending ? (
                            <><Loader2 className="h-4 w-4 animate-spin mr-2" />Disabling...</>
                        ) : (
                            "Disable User"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}