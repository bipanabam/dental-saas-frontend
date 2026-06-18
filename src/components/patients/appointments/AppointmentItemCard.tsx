"use client";

import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
    User,
    ArrowUpRight,
    MessageSquare,
    Globe,
    Phone,
    HelpCircle,
    CreditCard
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

import type { PatientAppointmentListItem } from "@/lib/api";


const STATUS_THEMES: Record<string, string> = {
    BOOKED: "bg-blue-50 text-blue-700 border-blue-100",
    CONFIRMED: "bg-sky-50 text-sky-700 border-sky-100",
    CHECKED_IN: "bg-purple-50 text-purple-700 border-purple-100",
    IN_PROGRESS: "bg-amber-50 text-amber-700 border-amber-200/70 animate-pulse",
    COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-100",
    NO_SHOW: "bg-slate-100 text-slate-500 border-slate-200/60",
    CANCELLED: "bg-rose-50 text-rose-600 border-rose-100 line-through",
};

const TYPE_THEMES: Record<string, string> = {
    WALK_IN: "bg-orange-50 text-orange-700 border-orange-100",
    BOOKED: "bg-indigo-50 text-indigo-700 border-indigo-100",
    FOLLOW_UP: "bg-teal-50 text-teal-700 border-teal-100",
    RESCHEDULED: "bg-violet-50 text-violet-700 border-violet-100",
};

const SOURCE_ICONS: Record<string, { icon: React.ComponentType<any>; style: string }> = {
    WHATSAPP: { icon: MessageSquare, style: "text-emerald-600 bg-emerald-50/50 border-emerald-100" },
    FRONT_DESK: { icon: User, style: "text-slate-600 bg-slate-50 border-slate-200/60" },
    ONLINE: { icon: Globe, style: "text-blue-600 bg-blue-50/50 border-blue-100" },
    PHONE: { icon: Phone, style: "text-indigo-600 bg-indigo-50/50 border-indigo-100" },
};

const AppointmentItemCard = ({ item, isLast }: { item: PatientAppointmentListItem; isLast: boolean }) => {
    const dateObj = new Date(item.appointment_date);

    const statusStyle = STATUS_THEMES[item.status] ?? "bg-slate-50 text-slate-600 border-slate-200";
    const typeStyle = TYPE_THEMES[item.appointment_type] ?? "bg-slate-50 text-slate-600 border-slate-200";
    const sourceMeta = SOURCE_ICONS[item.source] ?? { icon: HelpCircle, style: "text-slate-400 bg-slate-50 border-slate-100" };
    const SourceIcon = sourceMeta.icon;

    return (
        <div className="relative pl-8 group pb-6">

            {!isLast && (
                <div className="absolute left-1.75 top-6 bottom-0 w-px bg-slate-200 group-hover:bg-brand-200 transition-colors" />
            )}

            {/* Dot */}
            <div className={`absolute left-0 top-3 h-3.75 w-3.75 rounded-full border-2 border-white shadow-3xs transition-all duration-300 ${item.status === "IN_PROGRESS" ? "bg-amber-500 ring-2 ring-amber-100" : "bg-slate-300 ring-2 ring-slate-100 group-hover:bg-brand-600 group-hover:ring-brand-100"
                }`} />

            <div className="bg-white border border-slate-100 rounded-2xl shadow-3xs p-4 transition-all duration-200 hover:border-slate-200 hover:shadow-2xs flex gap-4 items-start">

                {/* Left Side: Traditional Calendar Grid Block Stamp */}
                <div className="w-14 h-14 bg-slate-50 border border-slate-100/80 rounded-xl flex flex-col items-center justify-center shrink-0 shadow-3xs select-none">
                    <span className="text-[10px] font-black tracking-widest uppercase text-slate-400 leading-none">
                        {format(dateObj, "MMM")}
                    </span>
                    <span className="text-xl font-black text-slate-800 tracking-tight leading-none mt-1">
                        {format(dateObj, "dd")}
                    </span>
                </div>

                {/* Right Side: Primary Encounter Info */}
                <div className="space-y-3 flex-1 min-w-0">

                    {/* Doctor and Quick badging */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="space-y-0.5">
                            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase block">Attending Practitioner</span>
                            <p className="text-sm font-black text-slate-800 tracking-tight truncate">
                                Dr. {item.doctor?.email?.split("@")[0] || "Staff Doctor"}
                            </p>
                        </div>

                        {/* Direct Status Tags Row */}
                        <div className="flex flex-wrap items-center gap-1.5">
                            <Badge variant="outline" className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded tracking-wide uppercase ${statusStyle}`}>
                                {item.status?.replace("_", " ")}
                            </Badge>
                            <Badge variant="outline" className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded tracking-wide uppercase ${typeStyle}`}>
                                {item.appointment_type?.replace("_", " ")}
                            </Badge>
                        </div>
                    </div>

                    {/* Chief Complaint Entry Block */}
                    <div className="text-xs font-semibold text-slate-500 bg-slate-50/50 p-2 rounded-xl border border-slate-100/50 flex items-baseline gap-1.5">
                        <span className="text-[10px] uppercase font-black tracking-wide text-slate-400 shrink-0">Complaint:</span>
                        <p className="text-slate-700 truncate font-medium">
                            {item.chief_complaint && item.chief_complaint !== "string" ? item.chief_complaint : "No specific symptoms logged"}
                        </p>
                    </div>

                    {/* Footer Grid Row Elements Strip */}
                    <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs text-slate-400">
                        <div className={`px-2 py-1 rounded-lg border flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide shadow-3xs ${sourceMeta.style}`}>
                            <SourceIcon className="h-3 w-3 shrink-0" />
                            <span>{item.source?.replace("_", " ")}</span>
                        </div>

                        {/* Financial State Badge */}
                        <div className={`px-2 py-1 rounded-lg border flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide shadow-3xs ${item.payment_status === "PENDING" ? "bg-rose-50 text-rose-700 border-rose-100/60" : "bg-emerald-50 text-emerald-700 border-emerald-100"
                            }`}>
                            <CreditCard className="h-3 w-3 shrink-0" />
                            <span>Bill: {item.payment_status}</span>
                        </div>

                        {/* Booking Initialization Log */}
                        <span className="text-[10px] font-mono font-medium ml-auto sm:block hidden">
                            Logged: {format(new Date(item.created_at), "dd MMM HH:mm")}
                        </span>
                    </div>

                </div>

                <Link
                    href={`/appointments/${item.id}`}
                    className="h-8 w-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700 text-slate-400 transition-all shadow-3xs self-center"
                    title="Open internal appointment scheduling console"
                >
                    <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
                </Link>

            </div>
        </div>
    );
};

export default AppointmentItemCard;