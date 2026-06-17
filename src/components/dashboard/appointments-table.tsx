import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Table } from "../ui/table";

import { AppointmentListItem } from "@/lib/api";

const AppointmentTable = ({
  appointments,
}: {
    appointments: AppointmentListItem[];
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Schedule</CardTitle>
      </CardHeader>

      <CardContent>
        <Table>...</Table>
      </CardContent>
    </Card>
  );
}

export default AppointmentTable;
