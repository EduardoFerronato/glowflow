"use server"

import { revalidatePath } from "next/cache"

import { requireSession } from "@/lib/session"
import {
  createPayment,
  updatePayment,
  deletePayment,
  createExpense,
  updateExpense,
  deleteExpense,
} from "@/services/finance.service"
import {
  paymentSchema,
  expenseSchema,
  type PaymentFormInput,
  type ExpenseFormInput,
} from "@/features/finance/schema"

export type ActionResult = { success: true } | { success: false; message: string }

function toPaymentInput(values: PaymentFormInput) {
  return {
    clientId: values.clientId,
    amount: values.amount,
    method: values.method,
    status: values.status,
    paidAt: new Date(values.paidAt),
    notes: values.notes || undefined,
  }
}

function toExpenseInput(values: ExpenseFormInput) {
  return {
    description: values.description,
    amount: values.amount,
    category: values.category,
    supplier: values.supplier || undefined,
    date: new Date(values.date),
  }
}

export async function createPaymentAction(input: PaymentFormInput): Promise<ActionResult> {
  const parsed = paymentSchema.safeParse(input)
  if (!parsed.success) return { success: false, message: "Dados inválidos." }
  const session = await requireSession()

  try {
    await createPayment(session.user.clinicId, toPaymentInput(parsed.data))
    revalidatePath("/financeiro")
    revalidatePath("/dashboard")
    return { success: true }
  } catch {
    return { success: false, message: "Não foi possível registrar o pagamento." }
  }
}

export async function updatePaymentAction(
  id: string,
  input: PaymentFormInput
): Promise<ActionResult> {
  const parsed = paymentSchema.safeParse(input)
  if (!parsed.success) return { success: false, message: "Dados inválidos." }
  const session = await requireSession()

  try {
    await updatePayment(session.user.clinicId, id, toPaymentInput(parsed.data))
    revalidatePath("/financeiro")
    revalidatePath("/dashboard")
    return { success: true }
  } catch {
    return { success: false, message: "Não foi possível atualizar o pagamento." }
  }
}

export async function deletePaymentAction(id: string): Promise<ActionResult> {
  const session = await requireSession()
  try {
    await deletePayment(session.user.clinicId, id)
    revalidatePath("/financeiro")
    revalidatePath("/dashboard")
    return { success: true }
  } catch {
    return { success: false, message: "Não foi possível excluir o pagamento." }
  }
}

export async function createExpenseAction(input: ExpenseFormInput): Promise<ActionResult> {
  const parsed = expenseSchema.safeParse(input)
  if (!parsed.success) return { success: false, message: "Dados inválidos." }
  const session = await requireSession()

  try {
    await createExpense(session.user.clinicId, toExpenseInput(parsed.data))
    revalidatePath("/financeiro")
    return { success: true }
  } catch {
    return { success: false, message: "Não foi possível registrar a despesa." }
  }
}

export async function updateExpenseAction(
  id: string,
  input: ExpenseFormInput
): Promise<ActionResult> {
  const parsed = expenseSchema.safeParse(input)
  if (!parsed.success) return { success: false, message: "Dados inválidos." }
  const session = await requireSession()

  try {
    await updateExpense(session.user.clinicId, id, toExpenseInput(parsed.data))
    revalidatePath("/financeiro")
    return { success: true }
  } catch {
    return { success: false, message: "Não foi possível atualizar a despesa." }
  }
}

export async function deleteExpenseAction(id: string): Promise<ActionResult> {
  const session = await requireSession()
  try {
    await deleteExpense(session.user.clinicId, id)
    revalidatePath("/financeiro")
    return { success: true }
  } catch {
    return { success: false, message: "Não foi possível excluir a despesa." }
  }
}
