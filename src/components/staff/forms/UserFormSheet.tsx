"use client";

import { useState } from "react";
import { UserPlus, UserCog } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import UserCreateForm from "./UserCreateForm";
import UserUpdateForm from "./UserUpdateForm";

type ExistingUser = {
    id: string;
    email: string;
    username: string;
    first_name?: string | null;
    last_name?: string | null;
    phone_number?: string | null;
    role?: string | null;
    is_active: boolean;
    is_verified: boolean;
};

// Create trigger (the "Add User" button)
export function AddUserButton() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                className="rounded-xl bg-brand-700 hover:bg-brand-800 font-bold text-xs shadow-3xs px-4 h-10 gap-1.5"
                onClick={() => setOpen(true)}
            >
                <UserPlus className="h-4 w-4 stroke-[2.5]" />
                Add User
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <UserPlus className="h-5 w-5 text-brand-700" />
                            Add Staff Member
                        </DialogTitle>
                        <DialogDescription>
                            Create a new user account and assign their clinic role.
                        </DialogDescription>
                    </DialogHeader>

                    <UserCreateForm
                        onSuccess={() => setOpen(false)}
                        onCancel={() => setOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}

// Edit trigger (used from UserTable row actions)
export function EditUserButton({ user }: { user: ExistingUser }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                variant="ghost"
                size="sm"
                className="h-8 rounded-lg text-xs text-slate-600 hover:text-slate-800"
                onClick={() => setOpen(true)}
            >
                <UserCog className="h-4 w-4" />
                Edit Profile
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <UserCog className="h-5 w-5 text-brand-700" />
                            Edit User
                        </DialogTitle>
                        <DialogDescription>
                            Update account details, role, or access status for{" "}
                            <span className="font-semibold text-slate-700">
                                {user.username}
                            </span>
                            .
                        </DialogDescription>
                    </DialogHeader>

                    <UserUpdateForm
                        user={user}
                        onSuccess={() => setOpen(false)}
                        onCancel={() => setOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}

export function UserEditDialog({
    user,
    open,
    onOpenChange,
}: {
    user: ExistingUser;
    open: boolean;
    onOpenChange: (v: boolean) => void;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserCog className="h-5 w-5 text-brand-700" />
                        Edit User
                    </DialogTitle>
                    <DialogDescription>
                        Update account details for{" "}
                        <span className="font-semibold text-slate-700">{user.username}</span>.
                    </DialogDescription>
                </DialogHeader>

                <UserUpdateForm
                    user={user}
                    onSuccess={() => onOpenChange(false)}
                    onCancel={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}