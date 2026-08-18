import { requireSession } from "@/lib/session"
import {
  getRevenueByMonth,
  getTopClients,
  getTopProceduresReport,
  getProfessionalPerformance,
  getExpensesByCategory,
} from "@/services/report.service"
import { PageHeader } from "@/components/shared/page-header"
import { RevenueTrendCard } from "@/features/reports/components/revenue-trend-card"
import { TopClientsCard } from "@/features/reports/components/top-clients-card"
import { TopProceduresCard } from "@/features/reports/components/top-procedures-card"
import { ProfessionalPerformanceCard } from "@/features/reports/components/professional-performance-card"
import { ExpensesByCategoryCard } from "@/features/reports/components/expenses-by-category-card"

export const metadata = { title: "Relatórios" }

export default async function RelatoriosPage() {
  const session = await requireSession()
  const clinicId = session.user.clinicId

  const [revenue, topClients, topProcedures, professionals, expensesByCategory] =
    await Promise.all([
      getRevenueByMonth(clinicId),
      getTopClients(clinicId),
      getTopProceduresReport(clinicId),
      getProfessionalPerformance(clinicId),
      getExpensesByCategory(clinicId),
    ])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Relatórios"
        description="Uma visão consolidada do desempenho da sua clínica."
      />

      <RevenueTrendCard data={revenue} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TopClientsCard clients={topClients} />
        <TopProceduresCard procedures={topProcedures} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ProfessionalPerformanceCard professionals={professionals} />
        <ExpensesByCategoryCard categories={expensesByCategory} />
      </div>
    </div>
  )
}
