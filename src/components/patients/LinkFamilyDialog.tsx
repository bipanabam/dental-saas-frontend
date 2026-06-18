"use client";

import { useMemo, useState } from "react";
import {
  Search,
  UserRound,
  Link2,
  Check,
  Loader2,
  Phone,
  Calendar,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";

import { Input } from "../ui/input";
import { Button } from "../ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";

import { useSearchPatients } from "@/hooks/patients/use-patients";
import { useLinkFamilyMember } from "@/hooks/patients/use-family-member";

import { getAge } from "@/lib/utils/get-age";

import type { FamilyRelationshipEnum } from "@/lib/api";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  patientId: string;
};

const RELATIONS: FamilyRelationshipEnum[] = [
  "SPOUSE",
  "HUSBAND",
  "WIFE",
  "FATHER",
  "MOTHER",
  "SON",
  "DAUGHTER",
  "BROTHER",
  "SISTER",
  "GRANDPARENT",
  "GRANDCHILD",
  "OTHER",
];

const format = (v: string) =>
  v
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (m) => m.toUpperCase());

const LinkFamilyDialog = ({ open, onOpenChange, patientId }: Props) => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("");
  const [relation, setRelation] = useState<FamilyRelationshipEnum | "">("");

  const searchEnabled = search.trim().length >= 2;

  const { data, isLoading } = useSearchPatients(search, searchEnabled);

  const link = useLinkFamilyMember(patientId);

  const patients = useMemo(
    () => data?.filter((x: any) => x.id !== patientId) ?? [],
    [data, patientId],
  );

  const submit = () => {
    if (!selected || relation === "") return;

    link.mutate(
      {
        family_member_id: selected,
        relationship_type: relation,
      },
      {
        onSuccess() {
          setSearch("");
          setSelected("");
          setRelation("");
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl rounded-3xl">
        <DialogHeader>
          <DialogTitle>Link Family Member</DialogTitle>

          <DialogDescription>
            Connect another patient profile for family history and shared
            workflows.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* SEARCH */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, phone, patient code..."
              className="pl-9"
            />
          </div>

          {/* RESULTS */}
          <ScrollArea className="h-65 rounded-xl border">
            {!searchEnabled && (
              <div className="p-8 text-center text-sm text-muted-foreground">
                Search at least 2 characters
              </div>
            )}

            {isLoading && (
              <div className="p-10 flex justify-center">
                <Loader2 className="animate-spin" />
              </div>
            )}

            <div className="p-2 space-y-2">
              {patients?.map((patient: any) => {
                const active = selected === patient.id;

                return (
                  <button
                    key={patient.id}
                    onClick={() =>
                      setSelected(patient.id)
                    }
                    className={`w-full rounded-xl border p-3 text-left transition

                      ${
                        active
                          ? "border-brand-600 bg-brand-50"
                          : "hover:border-brand-200"
                      }
                    `}
                  >
                    <div className="flex gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-brand-700 text-white">
                          {patient.first_name?.[0]}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <div className="font-semibold">
                              {patient.first_name} {patient.last_name}
                            </div>

                            <div className="text-xs text-muted-foreground">
                              {patient.patient_code}
                            </div>
                          </div>

                          {active && (
                            <Check className="text-brand-700 h-4 w-4" />
                          )}
                        </div>

                        <div className="mt-2 flex flex-wrap gap-2">
                          <Badge variant="secondary">
                            <Phone className="mr-1 h-3 w-3 text-white" />
                            <span className="text-white">
                              {patient.phone}
                            </span>
                          </Badge>

                          {patient.date_of_birth && (
                            <Badge variant="outline">
                              <Calendar className="mr-1 h-3 w-3" />
                              {getAge(patient.date_of_birth)}y
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}

              {searchEnabled && !isLoading && patients.length === 0 && (
                <div className="py-10 text-center text-muted-foreground">
                  No patients found
                </div>
              )}
            </div>
          </ScrollArea>

          {/* RELATION */}
          <Select
            value={relation}
            onValueChange={(v) =>
              setRelation(
                v as FamilyRelationshipEnum,
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select relationship" />
            </SelectTrigger>

            <SelectContent>
              {RELATIONS.map((relation) => (
                <SelectItem key={relation} value={relation}>
                  {format(relation)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            className="w-full"
            disabled={!selected || !relation || link.isPending}
            onClick={submit}
          >
            {link.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Link2 className="mr-2 h-4 w-4" />
                Link Family Member
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LinkFamilyDialog;
