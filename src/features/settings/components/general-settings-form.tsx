"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  PremiumCard,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/shared/premium-card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { LogoUpload } from "@/features/settings/components/logo-upload"
import { clinicInfoSchema, type ClinicInfoFormInput } from "@/features/settings/schema"
import { updateClinicInfoAction } from "@/features/settings/actions"
import { formatPhone } from "@/utils/format"

export function GeneralSettingsForm({ defaultValues }: { defaultValues: ClinicInfoFormInput }) {
  const [loading, setLoading] = React.useState(false)

  const form = useForm<ClinicInfoFormInput>({
    resolver: zodResolver(clinicInfoSchema),
    defaultValues,
  })

  async function onSubmit(values: ClinicInfoFormInput) {
    setLoading(true)
    const result = await updateClinicInfoAction(values)
    setLoading(false)

    if (!result.success) {
      toast.error(result.message)
      return
    }
    toast.success("Dados da clínica atualizados!")
  }

  return (
    <PremiumCard>
      <CardHeader>
        <CardTitle className="text-base">Dados da clínica</CardTitle>
        <CardDescription>Essas informações aparecem no topo do painel e em relatórios.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <LogoUpload logo={field.value} onChange={field.onChange} />
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da clínica</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: GlowFlow Estética" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="(11) 99999-9999"
                        {...field}
                        onChange={(e) => field.onChange(formatPhone(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input placeholder="Rua, número, bairro, cidade" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="size-4 animate-spin" /> : null}
                Salvar alterações
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </PremiumCard>
  )
}
