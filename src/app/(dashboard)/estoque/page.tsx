import { requireSession } from "@/lib/session"
import { listStock } from "@/services/stock.service"
import { PageHeader } from "@/components/shared/page-header"
import { StockSummary } from "@/features/stock/components/stock-summary"
import { StockTable } from "@/features/stock/components/stock-table"

export const metadata = { title: "Estoque" }

export default async function EstoquePage() {
  const session = await requireSession()
  const stock = await listStock(session.user.clinicId)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Estoque"
        description="Controle os produtos e insumos da sua clínica."
      />
      <StockSummary stock={stock} />
      <StockTable stock={stock} />
    </div>
  )
}
