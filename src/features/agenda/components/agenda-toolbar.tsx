"use client"

import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type AgendaViewMode = "day" | "week" | "month"

interface AgendaToolbarProps {
  view: AgendaViewMode
  onViewChange: (view: AgendaViewMode) => void
  label: string
  onPrev: () => void
  onNext: () => void
  onToday: () => void
  professionals: { id: string; name: string }[]
  procedures: { id: string; name: string }[]
  rooms: string[]
  professionalId: string
  procedureId: string
  room: string
  onProfessionalChange: (v: string) => void
  onProcedureChange: (v: string) => void
  onRoomChange: (v: string) => void
  onNewAppointment: () => void
}

const ALL = "all"

export function AgendaToolbar({
  view,
  onViewChange,
  label,
  onPrev,
  onNext,
  onToday,
  professionals,
  procedures,
  rooms,
  professionalId,
  procedureId,
  room,
  onProfessionalChange,
  onProcedureChange,
  onRoomChange,
  onNewAppointment,
}: AgendaToolbarProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onPrev} aria-label="Anterior">
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onToday}>
            Hoje
          </Button>
          <Button variant="outline" size="icon" onClick={onNext} aria-label="Próximo">
            <ChevronRight className="size-4" />
          </Button>
          <h2 className="ml-2 min-w-40 text-lg font-semibold capitalize">{label}</h2>
        </div>

        <div className="flex items-center gap-2">
          <Tabs value={view} onValueChange={(v) => onViewChange(v as AgendaViewMode)}>
            <TabsList>
              <TabsTrigger value="day">Dia</TabsTrigger>
              <TabsTrigger value="week">Semana</TabsTrigger>
              <TabsTrigger value="month">Mês</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={onNewAppointment} size="sm">
            <Plus className="size-4" />
            Novo agendamento
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select value={professionalId} onValueChange={onProfessionalChange}>
          <SelectTrigger size="sm" className="w-44">
            <SelectValue placeholder="Profissional" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todos profissionais</SelectItem>
            {professionals.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={procedureId} onValueChange={onProcedureChange}>
          <SelectTrigger size="sm" className="w-44">
            <SelectValue placeholder="Procedimento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todos procedimentos</SelectItem>
            {procedures.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={room} onValueChange={onRoomChange}>
          <SelectTrigger size="sm" className="w-36">
            <SelectValue placeholder="Sala" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todas salas</SelectItem>
            {rooms.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
