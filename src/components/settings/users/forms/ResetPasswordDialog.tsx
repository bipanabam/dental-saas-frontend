// components/settings/users/forms/ResetPasswordDialog.tsx
"use client";

import { useState } from "react";
import { KeyRound, Loader2 } from "lucide-react";

import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAdminResetPassword } from "@/hooks/users/use-staffs-mutations";
import type { UserListItem } from "@/lib/api";

export function ResetPasswordDialog({
    user,
    open,
    onOpenChange,
}: {
    user: UserListItem;
    open: boolean;
    onOpenChange: (v: boolean) => void;
}) {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const reset = useAdminResetPassword();

    const mismatch = confirm.length > 0 && password !== confirm;
    const canSubmit = password.length >= 8 && !mismatch && !reset.isPending;

    const handleSubmit = async () => {
        await reset.mutateAsync({ userId: user.id, newPassword: password });
        setPassword("");
        setConfirm("");
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm rounded-3xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <KeyRound className="h-4 w-4 text-amber-500" />
                        Reset Password
                    </DialogTitle>
                    <DialogDescription>
                        Set a new password for{" "}
                        <span className="font-semibold text-slate-700">{user.username}</span>.
                        <br />
                        <span className="text-red-500">Enter at least 8 characters</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-700">
                            New Password
                        </Label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Minimum 8 characters"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-700">
                            Confirm Password
                        </Label>
                        <Input
                            type="password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            placeholder="Repeat password"
                            className={mismatch ? "border-red-300 focus-visible:ring-red-300" : ""}
                        />
                        {mismatch && (
                            <p className="text-[11px] text-red-500 font-medium">
                                Passwords do not match
                            </p>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                        className="bg-amber-500 hover:bg-amber-600"
                    >
                        {reset.isPending ? (
                            <><Loader2 className="h-4 w-4 animate-spin mr-2" />Resetting...</>
                        ) : (
                            "Reset Password"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}