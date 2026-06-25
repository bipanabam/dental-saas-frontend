"use client";

import { useState } from "react";
import { UserCog } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionLoader } from "@/components/base/loading-view";

import { useGetUserProfile } from "@/hooks/users/use-staffs";
import EditProfileDialog from "./forms/EditProfileDialog";

function ProfileRow({
    label,
    value,
}: {
    label: string;
    value?: string | number | null;
}) {
    return (
        <div className="flex justify-between py-2.5 border-b border-slate-50 last:border-0">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                {label}
            </span>
            <span className="text-xs font-semibold text-slate-700">{value ?? "—"}</span>
        </div>
    );
}

export default function StaffProfilePanel({
    userId,
    username,
    role,
}: {
    userId: string;
    username: string;
    role: string;
}) {
    const { data: profile, isLoading } = useGetUserProfile(userId);
    const [editOpen, setEditOpen] = useState(false);

    if (isLoading) return <SectionLoader message="Loading profile..." />;

    const isDoctor = role.toLowerCase() === "doctor";

    return (
        <>
            <div className="space-y-4">
                {/* Header row with edit button */}
                <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Profile
                    </p>
                    <Button
                        size="sm"
                        variant="outline"
                        className="h-7 rounded-lg text-xs gap-1.5"
                        onClick={() => setEditOpen(true)}
                    >
                        <UserCog className="h-3.5 w-3.5" />
                        Edit Profile
                    </Button>
                </div>

                {!profile ? (
                    <div className="rounded-xl border-2 border-dashed border-slate-200 p-8 text-center">
                        <p className="text-xs text-slate-400">
                            No profile information recorded yet.
                        </p>
                        <Button
                            size="sm"
                            variant="outline"
                            className="mt-3 h-7 rounded-lg text-xs gap-1.5"
                            onClick={() => setEditOpen(true)}
                        >
                            <UserCog className="h-3.5 w-3.5" />
                            Add Profile Info
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="rounded-xl border border-slate-200 p-4">
                            <ProfileRow label="Bio" value={profile.bio} />
                            <ProfileRow label="Gender" value={profile.gender} />
                            <ProfileRow
                                label="Date of Birth"
                                value={
                                    profile.date_of_birth
                                        ? new Date(profile.date_of_birth).toLocaleDateString()
                                        : null
                                }
                            />
                            <ProfileRow label="Address" value={profile.address} />
                        </div>

                        {isDoctor && (
                            <div className="rounded-xl border border-brand-100 bg-brand-50/30 p-4">
                                <p className="text-[10px] font-black uppercase tracking-wider text-brand-600 mb-3">
                                    Clinical Info
                                </p>
                                <ProfileRow label="Specialization" value={profile.specialization} />
                                <ProfileRow label="NMC Reg. No." value={profile.nmc_reg_no} />
                                <ProfileRow label="Qualification" value={profile.qualification} />
                                <ProfileRow
                                    label="Experience"
                                    value={
                                        profile.experience_years
                                            ? `${profile.experience_years} years`
                                            : null
                                    }
                                />
                                <ProfileRow
                                    label="Consultation Fee"
                                    value={
                                        profile.consultation_fee
                                            ? `Rs ${profile.consultation_fee}`
                                            : null
                                    }
                                />
                            </div>
                        )}
                    </>
                )}
            </div>

            <EditProfileDialog
                userId={userId}
                username={username}
                role={role}
                profile={profile}
                open={editOpen}
                onOpenChange={setEditOpen}
            />
        </>
    );
}