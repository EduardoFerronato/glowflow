import "server-only"

import { prisma } from "@/lib/prisma"
import { AppointmentStatus, PaymentStatus } from "@/generated/prisma/enums"
import { startOfMonth, endOfMonth, lastNMonths, MONTH_LABELS } from "@/utils/date-range"

export async function getRevenueByMonth(clinicId: string, months = 12) {
  const range = lastNMonths(months)
  const rangeStart = startOfMonth(range[0])
  const rangeEnd = endOfMonth(range[range.length - 1])

  const payments = await prisma.payment.findMany({
    where: { clinicId, status: PaymentStatus.PAID, paidAt: { gte: rangeStart, lte: rangeEnd } },
    select: { amount: true, paidAt: true },
  })

  return range.map((month) => {
    const mStart = startOfMonth(month)
    const mEnd = endOfMonth(month)
    const total = payments
      .filter((p) => p.paidAt >= mStart && p.paidAt <= mEnd)
      .reduce((sum, p) => sum + p.amount, 0)
    return { label: MONTH_LABELS[month.getMonth()], value: Math.round(total * 100) / 100 }
  })
}

export async function getTopClients(clinicId: string, limit = 10) {
  const grouped = await prisma.payment.groupBy({
    by: ["clientId"],
    where: { clinicId, status: PaymentStatus.PAID },
    _sum: { amount: true },
    _count: { _all: true },
  })

  if (grouped.length === 0) return []

  const clients = await prisma.client.findMany({
    where: { id: { in: grouped.map((g) => g.clientId) } },
    select: { id: true, name: true, photo: true },
  })
  const byId = new Map(clients.map((c) => [c.id, c]))

  return grouped
    .map((g) => ({
      id: g.clientId,
      name: byId.get(g.clientId)?.name ?? "Cliente",
      photo: byId.get(g.clientId)?.photo ?? null,
      total: g._sum.amount ?? 0,
      paymentsCount: g._count._all,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit)
}

export async function getTopProceduresReport(clinicId: string, months = 12, limit = 10) {
  const range = lastNMonths(months)
  const rangeStart = startOfMonth(range[0])
  const rangeEnd = endOfMonth(range[range.length - 1])

  const grouped = await prisma.appointment.groupBy({
    by: ["procedureId"],
    where: {
      clinicId,
      status: AppointmentStatus.COMPLETED,
      startTime: { gte: rangeStart, lte: rangeEnd },
    },
    _count: { _all: true },
  })

  if (grouped.length === 0) return []

  const procedures = await prisma.procedure.findMany({
    where: { id: { in: grouped.map((g) => g.procedureId) } },
    select: { id: true, name: true, color: true, price: true },
  })
  const byId = new Map(procedures.map((p) => [p.id, p]))

  return grouped
    .map((g) => {
      const procedure = byId.get(g.procedureId)
      return {
        id: g.procedureId,
        name: procedure?.name ?? "Procedimento",
        color: procedure?.color ?? "#999999",
        count: g._count._all,
        revenue: (procedure?.price ?? 0) * g._count._all,
      }
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit)
}

export async function getProfessionalPerformance(clinicId: string, months = 12) {
  const range = lastNMonths(months)
  const rangeStart = startOfMonth(range[0])
  const rangeEnd = endOfMonth(range[range.length - 1])

  const grouped = await prisma.appointment.groupBy({
    by: ["professionalId"],
    where: {
      clinicId,
      status: AppointmentStatus.COMPLETED,
      startTime: { gte: rangeStart, lte: rangeEnd },
    },
    _count: { _all: true },
  })

  if (grouped.length === 0) return []

  const [professionals, appointments] = await Promise.all([
    prisma.professional.findMany({
      where: { id: { in: grouped.map((g) => g.professionalId) } },
      select: { id: true, name: true, color: true },
    }),
    prisma.appointment.findMany({
      where: {
        clinicId,
        status: AppointmentStatus.COMPLETED,
        startTime: { gte: rangeStart, lte: rangeEnd },
        professionalId: { in: grouped.map((g) => g.professionalId) },
      },
      select: { professionalId: true, procedure: { select: { price: true } } },
    }),
  ])

  const byId = new Map(professionals.map((p) => [p.id, p]))
  const revenueByProfessional = new Map<string, number>()
  for (const appt of appointments) {
    revenueByProfessional.set(
      appt.professionalId,
      (revenueByProfessional.get(appt.professionalId) ?? 0) + appt.procedure.price
    )
  }

  return grouped
    .map((g) => ({
      id: g.professionalId,
      name: byId.get(g.professionalId)?.name ?? "Profissional",
      color: byId.get(g.professionalId)?.color ?? "#999999",
      count: g._count._all,
      revenue: revenueByProfessional.get(g.professionalId) ?? 0,
    }))
    .sort((a, b) => b.revenue - a.revenue)
}

export async function getExpensesByCategory(clinicId: string, months = 12) {
  const range = lastNMonths(months)
  const rangeStart = startOfMonth(range[0])
  const rangeEnd = endOfMonth(range[range.length - 1])

  const grouped = await prisma.expense.groupBy({
    by: ["category"],
    where: { clinicId, date: { gte: rangeStart, lte: rangeEnd } },
    _sum: { amount: true },
  })

  return grouped
    .map((g) => ({ category: g.category, total: g._sum.amount ?? 0 }))
    .sort((a, b) => b.total - a.total)
}
