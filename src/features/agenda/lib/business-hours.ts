export interface BusinessHours {
  sun: [string, string] | null
  mon: [string, string] | null
  tue: [string, string] | null
  wed: [string, string] | null
  thu: [string, string] | null
  fri: [string, string] | null
  sat: [string, string] | null
}

const DAY_KEYS: (keyof BusinessHours)[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]

export function hoursForDay(day: Date, hours: BusinessHours) {
  return hours[DAY_KEYS[day.getDay()]]
}

export function isDayClosed(day: Date, hours: BusinessHours) {
  return hoursForDay(day, hours) === null
}

export function isWithinBusinessHours(day: Date, time: string, hours: BusinessHours) {
  const range = hoursForDay(day, hours)
  if (!range) return false
  const [start, end] = range
  return time >= start && time < end
}
