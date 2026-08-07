import { AppointmentStatus } from "@/generated/prisma/enums"

export interface StatusMeta {
  value: AppointmentStatus
  label: string
  /** Tailwind classes for a small filled dot used in legends/timelines. */
  dotClassName: string
  /** Tailwind classes for a badge-style pill. */
  badgeClassName: string
}

export const APPOINTMENT_STATUSES: StatusMeta[] = [
  {
    value: AppointmentStatus.SCHEDULED,
    label: "Agendado",
    dotClassName: "bg-muted-foreground/50",
    badgeClassName: "bg-muted text-muted-foreground",
  },
  {
    value: AppointmentStatus.CONFIRMED,
    label: "Confirmado",
    dotClassName: "bg-lilac-foreground",
    badgeClassName: "bg-lilac text-lilac-foreground",
  },
  {
    value: AppointmentStatus.CHECKED_IN,
    label: "Chegou",
    dotClassName: "bg-champagne-foreground",
    badgeClassName: "bg-champagne text-champagne-foreground",
  },
  {
    value: AppointmentStatus.IN_PROGRESS,
    label: "Em atendimento",
    dotClassName: "bg-primary",
    badgeClassName: "bg-primary/15 text-primary",
  },
  {
    value: AppointmentStatus.COMPLETED,
    label: "Concluído",
    dotClassName: "bg-emerald-500",
    badgeClassName: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  },
  {
    value: AppointmentStatus.CANCELLED,
    label: "Cancelado",
    dotClassName: "bg-destructive/60",
    badgeClassName: "bg-destructive/10 text-destructive",
  },
]

export const STATUS_LABEL: Record<string, string> = Object.fromEntries(
  APPOINTMENT_STATUSES.map((s) => [s.value, s.label])
)

export function statusMeta(status: string): StatusMeta {
  return (
    APPOINTMENT_STATUSES.find((s) => s.value === status) ?? APPOINTMENT_STATUSES[0]
  )
}
