import { CalendarClock } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/shared/empty-state"
import { formatDateTime } from "@/utils/format"

interface AppointmentRow {
  id: string
  startTime: Date
  status: string
  client: { name: string }
  professional: { name: string; color: string }
  procedure: { name: string }
}

const STATUS_LABEL: Record<string, string> = {
  SCHEDULED: "Agendado",
  CONFIRMED: "Confirmado",
  COMPLETED: "Concluído",
  CANCELLED: "Cancelado",
}

export function UpcomingAppointments({ appointments }: { appointments: AppointmentRow[] }) {
  return (
    <Card className="border-border/70 shadow-soft">
      <CardHeader>
        <CardTitle className="text-base">Próximos horários</CardTitle>
        <CardDescription>Agendamentos confirmados e programados</CardDescription>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <EmptyState
            icon={CalendarClock}
            title="Nenhum agendamento futuro"
            description="Os próximos horários da clínica aparecerão aqui."
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
                  <p className="text-xs font-medium">{formatDateTime(a.startTime)}</p>
                  <Badge variant="secondary" className="mt-0.5 text-[10px]">
                    {STATUS_LABEL[a.status] ?? a.status}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
