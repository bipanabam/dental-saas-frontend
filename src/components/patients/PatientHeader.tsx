"use client";

import { Pencil, Printer, Hash, Calendar, User, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAge } from "@/lib/utils/get-age";

const InfoChip = ({ icon: Icon, label, value }: any) => (
  <div className="flex items-center gap-3 rounded-xl bg-slate-50/70 border border-slate-100 px-3 py-2 transition-colors hover:bg-slate-50">
    <div className="p-1.5 bg-white rounded-lg border border-slate-100 shadow-sm text-slate-500">
      <Icon className="h-3.5 w-3.5" />
    </div>
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="text-sm font-semibold text-slate-800">
        {value || "—"}
      </p>
    </div>
  </div>
);

const PatientHeader = ({ patient }: any) => {
  // Format formatting lookups inline cleanly
  const formatEnum = (str: string) => 
    str ? str.replace(/_POS/g, "+").replace(/_NEG/g, "-").replace(/\b\w/g, l => l.toUpperCase()) : "—";

  return (
    <Card className="border border-slate-100 shadow-sm bg-white overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          
          <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left">
            <Avatar className="h-20 w-20 ring-4 ring-slate-50 shadow-inner">
              <AvatarFallback className="bg-brand-700 text-white font-bold text-xl">
                {patient.first_name?.slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-3.5 flex-1 min-w-0">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 truncate">
                    {patient.first_name} {patient.last_name}
                  </h1>
                  
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                    <Badge variant="secondary" className={`rounded-md text-[10px] uppercase font-bold tracking-wide ${
                      patient.status === "ACTIVE"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : "bg-rose-50 text-rose-700 border border-rose-100"
                    }`}>
                      {patient.status}
                    </Badge>
                    <Badge variant="secondary" className="rounded-md text-[10px] uppercase font-bold tracking-wide bg-blue-50 text-blue-700 border border-blue-100">
                      {patient.category}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs font-medium text-slate-400 mt-1">
                  Electronic Health Record Ledger System
                </p>
              </div>

              {/* Biometric Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 max-w-xl">
                <InfoChip icon={Hash} label="ID Code" value={patient.patient_code} />
                <InfoChip icon={Calendar} label="Age" value={`${getAge(patient.date_of_birth)} yrs`} />
                <InfoChip icon={User} label="Gender" value={formatEnum(patient.gender)} />
                <InfoChip icon={Heart} label="Blood" value={formatEnum(patient.blood_group)} />
              </div>
            </div>
          </div>

          {/* Action */}
          <div className="flex sm:justify-end items-center gap-2 border-t sm:border-0 pt-4 sm:pt-0 border-slate-100">
            <Button size="sm" className="rounded-xl font-semibold gap-2 shadow-sm bg-brand-700 hover:bg-brand-800 text-white flex-1 sm:flex-none">
              <Pencil className="h-3.5 w-3.5" />
              Edit Profile
            </Button>
            <Button size="sm" variant="outline" className="rounded-xl text-slate-600 border-slate-200 hover:bg-slate-50">
              <Printer className="h-3.5 w-3.5" />
            </Button>
          </div>

        </div>
      </CardContent>
    </Card>
  );
};

export default PatientHeader;