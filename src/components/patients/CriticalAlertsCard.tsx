import { AlertTriangle, ShieldAlert } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

const CriticalAlertsCard = ({patient}: any) => {
  const alerts = [
    {
      title: "Severe Allergy: Penicillin G",
      subtitle: "Confirmed Anaphylactic Reaction",
    },
    {
      title: "Fall Risk",
      subtitle: "Last assessment: High Risk",
    },
  ];

  return (
    <Card className="border border-red-300 bg-red-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <ShieldAlert size={18} />
          Critical Alerts
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {alerts.map((a) => (
          <div key={a.title} className="rounded-xl border bg-white p-4">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />

              <div>
                <p className="font-semibold text-red-700">{a.title}</p>
                <p className="text-sm text-muted-foreground">{a.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default CriticalAlertsCard;
