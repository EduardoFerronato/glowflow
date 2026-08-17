"use client"

import { cn } from "@/lib/utils"
import { AppointmentChip, type AppointmentChipData } from "@/features/agenda/components/appointment-chip"
import { DroppableSlot } from "@/features/agenda/components/droppable-slot"
import {
  timeSlots,
  slotId,
  dateKey,
  topForDate,
  heightForDuration,
  SLOT_HEIGHT,
} from "@/features/agenda/lib/grid"
import { isDayClosed, isWithinBusinessHours, type BusinessHours } from "@/features/agenda/lib/business-hours"

const WEEKDAY_FMT = new Intl.DateTimeFormat("pt-BR", { weekday: "short" })

interface CalendarGridProps {
  days: Date[]
  appointments: AppointmentChipData[]
  businessHours: BusinessHours
  onSlotClick: (day: Date, time: string) => void
  onChipClick: (id: string) => void
}

export function CalendarGrid({
  days,
  appointments,
  businessHours,
  onSlotClick,
  onChipClick,
}: CalendarGridProps) {
  const slots = timeSlots()
  const today = dateKey(new Date())

  const byDay = new Map<string, AppointmentChipData[]>()
  for (const appt of appointments) {
    const key = dateKey(appt.startTime)
    if (!byDay.has(key)) byDay.set(key, [])
    byDay.get(key)!.push(appt)
  }

  return (
    <div className="overflow-auto rounded-2xl border border-border/70 bg-card shadow-soft">
      <div className="flex min-w-[640px]">
        <div className="w-16 shrink-0 border-r border-border/50">
          <div className="h-12 border-b border-border/50" />
          {slots.map((time, i) =>
            i % 2 === 0 ? (
              <div
                key={time}
                style={{ height: SLOT_HEIGHT * 2 }}
                className="flex items-start justify-end px-2 pt-[-6px] text-[11px] text-muted-foreground"
              >
                <span className="-translate-y-1/2">{time}</span>
              </div>
            ) : null
          )}
        </div>

        {days.map((day) => {
          const key = dateKey(day)
          const dayAppointments = byDay.get(key) ?? []
          const closed = isDayClosed(day, businessHours)
          return (
            <div key={key} className="min-w-[140px] flex-1 border-r border-border/50 last:border-r-0">
              <div
                className={cn(
                  "sticky top-0 z-10 flex h-12 flex-col items-center justify-center border-b border-border/50 bg-card text-xs",
                  key === today && "bg-accent/50",
                  closed && "bg-muted/40"
                )}
              >
                <span className="capitalize text-muted-foreground">
                  {WEEKDAY_FMT.format(day)}
                </span>
                <span className={cn("font-semibold", key === today && "text-primary")}>
                  {day.getDate()}
                </span>
              </div>
              <div className="relative">
                {slots.map((time) => (
                  <DroppableSlot
                    key={time}
                    id={slotId(day, time)}
                    height={SLOT_HEIGHT}
                    dimmed={!isWithinBusinessHours(day, time, businessHours)}
                    onClick={() => onSlotClick(day, time)}
                  />
                ))}
                <div className="pointer-events-none absolute inset-0">
                  {dayAppointments.map((appt) => (
                    <div
                      key={appt.id}
                      className="pointer-events-auto absolute inset-x-1"
                      style={{
                        top: topForDate(appt.startTime),
                        height: heightForDuration(appt.startTime, appt.endTime),
                      }}
                    >
                      <AppointmentChip
                        appointment={appt}
                        style={{ height: "100%" }}
                        onClick={() => onChipClick(appt.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
