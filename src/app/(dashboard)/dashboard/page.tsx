import { requireSession } from "@/lib/session"
import {
  getDashboardSummary,
  getRevenueCharts,
  getTodayAgenda,
  getUpcomingBirthdays,
  getTopProcedures,
} from "@/services/dashboard.service"
import { PageHeader } from "@/components/shared/page-header"
import { RevenueHero } from "@/features/dashboard/components/revenue-hero"
import { TodayAgenda } from "@/features/dashboard/components/today-agenda"
import { UpcomingBirthdays } from "@/features/dashboard/components/upcoming-birthdays"
import { TopProcedures } from "@/features/dashboard/components/top-procedures"
import { RecentPayments } from "@/features/dashboard/components/recent-payments"
import { formatCurrency } from "@/utils/format"

export const metadata = { title: "Dashboard" }

function currentPeriodLabel() {
  const label = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(new Date())
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export default async function DashboardPage() {
  const session = await requireSession()
  const clinicId = session.user.clinicId

  const [summary, { weekly, monthly }, todayAgenda, birthdays, topProcedures] = await Promise.all([
    getDashboardSummary(clinicId),
    getRevenueCharts(clinicId),
    getTodayAgenda(clinicId),
    getUpcomingBirthdays(clinicId),
    getTopProcedures(clinicId),
  ])

  const { comparison } = summary

  return (
    <div className="space-y-10">
      <PageHeader
        title={`Olá, ${session.user.name.split(" ")[0]}`}
        description="Aqui está o resumo da sua clínica hoje."
      />

      <RevenueHero
        monthRevenue={summary.monthRevenue}
        comparisonRevenue={comparison.revenue}
        weekly={weekly}
        monthly={monthly}
        periodLabel={currentPeriodLabel()}
        stats={[
          { label: "Receita hoje", value: formatCurrency(summary.todayRevenue) },
          {
            label: "Ticket médio",
            value: formatCurrency(summary.averageTicket),
            trend: { value: comparison.averageTicket, positive: comparison.averageTicket >= 0 },
          },
          {
            label: "Procedimentos concluídos",
            value: String(summary.completedProceduresThisMonth),
            trend: {
              value: comparison.completedProcedures,
              positive: comparison.completedProcedures >= 0,
            },
          },
          {
            label: "Clientes novos",
            value: String(summary.newClientsThisMonth),
            trend: { value: comparison.newClients, positive: comparison.newClients >= 0 },
          },
        ]}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <TodayAgenda appointments={todayAgenda} />
        </div>
        <UpcomingBirthdays clients={birthdays} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TopProcedures procedures={topProcedures} />
        <RecentPayments payments={summary.recentPayments} />
      </div>
    </div>
  )
}
