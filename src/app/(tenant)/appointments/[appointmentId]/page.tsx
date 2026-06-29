import AppointmentWorkspacePage from "@/components/appointments/detail/AppointmentWorkspacePage";

export default async function AppointmentDetailPage({
  params,
}: {
  params: Promise<{ appointmentId: string }>;
}) {
  const { appointmentId } = await params;

  return (
    <AppointmentWorkspacePage
      appointmentId={appointmentId}
    />
  );
}