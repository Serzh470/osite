import { startOfWeek, endOfWeek } from "date-fns";

/** Get first and last day of week */
export default function weekPeriod() {
  const curr = new Date();
  const first = startOfWeek(curr, { weekStartsOn: 1 });
  const last = endOfWeek(curr, { weekStartsOn: 1 });
  return { first, last };
}
