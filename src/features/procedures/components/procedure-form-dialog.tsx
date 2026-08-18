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
import { ColorField } from "@/components/shared/color-field"
import { procedureSchema, type ProcedureFormInput } from "@/features/procedures/schema"
import { createProcedureAction, updateProcedureAction } from "@/features/procedures/actions"

interface ProcedureFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  procedureId?: string
  defaultValues?: Partial<ProcedureFormInput>
  onSaved: () => void
}

export function ProcedureFormDialog({
  open,
  onOpenChange,
  procedureId,
  defaultValues,
  onSaved,
}: ProcedureFormDialogProps) {
  const [loading, setLoading] = React.useState(false)
  const isEdit = Boolean(procedureId)

  const form = useForm<ProcedureFormInput>({
    resolver: zodResolver(procedureSchema),
    values: {
      name: defaultValues?.name ?? "",
      category: defaultValues?.category ?? "",
      price: defaultValues?.price ?? 0,
      duration: defaultValues?.duration ?? 30,
      description: defaultValues?.description ?? "",
      color: defaultValues?.color ?? "#e11d5f",
    },
  })

  async function onSubmit(values: ProcedureFormInput) {
    setLoading(true)
    const result = isEdit
      ? await updateProcedureAction(procedureId!, values)
      : await createProcedureAction(values)
    setLoading(false)

    if (!result.success) {
      toast.error(result.message)
      return
    }
    toast.success(isEdit ? "Procedimento atualizado!" : "Procedimento cadastrado!")
    onOpenChange(false)
    onSaved()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar procedimento" : "Novo procedimento"}</DialogTitle>
          <DialogDescription>Preencha os dados do procedimento.</DialogDescription>
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
                    <Input placeholder="Ex: Limpeza de Pele Profunda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Facial, Corporal, Capilar..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
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
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duração (min)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={5}
                        step={5}
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
            </div>

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <ColorField label="Cor na agenda" value={field.value} onChange={field.onChange} />
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Detalhes do procedimento..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="size-4 animate-spin" /> : null}
                {isEdit ? "Salvar alterações" : "Cadastrar procedimento"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
