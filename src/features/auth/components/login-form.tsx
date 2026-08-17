"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { fadeInUp } from "@/lib/motion"
import { loginSchema, type LoginInput } from "@/features/auth/schema"
import { loginAction } from "@/features/auth/actions"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "demo@glowflow.app", password: "" },
  })

  async function onSubmit(values: LoginInput) {
    setLoading(true)
    const result = await loginAction(values)
    setLoading(false)

    if (!result.success) {
      toast.error(result.message)
      return
    }

    toast.success("Bem-vinda de volta!")
    const redirectTo = searchParams.get("redirectTo") || "/dashboard"
    router.push(redirectTo)
    router.refresh()
  }

  return (
    <motion.div {...fadeInUp} className="space-y-8">
      <div className="space-y-2">
        <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
          Bem-vinda de volta
        </p>
        <h1 className="font-display text-3xl font-medium tracking-tight text-foreground">
          Entrar
        </h1>
        <p className="text-sm text-muted-foreground">Acesse o painel da sua clínica.</p>
      </div>

      <div className="flex items-center gap-2.5 rounded-xl border border-border/70 bg-muted/40 px-3.5 py-2.5">
        <span className="size-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden />
        <p className="text-xs text-muted-foreground">
          Ambiente de demonstração ·{" "}
          <code className="font-mono text-foreground">demo@glowflow.app</code> /{" "}
          <code className="font-mono text-foreground">glowflow123</code>
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input
                    className="h-11"
                    placeholder="voce@clinica.com"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Senha</FormLabel>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-muted-foreground transition-colors hover:text-primary"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      className="h-11 pr-10"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="h-11 w-full text-[0.925rem]" disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            Entrar
          </Button>
        </form>
      </Form>

      <p className="border-t border-border/60 pt-6 text-center text-sm text-muted-foreground">
        Ainda não tem uma conta?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Criar clínica
        </Link>
      </p>
    </motion.div>
  )
}
