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
import { CalendarDays } from "lucide-react";

import { useTodaysAppointments } from "@/hooks/appointments/use-appointments";

import { getSourceConfig, getStatusConfig } from "@/types/appointments";

const AppointmentTable = () => {
  const router = useRouter();

  const { data, isLoading, error } = useTodaysAppointments();
  const appointments = data?.items ?? [];

  return (
    <Card className="border-slate-100 shadow-sm bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
            <CalendarDays className="h-5 w-5 text-indigo-600" />
            Today’s Schedule
          </CardTitle>
          <CardDescription>
            Live tracking overview of daily clinic appointments
          </CardDescription>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/appointments")}
        >
          View All
        </Button>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border border-slate-100 overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Time / Provider</TableHead>
                <TableHead>Status / Source</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-slate-500">
                    Loading today’s appointments...
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && appointments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-slate-500">
                    No appointments for today
                  </TableCell>
                </TableRow>
              )}

              {appointments.map((item: any) => {
                const appt = item.appointment ?? item;
                const date = new Date(appt.appointment_date);
                const statusConfig = getStatusConfig(appt.status);
                const sourceConfig = getSourceConfig(appt.source);

                return (
                  <TableRow key={appt.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-medium">
                      <div>
                        <p className="text-sm text-slate-900">
                          {appt.patient?.first_name} {appt.patient?.last_name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {appt.patient?.phone}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div>
                        <p className="text-sm text-slate-700">
                          {date.toLocaleTimeString()}
                        </p>
                        <p className="text-xs text-indigo-600">
                          {appt.doctor?.email}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-1.5">
                        {/* STATUS */}
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border w-fit
                          ${statusConfig.className}`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                          {statusConfig.label}
                        </span>

                        {/* SOURCE */}
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                          <span
                            className={`h-2 w-2 rounded-full ${sourceConfig.dot}`}
                          />
                          <span>{sourceConfig.label}</span>
                        </div>

                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          router.push(`/appointments?id=${appt.id}`)
                        }
                      >
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
    </Card>
  );
};

export default AppointmentTable;