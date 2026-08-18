import { Sparkles } from "lucide-react"

import {
  PremiumCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/shared/premium-card"
import { EmptyState } from "@/components/shared/empty-state"
import { formatCurrency } from "@/utils/format"

interface ProcedureRow {
  id: string
  name: string
  color: string
  count: number
  revenue: number
}

export function TopProceduresCard({ procedures }: { procedures: ProcedureRow[] }) {
  const max = Math.max(...procedures.map((p) => p.revenue), 1)

  return (
    <PremiumCard hover className="h-full">
      <CardHeader>
        <CardTitle className="font-display text-lg font-medium">
          Procedimentos mais rentáveis
        </CardTitle>
        <CardDescription>Últimos 12 meses</CardDescription>
      </CardHeader>
      <CardContent>
        {procedures.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="Nenhum procedimento concluído"
            description="O ranking de procedimentos aparecerá aqui."
          />
        ) : (
          <ul className="space-y-3">
            {procedures.map((p) => (
              <li key={p.id} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="truncate font-medium">{p.name}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {p.count}x · {formatCurrency(p.revenue)}
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
