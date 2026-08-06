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

export async function getDashboardSummary(clinicId: string) {
  const now = new Date()
  const todayStart = startOfDay(now)
  const todayEnd = endOfDay(now)
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)

  const [
    todayPayments,
    monthPayments,
    todayAppointments,
    newClientsThisMonth,
    completedProceduresThisMonth,
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
    prisma.appointment.count({
      where: {
        clinicId,
        status: AppointmentStatus.COMPLETED,
        startTime: { gte: monthStart, lte: monthEnd },
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
  const averageTicket =
    completedProceduresThisMonth > 0 ? monthRevenue / completedProceduresThisMonth : 0

  return {
    todayRevenue: todayPayments._sum.amount ?? 0,
    monthRevenue,
    todayAppointments,
    newClientsThisMonth,
    completedProceduresThisMonth,
    averageTicket,
    upcomingAppointments,
    recentPayments,
  }
}

export async function getWeeklyRevenue(clinicId: string) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d
  })
  const rangeStart = startOfDay(days[0])
  const rangeEnd = endOfDay(days[days.length - 1])

  const payments = await prisma.payment.findMany({
    where: { clinicId, status: PaymentStatus.PAID, paidAt: { gte: rangeStart, lte: rangeEnd } },
    select: { amount: true, paidAt: true },
  })

  const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

  return days.map((day) => {
    const dayStart = startOfDay(day)
    const dayEnd = endOfDay(day)
    const total = payments
      .filter((p) => p.paidAt >= dayStart && p.paidAt <= dayEnd)
      .reduce((sum, p) => sum + p.amount, 0)
    return { label: WEEKDAYS[day.getDay()], value: Math.round(total * 100) / 100 }
  })
}

export async function getMonthlyRevenue(clinicId: string) {
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setDate(1)
    d.setMonth(d.getMonth() - (5 - i))
    return d
  })
  const rangeStart = startOfMonth(months[0])
  const rangeEnd = endOfMonth(months[months.length - 1])

  const payments = await prisma.payment.findMany({
    where: { clinicId, status: PaymentStatus.PAID, paidAt: { gte: rangeStart, lte: rangeEnd } },
    select: { amount: true, paidAt: true },
  })

  const MONTHS = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez",
  ]

  return months.map((month) => {
    const mStart = startOfMonth(month)
    const mEnd = endOfMonth(month)
    const total = payments
      .filter((p) => p.paidAt >= mStart && p.paidAt <= mEnd)
      .reduce((sum, p) => sum + p.amount, 0)
    return { label: MONTHS[month.getMonth()], value: Math.round(total * 100) / 100 }
  })
}
