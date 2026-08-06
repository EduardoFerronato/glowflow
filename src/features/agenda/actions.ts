"use server"

import { revalidatePath } from "next/cache"

import { requireSession } from "@/lib/session"
import {
  createAppointment,
  updateAppointment,
  rescheduleAppointment,
  updateAppointmentStatus,
  deleteAppointment,
  listAppointmentsInRange,
  type AppointmentFilters,
} from "@/services/appointment.service"
import { appointmentSchema, type AppointmentInput } from "@/features/agenda/schema"
import { AppointmentStatus } from "@/generated/prisma/enums"

export type ActionResult = { success: true } | { success: false; message: string }

function toDateTime(date: string, time: string) {
  return new Date(`${date}T${time}:00`)
}

export async function listAppointmentsAction(
  fromIso: string,
  toIso: string,
  filters: AppointmentFilters
) {
  const session = await requireSession()
  const appointments = await listAppointmentsInRange(
    session.user.clinicId,
    new Date(fromIso),
    new Date(toIso),
    filters
  )
  return appointments
}

export async function createAppointmentAction(input: AppointmentInput): Promise<ActionResult> {
  const parsed = appointmentSchema.safeParse(input)
  if (!parsed.success) return { success: false, message: "Dados inválidos." }
  const session = await requireSession()

  try {
    await createAppointment(session.user.clinicId, {
      clientId: parsed.data.clientId,
      professionalId: parsed.data.professionalId,
      procedureId: parsed.data.procedureId,
      room: parsed.data.room,
      startTime: toDateTime(parsed.data.date, parsed.data.time),
      notes: parsed.data.notes,
    })
    revalidatePath("/agenda")
    revalidatePath("/dashboard")
    return { success: true }
  } catch {
    return { success: false, message: "Não foi possível criar o agendamento." }
  }
}

export async function updateAppointmentAction(
  id: string,
  input: AppointmentInput
): Promise<ActionResult> {
  const parsed = appointmentSchema.safeParse(input)
  if (!parsed.success) return { success: false, message: "Dados inválidos." }
  const session = await requireSession()

  try {
    await updateAppointment(session.user.clinicId, id, {
      clientId: parsed.data.clientId,
      professionalId: parsed.data.professionalId,
      procedureId: parsed.data.procedureId,
      room: parsed.data.room,
      startTime: toDateTime(parsed.data.date, parsed.data.time),
      notes: parsed.data.notes,
    })
    revalidatePath("/agenda")
    return { success: true }
  } catch {
    return { success: false, message: "Não foi possível atualizar o agendamento." }
  }
}

export async function rescheduleAppointmentAction(
  id: string,
  newStartIso: string
): Promise<ActionResult> {
  const session = await requireSession()
  try {
    await rescheduleAppointment(session.user.clinicId, id, new Date(newStartIso))
    revalidatePath("/agenda")
    return { success: true }
  } catch {
    return { success: false, message: "Não foi possível reagendar." }
  }
}

export async function updateAppointmentStatusAction(
  id: string,
  status: AppointmentStatus
): Promise<ActionResult> {
  const session = await requireSession()
  try {
    await updateAppointmentStatus(session.user.clinicId, id, status)
    revalidatePath("/agenda")
    revalidatePath("/dashboard")
    return { success: true }
  } catch {
    return { success: false, message: "Não foi possível atualizar o status." }
  }
}

export async function deleteAppointmentAction(id: string): Promise<ActionResult> {
  const session = await requireSession()
  try {
    await deleteAppointment(session.user.clinicId, id)
    revalidatePath("/agenda")
    return { success: true }
  } catch {
    return { success: false, message: "Não foi possível excluir o agendamento." }
  }
}
