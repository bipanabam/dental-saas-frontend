"use client";

import {
  UserCheck,
  Calendar,
  Stethoscope,
  ClipboardCopy,
  FileText,
  FolderOpen,
  Clock,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Props {
  appointment?: any;
  loading?: boolean;
}

const AppointmentInspector = ({ appointment, loading }: Props) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">Loading appointment...</CardContent>
      </Card>
    );
  }

  if (!appointment) {
    return (
      <Card>
        <CardContent className="p-6">Select an appointment</CardContent>
      </Card>
    );
  }

  const date = new Date(appointment.appointment_date);

  return (
    <Card className="sticky top-6 rounded-2xl overflow-hidden">
      <CardContent className="p-6 space-y-5">
        {/* Header */}
        <div className="flex justify-between">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="bg-brand-700 text-white">
              AP
            </AvatarFallback>
          </Avatar>

          <Badge>{appointment.status}</Badge>
        </div>

        <div>
          <h2 className="text-xl font-bold">Appointment</h2>
          <p className="text-xs text-muted-foreground">{appointment.id}</p>
        </div>

        <Separator />

        {/* Meta */}
        <div className="grid grid-cols-2 gap-3">
          <Info
            icon={<Calendar size={14} />}
            label="Date"
            value={date.toLocaleDateString()}
          />

          <Info
            icon={<Clock size={14} />}
            label="Time"
            value={date.toLocaleTimeString()}
          />

          <Info
            icon={<Stethoscope size={14} />}
            label="Type"
            value={appointment.appointment_type}
          />

          <Info
            icon={<UserCheck size={14} />}
            label="Payment"
            value={appointment.payment_status}
          />
        </div>

        {/* Complaint */}
        <section>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Chief Complaint</h4>

          <div className="rounded-xl border p-3 text-sm">
            {appointment.chief_complaint || "No complaint"}
          </div>
        </section>

        {/* Procedures */}
        <section className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <ClipboardCopy className="h-3 w-3" /> Planned Procedures
            </h4>

            {appointment.procedures?.length ? (
                appointment.procedures.map((proc: any) => (
                    <div key={proc.id} className="text-xs font-semibold text-brand-900 bg-brand-50/60 border border-brand-100/60 px-3 py-2 rounded-xl">
                        {proc.procedure_catalog?.name ?? "Unnamed Procedure"}
                    </div>
                ))
            ) : (
                <p className="text-sm text-muted-foreground">
                No procedures planned
                </p>
            )}
        </section>

        {/* Notes */}
        <section className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <FileText size={14} />
                Notes
            </h4>

          <div className="rounded-xl border p-3 text-sm">
            {appointment.notes || "No notes"}
          </div>
        </section>

        <Separator />

        <div className="space-y-2">
            {appointment.status !== "CHECKED_IN" && 
                <Button className="w-full">Check In Patient</Button>
            }

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline">Reschedule</Button>

            <Button variant="outline" className="text-red-600">
              Cancel
            </Button>
          </div>

          <Button variant="ghost" className="w-full">
            <FolderOpen />
            Open Chart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

function Info({ icon, label, value }: any) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <div className="flex gap-1 items-center text-xs text-muted-foreground">
        {icon}
        {label}
      </div>

      <div className="font-semibold mt-1">{value || "-"}</div>
    </div>
  );
}

export default AppointmentInspector;
