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
import { colorsSchema, type ColorsFormInput } from "@/features/settings/schema"
import { updateColorsAction } from "@/features/settings/actions"

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : "#000000"}
            onChange={(e) => onChange(e.target.value)}
            className="size-9 shrink-0 cursor-pointer rounded-lg border border-border bg-transparent p-0.5"
            aria-label={label}
          />
          <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="#e11d5f" />
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}

export function AppearanceSettingsForm({
  defaultValues,
}: {
  defaultValues: ColorsFormInput
}) {
  const [loading, setLoading] = React.useState(false)

  const form = useForm<ColorsFormInput>({
    resolver: zodResolver(colorsSchema),
    defaultValues,
  })

  async function onSubmit(values: ColorsFormInput) {
    setLoading(true)
    const result = await updateColorsAction(values)
    setLoading(false)

    if (!result.success) {
      toast.error(result.message)
      return
    }
    toast.success("Cores atualizadas! Recarregue a página para ver o novo tema.")
  }

  return (
    <PremiumCard>
      <CardHeader>
        <CardTitle className="text-base">Cores da marca</CardTitle>
        <CardDescription>
          Personalize as cores usadas no menu e nos destaques do painel.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="primaryColor"
                render={({ field }) => (
                  <ColorField label="Cor primária" value={field.value} onChange={field.onChange} />
                )}
              />
              <FormField
                control={form.control}
                name="secondaryColor"
                render={({ field }) => (
                  <ColorField label="Cor secundária" value={field.value} onChange={field.onChange} />
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="size-4 animate-spin" /> : null}
                Salvar cores
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </PremiumCard>
  )
}
