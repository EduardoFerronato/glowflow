"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  PremiumCard,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/shared/premium-card"
import { Form, FormField } from "@/components/ui/form"
import {
  businessHoursSchema,
  type BusinessHoursFormInput,
} from "@/features/settings/schema"
import { updateBusinessHoursAction } from "@/features/settings/actions"

const DAY_LABELS: Record<keyof BusinessHoursFormInput, string> = {
  mon: "Segunda-feira",
  tue: "Terça-feira",
  wed: "Quarta-feira",
  thu: "Quinta-feira",
  fri: "Sexta-feira",
  sat: "Sábado",
  sun: "Domingo",
}
const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const

export function BusinessHoursForm({
  defaultValues,
}: {
  defaultValues: BusinessHoursFormInput
}) {
  const [loading, setLoading] = React.useState(false)

  const form = useForm<BusinessHoursFormInput>({
    resolver: zodResolver(businessHoursSchema),
    defaultValues,
  })

  async function onSubmit(values: BusinessHoursFormInput) {
    setLoading(true)
    const result = await updateBusinessHoursAction(values)
    setLoading(false)

    if (!result.success) {
      toast.error(result.message)
      return
    }
    toast.success("Horário de funcionamento atualizado!")
  }

  return (
    <PremiumCard>
      <CardHeader>
        <CardTitle className="text-base">Horário de funcionamento</CardTitle>
        <CardDescription>Defina os dias e horários em que a clínica atende.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {DAYS.map((day) => (
              <FormField
                key={day}
                control={form.control}
                name={`${day}.open`}
                render={({ field: openField }) => {
                  const isOpen = form.watch(`${day}.open`)
                  return (
                    <div className="flex flex-col gap-3 rounded-xl border border-border/60 p-3 sm:flex-row sm:items-center">
                      <div className="flex flex-1 items-center gap-3">
                        <Switch checked={openField.value} onCheckedChange={openField.onChange} />
                        <span className="text-sm font-medium">{DAY_LABELS[day]}</span>
                      </div>
                      {isOpen ? (
                        <div className="flex items-center gap-2">
                          <FormField
                            control={form.control}
                            name={`${day}.start`}
                            render={({ field }) => (
                              <Input type="time" className="w-32" {...field} />
                            )}
                          />
                          <span className="text-muted-foreground">até</span>
                          <FormField
                            control={form.control}
                            name={`${day}.end`}
                            render={({ field }) => (
                              <Input type="time" className="w-32" {...field} />
                            )}
                          />
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground sm:ml-auto">Fechado</span>
                      )}
                    </div>
                  )
                }}
              />
            ))}

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="size-4 animate-spin" /> : null}
                Salvar horários
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </PremiumCard>
  )
}
