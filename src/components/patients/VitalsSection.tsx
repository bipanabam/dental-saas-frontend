import AnalyticsCard from "../shared/analytics/AnalyticsCard";
import AnalyticsGrid from "../shared/analytics/AnalyticsGrid";

import { TrendingUp, Thermometer, Heart } from "lucide-react";

const VitalsSection = ({patient}: any) => {
  return (
    <>
        {/* Analytics */}
        <AnalyticsGrid>
            <AnalyticsCard
                title="BP"
                value={"138/92"}
                icon={TrendingUp}
                description="mmHg"
                priority="high"
                className="border-l-3 border-red-400"
            />
            <AnalyticsCard
                title="HR"
                value={"74 bpm"}
                icon={Heart}
                description="Normal Range"
                className="border-l-3 border-brand-400"
            />
            <AnalyticsCard
                title="Temp"
                value={"98.6 F"}
                icon={Thermometer}
                description=""
                className="border-l-3 border-brand-400"
            />
        </AnalyticsGrid>
    </>
  )
}

export default VitalsSection