import VitalsSection from "./VitalsSection";
import CriticalAlertsCard from "./CriticalAlertsCard";
import ClinicalSnapshotCard from "./ClinicalSnapshotCard";
import MedicationCard from "./MedicationCard";
import AppointmentCard from "./AppointmentCard";
import FamilyCard  from "./FamilyCard";

type Props = {
  patient: any;
  summary?: any;
};

const PatientOverview = ({
  patient,
  summary,
}: Props) => {
  return (
    <div className="space-y-6 w-full">
      {/* CRITICAL */}
      <div className="grid lg:grid-cols-2 gap-6">
        <VitalsSection patient={patient} />
        <CriticalAlertsCard patient={patient} />
      </div>

      {/* ACTIVE CARE */}
      <div className="grid lg:grid-cols-2 gap-6">
        <MedicationCard medications={patient.medical_record?.current_medications} />
        <AppointmentCard
          latest={summary?.latest_appointment}
          upcoming={summary?.upcoming_appointment}
        />
      </div>

      {/* CONTEXT */}
      <div className="grid lg:grid-cols-2 gap-6">
        <ClinicalSnapshotCard patient={patient} summary={summary} />
        <FamilyCard patientId={patient.id} />
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
