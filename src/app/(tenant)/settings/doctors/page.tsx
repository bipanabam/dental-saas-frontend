"use client";

import React from "react";
import {
  Stethoscope,
  PlusCircle,
  Phone,
  Mail,
  Shield,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Settings,
  UserX,
  Building,
  UserCheck,
  Award,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { SectionLoader } from "@/components/base/loading-view";
import SettingsHeader from "@/components/settings/SettingHeader";
import { useDoctors } from "@/hooks/users/use-doctors";

export default function DoctorSettingsPage() {
  const { data = [], isLoading } = useDoctors();

  if (isLoading) {
    return <SectionLoader message="Loading doctors registry..." />;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <SettingsHeader
        title="Medical Staff Registry"
        description="Manage clinician records, system credential statuses, and specific practice permissions."
        icon={Stethoscope}
        actions={
          <Button className="h-10 rounded-xl bg-brand-700 hover:bg-brand-800 font-bold text-xs shadow-3xs px-4 gap-1.5 self-start sm:self-center">
            <PlusCircle className="h-4 w-4 stroke-[2.5]" />
            Add Practitioner
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard 
          title="Registered Clinicians" 
          value={data.length} 
          subtitle="Total medical staff active profiles" 
          icon={<Building className="h-4 w-4 text-slate-400" />}
        />
        <SummaryCard 
          title="Active Duty" 
          value={data.filter((d) => d.is_active).length} 
          subtitle="Currently active scheduling logs" 
          icon={<UserCheck className="h-4 w-4 text-emerald-500" />}
        />
        <SummaryCard 
          title="Verified Licenses" 
          value={data.filter((d) => d.is_verified).length} 
          subtitle="Approved credentials & checks" 
          icon={<Award className="h-4 w-4 text-blue-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {data.map((doctor) => (
          <DoctorProfileCard key={doctor.id} doctor={doctor} />
        ))}
        {data.length === 0 && (
          <div className="lg:col-span-2 text-center p-12 border rounded-2xl border-dashed border-slate-200 text-slate-400 text-xs font-medium">
            No practitioners registered in the local clinic registry database.
          </div>
        )}
      </div>
    </div>
  );
}

/* 
Profile Card Component
*/
const DoctorProfileCard = ({ doctor }: { doctor: any }) => {
  const initials = doctor.username?.substring(0, 2).toUpperCase() || "DR";

  return (
    <Card className="rounded-2xl border-slate-100 shadow-3xs bg-white overflow-hidden flex flex-col justify-between transition-all duration-200 hover:border-slate-200 hover:shadow-2xs">
      <CardContent className="p-5 space-y-4">
        <div className="flex gap-4 items-start">
          {/* Circular Avatar Badge */}
          <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-brand-50 to-brand-100/40 border border-brand-100 flex items-center justify-center font-black text-brand-800 text-sm tracking-tight shrink-0 shadow-4xs select-none">
            {initials}
          </div>

          {/* Clinician Details */}
          <div className="space-y-1 min-w-0 flex-1">
            <h3 className="font-black text-slate-800 text-base tracking-tight truncate leading-none pt-0.5">
              Dr. {doctor.username}
            </h3>
            <Badge variant="outline" className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0 bg-slate-50 border-slate-200 text-slate-500 rounded-md">
              {doctor.role || "Practitioner"}
            </Badge>
            
            {/* Meta Communications Links Strip */}
            <div className="pt-2 space-y-1.5 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-2 truncate">
                <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                {doctor.email}
              </span>

              {doctor.phone_number ? (
                <span className="flex items-center gap-2 font-mono text-[11px]">
                  <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  {doctor.phone_number}
                </span>
              ) : (
                <span className="flex items-center gap-2 text-[11px] text-slate-400 italic">
                  <Phone className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                  No system telephone logged
                </span>
              )}
            </div>
          </div>

          {/* ACtions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 shrink-0 cursor-pointer">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-md border-slate-100 text-xs font-semibold text-slate-700">
              <DropdownMenuItem className="gap-2 cursor-pointer font-bold"><Settings className="h-3.5 w-3.5" /> Edit Profile</DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer font-bold"><Shield className="h-3.5 w-3.5 text-brand-600" /> Security Permissions</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-100" />
              <DropdownMenuItem className="gap-2 cursor-pointer font-black text-rose-600 focus:text-rose-700 focus:bg-rose-50">
                <UserX className="h-3.5 w-3.5" /> Revoke System Access
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </CardContent>

      {/* Separate Lower Status Panel */}
      <div className="bg-slate-50/70 border-t border-slate-100/80 px-5 py-2.5 flex items-center justify-between gap-2">
        {/* Verification Checks Block */}
        <div className="flex items-center gap-1.5 text-[11px] font-bold">
          {doctor.is_verified ? (
            <span className="flex items-center gap-1 text-blue-700">
              <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 fill-blue-50" />
              Medical License Verified
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-700">
              <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
              Credentials Pending
            </span>
          )}
        </div>

        <Badge
          className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-4xs border ${
            doctor.is_active
              ? "bg-emerald-50 text-emerald-700 border-emerald-200/50"
              : "bg-slate-100 text-slate-500 border-slate-200/60"
          }`}
        >
          {doctor.is_active ? "On Duty" : "Suspended"}
        </Badge>
      </div>
    </Card>
  );
};

/* 
Summary Card Component
*/
const SummaryCard = ({ 
  title, 
  value, 
  subtitle, 
  icon 
}: { 
  title: string; 
  value: number; 
  subtitle: string; 
  icon: React.ReactNode; 
}) => {
  return (
    <Card className="rounded-2xl border-slate-100 shadow-3xs bg-white overflow-hidden">
      <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 pb-1">
        <CardTitle className="text-[10px] font-black uppercase tracking-wider text-slate-400">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-1">
        <div className="text-2xl font-black text-slate-800 font-mono tracking-tight leading-none">
          {value}
        </div>
        <CardDescription className="text-[10px] font-semibold text-slate-400/90 tracking-normal truncate">
          {subtitle}
        </CardDescription>
      </CardContent>
    </Card>
  );
};