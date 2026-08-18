"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, Plus, MoreHorizontal, Pencil, Trash2, Receipt } from "lucide-react"
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
import { ExpenseFormDialog } from "@/features/finance/components/expense-form-dialog"
import { deleteExpenseAction } from "@/features/finance/actions"
import { formatCurrency, formatDate } from "@/utils/format"

export interface ExpenseRow {
  id: string
  description: string
  amount: number
  category: string
  supplier: string | null
  date: Date
}

export function ExpensesTable({ expenses }: { expenses: ExpenseRow[] }) {
  const router = useRouter()
  const [query, setQuery] = React.useState("")
  const [createOpen, setCreateOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<ExpenseRow | null>(null)
  const [deleting, setDeleting] = React.useState<ExpenseRow | null>(null)

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return expenses
    return expenses.filter((e) =>
      [e.description, e.category, e.supplier]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(q))
    )
  }, [expenses, query])

  async function handleDelete() {
    if (!deleting) return
    const result = await deleteExpenseAction(deleting.id)
    if (!result.success) {
      toast.error(result.message)
      return
    }
    toast.success("Despesa excluída.")
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
            placeholder="Buscar por descrição, categoria..."
            className="pl-9"
          />
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" />
          Nova despesa
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title={query ? "Nenhuma despesa encontrada" : "Nenhuma despesa registrada"}
            description={
              query ? "Tente buscar por outro termo." : "Registre a primeira despesa da clínica."
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead className="hidden sm:table-cell">Categoria</TableHead>
                <TableHead className="hidden md:table-cell">Fornecedor</TableHead>
                <TableHead className="hidden md:table-cell">Data</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.description}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="outline" className="font-normal">
                      {expense.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {expense.supplier ?? "—"}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {formatDate(expense.date)}
                  </TableCell>
                  <TableCell className="font-medium text-destructive">
                    -{formatCurrency(expense.amount)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditing(expense)}>
                          <Pencil className="size-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onClick={() => setDeleting(expense)}>
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

      <ExpenseFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSaved={() => router.refresh()}
      />

      {editing ? (
        <ExpenseFormDialog
          open={Boolean(editing)}
          onOpenChange={(open) => !open && setEditing(null)}
          expenseId={editing.id}
          defaultValues={{
            description: editing.description,
            amount: editing.amount,
            category: editing.category,
            supplier: editing.supplier ?? "",
            date: new Date(editing.date).toISOString().slice(0, 10),
          }}
          onSaved={() => router.refresh()}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Excluir despesa?"
        description={`Isso removerá "${deleting?.description ?? "a despesa"}" permanentemente.`}
        onConfirm={handleDelete}
      />
    </div>
  )
}
