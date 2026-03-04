export interface UpdateAvailabilitiesPayload {
  availability: { [key: string]: { from: string; to: string }[] }
}
export interface AvailabilityItem {
  id: number
  dayOfWeek: string
  date: string | null
  intervals: { from: string; to: string }[]
}
