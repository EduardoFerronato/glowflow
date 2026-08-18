"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { expenseSchema, type ExpenseFormInput } from "@/features/finance/schema"
import { createExpenseAction, updateExpenseAction } from "@/features/finance/actions"
import { EXPENSE_CATEGORIES } from "@/features/finance/lib/labels"

interface ExpenseFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  expenseId?: string
  defaultValues?: Partial<ExpenseFormInput>
  onSaved: () => void
}

export function ExpenseFormDialog({
  open,
  onOpenChange,
  expenseId,
  defaultValues,
  onSaved,
}: ExpenseFormDialogProps) {
  const [loading, setLoading] = React.useState(false)
  const isEdit = Boolean(expenseId)

  const form = useForm<ExpenseFormInput>({
    resolver: zodResolver(expenseSchema),
    values: {
      description: defaultValues?.description ?? "",
      amount: defaultValues?.amount ?? 0,
      category: defaultValues?.category ?? EXPENSE_CATEGORIES[0],
      supplier: defaultValues?.supplier ?? "",
      date: defaultValues?.date ?? new Date().toISOString().slice(0, 10),
    },
  })

  async function onSubmit(values: ExpenseFormInput) {
    setLoading(true)
    const result = isEdit
      ? await updateExpenseAction(expenseId!, values)
      : await createExpenseAction(values)
    setLoading(false)

    if (!result.success) {
      toast.error(result.message)
      return
    }
    toast.success(isEdit ? "Despesa atualizada!" : "Despesa registrada!")
    onOpenChange(false)
    onSaved()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar despesa" : "Nova despesa"}</DialogTitle>
          <DialogDescription>Registre uma despesa da clínica.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Compra de produtos" {...field} />
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
                name="date"
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
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecionar" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {EXPENSE_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
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
                name="supplier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fornecedor</FormLabel>
                    <FormControl>
                      <Input placeholder="Opcional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="size-4 animate-spin" /> : null}
                {isEdit ? "Salvar alterações" : "Registrar despesa"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
