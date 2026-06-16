"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Filter } from "lucide-react";

const AppointmentSidebar = () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date(2024, 8, 24));

    return (
        <div className="space-y-6">
            {/* Calendar Controller Card */}
            <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
                <CardContent className="p-4 flex justify-center">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="w-full max-w-full"
                    />
                </CardContent>
            </Card>

            {/* Resource Filtering Matrix */}
            <Card className="border border-slate-100 shadow-sm bg-brand-50/40 rounded-2xl">
                <CardHeader className="pb-3">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-brand-900 flex items-center gap-2">
                        <Filter className="h-3.5 w-3.5 text-brand-700" /> Resources Allocation
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[
                        { id: "all", label: "All Providers", checked: true },
                        { id: "dr-julian", label: "Dr. Julian (Lead)", checked: true },
                        { id: "dr-chen", label: "Dr. Sarah Chen", checked: true },
                        { id: "room-01", label: "Operatory Surgery Room 01", checked: false },
                    ].map((resource) => (
                        <div key={resource.id} className="flex items-center space-x-3 bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs">
                            <Checkbox id={resource.id} defaultChecked={resource.checked} className="border-slate-300 text-brand-700 focus-visible:ring-brand-600 data-[state=checked]:bg-brand-700 data-[state=checked]:border-brand-700" />
                            <Label htmlFor={resource.id} className="text-sm font-medium text-slate-700 cursor-pointer selection:bg-transparent">
                                {resource.label}
                            </Label>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}

export default AppointmentSidebar;