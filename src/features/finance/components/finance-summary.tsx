import { TrendingUp, TrendingDown, Scale } from "lucide-react"

import { PremiumCard, CardContent } from "@/components/shared/premium-card"
import { formatCurrency } from "@/utils/format"
import { cn } from "@/lib/utils"

interface FinanceSummaryProps {
  revenue: number
  expenses: number
  profit: number
  comparison: {
    revenue: number
    expenses: number
    profit: number
  }
}

function TrendBadge({ value, invert = false }: { value: number; invert?: boolean }) {
  const positive = invert ? value <= 0 : value >= 0
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        positive
          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
          : "bg-destructive/10 text-destructive"
      )}
    >
      {value >= 0 ? "↑" : "↓"} {Math.abs(value)}% vs. mês anterior
    </span>
  )
}

export function FinanceSummary({ revenue, expenses, profit, comparison }: FinanceSummaryProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <PremiumCard hover>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Receita do mês</p>
            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="size-4" />
            </div>
          </div>
          <p className="text-2xl font-semibold tracking-tight">{formatCurrency(revenue)}</p>
          <TrendBadge value={comparison.revenue} />
        </CardContent>
      </PremiumCard>

      <PremiumCard hover>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Despesas do mês</p>
            <div className="flex size-9 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <TrendingDown className="size-4" />
            </div>
          </div>
          <p className="text-2xl font-semibold tracking-tight">{formatCurrency(expenses)}</p>
          <TrendBadge value={comparison.expenses} invert />
        </CardContent>
      </PremiumCard>

      <PremiumCard hover>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Lucro líquido</p>
            <div className="flex size-9 items-center justify-center rounded-xl bg-champagne text-champagne-foreground">
              <Scale className="size-4" />
            </div>
          </div>
          <p className="text-2xl font-semibold tracking-tight">{formatCurrency(profit)}</p>
          <TrendBadge value={comparison.profit} />
        </CardContent>
      </PremiumCard>
    </div>
  )
}
