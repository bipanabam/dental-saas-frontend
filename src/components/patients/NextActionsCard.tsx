import { useState } from "react";
import Link from "next/link";

import { CheckCircle2, ArrowRight } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import AssignDoctorDialog from "./AssignDoctorDialog";
import { useAssignPrimaryDoctor } from "@/hooks/patients/use-patient-doctor";

const actionMap: any = {
  "Assign primary doctor": {
    href: "#",
    button: "Assign",
  },

  "Schedule first consultation": {
    href: "/appointments/create",
    button: "Schedule",
  },

  //   "Continue active medications": {
  //     href: `/encounters/${action.target_id}`,
  //     button: "Continue",
  //   },
  // appointment: {
  //     href: `/appointments/${action.target_id}`,
  //     button: "Open",
  // },
};

type Props = {
  patientId: string;
  actions: any;
};

const NextActionsCard = ({ patientId, actions = [] }: Props) => {
  const [open, setOpen] = useState(false);

  const [doctorId, setDoctorId] = useState<string>();

  const assignDoctor = useAssignPrimaryDoctor(patientId);

  async function handleAssign() {
    if (!doctorId) return;

    await assignDoctor.mutateAsync({
      path: {
        patient_id: patientId,
      },

      query: {
        doctor_id: doctorId,
      },
    });

    setOpen(false);
    setDoctorId(undefined);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Recommended Actions</CardTitle>
        </CardHeader>

        <CardContent>
          {!actions.length && (
            <p className="text-sm text-muted-foreground">No pending actions</p>
          )}

          <div className="space-y-3">
            {actions.map((action: string) => {
              const cfg = actionMap[action];
              //  const cfg = actionConfig[action.type];

              return (
                <div
                  key={action}
                  className="rounded-xl border p-3 flex items-center justify-between"
                >
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-4 w-4 text-brand-700 mt-0.5" />
                    <span className="font-medium">{action}</span>
                  </div>

                  {cfg && (
                    <Button asChild size="sm" onClick={() => setOpen(true)}>
                      <Link href={cfg.href}>{cfg.button}</Link>
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      <AssignDoctorDialog
        open={open}
        onOpenChange={setOpen}
        value={doctorId}
        onChange={setDoctorId}
        onSave={handleAssign}
        loading={assignDoctor.isPending}
      />
    </>
  );
};

export default NextActionsCard;
