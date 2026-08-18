"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  ArrowLeftRight,
  Package,
  AlertTriangle,
} from "lucide-react"
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
import { StockFormDialog } from "@/features/stock/components/stock-form-dialog"
import { StockMovementDialog } from "@/features/stock/components/stock-movement-dialog"
import { deleteStockItemAction } from "@/features/stock/actions"
import { formatDate } from "@/utils/format"

export interface StockRow {
  id: string
  name: string
  category: string | null
  quantity: number
  minQuantity: number
  unit: string
  expiryDate: Date | null
  supplier: string | null
}

const EXPIRY_WARNING_DAYS = 30

function expiryStatus(expiryDate: Date | null) {
  if (!expiryDate) return null
  const days = Math.round((new Date(expiryDate).getTime() - new Date().getTime()) / 86400000)
  if (days < 0) return { label: "Vencido", className: "bg-destructive/10 text-destructive" }
  if (days <= EXPIRY_WARNING_DAYS)
    return { label: `Vence em ${days}d`, className: "bg-champagne text-champagne-foreground" }
  return null
}

export function StockTable({ stock }: { stock: StockRow[] }) {
  const router = useRouter()
  const [query, setQuery] = React.useState("")
  const [createOpen, setCreateOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<StockRow | null>(null)
  const [moving, setMoving] = React.useState<StockRow | null>(null)
  const [deleting, setDeleting] = React.useState<StockRow | null>(null)

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return stock
    return stock.filter((s) =>
      [s.name, s.category, s.supplier].filter(Boolean).some((field) => field!.toLowerCase().includes(q))
    )
  }, [stock, query])

  async function handleDelete() {
    if (!deleting) return
    const result = await deleteStockItemAction(deleting.id)
    if (!result.success) {
      toast.error(result.message)
      return
    }
    toast.success("Item excluído.")
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
            placeholder="Buscar por nome, categoria, fornecedor..."
            className="pl-9"
          />
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" />
          Novo item
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Package}
            title={query ? "Nenhum item encontrado" : "Nenhum item cadastrado"}
            description={
              query ? "Tente buscar por outro termo." : "Cadastre o primeiro item de estoque."
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="hidden sm:table-cell">Categoria</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead className="hidden md:table-cell">Fornecedor</TableHead>
                <TableHead className="hidden lg:table-cell">Validade</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => {
                const lowStock = item.quantity <= item.minQuantity
                const expiry = expiryStatus(item.expiryDate)
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="hidden text-muted-foreground sm:table-cell">
                      {item.category ?? "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={lowStock ? "font-medium text-destructive" : undefined}>
                          {item.quantity} {item.unit}
                        </span>
                        {lowStock ? (
                          <Badge
                            variant="secondary"
                            className="gap-1 bg-destructive/10 text-destructive"
                          >
                            <AlertTriangle className="size-3" />
                            Baixo
                          </Badge>
                        ) : null}
                        {expiry ? (
                          <Badge variant="secondary" className={expiry.className}>
                            {expiry.label}
                          </Badge>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">
                      {item.supplier ?? "—"}
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground lg:table-cell">
                      {item.expiryDate ? formatDate(item.expiryDate) : "—"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setMoving(item)}>
                            <ArrowLeftRight className="size-4" />
                            Movimentar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEditing(item)}>
                            <Pencil className="size-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem variant="destructive" onClick={() => setDeleting(item)}>
                            <Trash2 className="size-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </div>

      <StockFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSaved={() => router.refresh()}
      />

      {editing ? (
        <StockFormDialog
          open={Boolean(editing)}
          onOpenChange={(open) => !open && setEditing(null)}
          stockId={editing.id}
          defaultValues={{
            name: editing.name,
            category: editing.category ?? "",
            quantity: editing.quantity,
            minQuantity: editing.minQuantity,
            unit: editing.unit,
            expiryDate: editing.expiryDate
              ? new Date(editing.expiryDate).toISOString().slice(0, 10)
              : "",
            supplier: editing.supplier ?? "",
          }}
          onSaved={() => router.refresh()}
        />
      ) : null}

      {moving ? (
        <StockMovementDialog
          open={Boolean(moving)}
          onOpenChange={(open) => !open && setMoving(null)}
          stockId={moving.id}
          itemName={moving.name}
          onSaved={() => router.refresh()}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Excluir item?"
        description={`Isso removerá "${deleting?.name ?? "o item"}" e seu histórico de movimentações permanentemente.`}
        onConfirm={handleDelete}
      />
    </div>
  )
}
