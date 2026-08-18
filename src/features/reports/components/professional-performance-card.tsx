import { Users } from "lucide-react"

import {
  PremiumCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/shared/premium-card"
import { EmptyState } from "@/components/shared/empty-state"
import { formatCurrency } from "@/utils/format"

interface ProfessionalRow {
  id: string
  name: string
  color: string
  count: number
  revenue: number
}

export function ProfessionalPerformanceCard({
  professionals,
}: {
  professionals: ProfessionalRow[]
}) {
  const max = Math.max(...professionals.map((p) => p.revenue), 1)

  return (
    <PremiumCard hover className="h-full">
      <CardHeader>
        <CardTitle className="font-display text-lg font-medium">Desempenho por profissional</CardTitle>
        <CardDescription>Últimos 12 meses, procedimentos concluídos</CardDescription>
      </CardHeader>
      <CardContent>
        {professionals.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Nenhum atendimento concluído"
            description="O desempenho por profissional aparecerá aqui."
          />
        ) : (
          <ul className="space-y-3">
            {professionals.map((p) => (
              <li key={p.id} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="flex items-center gap-2 truncate font-medium">
                    <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: p.color }} />
                    {p.name}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {p.count} atend. · {formatCurrency(p.revenue)}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.max((p.revenue / max) * 100, 6)}%`,
                      backgroundColor: p.color,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </PremiumCard>
  )
}
