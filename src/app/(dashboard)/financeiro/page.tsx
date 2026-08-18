import { requireSession } from "@/lib/session"
import {
  getFinanceSummary,
  getCashFlowChart,
  listPayments,
  listExpenses,
} from "@/services/finance.service"
import { listClients } from "@/services/client.service"
import { PageHeader } from "@/components/shared/page-header"
import { FinanceSummary } from "@/features/finance/components/finance-summary"
import { CashFlowCard } from "@/features/finance/components/cash-flow-card"
import { FinanceView } from "@/features/finance/components/finance-view"

export const metadata = { title: "Financeiro" }

export default async function FinanceiroPage() {
  const session = await requireSession()
  const clinicId = session.user.clinicId

  const [summary, cashFlow, payments, expenses, clients] = await Promise.all([
    getFinanceSummary(clinicId),
    getCashFlowChart(clinicId),
    listPayments(clinicId),
    listExpenses(clinicId),
    listClients(clinicId),
  ])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financeiro"
        description="Acompanhe o fluxo de caixa da sua clínica."
      />

      <FinanceSummary
        revenue={summary.revenue}
        expenses={summary.expenses}
        profit={summary.profit}
        comparison={summary.comparison}
      />

      <CashFlowCard data={cashFlow} />

      <FinanceView
        payments={payments}
        expenses={expenses}
        clients={clients.map((c) => ({ id: c.id, name: c.name }))}
      />
    </div>
  )
}
