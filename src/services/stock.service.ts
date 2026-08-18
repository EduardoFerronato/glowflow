import "server-only"

import { prisma } from "@/lib/prisma"
import { StockMovementType } from "@/generated/prisma/enums"

export async function listStock(clinicId: string) {
  return prisma.stock.findMany({
    where: { clinicId },
    orderBy: { name: "asc" },
  })
}

export async function listStockMovements(clinicId: string, stockId: string) {
  const stock = await prisma.stock.findFirst({ where: { id: stockId, clinicId }, select: { id: true } })
  if (!stock) return []
  return prisma.stockMovement.findMany({
    where: { stockId },
    orderBy: { date: "desc" },
    take: 50,
  })
}

export interface StockItemInput {
  name: string
  category?: string
  minQuantity: number
  unit: string
  expiryDate?: Date | null
  supplier?: string
}

export async function createStockItem(
  clinicId: string,
  data: StockItemInput & { quantity: number }
) {
  const { quantity, ...rest } = data
  return prisma.stock.create({
    data: {
      ...rest,
      quantity,
      clinicId,
      movements: quantity > 0
        ? { create: { type: StockMovementType.IN, quantity, reason: "Estoque inicial" } }
        : undefined,
    },
  })
}

export async function updateStockItem(clinicId: string, id: string, data: StockItemInput) {
  return prisma.stock.updateMany({ where: { id, clinicId }, data })
}

export async function deleteStockItem(clinicId: string, id: string) {
  return prisma.stock.deleteMany({ where: { id, clinicId } })
}

export async function registerStockMovement(
  clinicId: string,
  stockId: string,
  data: { type: StockMovementType; quantity: number; reason?: string }
) {
  const stock = await prisma.stock.findFirst({ where: { id: stockId, clinicId } })
  if (!stock) throw new Error("Item de estoque não encontrado.")

  const delta = data.type === StockMovementType.IN ? data.quantity : -data.quantity
  const newQuantity = stock.quantity + delta
  if (newQuantity < 0) throw new Error("Quantidade insuficiente em estoque.")

  await prisma.$transaction([
    prisma.stockMovement.create({
      data: { stockId, type: data.type, quantity: data.quantity, reason: data.reason },
    }),
    prisma.stock.update({ where: { id: stockId }, data: { quantity: newQuantity } }),
  ])
}
