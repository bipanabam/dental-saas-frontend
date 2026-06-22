"use client";

import { MoreVertical, CalendarClock, UserPlus, UserX } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type SecondaryAction = "reschedule" | "follow_up" | "no_show";

type Props = {
    status: string;
    onAction: (action: SecondaryAction) => void;
    disabled?: boolean;
};

export default function AppointmentActionsMenu({ status, onAction, disabled }: Props) {
    const canReschedule = !["COMPLETED", "CANCELLED", "CHECKED_IN", "IN_PROGRESS"].includes(status);
    const canNoShow = status === "BOOKED" || status === "CONFIRMED";
    const canFollowUp = status === "COMPLETED";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    disabled={disabled}
                    onClick={(e) => e.stopPropagation()}
                >
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                {canReschedule && (
                    <DropdownMenuItem onClick={() => onAction("reschedule")}>
                        <CalendarClock className="h-4 w-4 mr-2" />
                        Reschedule
                    </DropdownMenuItem>
                )}

                {canFollowUp && (
                    <DropdownMenuItem onClick={() => onAction("follow_up")}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Create Follow-up
                    </DropdownMenuItem>
                )}

                {canReschedule && canFollowUp && <DropdownMenuSeparator />}

                {canNoShow && (
                    <DropdownMenuItem
                        onClick={() => onAction("no_show")}
                        className="text-red-600 focus:text-red-600"
                    >
                        <UserX className="h-4 w-4 mr-2" />
                        Mark No-Show
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}