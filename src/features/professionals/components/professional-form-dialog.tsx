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
import { ColorField } from "@/components/shared/color-field"
import {
  professionalSchema,
  type ProfessionalFormInput,
} from "@/features/professionals/schema"
import {
  createProfessionalAction,
  updateProfessionalAction,
} from "@/features/professionals/actions"
import { formatPhone } from "@/utils/format"

interface ProfessionalFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  professionalId?: string
  defaultValues?: Partial<ProfessionalFormInput>
  onSaved: () => void
}

export function ProfessionalFormDialog({
  open,
  onOpenChange,
  professionalId,
  defaultValues,
  onSaved,
}: ProfessionalFormDialogProps) {
  const [loading, setLoading] = React.useState(false)
  const isEdit = Boolean(professionalId)

  const form = useForm<ProfessionalFormInput>({
    resolver: zodResolver(professionalSchema),
    values: {
      name: defaultValues?.name ?? "",
      specialty: defaultValues?.specialty ?? "",
      phone: defaultValues?.phone ?? "",
      email: defaultValues?.email ?? "",
      color: defaultValues?.color ?? "#e11d5f",
    },
  })

  async function onSubmit(values: ProfessionalFormInput) {
    setLoading(true)
    const result = isEdit
      ? await updateProfessionalAction(professionalId!, values)
      : await createProfessionalAction(values)
    setLoading(false)

    if (!result.success) {
      toast.error(result.message)
      return
    }
    toast.success(isEdit ? "Profissional atualizado!" : "Profissional cadastrado!")
    onOpenChange(false)
    onSaved()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar profissional" : "Novo profissional"}</DialogTitle>
          <DialogDescription>Preencha os dados do profissional.</DialogDescription>
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
                    <Input placeholder="Nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Especialidade</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Esteticista, Dermatologista..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="profissional@email.com" {...field} />
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
                <ColorField
                  label="Cor na agenda"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="size-4 animate-spin" /> : null}
                {isEdit ? "Salvar alterações" : "Cadastrar profissional"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
