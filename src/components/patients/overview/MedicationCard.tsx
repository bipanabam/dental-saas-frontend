import { Pill, AlertCircle } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const parse = (meds?: string) => meds?.split(",").map((x) => x.trim()) || [];

const MedicationCard = ({ medications }: { medications?: string }) => {
  const items = parse(medications);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Pill className="h-4 w-4 text-brand-700 stroke-[2.5]" />
          Current Medication
        </CardTitle>
      </CardHeader>

      <CardContent>
        {!items.length && (
          <div className="flex gap-2 text-muted-foreground">
            <AlertCircle />
            No medication
          </div>
        )}

        <div className="space-y-3">
          {items.map((med) => (
            <div className="rounded-xl border p-3 flex items-center gap-3">
              <Pill className="text-brand-600 h-4 w-4" />
              <div>
                <p className="font-medium">{med}</p>
                <p className="text-xs text-muted-foreground">Active prescription</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationCard;
