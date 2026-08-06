"use server"

import { APIError } from "better-auth/api"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from "@/features/auth/schema"

export type ActionResult = { success: true } | { success: false; message: string }

export async function loginAction(input: LoginInput): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, message: "Dados inválidos." }
  }

  try {
    await auth.api.signInEmail({ body: parsed.data })
    return { success: true }
  } catch (error) {
    if (error instanceof APIError) {
      return { success: false, message: "E-mail ou senha incorretos." }
    }
    return { success: false, message: "Não foi possível entrar. Tente novamente." }
  }
}

export async function registerAction(input: RegisterInput): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, message: "Dados inválidos." }
  }
  const { clinicName, name, email, password } = parsed.data

  const clinic = await prisma.clinic.create({
    data: {
      name: clinicName,
      settings: { create: {} },
    },
  })

  try {
    await auth.api.signUpEmail({
      body: { name, email, password, clinicId: clinic.id, role: "OWNER" } as never,
    })
    return { success: true }
  } catch (error) {
    await prisma.clinic.delete({ where: { id: clinic.id } }).catch(() => {})
    if (error instanceof APIError) {
      return {
        success: false,
        message:
          error.status === "UNPROCESSABLE_ENTITY"
            ? "Este e-mail já está cadastrado."
            : "Não foi possível criar a conta. Tente novamente.",
      }
    }
    return { success: false, message: "Não foi possível criar a conta. Tente novamente." }
  }
}
