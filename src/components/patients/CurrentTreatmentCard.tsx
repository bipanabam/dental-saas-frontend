import { Pill } from "lucide-react";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

const CurrentTreatmentCard = ({ patient, className }: { patient: any, className?: string }) => {
  return (
    <Card className={`border hover:border-primary flex flex-col justify-between ${className}`}>
      <CardHeader className="flex justify-between">
        <CardTitle className="flex gap-2 text-brand-600">
          <Pill size={18} />
          Current Treatment
        </CardTitle>

        <Button size="sm">Refill All</Button>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <TreatmentItem title="Lisinopril 10mg" note="1 tablet daily" />

          <TreatmentItem title="Metformin 500mg" note="1 tablet twice daily" />
        </div>
      </CardContent>
    </Card>
  );
};

const TreatmentItem = ({ title, note }: any) => {
  return (
    <div
      className=" rounded-xl border bg-brand-50/50 p-4"
    >
      <div className="flex justify-between">
        <h4 className="font-semibold">{title}</h4>

        <Badge>Active</Badge>
      </div>

      <p className="mt-2 text-sm text-muted-foreground">{note}</p>
    </div>
  );
};

export default CurrentTreatmentCard;
