"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Plus, MoreHorizontal, Pencil, Trash2, Users } from "lucide-react"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { ClientFormDialog } from "@/features/clients/components/client-form-dialog"
import { deleteClientAction } from "@/features/clients/actions"
import { formatDate } from "@/utils/format"

export interface ClientRow {
  id: string
  name: string
  phone: string | null
  email: string | null
  birthDate: Date | null
  photo: string | null
  cpf: string | null
  whatsapp: string | null
  instagram: string | null
  notes: string | null
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("")
}

export function ClientsTable({ clients }: { clients: ClientRow[] }) {
  const router = useRouter()
  const [query, setQuery] = React.useState("")
  const [createOpen, setCreateOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<ClientRow | null>(null)
  const [deleting, setDeleting] = React.useState<ClientRow | null>(null)

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return clients
    return clients.filter((c) =>
      [c.name, c.phone, c.email, c.instagram]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(q))
    )
  }, [clients, query])

  async function handleDelete() {
    if (!deleting) return
    const result = await deleteClientAction(deleting.id)
    if (!result.success) {
      toast.error(result.message)
      return
    }
    toast.success("Cliente excluído.")
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
            placeholder="Buscar por nome, telefone, e-mail..."
            className="pl-9"
          />
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" />
          Novo cliente
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Users}
            title={query ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado"}
            description={
              query
                ? "Tente buscar por outro termo."
                : "Cadastre o primeiro cliente da sua clínica."
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead className="hidden sm:table-cell">Telefone</TableHead>
                <TableHead className="hidden md:table-cell">E-mail</TableHead>
                <TableHead className="hidden lg:table-cell">Aniversário</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((client) => (
                <TableRow key={client.id} className="cursor-pointer">
                  <TableCell onClick={() => router.push(`/clientes/${client.id}`)}>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        {client.photo ? <AvatarImage src={client.photo} alt={client.name} /> : null}
                        <AvatarFallback className="bg-accent text-[11px] text-accent-foreground">
                          {initials(client.name)}
                        </AvatarFallback>
                      </Avatar>
                      <Link
                        href={`/clientes/${client.id}`}
                        className="font-medium hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {client.name}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell
                    className="hidden text-muted-foreground sm:table-cell"
                    onClick={() => router.push(`/clientes/${client.id}`)}
                  >
                    {client.phone ?? "—"}
                  </TableCell>
                  <TableCell
                    className="hidden text-muted-foreground md:table-cell"
                    onClick={() => router.push(`/clientes/${client.id}`)}
                  >
                    {client.email ?? "—"}
                  </TableCell>
                  <TableCell
                    className="hidden text-muted-foreground lg:table-cell"
                    onClick={() => router.push(`/clientes/${client.id}`)}
                  >
                    {client.birthDate ? formatDate(client.birthDate) : "—"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditing(client)}>
                          <Pencil className="size-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => setDeleting(client)}
                        >
                          <Trash2 className="size-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <ClientFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSaved={() => router.refresh()}
      />

      {editing ? (
        <ClientFormDialog
          open={Boolean(editing)}
          onOpenChange={(open) => !open && setEditing(null)}
          clientId={editing.id}
          defaultValues={{
            name: editing.name,
            phone: editing.phone ?? "",
            whatsapp: editing.whatsapp ?? "",
            email: editing.email ?? "",
            birthDate: editing.birthDate
              ? new Date(editing.birthDate).toISOString().slice(0, 10)
              : "",
            cpf: editing.cpf ?? "",
            instagram: editing.instagram ?? "",
            notes: editing.notes ?? "",
            photo: editing.photo ?? "",
          }}
          onSaved={() => router.refresh()}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Excluir cliente?"
        description={`Isso removerá ${deleting?.name ?? "o cliente"} e seu histórico permanentemente.`}
        onConfirm={handleDelete}
      />
    </div>
  )
}
