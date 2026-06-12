import { Button } from "@/components/ui/button";

import { Plus, ArrowRight } from "lucide-react";

const DashboardHeader = ({ userName } : any ) => {
  return (
    <div
      className="flex justify-between items-center"
    >
        <div>
            <h1 className="text-3xl font-bold">
            Dashboard
            </h1>

            {/* <p className="text-sm text-muted-foreground">
            Clinic overview and activity
            </p> */}
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">
                Welcome back, {userName} • {new Date().toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
        </div>

        <div className="flex gap-3">
            <Button variant="outline">
                <ArrowRight />
                Patients
            </Button>

            <Button className="bg-brand-700 hover:bg-brand-800">
                <Plus />
                New Appointment
            </Button>
        </div>
    </div>
  );
}

export default DashboardHeader;
