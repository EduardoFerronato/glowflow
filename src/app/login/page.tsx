import type { Metadata } from "next"
import { Suspense } from "react"

import { Logo } from "@/components/shared/logo"
import { LoginShowcase } from "@/features/auth/components/login-showcase"
import { LoginForm } from "@/features/auth/components/login-form"

export const metadata: Metadata = { title: "Entrar" }

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <LoginShowcase />
      <div className="flex flex-col items-center justify-center gap-10 px-6 py-12">
        <div className="w-full max-w-[380px] lg:hidden">
          <Logo />
        </div>
        <div className="w-full max-w-[380px]">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
