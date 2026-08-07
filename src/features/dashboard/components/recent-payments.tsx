import { Receipt } from "lucide-react"

import {
  PremiumCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/shared/premium-card"
import { EmptyState } from "@/components/shared/empty-state"
import { formatCurrency, formatDateTime } from "@/utils/format"

interface PaymentRow {
  id: string
  amount: number
  method: string
  paidAt: Date
  client: { name: string }
}

const METHOD_LABEL: Record<string, string> = {
  CASH: "Dinheiro",
  CREDIT_CARD: "Crédito",
  DEBIT_CARD: "Débito",
  PIX: "Pix",
  BANK_TRANSFER: "Transferência",
  OTHER: "Outro",
}

export function RecentPayments({ payments }: { payments: PaymentRow[] }) {
  return (
    <PremiumCard hover>
      <CardHeader>
        <CardTitle className="font-display text-lg font-medium">Últimas movimentações</CardTitle>
        <CardDescription>Pagamentos recebidos recentemente</CardDescription>
      </CardHeader>
      <CardContent>
        {payments.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="Nenhum pagamento ainda"
            description="Os pagamentos recebidos aparecerão aqui."
          />
        ) : (
          <ul className="space-y-1">
            {payments.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted/60"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{p.client.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {METHOD_LABEL[p.method] ?? p.method} · {formatDateTime(p.paidAt)}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  +{formatCurrency(p.amount)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </PremiumCard>
  )
}
