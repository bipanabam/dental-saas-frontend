"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  Calendar
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Button } from "../../ui/button";

function Item({
  label,
  appointment,
  highlight,
}: any) {
  const href = appointment
    ? `/appointments/${appointment.id}`
    : null;

  return (
    <div
      className={`
        rounded-2xl border p-4 transition-all
        ${highlight
          ? "border-brand-200 bg-brand-50/70"
          : "border-slate-200"
        }
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 min-w-0">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-brand-700" />

            <p className="text-[11px] font-bold uppercase tracking-wide text-brand-700">
              {label}
            </p>
          </div>

          {appointment ? (
            <>
              <p className="font-semibold text-slate-900">
                {new Date(
                  appointment.appointment_date,
                ).toLocaleString()}
              </p>

              <p className="text-sm text-slate-500 line-clamp-2">
                {appointment.chief_complaint || "No complaint recorded"}
              </p>
            </>
          ) : (
            <p className="text-sm text-slate-400">
              No appointment available
            </p>
          )}
        </div>

        {href && (
          <Button
            asChild
            variant={
              highlight
                ? "default"
                : "outline"
            }
            size="sm"
            className="shrink-0 rounded-xl"
          >
            <Link href={href}>
              Open
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}

const AppointmentCard = ({
  latest,
  upcoming,
}: any) => {
  return (
    <Card className="border-slate-100">
      <CardHeader>
        <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Calendar className="h-4 w-4 text-brand-700 stroke-[2.5]" />
          Appointments
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <Item
          label="Upcoming (Next Visit)"
          appointment={upcoming}
          highlight
        />

        <Item
          label="Latest Visit"
          appointment={latest}
        />
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;