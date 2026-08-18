import { z } from "zod"

import { paymentMethodValues, paymentStatusValues } from "@/features/finance/lib/labels"

export const paymentSchema = z.object({
  clientId: z.string().min(1, "Selecione um cliente."),
  amount: z.number().min(0.01, "Informe um valor válido."),
  method: z.enum(paymentMethodValues),
  status: z.enum(paymentStatusValues),
  paidAt: z.string().min(1, "Informe a data."),
  notes: z.string().optional(),
})
export type PaymentFormInput = z.infer<typeof paymentSchema>

export const expenseSchema = z.object({
  description: z.string().min(2, "Informe a descrição."),
  amount: z.number().min(0.01, "Informe um valor válido."),
  category: z.string().min(1, "Selecione uma categoria."),
  supplier: z.string().optional(),
  date: z.string().min(1, "Informe a data."),
})
export type ExpenseFormInput = z.infer<typeof expenseSchema>
