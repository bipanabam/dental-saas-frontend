"use client";

import { Bell, ChevronDown } from "lucide-react";


import { Avatar, AvatarFallback } from "@/components/ui/avatar";


import { Button } from "@/components/ui/button";


import { Separator } from "@/components/ui/separator";


import {
DropdownMenu,
DropdownMenuContent,
DropdownMenuItem,
DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const TopBar = () => {
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6">
        <div>
            <h2 className="font-semibold text-slate-800">
            Dashboard
            </h2>

            <p className="text-xs text-muted-foreground">
            Clinic overview
            </p>
        </div>

        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="text-brand-700"/>
            </Button>

            <Separator orientation="vertical" className="h-8" />

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-3 rounded-xl">
                        <Avatar>
                            <AvatarFallback className="bg-brand-700 text-white">B</AvatarFallback>
                        </Avatar>

                        <div className="text-left">
                            <p className="text-sm font-medium">Doctor Name</p>
                            <p className="text-xs text-muted-foreground">ADMIN</p>
                        </div>

                        <ChevronDown className="h-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </header>

  );
}

export default TopBar;