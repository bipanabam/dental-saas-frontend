import VitalsSection from "./VitalsSection";
import CriticalAlertsCard from "./CriticalAlertsCard";
import CurrentTreatmentCard from "./CurrentTreatmentCard";
import DiagnosisSummaryCard from "./DiagnosisSummaryCard";

const PatientOverview = ({ patient }: any) => {
  return (
    <div className="space-y-6 w-full">
      <VitalsSection patient={patient} />
      
      <div className="grid grid-cols-1 gap-6 items-start">
        <div className="space-y-6 grid grid-cols-2 gap-5">
          <CriticalAlertsCard patient={patient} />
          <DiagnosisSummaryCard patient={patient} />
        </div>

        <div className="h-full flex flex-col">
          <CurrentTreatmentCard patient={patient} className="h-full flex-1" />
        </div>
      </div>
    </div>
  );
};

export default PatientOverview;

function Detail({ icon, label, value }: any) {
  return (
    <div className="flex gap-3">
      <div className="text-muted-foreground">{icon}</div>

      <div>
        <p className="text-sm text-muted-foreground">{label}</p>

        <p className="font-medium">{value || "-"}</p>
      </div>
    </div>
  );
}
