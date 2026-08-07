import "server-only"

import { prisma } from "@/lib/prisma"
import { AppointmentStatus, PaymentStatus } from "@/generated/prisma/enums"

function startOfDay(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}
function endOfDay(date: Date) {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}
function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}
function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)
}

function percentChange(current: number, previous: number) {
  if (previous <= 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 1000) / 10
}

export async function getDashboardSummary(clinicId: string) {
  const now = new Date()
  const todayStart = startOfDay(now)
  const todayEnd = endOfDay(now)
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)
  const prevMonthRef = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const prevMonthStart = startOfMonth(prevMonthRef)
  const prevMonthEnd = endOfMonth(prevMonthRef)

  const [
    todayPayments,
    monthPayments,
    prevMonthPayments,
    todayAppointments,
    newClientsThisMonth,
    newClientsPrevMonth,
    completedProceduresThisMonth,
    completedProceduresPrevMonth,
    upcomingAppointments,
    recentPayments,
  ] = await Promise.all([
    prisma.payment.aggregate({
      where: { clinicId, status: PaymentStatus.PAID, paidAt: { gte: todayStart, lte: todayEnd } },
      _sum: { amount: true },
    }),
    prisma.payment.aggregate({
      where: { clinicId, status: PaymentStatus.PAID, paidAt: { gte: monthStart, lte: monthEnd } },
      _sum: { amount: true },
    }),
    prisma.payment.aggregate({
      where: {
        clinicId,
        status: PaymentStatus.PAID,
        paidAt: { gte: prevMonthStart, lte: prevMonthEnd },
      },
      _sum: { amount: true },
    }),
    prisma.appointment.count({
      where: {
        clinicId,
        startTime: { gte: todayStart, lte: todayEnd },
        status: { not: AppointmentStatus.CANCELLED },
      },
    }),
    prisma.client.count({
      where: { clinicId, createdAt: { gte: monthStart, lte: monthEnd } },
    }),
    prisma.client.count({
      where: { clinicId, createdAt: { gte: prevMonthStart, lte: prevMonthEnd } },
    }),
    prisma.appointment.count({
      where: {
        clinicId,
        status: AppointmentStatus.COMPLETED,
        startTime: { gte: monthStart, lte: monthEnd },
      },
    }),
    prisma.appointment.count({
      where: {
        clinicId,
        status: AppointmentStatus.COMPLETED,
        startTime: { gte: prevMonthStart, lte: prevMonthEnd },
      },
    }),
    prisma.appointment.findMany({
      where: {
        clinicId,
        startTime: { gte: now },
        status: { in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED] },
      },
      orderBy: { startTime: "asc" },
      take: 5,
      include: { client: true, professional: true, procedure: true },
    }),
    prisma.payment.findMany({
      where: { clinicId },
      orderBy: { paidAt: "desc" },
      take: 5,
      include: { client: true },
    }),
  ])

  const monthRevenue = monthPayments._sum.amount ?? 0
  const prevMonthRevenue = prevMonthPayments._sum.amount ?? 0
  const averageTicket =
    completedProceduresThisMonth > 0 ? monthRevenue / completedProceduresThisMonth : 0
  const prevAverageTicket =
    completedProceduresPrevMonth > 0 ? prevMonthRevenue / completedProceduresPrevMonth : 0

  return {
    todayRevenue: todayPayments._sum.amount ?? 0,
    monthRevenue,
    todayAppointments,
    newClientsThisMonth,
    completedProceduresThisMonth,
    averageTicket,
    upcomingAppointments,
    recentPayments,
    comparison: {
      revenue: percentChange(monthRevenue, prevMonthRevenue),
      newClients: percentChange(newClientsThisMonth, newClientsPrevMonth),
      completedProcedures: percentChange(completedProceduresThisMonth, completedProceduresPrevMonth),
      averageTicket: percentChange(averageTicket, prevAverageTicket),
    },
  }
}

export async function getTodayAgenda(clinicId: string) {
  const now = new Date()
  return prisma.appointment.findMany({
    where: {
      clinicId,
      startTime: { gte: startOfDay(now), lte: endOfDay(now) },
    },
    orderBy: { startTime: "asc" },
    include: { client: true, professional: true, procedure: true },
  })
}

export async function getUpcomingBirthdays(clinicId: string, limit = 5) {
  const clients = await prisma.client.findMany({
    where: { clinicId, birthDate: { not: null } },
    select: { id: true, name: true, photo: true, birthDate: true },
  })

  const now = new Date()
  const currentYear = now.getFullYear()

  return clients
    .map((client) => {
      const birth = client.birthDate!
      let next = new Date(currentYear, birth.getMonth(), birth.getDate())
      if (next < startOfDay(now)) next = new Date(currentYear + 1, birth.getMonth(), birth.getDate())
      const daysUntil = Math.round((next.getTime() - startOfDay(now).getTime()) / 86400000)
      return { ...client, nextBirthday: next, daysUntil }
    })
    .filter((c) => c.daysUntil <= 31)
    .sort((a, b) => a.daysUntil - b.daysUntil)
    .slice(0, limit)
}

export async function getTopProcedures(clinicId: string, limit = 5) {
  const now = new Date()
  const grouped = await prisma.appointment.groupBy({
    by: ["procedureId"],
    where: {
      clinicId,
      status: AppointmentStatus.COMPLETED,
      startTime: { gte: startOfMonth(now), lte: endOfMonth(now) },
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
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

/**
 * Fetches the last 6 months of payments in a single round trip and derives
 * both the weekly and monthly chart buckets from it (avoids two separate
 * queries hitting the DB for what is effectively overlapping data).
 */
export async function getRevenueCharts(clinicId: string) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d
  })
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setDate(1)
    d.setMonth(d.getMonth() - (5 - i))
    return d
  })

  const rangeStart = startOfMonth(months[0])
  const rangeEnd = endOfDay(days[days.length - 1])

  const payments = await prisma.payment.findMany({
    where: { clinicId, status: PaymentStatus.PAID, paidAt: { gte: rangeStart, lte: rangeEnd } },
    select: { amount: true, paidAt: true },
  })

  const weekly = days.map((day) => {
    const dayStart = startOfDay(day)
    const dayEnd = endOfDay(day)
    const total = payments
      .filter((p) => p.paidAt >= dayStart && p.paidAt <= dayEnd)
      .reduce((sum, p) => sum + p.amount, 0)
    return { label: WEEKDAYS[day.getDay()], value: Math.round(total * 100) / 100 }
  })

  const monthly = months.map((month) => {
    const mStart = startOfMonth(month)
    const mEnd = endOfMonth(month)
    const total = payments
      .filter((p) => p.paidAt >= mStart && p.paidAt <= mEnd)
      .reduce((sum, p) => sum + p.amount, 0)
    return { label: MONTHS[month.getMonth()], value: Math.round(total * 100) / 100 }
  })

  return { weekly, monthly }
}
