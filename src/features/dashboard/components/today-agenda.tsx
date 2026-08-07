import { CalendarClock } from "lucide-react"

import {
  PremiumCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/shared/premium-card"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/shared/empty-state"
import { formatTime } from "@/utils/format"
import { statusMeta } from "@/features/agenda/lib/status"
import { cn } from "@/lib/utils"

interface AppointmentRow {
  id: string
  startTime: Date
  status: string
  client: { name: string }
  professional: { name: string; color: string }
  procedure: { name: string }
}

export function TodayAgenda({ appointments }: { appointments: AppointmentRow[] }) {
  return (
    <PremiumCard hover className="h-full">
      <CardHeader>
        <CardTitle className="font-display text-lg font-medium">Agenda de hoje</CardTitle>
        <CardDescription>
          {appointments.length}{" "}
          {appointments.length === 1 ? "horário marcado" : "horários marcados"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <EmptyState
            icon={CalendarClock}
            title="Nenhum horário hoje"
            description="Os agendamentos do dia aparecerão aqui."
          />
        ) : (
          <ul className="space-y-1">
            {appointments.map((a) => (
              <li
                key={a.id}
                className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted/60"
              >
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: a.professional.color }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{a.client.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {a.procedure.name} · {a.professional.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium">{formatTime(a.startTime)}</p>
                  <Badge
                    variant="outline"
                    className={cn("mt-0.5 border-transparent text-[10px]", statusMeta(a.status).badgeClassName)}
                  >
                    {statusMeta(a.status).label}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </PremiumCard>
  )
}
