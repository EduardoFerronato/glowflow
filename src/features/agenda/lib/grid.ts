export const GRID_START_HOUR = 7
export const GRID_END_HOUR = 21
export const SLOT_MINUTES = 30
export const SLOT_HEIGHT = 32 // px
export const SLOTS_PER_HOUR = 60 / SLOT_MINUTES
export const TOTAL_SLOTS = (GRID_END_HOUR - GRID_START_HOUR) * SLOTS_PER_HOUR

export function timeSlots() {
  const slots: string[] = []
  for (let i = 0; i < TOTAL_SLOTS; i++) {
    const totalMinutes = GRID_START_HOUR * 60 + i * SLOT_MINUTES
    const h = Math.floor(totalMinutes / 60)
    const m = totalMinutes % 60
    slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`)
  }
  return slots
}

export function minutesFromGridStart(date: Date) {
  return (date.getHours() - GRID_START_HOUR) * 60 + date.getMinutes()
}

export function topForDate(date: Date) {
  return (minutesFromGridStart(date) / SLOT_MINUTES) * SLOT_HEIGHT
}

export function heightForDuration(startTime: Date, endTime: Date) {
  const minutes = (endTime.getTime() - startTime.getTime()) / 60000
  return Math.max((minutes / SLOT_MINUTES) * SLOT_HEIGHT, SLOT_HEIGHT * 0.75)
}

export function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`
}

export function slotId(day: Date, time: string) {
  return `${dateKey(day)}T${time}`
}

export function parseSlotId(id: string) {
  const [datePart, time] = id.split("T")
  const [y, m, d] = datePart.split("-").map(Number)
  const [h, min] = time.split(":").map(Number)
  return new Date(y, m - 1, d, h, min, 0, 0)
}
