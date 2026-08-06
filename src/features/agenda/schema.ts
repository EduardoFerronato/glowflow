import { z } from "zod"

export const appointmentSchema = z.object({
  clientId: z.string().min(1, "Selecione um cliente."),
  professionalId: z.string().min(1, "Selecione um profissional."),
  procedureId: z.string().min(1, "Selecione um procedimento."),
  room: z.string().optional(),
  date: z.string().min(1, "Selecione a data."),
  time: z.string().min(1, "Selecione o horário."),
  notes: z.string().optional(),
})
export type AppointmentInput = z.infer<typeof appointmentSchema>
