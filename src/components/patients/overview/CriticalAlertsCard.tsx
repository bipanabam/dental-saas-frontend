import { ShieldAlert, AlertTriangle } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const CriticalAlertsCard = ({ patient }: any) => {
  const alerts = [];

  if (patient.medical_record?.allergies) {
    alerts.push({
      title: "Allergies",
      value: patient.medical_record.allergies,
    });
  }

  if (patient.medical_record?.systemic_conditions) {
    alerts.push({
      title: "Systemic Conditions",
      value: patient.medical_record.systemic_conditions,
    });
  }

  if (!patient.medical_record?.emergency_contact_phone) {
    alerts.push({
      title: "Emergency Contact",
      value: "Missing information",
    });
  }

  return (
    <Card className="border-red-200">
      <CardHeader>
        <CardTitle className="text-sm font-black text-red-600 uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 stroke-[2.5]" />
          Critical Alerts
        </CardTitle>
      </CardHeader>

      <CardContent>
        {!alerts.length && (
          <p className="text-sm text-muted-foreground">No active alerts</p>
        )}

        <div className="space-y-3">
          {alerts.map((item: any, idx) => (
            <div key={idx} className="rounded-xl border bg-red-50 p-4">
              <div className="flex gap-3">
                <AlertTriangle />

                <div>
                  <p className="font-semibold">{item.title}</p>

                  <p className="text-sm">{item.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CriticalAlertsCard;
