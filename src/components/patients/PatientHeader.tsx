"use client";

import { Printer, Hash, Calendar, User, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import PatientActionsMenu from "./PatientActionsMenu";
import { getAge } from "@/lib/utils/get-age";

const PatientHeader = ({ patient, summary }: any) => {
  const formatEnum = (str: string) =>
    str
      ? str
        .replace(/_POS/g, "+")
        .replace(/_NEG/g, "-")
        .replace(/\b\w/g, (l) => l.toUpperCase())
      : "—";

  return (
    <Card className="border border-slate-100 shadow-sm bg-white overflow-hidden">
      <CardContent className="p-5 space-y-4">

        {/* TOP ROW */}
        <div className="flex items-start justify-between gap-4">

          {/* LEFT: IDENTITY */}
          <div className="flex items-center gap-4 min-w-0">
            <Avatar className="h-14 w-14 ring-2 ring-slate-50">
              <AvatarFallback className="bg-brand-700 text-white font-bold">
                {patient.first_name?.[0]}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              {/* NAME + STATUS */}
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold text-slate-900 truncate">
                  {patient.first_name} {patient.last_name}
                </h1>

                <Badge
                  className={`text-[10px] uppercase font-bold ${patient.status === "ACTIVE"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "bg-rose-50 text-rose-700 border border-rose-100"
                    }`}
                >
                  {patient.status}
                </Badge>

                <Badge className="text-[10px] uppercase font-bold bg-blue-50 text-blue-700 border border-blue-100">
                  {patient.category}
                </Badge>
              </div>

              <p className="text-[11px] text-slate-400 mt-0.5">
                EHR • Patient Profile
              </p>
            </div>
          </div>

          {/* RIGHT: ACTIONS */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="rounded-lg text-xs gap-1"
            >
              <Printer className="h-3.5 w-3.5" />
              Print
            </Button>

            <PatientActionsMenu patient={patient} summary={summary} />
          </div>
        </div>

        {/* SECOND ROW: SUBTLE VITAL STRIP */}
        <div className="flex flex-wrap gap-4 text-xs text-slate-600 border-t pt-3">

          <div className="flex items-center gap-1">
            <Hash className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-semibold">{patient.patient_code}</span>
          </div>

          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>{getAge(patient.date_of_birth)} yrs</span>
          </div>

          <div className="flex items-center gap-1">
            <User className="h-3.5 w-3.5 text-slate-400" />
            <span>{formatEnum(patient.gender)}</span>
          </div>

          <div className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5 text-slate-400" />
            <span>{formatEnum(patient.blood_group)}</span>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default PatientHeader;