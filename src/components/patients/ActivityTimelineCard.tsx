import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// const items = [
//   {
//     title: "Vitals Logged",
//     date: "Today",
//   },
//   {
//     title: "Prescription Renewed",
//     date: "Feb 14",
//   },
// ];

const ActivityTimelineCard = ({ patient, summary }: any) => {
  const items = [
    patient.created_at && {
      title: "Profile created",
      date: patient.created_at,
    },

    patient.last_visit_at && {
      title: "Last visit completed",
      date: patient.last_visit_at,
    },

    summary?.latest_appointment && {
      title: "Latest appointment",
      date:
        summary.latest_appointment.appointment_date,
    },

    summary?.upcoming_appointment && {
      title: "Upcoming appointment",
      date:
        summary.upcoming_appointment.appointment_date,
    },
  ].filter(Boolean);
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Activity Timeline
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="relative ml-2">
          {items.map((item) => (
            <div
              key={item.title}
              className="relative border-l border-slate-200 pl-5 pb-6"
            >
              <div className="absolute -left-1.25 top-1 h-2 w-2 rounded-full bg-brand-600"/>

              <p className="text-xs text-slate-400">
                {new Date(item.date)
                  .toLocaleDateString()}
              </p>

              <p className="font-medium">
                {item.title}
              </p>
            </div>
          ))}

        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityTimelineCard;
