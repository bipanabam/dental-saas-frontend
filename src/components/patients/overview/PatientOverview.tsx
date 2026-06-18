import VitalsSection from "./VitalsSection";
import CriticalAlertsCard from "./CriticalAlertsCard";
import ClinicalSnapshotCard from "./ClinicalSnapshotCard";
import MedicationCard from "./MedicationCard";
import AppointmentCard from "./AppointmentCard";
import FamilyCard from "./FamilyCard";
import RecentEncountersCard from "./RecentEncountersCard";

type Props = {
  patient: any;
  summary?: any;
};
const PatientOverview = ({
  patient,
  summary,
}: Props) => {
  return (
    <div className="space-y-6">

      {/* HERO HEALTH STATUS */}
      <div className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
        <VitalsSection
          vitals={summary?.latest_vitals}
        />
        <CriticalAlertsCard
          critical_alerts={summary?.critical_alerts}
          risk_score={summary?.risk_score}
          clinical_flags={summary?.clinical_flags}
        />
      </div>

      {/* ACTIVE CARE */}
      <div className="grid gap-6 lg:grid-cols-2">
        <AppointmentCard
          latest={summary?.latest_appointment}
          upcoming={summary?.upcoming_appointment}
        />
        <MedicationCard
          medications={summary?.current_medications}
        />
      </div>

      {/* CLINICAL CONTEXT */}
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <RecentEncountersCard
          encounters={summary?.recent_encounters}
        />
        <ClinicalSnapshotCard
          patient={patient}
          summary={summary}
        />
      </div>

      {/* SECONDARY */}
      <FamilyCard patientId={patient.id} />

    </div>
  );
};

export default PatientOverview;
