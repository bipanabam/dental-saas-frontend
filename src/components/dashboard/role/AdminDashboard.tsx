import DashboardSection from "../shared/DashboardSection";
import { LiveOperationsBoard } from "../operations/LiveOperationsBoard";

// import {
//   Users,
//   CalendarDays,
//   Activity,
//   DollarSign
// } from "lucide-react"

// const statConfig: KPI = () => [

//     {
//       title: "Total Patients",
//       value: 1420,
//       description: `+124 this month`,
//       icon: Users,
//     iconBg: "border-blue-100 bg-blue-50/30 text-blue-600",
//     },


//     {
//       title: "Monthly Admissions",
//       value: 124,
//       description: `+12 today`,
//       icon: CalendarDays,
//       iconBg: "border-amber-100 bg-amber-50/30 text-amber-600",
//     },


//     {
//       title: "Active Cases",
//       value: 231,
//       description: "Active treatment",
//       icon: Activity,
//       iconBg: "border-emerald-100 bg-emerald-50/30 text-emerald-600",
//     },


//     {
//       title: "Today's Revenue",
//       value: `$14250`,
//       description: "Collected payments",
//       icon: DollarSign,
//       iconBg: "border-indigo-100 bg-indigo-50/30 text-indigo-600",
//     }

//   ]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
{/* 
      <KpiGrid items={statConfig}/> */}

      <div className="grid lg:grid-cols-12 gap-6">

        <div className="lg:col-span-8">
        </div>

        {/* <div className="lg:col-span-4">
          <DashboardSection
            title="Critical Alerts"
          >
            <ActionInbox />
          </DashboardSection>
        </div> */}

      </div>

      {/* <div className="grid lg:grid-cols-2 gap-6">

        <AnalyticsSection />

        <RevenueSnapshot />

      </div>

      <SessionMonitor /> */}

    </div>
  );
}