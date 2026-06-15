"use client";

import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

interface FilterProps {
    onFilterChange: (filters: any) => void;
}

const PatientFilterBar = ({ onFilterChange }: FilterProps) => {
    const [filters, setFilters] = React.useState({
        category: "ALL",
        status: "ALL",
        gender: "ALL",
        blood_group: "ALL"
    });

    const handleUpdate = (field: string, value: string) => {
        const updated = { ...filters, [field]: value };
        setFilters(updated);
        onFilterChange(updated);
    };

    const handleReset = () => {
        const fresh = { category: "ALL", status: "ALL", gender: "ALL", blood_group: "ALL" };
        setFilters(fresh);
        onFilterChange(fresh);
    };

    return (
        <div className="w-full bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <SlidersHorizontal className="h-3.5 w-3.5 text-brand-700" /> Filter Context Controls
            </div>

            <div className="grid gap-3 grid-cols-2 md:grid-cols-4 lg:flex lg:items-center">
                {/* Category Filter */}
                <div className="space-y-1 lg:w-48">
                    <Select value={filters.category} onValueChange={(v) => handleUpdate("category", v)}>
                        <SelectTrigger className="rounded-xl bg-slate-50/50 border-slate-100">
                            <SelectValue placeholder="Category Classification" />
                        </SelectTrigger>
                        <SelectContent className="bg-white rounded-xl">
                            <SelectItem value="ALL">All Categories</SelectItem>
                            <SelectItem value="REGULAR">Regular</SelectItem>
                            <SelectItem value="VIP">VIP Tier</SelectItem>
                            <SelectItem value="EMERGENCY">Emergency</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Status Filter */}
                <div className="space-y-1 lg:w-48">
                    <Select value={filters.status} onValueChange={(v) => handleUpdate("status", v)}>
                        <SelectTrigger className="rounded-xl bg-slate-50/50 border-slate-100">
                            <SelectValue placeholder="Operational Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white rounded-xl">
                            <SelectItem value="ALL">All Statuses</SelectItem>
                            <SelectItem value="ACTIVE">Active Treatment</SelectItem>
                            <SelectItem value="INACTIVE">Inactive / Archived</SelectItem>
                            <SelectItem value="PENDING">Pending Review</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Gender Filter */}
                <div className="space-y-1 lg:w-40">
                    <Select value={filters.gender} onValueChange={(v) => handleUpdate("gender", v)}>
                        <SelectTrigger className="rounded-xl bg-slate-50/50 border-slate-100">
                            <SelectValue placeholder="Gender Demographics" />
                        </SelectTrigger>
                        <SelectContent className="bg-white rounded-xl">
                            <SelectItem value="ALL">All Genders</SelectItem>
                            <SelectItem value="MALE">Male</SelectItem>
                            <SelectItem value="FEMALE">Female</SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Blood Group Filter */}
                <div className="space-y-1 lg:w-40">
                    <Select value={filters.blood_group} onValueChange={(v) => handleUpdate("blood_group", v)}>
                        <SelectTrigger className="rounded-xl bg-slate-50/50 border-slate-100">
                            <SelectValue placeholder="Blood Typology" />
                        </SelectTrigger>
                        <SelectContent className="bg-white rounded-xl">
                            <SelectItem value="ALL">All Groups</SelectItem>
                            <SelectItem value="A_POS">A+</SelectItem>
                            <SelectItem value="A_NEG">A-</SelectItem>
                            <SelectItem value="O_POS">O+</SelectItem>
                            <SelectItem value="O_NEG">O-</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Reset Actions */}
                <Button
                    variant="ghost"
                    onClick={handleReset}
                    className="lg:ml-auto rounded-xl text-slate-500 hover:text-slate-900 border border-transparent hover:border-slate-100 h-10 px-4"
                >
                    <RotateCcw className="h-3.5 w-3.5 mr-2" /> Reset Scope
                </Button>
            </div>
        </div>
    );
}

export default PatientFilterBar;