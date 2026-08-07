"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, MailCheck } from "lucide-react"
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
import {
  PremiumCard,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/shared/premium-card"
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/features/auth/schema"
import { authClient } from "@/lib/auth-client"

export function ForgotPasswordForm() {
  const [loading, setLoading] = React.useState(false)
  const [sent, setSent] = React.useState(false)

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  })

  async function onSubmit(values: ForgotPasswordInput) {
    setLoading(true)
    await authClient.requestPasswordReset({
      email: values.email,
      redirectTo: "/reset-password",
    })
    setLoading(false)
    setSent(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <PremiumCard className="shadow-soft-lg">
        <CardHeader>
          <CardTitle className="font-display text-2xl font-medium">Recuperar senha</CardTitle>
          <CardDescription>
            Informe seu e-mail e enviaremos um link para redefinir sua senha.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-3 py-6 text-center"
              >
                <div className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <MailCheck className="size-5" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Se existir uma conta com esse e-mail, enviamos um link de
                  redefinição. Em ambiente de desenvolvimento, o link aparece
                  no console do servidor.
                </p>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail</FormLabel>
                          <FormControl>
                            <Input placeholder="voce@clinica.com" autoComplete="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? <Loader2 className="size-4 animate-spin" /> : null}
                      Enviar link
                    </Button>
                  </form>
                </Form>
              </motion.div>
            )}
          </AnimatePresence>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Lembrou a senha?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Voltar para o login
            </Link>
          </p>
        </CardContent>
      </PremiumCard>
    </motion.div>
  )
}
