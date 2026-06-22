export type WorkflowAction =
  | "confirm"
  | "check_in"
  | "start"
  | "complete"
  | "open";

export type AppointmentItem = {
  id: string;
};

type ActionDef = { action: WorkflowAction; label: string };

// "what's next" action -> used by AppointmentQueueCard's compact button
export function getPrimaryWorkflowAction(status: string): WorkflowAction {
  switch (status) {
    case "BOOKED":
      return "confirm";
    case "CONFIRMED":
      return "check_in";
    case "CHECKED_IN":
      return "start";
    case "IN_PROGRESS":
      return "complete";
    default:
      return "open";
  }
}

// Full set of valid actions for a given status -> used by VisitWorkflowPanel
// which has room to show more than one option
export function getAvailableActions(status: string): ActionDef[] {
  switch (status) {
    case "BOOKED":
      return [
        { action: "confirm", label: "Confirm Appointment" },
        { action: "check_in", label: "Check In Patient" },
      ];
    case "CONFIRMED":
      return [{ action: "check_in", label: "Check In Patient" }];
    case "CHECKED_IN":
      return [{ action: "start", label: "Start Encounter" }];
    case "IN_PROGRESS":
      return [{ action: "complete", label: "Complete Visit" }];
    default:
      return [];
  }
}