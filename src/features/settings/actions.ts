"use server"

import { revalidatePath } from "next/cache"

import { requireSession } from "@/lib/session"
import {
  updateClinicInfo,
  updateBusinessHours,
  updateColors,
  type BusinessHours,
} from "@/services/settings.service"
import {
  clinicInfoSchema,
  businessHoursSchema,
  colorsSchema,
  type ClinicInfoFormInput,
  type BusinessHoursFormInput,
  type ColorsFormInput,
} from "@/features/settings/schema"

export type ActionResult = { success: true } | { success: false; message: string }

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const

export async function updateClinicInfoAction(input: ClinicInfoFormInput): Promise<ActionResult> {
  const parsed = clinicInfoSchema.safeParse(input)
  if (!parsed.success) return { success: false, message: "Dados inválidos." }
  const session = await requireSession()

  try {
    await updateClinicInfo(session.user.clinicId, {
      name: parsed.data.name,
      phone: parsed.data.phone || undefined,
      address: parsed.data.address || undefined,
      logo: parsed.data.logo || undefined,
    })
    revalidatePath("/", "layout")
    return { success: true }
  } catch {
    return { success: false, message: "Não foi possível salvar os dados da clínica." }
  }
}

export async function updateBusinessHoursAction(
  input: BusinessHoursFormInput
): Promise<ActionResult> {
  const parsed = businessHoursSchema.safeParse(input)
  if (!parsed.success) return { success: false, message: "Verifique os horários informados." }
  const session = await requireSession()

  const businessHours = DAYS.reduce((acc, day) => {
    const d = parsed.data[day]
    acc[day] = d.open ? [d.start, d.end] : null
    return acc
  }, {} as BusinessHours)

  try {
    await updateBusinessHours(session.user.clinicId, businessHours)
    revalidatePath("/configuracoes")
    return { success: true }
  } catch {
    return { success: false, message: "Não foi possível salvar o horário de funcionamento." }
  }
}

export async function updateColorsAction(input: ColorsFormInput): Promise<ActionResult> {
  const parsed = colorsSchema.safeParse(input)
  if (!parsed.success) return { success: false, message: "Cores inválidas." }
  const session = await requireSession()

  try {
    await updateColors(session.user.clinicId, parsed.data)
    revalidatePath("/", "layout")
    return { success: true }
  } catch {
    return { success: false, message: "Não foi possível salvar as cores." }
  }
}
