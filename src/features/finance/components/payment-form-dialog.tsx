"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ClientCombobox } from "@/components/shared/client-combobox"
import { paymentSchema, type PaymentFormInput } from "@/features/finance/schema"
import { createPaymentAction, updatePaymentAction } from "@/features/finance/actions"
import {
  PAYMENT_METHOD_LABEL,
  PAYMENT_STATUS_LABEL,
  paymentMethodValues,
  paymentStatusValues,
} from "@/features/finance/lib/labels"

interface PaymentFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clients: { id: string; name: string }[]
  paymentId?: string
  defaultValues?: Partial<PaymentFormInput>
  onSaved: () => void
}

export function PaymentFormDialog({
  open,
  onOpenChange,
  clients,
  paymentId,
  defaultValues,
  onSaved,
}: PaymentFormDialogProps) {
  const [loading, setLoading] = React.useState(false)
  const isEdit = Boolean(paymentId)

  const form = useForm<PaymentFormInput>({
    resolver: zodResolver(paymentSchema),
    values: {
      clientId: defaultValues?.clientId ?? "",
      amount: defaultValues?.amount ?? 0,
      method: defaultValues?.method ?? "PIX",
      status: defaultValues?.status ?? "PAID",
      paidAt: defaultValues?.paidAt ?? new Date().toISOString().slice(0, 10),
      notes: defaultValues?.notes ?? "",
    },
  })

  async function onSubmit(values: PaymentFormInput) {
    setLoading(true)
    const result = isEdit
      ? await updatePaymentAction(paymentId!, values)
      : await createPaymentAction(values)
    setLoading(false)

    if (!result.success) {
      toast.error(result.message)
      return
    }
    toast.success(isEdit ? "Pagamento atualizado!" : "Pagamento registrado!")
    onOpenChange(false)
    onSaved()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar pagamento" : "Novo pagamento"}</DialogTitle>
          <DialogDescription>Registre uma receita recebida.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <FormControl>
                    <ClientCombobox
                      clients={clients}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(
                            Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paidAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Forma de pagamento</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecionar" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {paymentMethodValues.map((value) => (
                          <SelectItem key={value} value={value}>
                            {PAYMENT_METHOD_LABEL[value]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecionar" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {paymentStatusValues.map((value) => (
                          <SelectItem key={value} value={value}>
                            {PAYMENT_STATUS_LABEL[value]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea rows={2} placeholder="Detalhes adicionais..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="size-4 animate-spin" /> : null}
                {isEdit ? "Salvar alterações" : "Registrar pagamento"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
