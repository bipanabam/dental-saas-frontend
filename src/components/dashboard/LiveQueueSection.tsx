"use client";

import { useMemo } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { Clock, User, Activity } from "lucide-react";

import { useTodaysAppointments } from "@/hooks/appointments/use-appointments";
import { useTodaysQueue } from "@/hooks/queues/use-queue";

import { getStatusConfig } from "@/types/appointments";

import { SectionLoader } from "../base/loading-view";

const LiveQueueSection = () => {
  const { data: queueData, isLoading: queueLoading } = useTodaysQueue({
    limit: 20,
  });
  const { data: apptData, isLoading: apptLoading } = useTodaysAppointments();

  const isLoading = queueLoading || apptLoading;

  const queueItems = queueData?.items ?? [];
  const appointmentItems = apptData?.items ?? [];

  const nowServing = useMemo(() => {
    return queueItems.filter((q) => q.queue?.status === "IN_PROGRESS");
  }, [queueItems]);

  const waiting = useMemo(() => {
    return queueItems.filter(
      (q) => q.queue?.status === "WAITING" || q.queue?.status === "SKIPPED",
    );
  }, [queueItems]);

  if (isLoading) {
    return <SectionLoader message="Loading live dashboard..." />
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* LEFT: APPOINTMENT BOARD */}
      <Card className="xl:col-span-4 border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-900">
            <Clock className="h-4 w-4 text-brand-600" />
            Today's Schedule
          </CardTitle>
        </CardHeader>

        <CardContent
          className="relative pl-6 py-4 space-y-5 max-h-105 overflow-y-auto
          before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100"
        >
          {appointmentItems.length === 0 && (
            <p className="text-xs text-slate-400">No appointments today</p>
          )}

          {appointmentItems.map((item) => {
            const appt = item.appointment;
            const date = new Date(appt.appointment_date);
            const status = getStatusConfig(appt.status);

            return (
              <div key={appt.id} className="relative group">
                {/* node */}
                <span className="absolute -left-4.5 top-1 h-2.5 w-2.5 rounded-full bg-brand-500 ring-4 ring-brand-50" />

                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">
                    {date.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>

                  <Badge className={status.className}>{status.label}</Badge>
                </div>

                <div className="mt-1 text-sm font-semibold text-slate-900">
                  {appt.patient.first_name} {appt.patient.last_name}
                </div>

                <div className="text-xs text-slate-400">
                  {appt.appointment_type}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* RIGHT: QUEUE BOARD */}
      <Card className="xl:col-span-8 border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden flex flex-col">
        <CardHeader className="border-b flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold text-slate-900">
            Live Queue Board
          </CardTitle>

          <Badge className="bg-brand-100 text-brand-700">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600 animate-pulse mr-1" />
            Live
          </Badge>
        </CardHeader>

        <CardContent className="p-0">
          {/* NOW SERVING */}
          <div className="px-4 py-3 border-b bg-emerald-50/40">
            <p className="text-xs font-bold text-emerald-700 mb-2">
              Now Serving
            </p>

            {nowServing.length === 0 ? (
              <p className="text-xs text-slate-500">No active patient</p>
            ) : (
              nowServing.slice(0, 2).map((item) => (
                <div
                  key={item.queue.id}
                  className="flex justify-between text-sm"
                >
                  <span className="font-medium">
                    #{item.queue.token_number}{" "}
                    {item.appointment.patient.first_name}
                  </span>
                  <Badge
                    className={
                      getStatusConfig(item.appointment.status).className
                    }
                  >
                    In Progress
                  </Badge>
                </div>
              ))
            )}
          </div>

          {/* TABLE */}
          <div className="max-h-90 overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-white border-b">
                <TableRow>
                  <TableHead>Token</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {queueItems.map((item) => {
                  const appt = item.appointment;
                  const queue = item.queue;

                  const status = getStatusConfig(appt.status);

                  return (
                    <TableRow key={queue.id}>
                      <TableCell className="font-mono text-xs">
                        #{queue.token_number}
                      </TableCell>

                      <TableCell className="font-medium">
                        {appt.patient.first_name} {appt.patient.last_name}
                      </TableCell>

                      <TableCell className="text-xs text-slate-500 flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {appt.doctor?.username ?? "Unassigned"}
                      </TableCell>

                      <TableCell className="text-right">
                        <Badge className={status.className}>
                          {status.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* FOOTER SUMMARY */}
          <div className="border-t px-4 py-3 flex justify-between text-xs text-slate-500">
            <span>Total: {queueItems.length}</span>
            <span className="text-brand-600 font-medium">
              Active: {nowServing.length}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveQueueSection;
