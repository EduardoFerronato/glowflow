"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Loader2, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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
import { ClientCombobox } from "@/features/agenda/components/client-combobox"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { appointmentSchema, type AppointmentInput } from "@/features/agenda/schema"
import {
  createAppointmentAction,
  updateAppointmentAction,
  deleteAppointmentAction,
  updateAppointmentStatusAction,
} from "@/features/agenda/actions"
import { AppointmentStatus } from "@/generated/prisma/enums"

const STATUS_OPTIONS: { value: AppointmentStatus; label: string }[] = [
  { value: AppointmentStatus.SCHEDULED, label: "Agendado" },
  { value: AppointmentStatus.CONFIRMED, label: "Confirmado" },
  { value: AppointmentStatus.COMPLETED, label: "Concluído" },
  { value: AppointmentStatus.CANCELLED, label: "Cancelado" },
]

interface Option {
  id: string
  name: string
}

interface AppointmentFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clients: Option[]
  professionals: Option[]
  procedures: Option[]
  rooms: string[]
  appointmentId?: string
  defaultValues?: Partial<AppointmentInput>
  status?: AppointmentStatus
  onSaved: () => void
  onDeleted?: () => void
}

export function AppointmentFormDialog({
  open,
  onOpenChange,
  clients,
  professionals,
  procedures,
  rooms,
  appointmentId,
  defaultValues,
  status,
  onSaved,
  onDeleted,
}: AppointmentFormDialogProps) {
  const [loading, setLoading] = React.useState(false)
  const [statusLoading, setStatusLoading] = React.useState(false)
  const [confirmDelete, setConfirmDelete] = React.useState(false)
  const isEdit = Boolean(appointmentId)

  async function handleStatusChange(next: AppointmentStatus) {
    if (!appointmentId) return
    setStatusLoading(true)
    const result = await updateAppointmentStatusAction(appointmentId, next)
    setStatusLoading(false)
    if (!result.success) {
      toast.error(result.message)
      return
    }
    toast.success("Status atualizado.")
    onSaved()
  }

  const form = useForm<AppointmentInput>({
    resolver: zodResolver(appointmentSchema),
    values: {
      clientId: defaultValues?.clientId ?? "",
      professionalId: defaultValues?.professionalId ?? "",
      procedureId: defaultValues?.procedureId ?? "",
      room: defaultValues?.room ?? "",
      date: defaultValues?.date ?? "",
      time: defaultValues?.time ?? "",
      notes: defaultValues?.notes ?? "",
    },
  })

  async function onSubmit(values: AppointmentInput) {
    setLoading(true)
    const result = isEdit
      ? await updateAppointmentAction(appointmentId!, values)
      : await createAppointmentAction(values)
    setLoading(false)

    if (!result.success) {
      toast.error(result.message)
      return
    }
    toast.success(isEdit ? "Agendamento atualizado!" : "Agendamento criado!")
    onOpenChange(false)
    onSaved()
  }

  async function handleDelete() {
    if (!appointmentId) return
    const result = await deleteAppointmentAction(appointmentId)
    if (!result.success) {
      toast.error(result.message)
      return
    }
    toast.success("Agendamento excluído.")
    onOpenChange(false)
    onDeleted?.()
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEdit ? "Editar agendamento" : "Novo agendamento"}</DialogTitle>
            <DialogDescription>
              Preencha os dados do agendamento.
            </DialogDescription>
          </DialogHeader>

          {isEdit && status ? (
            <div className="flex flex-wrap gap-1.5">
              {STATUS_OPTIONS.map((opt) => (
                <Badge
                  key={opt.value}
                  variant={status === opt.value ? "default" : "outline"}
                  className="cursor-pointer select-none"
                  onClick={() => !statusLoading && handleStatusChange(opt.value)}
                >
                  {opt.label}
                </Badge>
              ))}
            </div>
          ) : null}

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
                  name="professionalId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profissional</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecionar" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {professionals.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name}
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
                  name="procedureId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Procedimento</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecionar" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {procedures.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
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
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horário</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="room"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sala</FormLabel>
                      <FormControl>
                        <Input list="rooms-list" placeholder="Sala 1" {...field} />
                      </FormControl>
                      <datalist id="rooms-list">
                        {rooms.map((r) => (
                          <option key={r} value={r} />
                        ))}
                      </datalist>
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
                      <Textarea rows={2} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter className="gap-2 sm:justify-between">
                {isEdit ? (
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setConfirmDelete(true)}
                  >
                    <Trash2 className="size-4" />
                    Excluir
                  </Button>
                ) : (
                  <span />
                )}
                <Button type="submit" disabled={loading}>
                  {loading ? <Loader2 className="size-4 animate-spin" /> : null}
                  {isEdit ? "Salvar alterações" : "Criar agendamento"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Excluir agendamento?"
        description="Essa ação não pode ser desfeita."
        onConfirm={handleDelete}
      />
    </>
  )
}
