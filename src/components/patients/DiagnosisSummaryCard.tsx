import { Stethoscope } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

const DiagnosisSummaryCard = ({ patient }: any) => {
  const diagnosis = [
    {
      title: "Hypertension Stage 2",
      code: "I10",
      priority: "Primary",
    },
    {
      title: "Type 2 Diabetes",
      code: "E11.9",
      priority: "Secondary",
    },
  ];

  return (
    <Card className="border hover:border-primary">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2 text-brand-600 text-base">
                <Stethoscope size={18} />
                Diagnosis Summary
            </CardTitle>

            <Button variant="ghost" className="text-brand-600">ICD-10</Button>
        </CardHeader>

        <CardContent className="space-y-5 flex-1">
            {diagnosis.map((item) => (
            <div
                key={item.code}
                className="border-b pb-5 last:border-0 border-brand-100"
            >
                <div className="flex justify-between">
                <div>
                    <p className="font-semibold">{item.title}</p>

                    <p className="text-sm text-muted-foreground">{item.code}</p>
                </div>

                <Badge>{item.priority}</Badge>
                </div>
            </div>
            ))}
        </CardContent>
    </Card>
  );
};

export default DiagnosisSummaryCard;
