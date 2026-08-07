"use server"

import { revalidatePath } from "next/cache"

import { requireSession } from "@/lib/session"
import {
  createClient,
  updateClient,
  deleteClient,
  searchClients,
  addClientPhoto,
  deleteClientPhoto,
  addClientAttachment,
  deleteClientAttachment,
} from "@/services/client.service"
import { clientSchema, type ClientFormInput } from "@/features/clients/schema"
import type { PhotoCategory } from "@/generated/prisma/enums"

export type ActionResult = { success: true } | { success: false; message: string }

function toClientInput(values: ClientFormInput) {
  return {
    name: values.name,
    phone: values.phone || undefined,
    whatsapp: values.whatsapp || undefined,
    email: values.email || undefined,
    birthDate: values.birthDate ? new Date(values.birthDate) : undefined,
    cpf: values.cpf || undefined,
    instagram: values.instagram || undefined,
    notes: values.notes || undefined,
    photo: values.photo || undefined,
    status: values.status,
    tags: values.tags,
  }
}

export async function createClientAction(input: ClientFormInput): Promise<ActionResult> {
  const parsed = clientSchema.safeParse(input)
  if (!parsed.success) return { success: false, message: "Dados inválidos." }
  const session = await requireSession()

  try {
    await createClient(session.user.clinicId, toClientInput(parsed.data))
    revalidatePath("/clientes")
    return { success: true }
  } catch {
    return { success: false, message: "Não foi possível criar o cliente." }
  }
}

export async function updateClientAction(
  id: string,
  input: ClientFormInput
): Promise<ActionResult> {
  const parsed = clientSchema.safeParse(input)
  if (!parsed.success) return { success: false, message: "Dados inválidos." }
  const session = await requireSession()

  try {
    await updateClient(session.user.clinicId, id, toClientInput(parsed.data))
    revalidatePath("/clientes")
    revalidatePath(`/clientes/${id}`)
    return { success: true }
  } catch {
    return { success: false, message: "Não foi possível atualizar o cliente." }
  }
}

export async function searchClientsAction(query: string) {
  const session = await requireSession()
  return searchClients(session.user.clinicId, query)
}

export async function deleteClientAction(id: string): Promise<ActionResult> {
  const session = await requireSession()
  try {
    await deleteClient(session.user.clinicId, id)
    revalidatePath("/clientes")
    return { success: true }
  } catch {
    return { success: false, message: "Não foi possível excluir o cliente." }
  }
}

export async function addClientPhotoAction(
  clientId: string,
  data: { url: string; category: PhotoCategory; notes?: string }
): Promise<ActionResult> {
  const session = await requireSession()
  try {
    await addClientPhoto(session.user.clinicId, clientId, data)
    revalidatePath(`/clientes/${clientId}`)
    return { success: true }
  } catch {
    return { success: false, message: "Não foi possível salvar a foto." }
  }
}

export async function deleteClientPhotoAction(clientId: string, photoId: string): Promise<ActionResult> {
  const session = await requireSession()
  try {
    await deleteClientPhoto(session.user.clinicId, photoId)
    revalidatePath(`/clientes/${clientId}`)
    return { success: true }
  } catch {
    return { success: false, message: "Não foi possível remover a foto." }
  }
}

export async function addClientAttachmentAction(
  clientId: string,
  data: { name: string; url: string; fileType?: string; size?: number }
): Promise<ActionResult> {
  const session = await requireSession()
  try {
    await addClientAttachment(session.user.clinicId, clientId, data)
    revalidatePath(`/clientes/${clientId}`)
    return { success: true }
  } catch {
    return { success: false, message: "Não foi possível salvar o anexo." }
  }
}

export async function deleteClientAttachmentAction(
  clientId: string,
  attachmentId: string
): Promise<ActionResult> {
  const session = await requireSession()
  try {
    await deleteClientAttachment(session.user.clinicId, attachmentId)
    revalidatePath(`/clientes/${clientId}`)
    return { success: true }
  } catch {
    return { success: false, message: "Não foi possível remover o anexo." }
  }
}
