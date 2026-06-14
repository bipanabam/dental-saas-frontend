"use client";

import { Bell, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTenant } from "@/providers/tenant-provider";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TopBar = () => {
    const { session } = useTenant();
    const userEmail = session?.user?.email || "user@clinic.com";
    const userRole = session?.user?.role || "STAFF";

    return (
        <header className="sticky top-0 z-40 h-16 w-full border-b bg-white/80 backdrop-blur-md flex items-center justify-between px-6 transition-all">
            {/* Left side: Tenant Info */}
            <div className="flex items-center gap-2">
                <span className="text-xs font-semibold bg-brand-50 text-brand-700 px-2.5 py-1 rounded-md border border-brand-100 uppercase tracking-wider">
                    {session?.user?.tenantName || "Clinic"} Workspace
                </span>
            </div>

            {/* Right side: Actions & Workspace controls */}
            <div className="flex items-center gap-3">
                {/* Notification Bell */}
                <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-slate-900 hover:bg-brand-50 rounded-xl h-10 w-10">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-brand-600 ring-2 ring-white" />
                </Button>

                <Separator orientation="vertical" className="h-6 bg-slate-200" />

                {/* User Workspace Profiles */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-11 gap-2.5 px-2 hover:bg-slate-50 rounded-xl transition-all data-[state=open]:bg-slate-50">
                            <Avatar className="h-8 w-8 border border-slate-100 shadow-sm">
                                <AvatarFallback className="bg-brand-700 text-white font-semibold text-xs">
                                    {userEmail.slice(0, 1).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            <div className="hidden md:flex flex-col text-left">
                                <p className="text-xs font-semibold text-slate-700 max-w-35 truncate">{userEmail}</p>
                                <p className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">{userRole}</p>
                            </div>

                            <ChevronDown className="h-3.5 w-3.5 text-slate-400 transition-transform duration-200" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-56 mt-1 rounded-xl p-1.5 shadow-xl border-slate-100">
                        <DropdownMenuLabel className="text-xs font-normal text-slate-400 px-2 py-1.5">
                            My Account
                        </DropdownMenuLabel>
                        <DropdownMenuItem className="rounded-lg text-slate-700 focus:bg-slate-50 cursor-pointer text-sm py-2">Profile Details</DropdownMenuItem>
                        <DropdownMenuItem className="rounded-lg text-slate-700 focus:bg-slate-50 cursor-pointer text-sm py-2">Clinic Settings</DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-100 my-1" />
                        <DropdownMenuItem className="rounded-lg text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer text-sm py-2">
                            Sign Out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};

export default TopBar;