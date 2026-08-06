import { z } from "zod"

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
})
export type ClientFormInput = z.infer<typeof clientSchema>
