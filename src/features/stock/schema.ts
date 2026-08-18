import { z } from "zod"

export const stockItemSchema = z.object({
  name: z.string().min(2, "Informe o nome do item."),
  category: z.string().optional(),
  quantity: z.number().min(0, "Informe uma quantidade válida."),
  minQuantity: z.number().min(0, "Informe uma quantidade mínima válida."),
  unit: z.string().min(1, "Informe a unidade."),
  expiryDate: z.string().optional(),
  supplier: z.string().optional(),
})
export type StockItemFormInput = z.infer<typeof stockItemSchema>

export const stockMovementValues = ["IN", "OUT"] as const

export const stockMovementSchema = z.object({
  type: z.enum(stockMovementValues),
  quantity: z.number().min(1, "Informe uma quantidade válida."),
  reason: z.string().optional(),
})
export type StockMovementFormInput = z.infer<typeof stockMovementSchema>
