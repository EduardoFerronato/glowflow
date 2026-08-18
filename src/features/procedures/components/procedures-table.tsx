"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, Plus, MoreHorizontal, Pencil, Ban, RotateCcw, Sparkles } from "lucide-react"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EmptyState } from "@/components/shared/empty-state"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { ProcedureFormDialog } from "@/features/procedures/components/procedure-form-dialog"
import { setProcedureActiveAction } from "@/features/procedures/actions"
import { formatCurrency } from "@/utils/format"

export interface ProcedureRow {
  id: string
  name: string
  category: string | null
  price: number
  duration: number
  description: string | null
  color: string
  active: boolean
}

export function ProceduresTable({ procedures }: { procedures: ProcedureRow[] }) {
  const router = useRouter()
  const [query, setQuery] = React.useState("")
  const [createOpen, setCreateOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<ProcedureRow | null>(null)
  const [deactivating, setDeactivating] = React.useState<ProcedureRow | null>(null)

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return procedures
    return procedures.filter((p) =>
      [p.name, p.category].filter(Boolean).some((field) => field!.toLowerCase().includes(q))
    )
  }, [procedures, query])

  async function handleDeactivate() {
    if (!deactivating) return
    const result = await setProcedureActiveAction(deactivating.id, false)
    if (!result.success) {
      toast.error(result.message)
      return
    }
    toast.success("Procedimento desativado.")
    router.refresh()
  }

  async function handleReactivate(procedure: ProcedureRow) {
    const result = await setProcedureActiveAction(procedure.id, true)
    if (!result.success) {
      toast.error(result.message)
      return
    }
    toast.success("Procedimento reativado.")
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome, categoria..."
            className="pl-9"
          />
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" />
          Novo procedimento
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title={query ? "Nenhum procedimento encontrado" : "Nenhum procedimento cadastrado"}
            description={
              query
                ? "Tente buscar por outro termo."
                : "Cadastre o primeiro procedimento da sua clínica."
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Procedimento</TableHead>
                <TableHead className="hidden sm:table-cell">Categoria</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((procedure) => (
                <TableRow
                  key={procedure.id}
                  className={!procedure.active ? "opacity-60" : undefined}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span
                        className="size-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: procedure.color }}
                      />
                      <span className="font-medium">{procedure.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground sm:table-cell">
                    {procedure.category ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{procedure.duration} min</TableCell>
                  <TableCell className="font-medium">{formatCurrency(procedure.price)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        procedure.active
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {procedure.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditing(procedure)}>
                          <Pencil className="size-4" />
                          Editar
                        </DropdownMenuItem>
                        {procedure.active ? (
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => setDeactivating(procedure)}
                          >
                            <Ban className="size-4" />
                            Desativar
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleReactivate(procedure)}>
                            <RotateCcw className="size-4" />
                            Reativar
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <ProcedureFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSaved={() => router.refresh()}
      />

      {editing ? (
        <ProcedureFormDialog
          open={Boolean(editing)}
          onOpenChange={(open) => !open && setEditing(null)}
          procedureId={editing.id}
          defaultValues={{
            name: editing.name,
            category: editing.category ?? "",
            price: editing.price,
            duration: editing.duration,
            description: editing.description ?? "",
            color: editing.color,
          }}
          onSaved={() => router.refresh()}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(deactivating)}
        onOpenChange={(open) => !open && setDeactivating(null)}
        title="Desativar procedimento?"
        description={`${deactivating?.name ?? "O procedimento"} deixará de aparecer para novos agendamentos, mas o histórico é mantido.`}
        confirmLabel="Desativar"
        onConfirm={handleDeactivate}
      />
    </div>
  )
}
