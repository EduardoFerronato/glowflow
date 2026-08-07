import "server-only"

import { prisma } from "@/lib/prisma"
import { ClientStatus, PhotoCategory } from "@/generated/prisma/enums"

export function parseTags(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((t): t is string => typeof t === "string") : []
  } catch {
    return []
  }
}

function withParsedTags<T extends { tags: string }>(client: T) {
  return { ...client, tags: parseTags(client.tags) }
}

export async function listClients(clinicId: string) {
  const clients = await prisma.client.findMany({
    where: { clinicId },
    orderBy: { name: "asc" },
  })
  return clients.map(withParsedTags)
}

export async function getClientById(clinicId: string, id: string) {
  const client = await prisma.client.findFirst({ where: { id, clinicId } })
  return client ? withParsedTags(client) : null
}

export async function searchClients(clinicId: string, query: string, limit = 6) {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const clients = await prisma.client.findMany({
    where: { clinicId },
    select: { id: true, name: true, phone: true, email: true, photo: true },
    orderBy: { name: "asc" },
  })

  return clients
    .filter((c) =>
      [c.name, c.phone, c.email].filter(Boolean).some((field) => field!.toLowerCase().includes(q))
    )
    .slice(0, limit)
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
      photos: {
        orderBy: { takenAt: "desc" },
        include: { procedure: { select: { name: true } } },
      },
      attachments: {
        orderBy: { createdAt: "desc" },
      },
    },
  })
  return client ? withParsedTags(client) : null
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
  status?: ClientStatus
  tags?: string[]
}

function toPersistedData(data: ClientInput) {
  const { tags, ...rest } = data
  return {
    ...rest,
    ...(tags ? { tags: JSON.stringify(tags) } : {}),
  }
}

export async function createClient(clinicId: string, data: ClientInput) {
  return prisma.client.create({ data: { ...toPersistedData(data), clinicId } })
}

export async function updateClient(clinicId: string, id: string, data: ClientInput) {
  return prisma.client.updateMany({ where: { id, clinicId }, data: toPersistedData(data) })
}

export async function deleteClient(clinicId: string, id: string) {
  return prisma.client.deleteMany({ where: { id, clinicId } })
}

export async function addClientPhoto(
  clinicId: string,
  clientId: string,
  data: { url: string; category: PhotoCategory; notes?: string }
) {
  const client = await prisma.client.findFirst({ where: { id: clientId, clinicId }, select: { id: true } })
  if (!client) throw new Error("Cliente não encontrado.")
  return prisma.clientPhoto.create({ data: { clientId, ...data } })
}

export async function deleteClientPhoto(clinicId: string, photoId: string) {
  return prisma.clientPhoto.deleteMany({ where: { id: photoId, client: { clinicId } } })
}

export async function addClientAttachment(
  clinicId: string,
  clientId: string,
  data: { name: string; url: string; fileType?: string; size?: number }
) {
  const client = await prisma.client.findFirst({ where: { id: clientId, clinicId }, select: { id: true } })
  if (!client) throw new Error("Cliente não encontrado.")
  return prisma.clientAttachment.create({ data: { clientId, ...data } })
}

export async function deleteClientAttachment(clinicId: string, attachmentId: string) {
  return prisma.clientAttachment.deleteMany({ where: { id: attachmentId, client: { clinicId } } })
}
