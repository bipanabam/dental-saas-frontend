"use client";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Clock, User } from "lucide-react";

import type { TodaysAppointmentListItem } from "@/lib/api";

interface Props {
  appointments: TodaysAppointmentListItem[];

  selectedId?: string;
  isLoading: boolean;

  onSelect: (
    item: TodaysAppointmentListItem
  ) => void;
}


const AppointmentList = ({
  appointments,
  selectedId,
  onSelect,
  isLoading,
}: Props ) => {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Column Status Label Header Block */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Booked Timeline
          </h3>
        </div>
        <Badge className="bg-brand-100 text-brand-800 hover:bg-brand-100 font-bold rounded-md">
          {appointments.length}
        </Badge>
      </div>

      {/* Appointment Cards Stream Container */}
      <div className="space-y-3">
        {appointments.map((item) => {
          const appt = item.appointment;
          const selected = selectedId === appt.id;
          return (
            <div
              key={appt.id}
              onClick={() => onSelect(item)}
              className={cn(
                "p-4 rounded-2xl border transition-all duration-200 cursor-pointer text-left shadow-2xs",
                selected
                ? "border-brand-600 bg-brand-50/50 ring-2 ring-brand-600/10"
                : "border-slate-100 bg-white hover:border-slate-300 hover:shadow-xs"
              )}
            >
              <div className="flex justify-between items-start mb-2.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-50 text-brand-700 text-xs font-bold border border-brand-100">
                  <Clock className="h-3 w-3" /> {appt.appointment_date}
                </span>
                {item.queue && (
                  <Badge className="text-xs font-mono text-white border border-slate-100 px-1.5 py-0.5 rounded">
                    # {item.queue.token_number}
                  </Badge>
                )}
              </div>

              <h4 className="font-bold text-slate-900 text-base">
                {appt.patient.first_name} {appt.patient.last_name}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                {appt.chief_complaint}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-brand-700 flex items-center gap-1">
                  <User className="h-3 w-3" /> {appt.doctor?.email}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AppointmentList;
