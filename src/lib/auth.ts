import { betterAuth } from "better-auth"
import { nextCookies } from "better-auth/next-js"
import { prismaAdapter } from "@better-auth/prisma-adapter"

import { prisma } from "@/lib/prisma"

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, { provider: "sqlite" }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      // Sem SMTP configurado em dev: o link de redefinição é logado no console.
      // Em produção, troque por um provedor real (ex: Resend) aqui.
      console.log(`[GlowFlow] Link de redefinição de senha para ${user.email}: ${url}`)
    },
  },
  user: {
    additionalFields: {
      clinicId: {
        type: "string",
        required: true,
        input: true,
      },
      role: {
        type: "string",
        required: false,
        defaultValue: "OWNER",
        input: true,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 dias
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  rateLimit: {
    window: 60,
    max: 20,
  },
  plugins: [nextCookies()],
})

export type Session = Awaited<ReturnType<typeof auth.api.getSession>>
