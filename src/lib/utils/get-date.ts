export type Range = "today" | "week" | "month";

export default function getDateRange(range: Range) {
  const end = new Date();

  if (range === "week") {
    const start = new Date();
    start.setDate(end.getDate() - 7);

    return {
      date_start: start.toISOString().split("T")[0],
      date_end: end.toISOString().split("T")[0],
    };
  }

  if (range === "month") {
    const start = new Date();
    start.setMonth(end.getMonth() - 1);

    return {
      date_start: start.toISOString().split("T")[0],
      date_end: end.toISOString().split("T")[0],
    };
  }

  return {};
}