/**
 * Mock schedule data used by SelectDateTimeScreen and checkout flow.
 * Dates are generated from today so the calendar is always current.
 */

export interface MockDatePill {
  id: string;
  labelTop: string;
  labelBottom: string;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildUpcomingDates(count: number): MockDatePill[] {
  const today = new Date();
  const days: MockDatePill[] = [];

  for (let i = 0; i < count; i += 1) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    days.push({
      id: d.toISOString().slice(0, 10), // e.g. "2026-03-05"
      labelTop: WEEKDAYS[d.getDay()],
      labelBottom: String(d.getDate()),
    });
  }

  return days;
}

export const MOCK_DATES: MockDatePill[] = buildUpcomingDates(7);

export const MOCK_SLOTS: string[] = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

