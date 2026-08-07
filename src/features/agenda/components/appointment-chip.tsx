"use client"

import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"

import { cn } from "@/lib/utils"
import { formatTime } from "@/utils/format"
import { hexToRgba } from "@/utils/color"
import { statusMeta } from "@/features/agenda/lib/status"

export interface AppointmentChipData {
  id: string
  clientName: string
  procedureName: string
  professionalColor: string
  status: string
  startTime: Date
  endTime: Date
}

export function AppointmentChip({
  appointment,
  style,
  compact = false,
  onClick,
}: {
  appointment: AppointmentChipData
  style?: React.CSSProperties
  compact?: boolean
  onClick?: (e: React.MouseEvent) => void
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: appointment.id,
    data: appointment,
  })

  const dragStyle: React.CSSProperties = {
    ...style,
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 50 : style?.zIndex,
    opacity: isDragging ? 0.6 : 1,
    backgroundColor: hexToRgba(appointment.professionalColor, 0.12),
    borderColor: hexToRgba(appointment.professionalColor, 0.35),
  }

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onClick}
      style={dragStyle}
      className={cn(
        "group cursor-grab overflow-hidden rounded-lg border px-2 py-1 text-left text-xs shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing",
        appointment.status === "CANCELLED" && "opacity-50 line-through",
        compact ? "w-full" : "absolute inset-x-1"
      )}
      title={`${appointment.clientName} · ${appointment.procedureName}`}
    >
      <div
        className="absolute inset-y-0 left-0 w-1"
        style={{ backgroundColor: appointment.professionalColor }}
      />
      <div className="pl-1.5">
        <p className="truncate font-medium text-foreground">{appointment.clientName}</p>
        {!compact ? (
          <p className="truncate text-muted-foreground">{appointment.procedureName}</p>
        ) : null}
        <p className="flex items-center gap-1 truncate text-[10px] text-muted-foreground/80">
          <span className={cn("size-1.5 shrink-0 rounded-full", statusMeta(appointment.status).dotClassName)} />
          {formatTime(appointment.startTime)}
        </p>
      </div>
    </button>
  )
}
