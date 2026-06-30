"use client";

import { useState } from "react";
import { Phone, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { checkCallOrderApiV1QueueQueueIdCheckOrderGet } from "@/lib/api";
import { getApiError } from "@/lib/utils/get-api-error";
import { useQueueActions } from "@/hooks/queues/use-queue-actions";

interface CallPatientButtonProps {
    queueId: string;
    tokenNumber: number;
    loading?: boolean;
    className?: string;
}

export default function CallPatientButton({
    queueId,
    tokenNumber,
    loading = false,
    className,
}: CallPatientButtonProps) {
    const [checking, setChecking] = useState(false);
    const [warningOpen, setWarningOpen] = useState(false);
    const [aheadCount, setAheadCount] = useState(0);

    const { callQueue } = useQueueActions();

    async function handleClick() {
        setChecking(true);
        try {
            const res = await checkCallOrderApiV1QueueQueueIdCheckOrderGet({
                path: { queue_id: queueId },
            });

            if (res.error) throw res.error;

            const { is_next_in_line, waiting_ahead_count } = res.data!;

            if (is_next_in_line) {
                // In order -> call immediately
                await callQueue({ path: { queue_id: queueId } });
            } else {
                // Out of order -> warn first
                setAheadCount(waiting_ahead_count);
                setWarningOpen(true);
            }
        } catch (e) {
            toast.error(getApiError(e));
        } finally {
            setChecking(false);
        }
    }

    async function handleCallAnyway() {
        setWarningOpen(false);
        try {
            await callQueue({ path: { queue_id: queueId } });
        } catch (e) {
            toast.error(getApiError(e));
        }
    }

    const isBusy = checking || loading;

    return (
        <>
            <Button
                size="sm"
                onClick={handleClick}
                disabled={isBusy}
                className={
                    className ??
                    "h-8 rounded-lg text-xs font-bold bg-brand-700 hover:bg-brand-800 text-white gap-1.5 flex-1 shadow-3xs"
                }
            >
                {isBusy
                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    : <Phone className="h-3.5 w-3.5" />
                }
                Announce Token
            </Button>

            <AlertDialog open={warningOpen} onOpenChange={setWarningOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Call out of order?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {aheadCount} patient{aheadCount > 1 ? "s are" : " is"} still
                            waiting ahead of token #{tokenNumber}. Calling this patient now
                            will skip past them. Continue?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCallAnyway}>
                            Call Anyway
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}