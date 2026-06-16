import { Calendar, Receipt, CirclePlus, NotebookPen } from "lucide-react";

import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

const PatientActionsCard = ({ patient }: any) => {
  return (
    <Card>
        <CardHeader>
            <CardTitle className="uppercase text-sm font-semibold text-slate-600">Patient Actions</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
            <Button className="w-full">
                <Calendar />
                Start Encounter
            </Button>

            <Button variant="outline" className="w-full border-brand-600">
                <CirclePlus className="text-brand-600" />
                New Appointment
            </Button>

            <Button variant="outline" className="w-full border-slate-300">
                <NotebookPen />
                Add Progress Note
            </Button>

            <Button variant="outline" className="w-full border-slate-300">
                <Receipt />
                Generate Invoice
            </Button>
        </CardContent>
    </Card>
  );
};

export default PatientActionsCard;
