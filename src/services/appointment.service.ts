import "server-only"

import { prisma } from "@/lib/prisma"
import { AppointmentStatus } from "@/generated/prisma/enums"

export interface AppointmentFilters {
  professionalId?: string
  room?: string
  procedureId?: string
}

export async function listAppointmentsInRange(
  clinicId: string,
  from: Date,
  to: Date,
  filters: AppointmentFilters = {}
) {
  return prisma.appointment.findMany({
    where: {
      clinicId,
      startTime: { gte: from, lte: to },
      ...(filters.professionalId ? { professionalId: filters.professionalId } : {}),
      ...(filters.room ? { room: filters.room } : {}),
      ...(filters.procedureId ? { procedureId: filters.procedureId } : {}),
    },
    include: { client: true, professional: true, procedure: true },
    orderBy: { startTime: "asc" },
  })
}

export async function listDistinctRooms(clinicId: string) {
  const rows = await prisma.appointment.findMany({
    where: { clinicId, room: { not: null } },
    select: { room: true },
    distinct: ["room"],
  })
  return rows.map((r) => r.room).filter((r): r is string => Boolean(r))
}

export async function createAppointment(
  clinicId: string,
  data: {
    clientId: string
    professionalId: string
    procedureId: string
    room?: string
    startTime: Date
    notes?: string
  }
) {
  const procedure = await prisma.procedure.findFirstOrThrow({
    where: { id: data.procedureId, clinicId },
  })
  const endTime = new Date(data.startTime.getTime() + procedure.duration * 60000)

  return prisma.appointment.create({
    data: {
      clinicId,
      clientId: data.clientId,
      professionalId: data.professionalId,
      procedureId: data.procedureId,
      room: data.room,
      startTime: data.startTime,
      endTime,
      notes: data.notes,
    },
  })
}

export async function updateAppointment(
  clinicId: string,
  id: string,
  data: {
    clientId: string
    professionalId: string
    procedureId: string
    room?: string
    startTime: Date
    notes?: string
  }
) {
  const procedure = await prisma.procedure.findFirstOrThrow({
    where: { id: data.procedureId, clinicId },
  })
  const endTime = new Date(data.startTime.getTime() + procedure.duration * 60000)

  return prisma.appointment.updateMany({
    where: { id, clinicId },
    data: {
      clientId: data.clientId,
      professionalId: data.professionalId,
      procedureId: data.procedureId,
      room: data.room,
      startTime: data.startTime,
      endTime,
      notes: data.notes,
    },
  })
}

export async function rescheduleAppointment(clinicId: string, id: string, newStart: Date) {
  const appointment = await prisma.appointment.findFirstOrThrow({ where: { id, clinicId } })
  const duration = appointment.endTime.getTime() - appointment.startTime.getTime()
  const newEnd = new Date(newStart.getTime() + duration)

  return prisma.appointment.updateMany({
    where: { id, clinicId },
    data: { startTime: newStart, endTime: newEnd },
  })
}

export async function updateAppointmentStatus(
  clinicId: string,
  id: string,
  status: AppointmentStatus
) {
  return prisma.appointment.updateMany({
    where: { id, clinicId },
    data: { status },
  })
}

export async function deleteAppointment(clinicId: string, id: string) {
  return prisma.appointment.deleteMany({ where: { id, clinicId } })
}
