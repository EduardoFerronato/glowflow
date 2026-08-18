"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, Plus, MoreHorizontal, Pencil, UserX, UserCheck, Users } from "lucide-react"
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
import { ProfessionalFormDialog } from "@/features/professionals/components/professional-form-dialog"
import { setProfessionalActiveAction } from "@/features/professionals/actions"
import { initials } from "@/utils/initials"

export interface ProfessionalRow {
  id: string
  name: string
  specialty: string | null
  phone: string | null
  email: string | null
  color: string
  active: boolean
}

export function ProfessionalsTable({ professionals }: { professionals: ProfessionalRow[] }) {
  const router = useRouter()
  const [query, setQuery] = React.useState("")
  const [createOpen, setCreateOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<ProfessionalRow | null>(null)
  const [deactivating, setDeactivating] = React.useState<ProfessionalRow | null>(null)

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return professionals
    return professionals.filter((p) =>
      [p.name, p.specialty, p.phone, p.email]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(q))
    )
  }, [professionals, query])

  async function handleDeactivate() {
    if (!deactivating) return
    const result = await setProfessionalActiveAction(deactivating.id, false)
    if (!result.success) {
      toast.error(result.message)
      return
    }
    toast.success("Profissional desativado.")
    router.refresh()
  }

  async function handleReactivate(professional: ProfessionalRow) {
    const result = await setProfessionalActiveAction(professional.id, true)
    if (!result.success) {
      toast.error(result.message)
      return
    }
    toast.success("Profissional reativado.")
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
            placeholder="Buscar por nome, especialidade..."
            className="pl-9"
          />
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" />
          Novo profissional
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Users}
            title={query ? "Nenhum profissional encontrado" : "Nenhum profissional cadastrado"}
            description={
              query
                ? "Tente buscar por outro termo."
                : "Cadastre o primeiro profissional da sua clínica."
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Profissional</TableHead>
                <TableHead className="hidden sm:table-cell">Telefone</TableHead>
                <TableHead className="hidden md:table-cell">E-mail</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((professional) => (
                <TableRow
                  key={professional.id}
                  className={!professional.active ? "opacity-60" : undefined}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className="flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-medium text-white"
                        style={{ backgroundColor: professional.color }}
                      >
                        {initials(professional.name)}
                      </div>
                      <div>
                        <p className="font-medium">{professional.name}</p>
                        {professional.specialty ? (
                          <p className="text-xs text-muted-foreground">{professional.specialty}</p>
                        ) : null}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground sm:table-cell">
                    {professional.phone ?? "—"}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {professional.email ?? "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        professional.active
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {professional.active ? "Ativo" : "Inativo"}
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
                        <DropdownMenuItem onClick={() => setEditing(professional)}>
                          <Pencil className="size-4" />
                          Editar
                        </DropdownMenuItem>
                        {professional.active ? (
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => setDeactivating(professional)}
                          >
                            <UserX className="size-4" />
                            Desativar
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleReactivate(professional)}>
                            <UserCheck className="size-4" />
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

      <ProfessionalFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSaved={() => router.refresh()}
      />

      {editing ? (
        <ProfessionalFormDialog
          open={Boolean(editing)}
          onOpenChange={(open) => !open && setEditing(null)}
          professionalId={editing.id}
          defaultValues={{
            name: editing.name,
            specialty: editing.specialty ?? "",
            phone: editing.phone ?? "",
            email: editing.email ?? "",
            color: editing.color,
          }}
          onSaved={() => router.refresh()}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(deactivating)}
        onOpenChange={(open) => !open && setDeactivating(null)}
        title="Desativar profissional?"
        description={`${deactivating?.name ?? "O profissional"} deixará de aparecer para novos agendamentos, mas o histórico é mantido.`}
        confirmLabel="Desativar"
        onConfirm={handleDeactivate}
      />
    </div>
  )
}
