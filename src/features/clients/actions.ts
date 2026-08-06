"use server"

import { revalidatePath } from "next/cache"

import { requireSession } from "@/lib/session"
import { createClient, updateClient, deleteClient } from "@/services/client.service"
import { clientSchema, type ClientFormInput } from "@/features/clients/schema"

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
