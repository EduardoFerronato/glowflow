import "server-only"

import { prisma } from "@/lib/prisma"
import { PaymentMethod, PaymentStatus } from "@/generated/prisma/enums"
import {
  startOfMonth,
  endOfMonth,
  percentChange,
  lastNMonths,
  MONTH_LABELS,
} from "@/utils/date-range"

export async function getFinanceSummary(clinicId: string) {
  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)
  const prevMonthRef = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const prevMonthStart = startOfMonth(prevMonthRef)
  const prevMonthEnd = endOfMonth(prevMonthRef)

  const [monthRevenue, prevMonthRevenue, monthExpenses, prevMonthExpenses] = await Promise.all([
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
    prisma.expense.aggregate({
      where: { clinicId, date: { gte: monthStart, lte: monthEnd } },
      _sum: { amount: true },
    }),
    prisma.expense.aggregate({
      where: { clinicId, date: { gte: prevMonthStart, lte: prevMonthEnd } },
      _sum: { amount: true },
    }),
  ])

  const revenue = monthRevenue._sum.amount ?? 0
  const prevRevenue = prevMonthRevenue._sum.amount ?? 0
  const expenses = monthExpenses._sum.amount ?? 0
  const prevExpenses = prevMonthExpenses._sum.amount ?? 0
  const profit = revenue - expenses
  const prevProfit = prevRevenue - prevExpenses

  return {
    revenue,
    expenses,
    profit,
    comparison: {
      revenue: percentChange(revenue, prevRevenue),
      expenses: percentChange(expenses, prevExpenses),
      profit: percentChange(profit, prevProfit),
    },
  }
}

export async function getCashFlowChart(clinicId: string) {
  const months = lastNMonths(6)
  const rangeStart = startOfMonth(months[0])
  const rangeEnd = endOfMonth(months[months.length - 1])

  const [payments, expenses] = await Promise.all([
    prisma.payment.findMany({
      where: { clinicId, status: PaymentStatus.PAID, paidAt: { gte: rangeStart, lte: rangeEnd } },
      select: { amount: true, paidAt: true },
    }),
    prisma.expense.findMany({
      where: { clinicId, date: { gte: rangeStart, lte: rangeEnd } },
      select: { amount: true, date: true },
    }),
  ])

  return months.map((month) => {
    const mStart = startOfMonth(month)
    const mEnd = endOfMonth(month)
    const revenue = payments
      .filter((p) => p.paidAt >= mStart && p.paidAt <= mEnd)
      .reduce((sum, p) => sum + p.amount, 0)
    const expense = expenses
      .filter((e) => e.date >= mStart && e.date <= mEnd)
      .reduce((sum, e) => sum + e.amount, 0)
    return {
      label: MONTH_LABELS[month.getMonth()],
      revenue: Math.round(revenue * 100) / 100,
      expense: Math.round(expense * 100) / 100,
    }
  })
}

export async function listPayments(clinicId: string, limit = 100) {
  return prisma.payment.findMany({
    where: { clinicId },
    include: { client: true },
    orderBy: { paidAt: "desc" },
    take: limit,
  })
}

export interface PaymentInput {
  clientId: string
  amount: number
  method: PaymentMethod
  status: PaymentStatus
  paidAt: Date
  notes?: string
}

export async function createPayment(clinicId: string, data: PaymentInput) {
  return prisma.payment.create({ data: { ...data, clinicId } })
}

export async function updatePayment(clinicId: string, id: string, data: PaymentInput) {
  return prisma.payment.updateMany({ where: { id, clinicId }, data })
}

export async function deletePayment(clinicId: string, id: string) {
  return prisma.payment.deleteMany({ where: { id, clinicId } })
}

export async function listExpenses(clinicId: string, limit = 100) {
  return prisma.expense.findMany({
    where: { clinicId },
    orderBy: { date: "desc" },
    take: limit,
  })
}

export interface ExpenseInput {
  description: string
  amount: number
  category: string
  supplier?: string
  date: Date
}

export async function createExpense(clinicId: string, data: ExpenseInput) {
  return prisma.expense.create({ data: { ...data, clinicId } })
}

export async function updateExpense(clinicId: string, id: string, data: ExpenseInput) {
  return prisma.expense.updateMany({ where: { id, clinicId }, data })
}

export async function deleteExpense(clinicId: string, id: string) {
  return prisma.expense.deleteMany({ where: { id, clinicId } })
}
