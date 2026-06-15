"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, ShieldAlert } from "lucide-react";

interface PatientDataTableProps {
    data: any[];
}

const PatientDataTable = ({ data }: PatientDataTableProps) => {
    if (!data.length) {
        return (
            <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-2xl bg-white text-center">
                <ShieldAlert className="h-10 w-10 text-slate-300 mb-3" />
                <p className="text-sm font-semibold text-slate-700">No matching patient tracking found</p>
                <p className="text-xs text-slate-400 mt-1">Refine your active dashboard filter scopes above.</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <Table>
                <TableHeader className="bg-slate-50/70">
                    <TableRow>
                        <TableHead className="font-semibold text-slate-600 w-30">Code</TableHead>
                        <TableHead className="font-semibold text-slate-600">Full Name</TableHead>
                        <TableHead className="font-semibold text-slate-600">Contact Matrix</TableHead>
                        <TableHead className="font-semibold text-slate-600">Biometrics</TableHead>
                        <TableHead className="font-semibold text-slate-600">System Tag</TableHead>
                        <TableHead className="font-semibold text-slate-600">Status</TableHead>
                        <TableHead className="text-right font-semibold text-slate-600">Action Frame</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((patient) => (
                        <TableRow key={patient.id} className="hover:bg-slate-50/40 transition-colors">
                            <TableCell className="font-mono text-xs text-brand-500 font-bold">
                                {patient.patient_code}
                            </TableCell>
                            <TableCell className="font-medium text-slate-900">
                                {patient.first_name} {patient.last_name}
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="text-sm text-slate-700">{patient.phone}</span>
                                    <span className="text-xs text-slate-400">{patient.email || "N/A"}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                    <span className="bg-slate-100 px-2 py-0.5 rounded font-medium">
                                        {patient.gender.charAt(0)}
                                    </span>
                                    {patient.blood_group && (
                                        <span className="bg-red-50 text-red-700 border border-red-100 px-1.5 py-0.5 rounded font-bold text-[10px]">
                                            {patient.blood_group.replace("_POS", "+").replace("_NEG", "-")}
                                        </span>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="secondary" className={`rounded-md text-[10px] uppercase font-bold tracking-wide ${patient.category === "VIP" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                                        patient.category === "EMERGENCY" ? "bg-rose-50 text-rose-700 border border-rose-100" :
                                            "bg-blue-50 text-blue-700 border border-blue-100"
                                    }`}>
                                    {patient.category}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${patient.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                                    }`}>
                                    {patient.status || "UNASSIGNED"}
                                </span>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button size="sm" variant="ghost" className="hover:bg-slate-100 text-slate-600 rounded-lg">
                                    <Eye className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default PatientDataTable;