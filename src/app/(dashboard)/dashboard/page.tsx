import {
  DollarSign,
  CalendarCheck,
  UserPlus,
  Sparkles,
  Receipt,
  TrendingUp,
} from "lucide-react"

import { requireSession } from "@/lib/session"
import {
  getDashboardSummary,
  getWeeklyRevenue,
  getMonthlyRevenue,
} from "@/services/dashboard.service"
import { StatCard } from "@/components/shared/stat-card"
import { PageHeader } from "@/components/shared/page-header"
import { RevenueChart } from "@/features/dashboard/components/revenue-chart"
import { UpcomingAppointments } from "@/features/dashboard/components/upcoming-appointments"
import { RecentPayments } from "@/features/dashboard/components/recent-payments"
import { formatCurrency } from "@/utils/format"

export const metadata = { title: "Dashboard" }

export default async function DashboardPage() {
  const session = await requireSession()
  const clinicId = session.user.clinicId

  const [summary, weekly, monthly] = await Promise.all([
    getDashboardSummary(clinicId),
    getWeeklyRevenue(clinicId),
    getMonthlyRevenue(clinicId),
  ])

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Olá, ${session.user.name.split(" ")[0]} 👋`}
        description="Aqui está o resumo da sua clínica hoje."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          index={0}
          label="Receita hoje"
          value={formatCurrency(summary.todayRevenue)}
          icon={<DollarSign />}
        />
        <StatCard
          index={1}
          label="Receita do mês"
          value={formatCurrency(summary.monthRevenue)}
          icon={<TrendingUp />}
        />
        <StatCard
          index={2}
          label="Agendamentos hoje"
          value={String(summary.todayAppointments)}
          icon={<CalendarCheck />}
        />
        <StatCard
          index={3}
          label="Clientes novos (mês)"
          value={String(summary.newClientsThisMonth)}
          icon={<UserPlus />}
        />
        <StatCard
          index={4}
          label="Procedimentos realizados"
          value={String(summary.completedProceduresThisMonth)}
          icon={<Sparkles />}
        />
        <StatCard
          index={5}
          label="Ticket médio"
          value={formatCurrency(summary.averageTicket)}
          icon={<Receipt />}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RevenueChart weekly={weekly} monthly={monthly} />
        </div>
        <UpcomingAppointments appointments={summary.upcomingAppointments} />
      </div>

      <RecentPayments payments={summary.recentPayments} />
    </div>
  )
}
