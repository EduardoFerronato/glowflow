import { z } from "zod"

export const clientStatusValues = ["ACTIVE", "INACTIVE", "VIP"] as const

export const clientSchema = z.object({
  name: z.string().min(2, "Informe o nome do cliente."),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.union([z.email("E-mail inválido."), z.literal("")]).optional(),
  birthDate: z.string().optional(),
  cpf: z.string().optional(),
  instagram: z.string().optional(),
  notes: z.string().optional(),
  photo: z.string().optional(),
  status: z.enum(clientStatusValues),
  tags: z.array(z.string()),
})
export type ClientFormInput = z.infer<typeof clientSchema>
