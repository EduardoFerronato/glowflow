import "server-only"

import { prisma } from "@/lib/prisma"

export async function listClients(clinicId: string) {
  return prisma.client.findMany({
    where: { clinicId },
    orderBy: { name: "asc" },
  })
}

export async function getClientById(clinicId: string, id: string) {
  return prisma.client.findFirst({ where: { id, clinicId } })
}

export async function getClientProfile(clinicId: string, id: string) {
  const client = await prisma.client.findFirst({
    where: { id, clinicId },
    include: {
      appointments: {
        orderBy: { startTime: "desc" },
        include: { procedure: true, professional: true },
      },
      payments: {
        orderBy: { paidAt: "desc" },
      },
    },
  })
  return client
}

export interface ClientInput {
  name: string
  phone?: string
  whatsapp?: string
  email?: string
  birthDate?: Date | null
  cpf?: string
  instagram?: string
  notes?: string
  photo?: string
}

export async function createClient(clinicId: string, data: ClientInput) {
  return prisma.client.create({ data: { ...data, clinicId } })
}

export async function updateClient(clinicId: string, id: string, data: ClientInput) {
  return prisma.client.updateMany({ where: { id, clinicId }, data })
}

export async function deleteClient(clinicId: string, id: string) {
  return prisma.client.deleteMany({ where: { id, clinicId } })
}
