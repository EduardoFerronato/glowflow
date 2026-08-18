import "server-only"

import { prisma } from "@/lib/prisma"

export async function listProcedures(clinicId: string) {
  return prisma.procedure.findMany({
    where: { clinicId, active: true },
    orderBy: { name: "asc" },
  })
}

export async function listAllProcedures(clinicId: string) {
  return prisma.procedure.findMany({
    where: { clinicId },
    orderBy: { name: "asc" },
  })
}

export interface ProcedureInput {
  name: string
  category?: string
  price: number
  duration: number
  description?: string
  color: string
}

export async function createProcedure(clinicId: string, data: ProcedureInput) {
  return prisma.procedure.create({ data: { ...data, clinicId } })
}

export async function updateProcedure(clinicId: string, id: string, data: ProcedureInput) {
  return prisma.procedure.updateMany({ where: { id, clinicId }, data })
}

export async function setProcedureActive(clinicId: string, id: string, active: boolean) {
  return prisma.procedure.updateMany({ where: { id, clinicId }, data: { active } })
}
