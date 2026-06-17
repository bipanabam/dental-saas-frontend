"use client";

import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { CalendarDays, HeartPulse, Edit3 } from "lucide-react";

import { AppointmentListItem } from "@/lib/api";
import type { AppointmentStats } from "@/lib/api";

import { getSourceConfig, getStatusConfig } from "@/types/appointments";

interface Props {
  appointments: AppointmentListItem[];
  isLoading: boolean;
  range: string;
  stats?: AppointmentStats;
}

const AppointmentTable = ({ appointments, isLoading, range, stats }: Props) => {
  const router = useRouter();

  return (
    <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden flex flex-col p-0">
      <CardHeader className="border-b border-slate-100 bg-linear-to-r from-brand-50/40 to-transparent p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-brand-100 flex items-center justify-center shadow-2xs">
              <CalendarDays className="h-5 w-5 text-brand-700" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-slate-900">
                Appointment Schedule
              </CardTitle>
              <CardDescription className="text-xs font-medium text-slate-400 mt-0.5">
                {range === "week"
                  ? "Showing trailing 7 days queue"
                  : "Showing trailing 30 days ledger"}
              </CardDescription>
            </div>
          </div>

          <div className="text-left sm:text-right bg-white sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-0 border-slate-100 shadow-3xs sm:shadow-none">
            <p className="text-2xl font-black text-brand-700 leading-none">
              {stats?.total ?? 0}
            </p>
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mt-1">
              Total Booked
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 min-w-0">
        <div className="relative max-h-130 overflow-y-auto no-scrollbar">
          <Table>
            <TableHeader className="sticky top-0 z-30 bg-slate-50/95 backdrop-blur-xs border-b border-slate-100">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-400 h-11">
                  Patient
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-400 h-11">
                  Time & Provider
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-400 h-11">
                  Status / Source
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-400 text-right h-11 pr-5">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={4} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-950/40">
                        <HeartPulse size={22} className="animate-pulse" />
                      </div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Syncing Schedule Entries...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && appointments.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-48 text-center text-sm font-medium text-slate-400"
                  >
                    No active appointment slots match this query criteria.
                  </TableCell>
                </TableRow>
              )}

              {appointments.map((item: any) => {
                const appt = item.appointment ?? item;
                const date = new Date(appt.appointment_date);
                const statusConfig = getStatusConfig(appt.status);
                const sourceConfig = getSourceConfig(appt.source);

                return (
                  <TableRow
                    key={appt.id}
                    className="hover:bg-slate-50/40 border-b border-slate-100 group transition-colors"
                  >
                    <TableCell className="py-3.5 min-w-60">
                      <div className="space-y-1">
                        <p className="font-medium text-slate-900 group-hover:text-brand-700 transition-colors">
                          {appt.patient?.first_name} {appt.patient?.last_name}
                        </p>

                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                          <span>{appt.patient?.phone}</span>

                          <span className="text-slate-300">•</span>

                          <span className="px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 font-semibold text-[10px] uppercase tracking-wide">
                            {appt.appointment_type}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-3.5">
                      <div className="space-y-1 text-xs">
                        <div className="font-medium text-slate-800">
                          {date.toLocaleDateString([], {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          })}
                        </div>

                        <div className="font-medium text-slate-500">
                          {date.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div className="text-[11px] font-mono font-medium text-brand-600 truncate max-w-45">
                          {appt.doctor?.email?.split("@")[0]}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-3.5">
                      <div className="flex flex-col gap-1.5 items-start">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${statusConfig.className}`}
                        >
                          <span className="h-1 w-1 rounded-full bg-current" />
                          {statusConfig.label}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${sourceConfig.dot}`}
                          />
                          <span>{sourceConfig.label}</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-3.5 text-right pr-5">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl border-slate-200 shadow-2xs hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 transition-all font-semibold gap-1.5"
                        onClick={() =>
                          router.push(`/appointments?id=${appt.id}`)
                        }
                      >
                        <Edit3 className="h-3 w-3" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      {/* Sticky Bottom Status Bar */}
      <div className="border-t border-slate-100 bg-slate-50/70 backdrop-blur-xs px-5 py-3 flex flex-wrap gap-x-6 gap-y-2 justify-between sm:justify-start">
        {[
          { label: "Booked", value: stats?.booked, color: "text-slate-700" },
          {
            label: "Confirmed",
            value: stats?.confirmed,
            color: "text-emerald-600",
          },
          {
            label: "Checked In",
            value: stats?.checked_in,
            color: "text-cyan-600",
          },
          {
            label: "Active",
            value: stats?.in_progress,
            color: "text-brand-600",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="text-xs font-semibold flex items-center gap-1.5"
          >
            <span className="text-slate-400 uppercase tracking-wider text-[10px]">
              {stat.label}:
            </span>
            <span className={`font-bold text-sm ${stat.color}`}>
              {stat.value ?? 0}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AppointmentTable;
