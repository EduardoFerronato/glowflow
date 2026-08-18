"use server"

import { revalidatePath } from "next/cache"

import { requireSession } from "@/lib/session"
import {
  createProfessional,
  updateProfessional,
  setProfessionalActive,
} from "@/services/professional.service"
import { professionalSchema, type ProfessionalFormInput } from "@/features/professionals/schema"

export type ActionResult = { success: true } | { success: false; message: string }

function toProfessionalInput(values: ProfessionalFormInput) {
  return {
    name: values.name,
    specialty: values.specialty || undefined,
    phone: values.phone || undefined,
    email: values.email || undefined,
    color: values.color,
  }
}

export async function createProfessionalAction(input: ProfessionalFormInput): Promise<ActionResult> {
  const parsed = professionalSchema.safeParse(input)
  if (!parsed.success) return { success: false, message: "Dados inválidos." }
  const session = await requireSession()

  try {
    await createProfessional(session.user.clinicId, toProfessionalInput(parsed.data))
    revalidatePath("/profissionais")
    return { success: true }
  } catch {
    return { success: false, message: "Não foi possível cadastrar o profissional." }
  }
}

export async function updateProfessionalAction(
  id: string,
  input: ProfessionalFormInput
): Promise<ActionResult> {
  const parsed = professionalSchema.safeParse(input)
  if (!parsed.success) return { success: false, message: "Dados inválidos." }
  const session = await requireSession()

  try {
    await updateProfessional(session.user.clinicId, id, toProfessionalInput(parsed.data))
    revalidatePath("/profissionais")
    return { success: true }
  } catch {
    return { success: false, message: "Não foi possível atualizar o profissional." }
  }
}

export async function setProfessionalActiveAction(
  id: string,
  active: boolean
): Promise<ActionResult> {
  const session = await requireSession()
  try {
    await setProfessionalActive(session.user.clinicId, id, active)
    revalidatePath("/profissionais")
    return { success: true }
  } catch {
    return {
      success: false,
      message: active
        ? "Não foi possível reativar o profissional."
        : "Não foi possível desativar o profissional.",
    }
  }
}
