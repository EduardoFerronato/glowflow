import { Wallet } from "lucide-react"

import {
  PremiumCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/shared/premium-card"
import { EmptyState } from "@/components/shared/empty-state"
import { formatCurrency } from "@/utils/format"

interface ExpenseCategoryRow {
  category: string
  total: number
}

export function ExpensesByCategoryCard({ categories }: { categories: ExpenseCategoryRow[] }) {
  const max = Math.max(...categories.map((c) => c.total), 1)

  return (
    <PremiumCard hover className="h-full">
      <CardHeader>
        <CardTitle className="font-display text-lg font-medium">Despesas por categoria</CardTitle>
        <CardDescription>Últimos 12 meses</CardDescription>
      </CardHeader>
      <CardContent>
        {categories.length === 0 ? (
          <EmptyState
            icon={Wallet}
            title="Nenhuma despesa registrada"
            description="A distribuição por categoria aparecerá aqui."
          />
        ) : (
          <ul className="space-y-3">
            {categories.map((c) => (
              <li key={c.category} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="truncate font-medium">{c.category}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatCurrency(c.total)}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${Math.max((c.total / max) * 100, 6)}%` }}
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
