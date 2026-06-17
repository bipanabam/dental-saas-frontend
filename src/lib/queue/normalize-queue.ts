import type { TodaysQueueListItem, DoctorQueueListItem } from "@/lib/api";

export interface NormalizedQueueItem {
  queueId: string;
  tokenNumber: number;
  status: string;
  estimatedWaitMins: number | null;
  patientFirstName: string;
  patientLastName: string;
  patientPhone: string | null;
  chiefComplaint: string | null;
  appointmentType: string;
  doctorUsername: string | null;
}

export function normalizeTodaysItem(item: TodaysQueueListItem): NormalizedQueueItem {
  return {
    queueId: item.queue.id,
    tokenNumber: item.queue.token_number,
    status: item.queue.status,
    estimatedWaitMins: item.queue.estimated_wait_mins ?? null,
    patientFirstName: item.appointment.patient.first_name,
    patientLastName: item.appointment.patient.last_name,
    patientPhone: item.appointment.patient.phone ?? null,
    chiefComplaint: item.appointment.chief_complaint ?? null,
    appointmentType: item.appointment.appointment_type,
    doctorUsername: item.appointment.doctor?.username ?? null,
  };
}

export function normalizeDoctorItem(item: DoctorQueueListItem): NormalizedQueueItem {
  return {
    queueId: item.queue_id,
    tokenNumber: item.token_number,
    status: item.status,
    estimatedWaitMins: null,              // not in DoctorQueueListItem
    patientFirstName: item.patient.first_name,
    patientLastName: item.patient.last_name,
    patientPhone: item.patient.phone ?? null,
    chiefComplaint: item.chief_complaint ?? null,
    appointmentType: item.appointment_type,
    doctorUsername: null,                 // filtered to one doctor already
  };
}