import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Eye } from "lucide-react";

import { getAge } from "@/lib/utils/get-age";

export const patientColumns = [
  {
    key: "patient_code",
    title: "Code",
    className: "uppercase font-semibold text-slate-600 w-30",

    render: (value: string) => (
      <span className=" font-mono text-xs text-brand-500 font-bold">
        {value}
      </span>
    ),
  },

  {
    key: "name",
    title: "Full Name",
    className: "uppercase font-semibold text-slate-600",

    render: (_: unknown, patient: any) => (
      <>
        {patient.first_name} {patient.last_name}
      </>
    ),
  },

    {
        key: "age_gender",
        title: "Age/Gender",
        className: "uppercase font-semibold text-slate-600",

        render: (_: unknown, patient: any) => {
            const age = getAge(
                patient.date_of_birth
            );

            return (
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className="bg-orange-100 px-2 py-0.5 rounded font-medium border border-orange-200">
                    {age
                    ? `${age}`
                    : "—"}
                </span>
                <span className="bg-slate-100 px-2 py-0.5 rounded font-medium border border-slate-200">
                    {patient.gender.charAt(0)}
                </span>
            </div>
            );
        },
    },

  {
    key: "contact",
    title: "Contact",
    className: "uppercase font-semibold text-slate-600",

    render: (_: unknown, patient: any) => (
        <div className="flex flex-col">
            <span className="text-sm text-slate-700">{patient.phone}</span>
            <span className="text-xs text-slate-400">{patient.email || "N/A"}</span>
        </div>
    ),
  },
    {
        key: "blood_group",
        title: "Biometrics",
        className: "uppercase font-semibold text-slate-600",

        render: (_: unknown, patient: any) => (
            <>
                {patient.blood_group && (
                    <span className="bg-red-50 text-red-700 border border-red-100 px-1.5 py-0.5 rounded font-bold text-[10px]">
                        {patient.blood_group.replace("_POS", "+").replace("_NEG", "-")}
                    </span>
                )}
            </>
        ),
    },

  {
    key: "category",
    title: "Category",
      className: "uppercase font-semibold text-slate-600",

      render: (value: string) => 
        <Badge variant="secondary" className={`rounded-md text-[10px] uppercase font-bold tracking-wide ${value === "VIP" ? "bg-amber-50 text-amber-700 border border-amber-100" :
              value === "CHILD" ? "bg-rose-50 text-rose-700 border border-rose-100" :
                "bg-blue-50 text-blue-700 border border-blue-100"
            }`}>
            {value}
        </Badge>,
  },

  {
    key: "status",
    title: "Status",
      className: "uppercase font-semibold text-slate-600",

    render: (value: string) => 
        <>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${value === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                }`}>
                {value || "INACTIVE"}
            </span>
        </>,
  },

  {
    key: "actions",
    title: "Actions",
      className: "uppercase font-semibold text-slate-600",

    render: () => (
      <Button size="icon" variant="ghost">
        <Eye />
      </Button>
    ),
  },
];
