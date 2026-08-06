"use client"

import { useDroppable } from "@dnd-kit/core"

import { cn } from "@/lib/utils"

export function DroppableSlot({
  id,
  height,
  onClick,
  children,
}: {
  id: string
  height: number
  onClick?: () => void
  children?: React.ReactNode
}) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      style={{ height }}
      className={cn(
        "relative border-b border-border/50 transition-colors",
        isOver && "bg-primary/10"
      )}
    >
      {children}
    </div>
  )
}
