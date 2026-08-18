"use server"

import { revalidatePath } from "next/cache"

import { requireSession } from "@/lib/session"
import {
  createProcedure,
  updateProcedure,
  setProcedureActive,
} from "@/services/procedure.service"
import { procedureSchema, type ProcedureFormInput } from "@/features/procedures/schema"

export type ActionResult = { success: true } | { success: false; message: string }

function toProcedureInput(values: ProcedureFormInput) {
  return {
    name: values.name,
    category: values.category || undefined,
    price: values.price,
    duration: values.duration,
    description: values.description || undefined,
    color: values.color,
  }
}

export async function createProcedureAction(input: ProcedureFormInput): Promise<ActionResult> {
  const parsed = procedureSchema.safeParse(input)
  if (!parsed.success) return { success: false, message: "Dados inválidos." }
  const session = await requireSession()

  try {
    await createProcedure(session.user.clinicId, toProcedureInput(parsed.data))
    revalidatePath("/procedimentos")
    return { success: true }
  } catch {
    return { success: false, message: "Não foi possível cadastrar o procedimento." }
  }
}

export async function updateProcedureAction(
  id: string,
  input: ProcedureFormInput
): Promise<ActionResult> {
  const parsed = procedureSchema.safeParse(input)
  if (!parsed.success) return { success: false, message: "Dados inválidos." }
  const session = await requireSession()

  try {
    await updateProcedure(session.user.clinicId, id, toProcedureInput(parsed.data))
    revalidatePath("/procedimentos")
    return { success: true }
  } catch {
    return { success: false, message: "Não foi possível atualizar o procedimento." }
  }
}

export async function setProcedureActiveAction(
  id: string,
  active: boolean
): Promise<ActionResult> {
  const session = await requireSession()
  try {
    await setProcedureActive(session.user.clinicId, id, active)
    revalidatePath("/procedimentos")
    return { success: true }
  } catch {
    return {
      success: false,
      message: active
        ? "Não foi possível reativar o procedimento."
        : "Não foi possível desativar o procedimento.",
    }
  }
}
