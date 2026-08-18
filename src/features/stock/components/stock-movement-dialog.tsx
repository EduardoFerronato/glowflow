"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Loader2, ArrowDownCircle, ArrowUpCircle } from "lucide-react"

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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { stockMovementSchema, type StockMovementFormInput } from "@/features/stock/schema"
import { registerStockMovementAction } from "@/features/stock/actions"

interface StockMovementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  stockId: string
  itemName: string
  onSaved: () => void
}

export function StockMovementDialog({
  open,
  onOpenChange,
  stockId,
  itemName,
  onSaved,
}: StockMovementDialogProps) {
  const [loading, setLoading] = React.useState(false)

  const form = useForm<StockMovementFormInput>({
    resolver: zodResolver(stockMovementSchema),
    values: { type: "IN", quantity: 1, reason: "" },
  })

  async function onSubmit(values: StockMovementFormInput) {
    setLoading(true)
    const result = await registerStockMovementAction(stockId, values)
    setLoading(false)

    if (!result.success) {
      toast.error(result.message)
      return
    }
    toast.success("Movimentação registrada!")
    onOpenChange(false)
    onSaved()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Movimentar estoque</DialogTitle>
          <DialogDescription>{itemName}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Tabs value={field.value} onValueChange={field.onChange}>
                    <TabsList className="w-full">
                      <TabsTrigger value="IN" className="flex-1">
                        <ArrowDownCircle className="size-4" />
                        Entrada
                      </TabsTrigger>
                      <TabsTrigger value="OUT" className="flex-1">
                        <ArrowUpCircle className="size-4" />
                        Saída
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      step={1}
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Compra, uso em atendimento, perda..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="size-4 animate-spin" /> : null}
                Registrar movimentação
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
