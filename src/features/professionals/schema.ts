import { z } from "zod"

export const professionalSchema = z.object({
  name: z.string().min(2, "Informe o nome do profissional."),
  specialty: z.string().optional(),
  phone: z.string().optional(),
  email: z.union([z.email("E-mail inválido."), z.literal("")]).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Cor inválida."),
})
export type ProfessionalFormInput = z.infer<typeof professionalSchema>
