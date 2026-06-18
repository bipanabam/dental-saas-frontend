"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Plus, ArrowUpRight, ShieldCheck, Loader2 } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import LinkFamilyDialog from "../LinkFamilyDialog";
import RemoveFamilyDialog from "../RemoveFamilyDialog";

import { usePatientFamily } from "@/hooks/patients/use-family-member";

type Props = {
  patientId: string;
};

const relationshipColor = (relation?: string) => {
  switch (relation) {
    case "PARENT":
      return "bg-blue-50 text-blue-700 border-blue-100/70";
    case "CHILD":
      return "bg-emerald-50 text-emerald-700 border-emerald-100/70";
    case "SPOUSE":
      return "bg-violet-50 text-violet-700 border-violet-100/70";
    default:
      return "bg-slate-50 text-slate-600 border-slate-200/60";
  }
};

const FamilyCard = ({ patientId }: Props) => {
  const [open, setOpen] = useState(false);
  const { data, isLoading } = usePatientFamily(patientId);

  return (
    <Card className="overflow-hidden border border-slate-100 shadow-sm bg-white rounded-2xl">
      <CardHeader className="pb-4 border-b border-slate-50 bg-slate-50/20">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Users className="h-4 w-4 text-brand-700 stroke-[2.5]" />
              Family Network
            </CardTitle>
            <p className="text-xs font-semibold text-slate-400">
              Linked co-dependent patient profiles
            </p>
          </div>

          <Button
            size="sm"
            className="h-8 rounded-lg text-xs font-bold bg-brand-700 hover:bg-brand-800 text-white gap-1 px-3 shadow-3xs transition-all"
            onClick={() => setOpen(true)}
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Link Member</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {isLoading && 
        <div className="py-12 text-center border border-dashed border-slate-200/70 rounded-xl bg-slate-50/30 px-4">
            <div className="flex items-center justify-center">
                <Loader2 className="animate-spin text-brand-500" />
            </div>
        </div>
        }

        {/* EMPTY STATE */}
        {!data?.length || !!isLoading && (
          <div className="py-12 text-center border border-dashed border-slate-200/70 rounded-xl bg-slate-50/30 px-4">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 border border-brand-100/50 text-brand-700 shadow-3xs">
              <Users className="h-5 w-5 stroke-[2.2]" />
            </div>
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Isolated Profile
            </h4>
            <p className="text-xs text-slate-400 max-w-60 mx-auto mt-1 leading-normal font-medium">
              No family records found. Link parents, children, or insurance
              guardians for shared check-ins.
            </p>
          </div>
        )}

        {/* POPULATED LIST */}
        <div className="space-y-2">
          {data?.map((member: any) => (
            <div
              key={member.id}
              className="group relative rounded-xl border border-slate-100 bg-white p-3 transition-all duration-200 hover:border-brand-200 hover:bg-brand-50/10 hover:shadow-3xs"
            >
              <div className="flex items-center justify-between gap-4">
                <Link
                  href={`/patients/${member.id}`}
                  className="flex items-center gap-3 flex-1 min-w-0"
                >
                  <Avatar className="h-10 w-10 border border-brand-100/40 shadow-3xs ring-2 ring-slate-50 group-hover:ring-brand-100/50 transition-all shrink-0">
                    <AvatarFallback className="bg-linear-to-br from-brand-600 to-brand-800 text-white font-black text-xs">
                      {member.first_name?.[0]}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-slate-900 text-sm tracking-tight truncate group-hover:text-brand-800 transition-colors">
                        {member.first_name} {member.last_name}
                      </h4>
                      <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 opacity-40 group-hover:opacity-100 group-hover:text-brand-700 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant="outline"
                        className={`text-[9px] font-extrabold px-1.5 py-0 rounded border uppercase tracking-wider shadow-3xs ${relationshipColor(member.relationship_type)}`}
                      >
                        {member.relationship_type?.replace("_", " ")}
                      </Badge>
                      {/* Optional Indicator: If they share the same account manager or insurance */}
                      {member.is_guarantor && (
                        <span className="text-[10px] text-slate-400 flex items-center gap-0.5 font-medium">
                          <ShieldCheck className="h-3 w-3 text-emerald-600" />{" "}
                          Guarantor
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
                <RemoveFamilyDialog patientId={patientId} familyMemberId={member.id} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <LinkFamilyDialog
        open={open}
        onOpenChange={setOpen}
        patientId={patientId}
      />
    </Card>
  );
};

export default FamilyCard;
