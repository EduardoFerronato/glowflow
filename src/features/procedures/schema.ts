import { z } from "zod"

export const procedureSchema = z.object({
  name: z.string().min(2, "Informe o nome do procedimento."),
  category: z.string().optional(),
  price: z.number().min(0, "Informe um preço válido."),
  duration: z.number().int().min(5, "Duração mínima de 5 minutos."),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Cor inválida."),
})
export type ProcedureFormInput = z.infer<typeof procedureSchema>
