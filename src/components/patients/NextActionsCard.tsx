import Link from "next/link";

import { CheckCircle2, ArrowRight } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

const NextActionsCard = ({ actions = [] }: any) => {
  return (
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
                  <Button asChild size="sm">
                    <Link href={cfg.href}>
                        {cfg.button}
                    </Link>
        
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default NextActionsCard;
