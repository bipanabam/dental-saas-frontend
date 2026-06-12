import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Table } from "../ui/table";

const AppointmentTable = ({
  appointments,
}: {
  appointments: Appointment[];
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
