"use client"

import * as React from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { toast } from "sonner"

import { AgendaToolbar, type AgendaViewMode } from "@/features/agenda/components/agenda-toolbar"
import { StatusLegend } from "@/features/agenda/components/status-legend"
import { CalendarGrid } from "@/features/agenda/components/calendar-grid"
import { MonthView } from "@/features/agenda/components/month-view"
import { AppointmentFormDialog } from "@/features/agenda/components/appointment-form-dialog"
import { listAppointmentsAction, rescheduleAppointmentAction } from "@/features/agenda/actions"
import { dateKey, parseSlotId } from "@/features/agenda/lib/grid"
import type { AppointmentChipData } from "@/features/agenda/components/appointment-chip"
import type { AppointmentStatus } from "@/generated/prisma/enums"

interface Option {
  id: string
  name: string
}

interface AgendaViewProps {
  clients: Option[]
  professionals: (Option & { color: string })[]
  procedures: Option[]
  rooms: string[]
}

const ALL = "all"

function startOfWeek(date: Date) {
  const d = new Date(date)
  d.setDate(d.getDate() - d.getDay())
  d.setHours(0, 0, 0, 0)
  return d
}

function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function rangeForView(view: AgendaViewMode, reference: Date) {
  if (view === "day") {
    const start = new Date(reference)
    start.setHours(0, 0, 0, 0)
    return { from: start, to: addDays(start, 1) }
  }
  if (view === "week") {
    const start = startOfWeek(reference)
    return { from: start, to: addDays(start, 7) }
  }
  const start = new Date(reference.getFullYear(), reference.getMonth() - 1, 25)
  const end = new Date(reference.getFullYear(), reference.getMonth() + 2, 5)
  return { from: start, to: end }
}

function labelForView(view: AgendaViewMode, reference: Date) {
  if (view === "day")
    return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(
      reference
    )
  if (view === "week") {
    const start = startOfWeek(reference)
    const end = addDays(start, 6)
    const fmt = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" })
    return `${fmt.format(start)} – ${fmt.format(end)}`
  }
  return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(reference)
}

export function AgendaView({ clients, professionals, procedures, rooms }: AgendaViewProps) {
  const queryClient = useQueryClient()
  const [view, setView] = React.useState<AgendaViewMode>("week")
  const [reference, setReference] = React.useState(() => new Date())
  const [professionalId, setProfessionalId] = React.useState(ALL)
  const [procedureId, setProcedureId] = React.useState(ALL)
  const [room, setRoom] = React.useState(ALL)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<AppointmentChipData & { room?: string; notes?: string } | null>(
    null
  )
  const [prefill, setPrefill] = React.useState<{ date: string; time: string } | null>(null)

  const { from, to } = rangeForView(view, reference)

  const filters = {
    professionalId: professionalId === ALL ? undefined : professionalId,
    procedureId: procedureId === ALL ? undefined : procedureId,
    room: room === ALL ? undefined : room,
  }

  const { data, isLoading } = useQuery({
    queryKey: ["appointments", from.toISOString(), to.toISOString(), filters],
    queryFn: () => listAppointmentsAction(from.toISOString(), to.toISOString(), filters),
  })

  const appointments: AppointmentChipData[] = React.useMemo(
    () =>
      (data ?? []).map((a) => ({
        id: a.id,
        clientName: a.client.name,
        procedureName: a.procedure.name,
        professionalColor: a.professional.color,
        status: a.status,
        startTime: new Date(a.startTime),
        endTime: new Date(a.endTime),
      })),
    [data]
  )

  const raw = data ?? []

  function refetch() {
    queryClient.invalidateQueries({ queryKey: ["appointments"] })
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  )

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return
    const appointmentId = String(active.id)
    const overId = String(over.id)

    let newStart: Date
    if (overId.startsWith("month-")) {
      const existing = raw.find((a) => a.id === appointmentId)
      if (!existing) return
      const targetDay = parseSlotId(`${overId.replace("month-", "")}T00:00`)
      const original = new Date(existing.startTime)
      newStart = new Date(
        targetDay.getFullYear(),
        targetDay.getMonth(),
        targetDay.getDate(),
        original.getHours(),
        original.getMinutes()
      )
    } else {
      newStart = parseSlotId(overId)
    }

    const result = await rescheduleAppointmentAction(appointmentId, newStart.toISOString())
    if (!result.success) {
      toast.error(result.message)
      return
    }
    toast.success("Agendamento reagendado.")
    refetch()
  }

  function openCreateDialog(date?: Date, time?: string) {
    setEditing(null)
    if (date) {
      setPrefill({ date: dateKey(date), time: time ?? "09:00" })
    } else {
      setPrefill(null)
    }
    setDialogOpen(true)
  }

  function openEditDialog(id: string) {
    const appt = raw.find((a) => a.id === id)
    if (!appt) return
    setEditing({
      id: appt.id,
      clientName: appt.client.name,
      procedureName: appt.procedure.name,
      professionalColor: appt.professional.color,
      status: appt.status,
      startTime: new Date(appt.startTime),
      endTime: new Date(appt.endTime),
      room: appt.room ?? undefined,
      notes: appt.notes ?? undefined,
    })
    setPrefill(null)
    setDialogOpen(true)
  }

  const editingRaw = editing ? raw.find((a) => a.id === editing.id) : null

  function navigate(direction: -1 | 1) {
    if (view === "day") setReference((d) => addDays(d, direction))
    else if (view === "week") setReference((d) => addDays(d, direction * 7))
    else setReference((d) => new Date(d.getFullYear(), d.getMonth() + direction, 1))
  }

  return (
    <div className="space-y-4">
      <AgendaToolbar
        view={view}
        onViewChange={setView}
        label={labelForView(view, reference)}
        onPrev={() => navigate(-1)}
        onNext={() => navigate(1)}
        onToday={() => setReference(new Date())}
        professionals={professionals}
        procedures={procedures}
        rooms={rooms}
        professionalId={professionalId}
        procedureId={procedureId}
        room={room}
        onProfessionalChange={setProfessionalId}
        onProcedureChange={setProcedureId}
        onRoomChange={setRoom}
        onNewAppointment={() => openCreateDialog()}
      />

      <StatusLegend />

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        {isLoading ? (
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            Carregando agenda...
          </div>
        ) : view === "month" ? (
          <MonthView
            reference={reference}
            appointments={appointments}
            onDayClick={(day) => openCreateDialog(day, "09:00")}
            onChipClick={openEditDialog}
          />
        ) : (
          <CalendarGrid
            days={view === "day" ? [reference] : Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(reference), i))}
            appointments={appointments}
            onSlotClick={(day, time) => openCreateDialog(day, time)}
            onChipClick={openEditDialog}
          />
        )}
      </DndContext>

      <AppointmentFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        clients={clients}
        professionals={professionals}
        procedures={procedures}
        rooms={rooms}
        appointmentId={editing?.id}
        status={editingRaw?.status as AppointmentStatus | undefined}
        defaultValues={
          editing && editingRaw
            ? {
                clientId: editingRaw.clientId,
                professionalId: editingRaw.professionalId,
                procedureId: editingRaw.procedureId,
                room: editingRaw.room ?? "",
                date: dateKey(new Date(editingRaw.startTime)),
                time: new Date(editingRaw.startTime).toTimeString().slice(0, 5),
                notes: editingRaw.notes ?? "",
              }
            : prefill
              ? { date: prefill.date, time: prefill.time }
              : undefined
        }
        onSaved={refetch}
        onDeleted={refetch}
      />
    </div>
  )
}
