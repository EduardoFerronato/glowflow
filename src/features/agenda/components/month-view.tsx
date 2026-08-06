"use client"

import { useDroppable } from "@dnd-kit/core"

import { cn } from "@/lib/utils"
import { AppointmentChip, type AppointmentChipData } from "@/features/agenda/components/appointment-chip"
import { dateKey } from "@/features/agenda/lib/grid"

const WEEKDAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

function buildMonthMatrix(reference: Date) {
  const year = reference.getFullYear()
  const month = reference.getMonth()
  const firstOfMonth = new Date(year, month, 1)
  const startOffset = firstOfMonth.getDay()
  const gridStart = new Date(year, month, 1 - startOffset)

  const days: Date[] = []
  for (let i = 0; i < 42; i++) {
    days.push(new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i))
  }
  return days
}

function MonthCell({
  day,
  inMonth,
  appointments,
  onClick,
  onChipClick,
}: {
  day: Date
  inMonth: boolean
  appointments: AppointmentChipData[]
  onClick: () => void
  onChipClick: (id: string) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `month-${dateKey(day)}` })
  const today = dateKey(new Date()) === dateKey(day)
  const visible = appointments.slice(0, 3)
  const extra = appointments.length - visible.length

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      className={cn(
        "flex min-h-28 flex-col gap-1 border-b border-r border-border/50 p-1.5 text-xs transition-colors",
        !inMonth && "bg-muted/30 text-muted-foreground/50",
        isOver && "bg-primary/10"
      )}
    >
      <span
        className={cn(
          "flex size-5 items-center justify-center rounded-full text-[11px] font-medium",
          today && "bg-primary text-primary-foreground"
        )}
      >
        {day.getDate()}
      </span>
      <div className="flex flex-col gap-1">
        {visible.map((a) => (
          <AppointmentChip
            key={a.id}
            appointment={a}
            compact
            onClick={(e) => {
              e.stopPropagation()
              onChipClick(a.id)
            }}
          />
        ))}
        {extra > 0 ? (
          <span className="px-1 text-[10px] text-muted-foreground">+{extra} mais</span>
        ) : null}
      </div>
    </div>
  )
}

export function MonthView({
  reference,
  appointments,
  onDayClick,
  onChipClick,
}: {
  reference: Date
  appointments: AppointmentChipData[]
  onDayClick: (day: Date) => void
  onChipClick: (id: string) => void
}) {
  const days = buildMonthMatrix(reference)
  const byDay = new Map<string, AppointmentChipData[]>()
  for (const appt of appointments) {
    const key = dateKey(appt.startTime)
    if (!byDay.has(key)) byDay.set(key, [])
    byDay.get(key)!.push(appt)
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft">
      <div className="grid grid-cols-7 border-b border-border/50 bg-muted/40 text-center text-xs font-medium text-muted-foreground">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="py-2">
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day) => (
          <MonthCell
            key={dateKey(day)}
            day={day}
            inMonth={day.getMonth() === reference.getMonth()}
            appointments={byDay.get(dateKey(day)) ?? []}
            onClick={() => onDayClick(day)}
            onChipClick={onChipClick}
          />
        ))}
      </div>
    </div>
  )
}
