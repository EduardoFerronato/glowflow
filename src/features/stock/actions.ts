"use server"

import { revalidatePath } from "next/cache"

import { requireSession } from "@/lib/session"
import {
  createStockItem,
  updateStockItem,
  deleteStockItem,
  registerStockMovement,
} from "@/services/stock.service"
import {
  stockItemSchema,
  stockMovementSchema,
  type StockItemFormInput,
  type StockMovementFormInput,
} from "@/features/stock/schema"

export type ActionResult = { success: true } | { success: false; message: string }

function toStockItemInput(values: StockItemFormInput) {
  return {
    name: values.name,
    category: values.category || undefined,
    minQuantity: values.minQuantity,
    unit: values.unit,
    expiryDate: values.expiryDate ? new Date(values.expiryDate) : undefined,
    supplier: values.supplier || undefined,
  }
}

export async function createStockItemAction(input: StockItemFormInput): Promise<ActionResult> {
  const parsed = stockItemSchema.safeParse(input)
  if (!parsed.success) return { success: false, message: "Dados inválidos." }
  const session = await requireSession()

  try {
    await createStockItem(session.user.clinicId, {
      ...toStockItemInput(parsed.data),
      quantity: parsed.data.quantity,
    })
    revalidatePath("/estoque")
    return { success: true }
  } catch {
    return { success: false, message: "Não foi possível cadastrar o item." }
  }
}

export async function updateStockItemAction(
  id: string,
  input: StockItemFormInput
): Promise<ActionResult> {
  const parsed = stockItemSchema.safeParse(input)
  if (!parsed.success) return { success: false, message: "Dados inválidos." }
  const session = await requireSession()

  try {
    await updateStockItem(session.user.clinicId, id, toStockItemInput(parsed.data))
    revalidatePath("/estoque")
    return { success: true }
  } catch {
    return { success: false, message: "Não foi possível atualizar o item." }
  }
}

export async function deleteStockItemAction(id: string): Promise<ActionResult> {
  const session = await requireSession()
  try {
    await deleteStockItem(session.user.clinicId, id)
    revalidatePath("/estoque")
    return { success: true }
  } catch {
    return { success: false, message: "Não foi possível excluir o item." }
  }
}

export async function registerStockMovementAction(
  stockId: string,
  input: StockMovementFormInput
): Promise<ActionResult> {
  const parsed = stockMovementSchema.safeParse(input)
  if (!parsed.success) return { success: false, message: "Dados inválidos." }
  const session = await requireSession()

  try {
    await registerStockMovement(session.user.clinicId, stockId, {
      type: parsed.data.type,
      quantity: parsed.data.quantity,
      reason: parsed.data.reason || undefined,
    })
    revalidatePath("/estoque")
    return { success: true }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Não foi possível registrar a movimentação.",
    }
  }
}
