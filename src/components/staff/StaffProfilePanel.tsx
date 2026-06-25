"use client";

import { useState } from "react";
import { UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionLoader } from "@/components/base/loading-view";
import { useGetUserProfile } from "@/hooks/users/use-staffs";
import EditProfileDialog from "./forms/EditProfileDialog";

function ProfileRow({ label, value, isMono = false }: { label: string; value?: string | number | null; isMono?: boolean }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] py-2.5 border-b border-slate-100 last:border-0 items-baseline gap-1 sm:gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {label}
            </span>
            <span className={`text-xs font-medium text-slate-700 leading-relaxed ${isMono ? "font-mono" : ""}`}>
                {value ?? "—"}
            </span>
        </div>
    );
}

export default function StaffProfilePanel({ userId, username, role }: { userId: string; username: string; role: string }) {
    const { data: profile, isLoading } = useGetUserProfile(userId);
    const [editOpen, setEditOpen] = useState(false);

    if (isLoading) return <SectionLoader message="Loading registry records..." />;

    const isDoctor = role.toLowerCase() === "doctor";

    return (
        <>
            <div className="space-y-4">
                {/* Clean Master Title Line */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="space-y-0.5">
                        <h3 className="text-sm font-bold text-slate-800">Staff Profile Record</h3>
                        <p className="text-[11px] text-slate-400">Comprehensive credentials ledger</p>
                    </div>
                    <Button
                        size="sm"
                        variant="outline"
                        className="h-7 rounded-lg text-xs gap-1.5 font-semibold text-slate-600 border-slate-200 hover:bg-slate-50"
                        onClick={() => setEditOpen(true)}
                    >
                        <UserCog className="h-3.5 w-3.5 text-slate-400" />
                        Edit Profile
                    </Button>
                </div>

                {!profile ? (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
                        <p className="text-xs text-slate-400 font-medium">No profile info mapped to this record.</p>
                        <Button
                            size="sm"
                            variant="outline"
                            className="mt-3 h-7 rounded-lg text-xs gap-1.5"
                            onClick={() => setEditOpen(true)}
                        >
                            <UserCog className="h-3.5 w-3.5" />
                            Initialize Profile
                        </Button>
                    </div>
                ) : (
                    <div className="bg-white border border-slate-200/80 rounded-xl divide-y divide-slate-100 shadow-sm overflow-hidden">

                        {/* Demographic Segment */}
                        <div className="p-4 sm:p-5">
                            <ProfileRow label="Bio Description" value={profile.bio} />
                            <ProfileRow label="Gender Identity" value={profile.gender} />
                            <ProfileRow
                                label="Date of Birth"
                                value={profile.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : null}
                                isMono
                            />
                            <ProfileRow label="Physical Address" value={profile.address} />
                        </div>

                        {/* Clinical Segment (Only appended if physician credentials match) */}
                        {isDoctor && (
                            <div className="p-4 sm:p-5 bg-brand-50/20">
                                <div className="mb-3">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-brand-700 font-mono">
                                        [ Clinical Registration Records ]
                                    </p>
                                </div>
                                <ProfileRow label="Specialization" value={profile.specialization} />
                                <ProfileRow label="NMC Reg. No." value={profile.nmc_reg_no} isMono />
                                <ProfileRow label="Qualification" value={profile.qualification} />
                                <ProfileRow
                                    label="Active Practice"
                                    value={profile.experience_years ? `${profile.experience_years} Years Active` : null}
                                />
                                <ProfileRow
                                    label="Base Consultation"
                                    value={profile.consultation_fee ? `Rs. ${profile.consultation_fee}` : null}
                                    isMono
                                />
                            </div>
                        )}

                    </div>
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