import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

const items = [
  {
    title: "Vitals Logged",
    date: "Today",
  },
  {
    title: "Prescription Renewed",
    date: "Feb 14",
  },
];

const ActivityTimelineCard = ({ patient }: any) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Timeline</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-5">
          {items.map((i) => (
            <div
              key={i.title}
              className="border-l pl-4"
            >
              <p className="text-xs text-brand-600">{i.date}</p>

              <p className="font-medium">{i.title}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityTimelineCard;
