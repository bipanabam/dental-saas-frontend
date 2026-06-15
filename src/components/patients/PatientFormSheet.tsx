"use client";

import React from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, UserPlus } from "lucide-react";

const PatientFormSheet = () => {
    const [open, setOpen] = React.useState(false);
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const phone = formData.get("phone") as string;

        // Client-side execution matching your Pydantic regex validations
        const rawDigits = phone.replace(/[\s\-]/g, "");
        if (!/^\+?[0-9\s\-]+$/.test(phone)) {
            setErrors({ phone: "Invalid syntax: Only symbols (+, -, spaces) and digits allowed." });
            return;
        }
        if (rawDigits.replace("+", "").length < 10) {
            setErrors({ phone: "Phone numbers must span a minimum of 10 digits." });
            return;
        }

        setErrors({});
        // Execute creation pipeline logic here...
        setOpen(false);
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button className="bg-brand-700 hover:bg-brand-800 text-white gap-2 shadow-sm rounded-xl">
                    <Plus className="h-4 w-4" /> Add New Patient
                </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-lg overflow-y-auto bg-white rounded-l-2xl border-slate-100 shadow-2xl p-6">
                <SheetHeader className="pb-4 border-b border-slate-100">
                    <SheetTitle className="text-xl font-bold flex items-center gap-2 text-slate-900">
                        <UserPlus className="h-5 w-5 text-brand-700" /> Intake Profile Form
                    </SheetTitle>
                    <SheetDescription>
                        Register new patient profiles to your clinical core ecosystem database.
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="space-y-5 pt-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="first_name">First Name *</Label>
                            <Input id="first_name" name="first_name" placeholder="John" required className="rounded-xl" />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="last_name">Last Name *</Label>
                            <Input id="last_name" name="last_name" placeholder="Doe" required className="rounded-xl" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="date_of_birth">Date of Birth *</Label>
                            <Input id="date_of_birth" name="date_of_birth" type="date" required className="rounded-xl" />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="gender">Gender Layout *</Label>
                            <Select name="gender" defaultValue="OTHER">
                                <SelectTrigger className="rounded-xl">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent className="bg-white rounded-xl">
                                    <SelectItem value="MALE">Male</SelectItem>
                                    <SelectItem value="FEMALE">Female</SelectItem>
                                    <SelectItem value="OTHER">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="phone">Phone System Contact *</Label>
                            <Input id="phone" name="phone" placeholder="+1 (555) 000-0000" required className="rounded-xl" />
                            {errors.phone && <p className="text-[11px] font-medium text-red-500">{errors.phone}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="blood_group">Blood Group</Label>
                            <Select name="blood_group">
                                <SelectTrigger className="rounded-xl">
                                    <SelectValue placeholder="Optional" />
                                </SelectTrigger>
                                <SelectContent className="bg-white rounded-xl">
                                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                                        <SelectItem key={bg} value={bg.replace("-", "_NEG").replace("+", "_POS")}>{bg}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="email">Email Coordinates</Label>
                        <Input id="email" name="email" type="email" placeholder="john.doe@example.com" className="rounded-xl" />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="category">Patient Class Segment</Label>
                        <Select name="category" defaultValue="REGULAR">
                            <SelectTrigger className="rounded-xl">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent className="bg-white rounded-xl">
                                <SelectItem value="REGULAR">Regular</SelectItem>
                                <SelectItem value="VIP">Premium / VIP</SelectItem>
                                <SelectItem value="EMERGENCY">Emergency Standby</SelectItem>
                                <SelectItem value="INSURANCE">Corporate Insurance</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="address">Physical Mailing Address</Label>
                        <Input id="address" name="address" placeholder="742 Evergreen Terrace" className="rounded-xl" />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="allergies">Clinical Contraindications & Allergies</Label>
                        <Textarea id="allergies" name="allergies" placeholder="Penicillin, Sulfa drugs, Latex restrictions..." className="rounded-xl min-h-20" />
                    </div>

                    <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl">
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-brand-700 hover:bg-brand-800 text-white rounded-xl px-6">
                            Commit Entry
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}

export default PatientFormSheet;