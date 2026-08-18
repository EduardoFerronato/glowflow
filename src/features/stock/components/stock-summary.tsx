import { Package, AlertTriangle, CalendarClock } from "lucide-react"

import { PremiumCard, CardContent } from "@/components/shared/premium-card"
import type { StockRow } from "@/features/stock/components/stock-table"

const EXPIRY_WARNING_DAYS = 30

export function StockSummary({ stock }: { stock: StockRow[] }) {
  const lowStockCount = stock.filter((s) => s.quantity <= s.minQuantity).length
  const expiringCount = stock.filter((s) => {
    if (!s.expiryDate) return false
    const days = Math.round((new Date(s.expiryDate).getTime() - new Date().getTime()) / 86400000)
    return days <= EXPIRY_WARNING_DAYS
  }).length

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <PremiumCard>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Itens cadastrados</p>
            <p className="text-2xl font-semibold tracking-tight">{stock.length}</p>
          </div>
          <div className="flex size-9 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <Package className="size-4" />
          </div>
        </CardContent>
      </PremiumCard>

      <PremiumCard>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Estoque baixo</p>
            <p className="text-2xl font-semibold tracking-tight">{lowStockCount}</p>
          </div>
          <div className="flex size-9 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <AlertTriangle className="size-4" />
          </div>
        </CardContent>
      </PremiumCard>

      <PremiumCard>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Vencendo em 30 dias</p>
            <p className="text-2xl font-semibold tracking-tight">{expiringCount}</p>
          </div>
          <div className="flex size-9 items-center justify-center rounded-xl bg-champagne text-champagne-foreground">
            <CalendarClock className="size-4" />
          </div>
        </CardContent>
      </PremiumCard>
    </div>
  )
}
