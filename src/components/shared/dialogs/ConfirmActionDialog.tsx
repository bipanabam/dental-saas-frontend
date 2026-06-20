"use client";

import { useState } from "react";

import { Loader2 } from "lucide-react";

import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

type Props = {
    children: React.ReactNode;

    title: string;
    description?: string;

    confirmLabel?: string;
    cancelLabel?: string;

    destructive?: boolean;

    loading?: boolean;

    onConfirm: () => Promise<void> | void;
    onClose?: () => void;
};

export function ConfirmActionDialog({
    children,

    title,
    description,

    confirmLabel = "Confirm",
    cancelLabel = "Cancel",

    destructive = false,
    loading = false,

    onConfirm,
    onClose,
}: Props) {
    const [open, setOpen] =
        useState(false);

    async function handleConfirm(
        e: React.MouseEvent<HTMLButtonElement>,
    ) {
        e.preventDefault();

        try {
            await onConfirm();

            setOpen(false);
        } catch {
            // remain open
        }
    }

    return (
        <AlertDialog
            open={open}
            onOpenChange={(next) => {
                if (!loading) {
                    setOpen(next);
                }
            }}
        >
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {title}
                    </AlertDialogTitle>

                    {description && (
                        <AlertDialogDescription>
                            {description}
                        </AlertDialogDescription>
                    )}
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel
                        disabled={loading}
                        onClick={onClose}
                    >
                        {cancelLabel}
                    </AlertDialogCancel>

                    <AlertDialogAction
                        disabled={loading}
                        onClick={handleConfirm}
                        className={
                            destructive
                                ? "bg-red-600 hover:bg-red-700"
                                : undefined
                        }
                    >
                        {loading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}

                        {confirmLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}