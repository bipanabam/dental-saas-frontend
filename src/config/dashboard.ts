import {
 Users,
 CalendarDays,
 Activity,
 DollarSign
} from "lucide-react"



export const statConfig = (
stats:any
)=>[

{
 title:"Total Patients",
 value:stats.totalPatients,
 description:`+${stats.newPatientsLast30Days} this month`,
 icon:Users,
 className: "border-blue-100 bg-blue-50/30 text-blue-600",
},


{
 title:"Monthly Admissions",
 value:stats.newPatientsLast30Days,
 description:`+${stats.newPatientsLast24Hours} today`,
 icon:CalendarDays,
 className: "border-amber-100 bg-amber-50/30 text-amber-600",
},


{
 title:"Active Cases",
 value:stats.activePatients,
 description:"Active treatment",
 icon:Activity,
 className: "border-emerald-100 bg-emerald-50/30 text-emerald-600",
},


{
 title:"Today's Revenue",
 value:`$${stats.totalRevenue}`,
 description:"Collected payments",
 icon:DollarSign,
 className: "border-indigo-100 bg-indigo-50/30 text-indigo-600",
}

]