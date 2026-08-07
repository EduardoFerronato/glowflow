import { APPOINTMENT_STATUSES } from "@/features/agenda/lib/status"
import { cn } from "@/lib/utils"

export function StatusLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
      {APPOINTMENT_STATUSES.map((status) => (
        <span key={status.value} className="flex items-center gap-1.5">
          <span className={cn("size-2 rounded-full", status.dotClassName)} />
          {status.label}
        </span>
      ))}
    </div>
  )
}
