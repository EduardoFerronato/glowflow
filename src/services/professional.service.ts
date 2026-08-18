import "server-only"

import { prisma } from "@/lib/prisma"

export async function listProfessionals(clinicId: string) {
  return prisma.professional.findMany({
    where: { clinicId, active: true },
    orderBy: { name: "asc" },
  })
}

export async function listAllProfessionals(clinicId: string) {
  return prisma.professional.findMany({
    where: { clinicId },
    orderBy: { name: "asc" },
  })
}

export interface ProfessionalInput {
  name: string
  specialty?: string
  phone?: string
  email?: string
  color: string
}

export async function createProfessional(clinicId: string, data: ProfessionalInput) {
  return prisma.professional.create({ data: { ...data, clinicId } })
}

export async function updateProfessional(clinicId: string, id: string, data: ProfessionalInput) {
  return prisma.professional.updateMany({ where: { id, clinicId }, data })
}

export async function setProfessionalActive(clinicId: string, id: string, active: boolean) {
  return prisma.professional.updateMany({ where: { id, clinicId }, data: { active } })
}
