"use client";

import { useState } from "react";

import {
  MoreVertical,
  KeyRound,
  UserX,
  UserCheck,
  MailCheck,
  MailX,
  Phone,
  Settings
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { UserEditDialog } from "@/components/staff/forms/UserFormSheet";
import { ResetPasswordDialog } from "@/components/staff/forms/ResetPasswordDialog";
import { RestoreUserDialog } from "@/components/staff/forms/RestoreUserDialog";
import { DisableUserDialog } from "@/components/staff/forms/DisableUserDialog";

import { ROLE_BADGE_THEMES } from "@/types/user";

import type { UserListItem } from "@/lib/api";

interface TableProps {
  data: UserListItem[];
}

const UserTable = ({ data }: TableProps) => {
  if (!data.length) {
    return (
      <div className="rounded-2xl border p-8 text-center text-sm text-muted-foreground">
        No users found.
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-3xs overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="w-full text-left border-collapse">
          <TableHeader>
            <TableRow className="bg-slate-50 /70 border-b border-slate-100 select-none">
              <TableHead className="w-14" />
              <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                User
              </TableHead>
              <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                Designation Role
              </TableHead>
              <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                System Verification
              </TableHead>
              <TableHead className="w-14 text-right text-[10px] font-black text-slate-400 uppercase tracking-wider" />
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-slate-50 text-xs">
            {data.map((user) => (
              <UserRow key={user.id} user={user} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserTable;

const UserRow = ({ user }: { user: UserListItem }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [disableOpen, setDisableOpen] = useState(false);
  const [restoreOpen, setRestoreOpen] = useState(false);

  const roleStyle =
    ROLE_BADGE_THEMES[user.role] ??
    "bg-slate-50 text-slate-600 border-slate-100";
  const initials = user.username?.substring(0, 1).toUpperCase() || "US";

  return (
    <>
    <TableRow>
      <TableCell>
        <div className="h-8 w-8 rounded-xl bg-slate-100 text-slate-700 font-bold tracking-tight text-[11px] flex items-center justify-center border border-slate-200/50 shadow-3xs uppercase group-hover:border-brand-200 group-hover:bg-brand-50 group-hover:text-brand-700 transition-colors">
          {initials}
        </div>
      </TableCell>

      <TableCell>
        <div className="space-y-0.5">
          <span className="font-black text-slate-800 text-sm tracking-tight block">
            {user.username}
          </span>
          <div className="flex flex-col gap-0.5 text-slate-400 font-medium text-[11px]">
            <span className="truncate block">{user.email}</span>
            {user.phone_number && (
              <span className="flex items-center gap-1 font-mono text-[10px]">
                <Phone className="h-2.5 w-2.5 text-slate-400" />
                {user.phone_number}
              </span>
            )}
          </div>
        </div>
      </TableCell>

      <TableCell>
        <Badge
          variant="outline"
          className={`text-[9px] font-black px-2 py-0.5 rounded-md tracking-wide uppercase shadow-3xs ${roleStyle}`}
        >
          {user.role}
        </Badge>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
          {user.is_verified ? (
            <>
              <MailCheck className="h-3.5 w-3.5 text-emerald-500" />{" "}
              <span className="text-emerald-700 text-[10px]">E-Verified</span>
            </>
          ) : (
            <>
              <MailX className="h-3.5 w-3.5 text-slate-400" />{" "}
              <span className="text-slate-400 text-[10px]">
                Pending Verification
              </span>
            </>
          )}
        </div>
      </TableCell>

      <TableCell className="text-right">
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
              Action Panel
            </DropdownMenuLabel>

              <DropdownMenuItem
                className="gap-2 cursor-pointer h-8 rounded-lg text-xs text-slate-600"
                onSelect={(e) => {
                  e.preventDefault();
                  setDropdownOpen(false); // close dropdown first
                  setEditOpen(true);      // then open dialog
                }}
              >
                <Settings className="h-4 w-4" />
                Edit Profile
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setDropdownOpen(false);
                  setResetOpen(true);
                }}
                className="gap-2 cursor-pointer h-8 rounded-lg text-xs text-slate-600"
              >
                <KeyRound className="h-4 w-4 text-amber-500" />
                Reset Password
              </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuSeparator className="bg-slate-100" />
              {user.is_active ? (
                <DropdownMenuItem
                  className="gap-2 px-4 font-black text-rose-600 focus:text-rose-700 focus:bg-rose-50 cursor-pointer"
                  onSelect={(e) => {
                    e.preventDefault();
                    setDropdownOpen(false); 
                    setDisableOpen(true);
                  }}
                >
                  <UserX className="h-4 w-4" />
                  Disable user
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className="gap-2 font-black text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50 cursor-pointer"
                    onSelect={(e) => {
                      e.preventDefault();
                      setDropdownOpen(false);
                      setRestoreOpen(true);
                    }}
                >
                  <UserCheck className="h-4 w-4" />
                  Restore User
                </DropdownMenuItem>
              )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
    <UserEditDialog
      user={user}
      open={editOpen}
      onOpenChange={setEditOpen}
    />
    <ResetPasswordDialog 
      user={user} 
      open={resetOpen} 
      onOpenChange={setResetOpen} />
    <DisableUserDialog 
      userId={user.id}
      open={disableOpen}
      onOpenChange={setDisableOpen}
    />
    <RestoreUserDialog
      userId={user.id}
      open={restoreOpen}
      onOpenChange={setRestoreOpen}
    />
    </>
  );
};
