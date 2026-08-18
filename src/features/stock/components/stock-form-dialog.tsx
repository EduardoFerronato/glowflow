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
import { stockItemSchema, type StockItemFormInput } from "@/features/stock/schema"
import { createStockItemAction, updateStockItemAction } from "@/features/stock/actions"

interface StockFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  stockId?: string
  defaultValues?: Partial<StockItemFormInput>
  onSaved: () => void
}

function numberField(onChange: (value: number) => void) {
  return (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange(Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber)
}

export function StockFormDialog({
  open,
  onOpenChange,
  stockId,
  defaultValues,
  onSaved,
}: StockFormDialogProps) {
  const [loading, setLoading] = React.useState(false)
  const isEdit = Boolean(stockId)

  const form = useForm<StockItemFormInput>({
    resolver: zodResolver(stockItemSchema),
    values: {
      name: defaultValues?.name ?? "",
      category: defaultValues?.category ?? "",
      quantity: defaultValues?.quantity ?? 0,
      minQuantity: defaultValues?.minQuantity ?? 5,
      unit: defaultValues?.unit ?? "un",
      expiryDate: defaultValues?.expiryDate ?? "",
      supplier: defaultValues?.supplier ?? "",
    },
  })

  async function onSubmit(values: StockItemFormInput) {
    setLoading(true)
    const result = isEdit
      ? await updateStockItemAction(stockId!, values)
      : await createStockItemAction(values)
    setLoading(false)

    if (!result.success) {
      toast.error(result.message)
      return
    }
    toast.success(isEdit ? "Item atualizado!" : "Item cadastrado!")
    onOpenChange(false)
    onSaved()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar item" : "Novo item de estoque"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "A quantidade é ajustada via movimentações."
              : "Preencha os dados do item e a quantidade inicial."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Ácido Hialurônico" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Insumos" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unidade</FormLabel>
                    <FormControl>
                      <Input placeholder="un, ml, cx..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {!isEdit ? (
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade inicial</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          step={1}
                          value={field.value}
                          onChange={numberField(field.onChange)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}
              <FormField
                control={form.control}
                name="minQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estoque mínimo</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step={1}
                        value={field.value}
                        onChange={numberField(field.onChange)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Validade</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
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
                {isEdit ? "Salvar alterações" : "Cadastrar item"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
