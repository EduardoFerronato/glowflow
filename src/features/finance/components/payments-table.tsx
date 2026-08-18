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
import { PaymentFormDialog } from "@/features/finance/components/payment-form-dialog"
import { deletePaymentAction } from "@/features/finance/actions"
import { PAYMENT_METHOD_LABEL, PAYMENT_STATUS_LABEL } from "@/features/finance/lib/labels"
import { formatCurrency, formatDate } from "@/utils/format"

export interface PaymentRow {
  id: string
  amount: number
  method: string
  status: string
  paidAt: Date
  notes: string | null
  clientId: string
  client: { name: string }
}

const STATUS_BADGE: Record<string, string> = {
  PAID: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  PENDING: "bg-champagne text-champagne-foreground",
  CANCELLED: "bg-muted text-muted-foreground",
  REFUNDED: "bg-destructive/10 text-destructive",
}

export function PaymentsTable({
  payments,
  clients,
}: {
  payments: PaymentRow[]
  clients: { id: string; name: string }[]
}) {
  const router = useRouter()
  const [query, setQuery] = React.useState("")
  const [createOpen, setCreateOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<PaymentRow | null>(null)
  const [deleting, setDeleting] = React.useState<PaymentRow | null>(null)

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return payments
    return payments.filter((p) => p.client.name.toLowerCase().includes(q))
  }, [payments, query])

  async function handleDelete() {
    if (!deleting) return
    const result = await deletePaymentAction(deleting.id)
    if (!result.success) {
      toast.error(result.message)
      return
    }
    toast.success("Pagamento excluído.")
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
            placeholder="Buscar por cliente..."
            className="pl-9"
          />
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" />
          Novo pagamento
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title={query ? "Nenhum pagamento encontrado" : "Nenhum pagamento registrado"}
            description={
              query ? "Tente buscar por outro termo." : "Registre o primeiro pagamento recebido."
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead className="hidden sm:table-cell">Forma</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Data</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.client.name}</TableCell>
                  <TableCell className="hidden text-muted-foreground sm:table-cell">
                    {PAYMENT_METHOD_LABEL[payment.method] ?? payment.method}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={STATUS_BADGE[payment.status] ?? "bg-muted text-muted-foreground"}
                    >
                      {PAYMENT_STATUS_LABEL[payment.status] ?? payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {formatDate(payment.paidAt)}
                  </TableCell>
                  <TableCell className="font-medium text-emerald-600 dark:text-emerald-400">
                    +{formatCurrency(payment.amount)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditing(payment)}>
                          <Pencil className="size-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onClick={() => setDeleting(payment)}>
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

      <PaymentFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        clients={clients}
        onSaved={() => router.refresh()}
      />

      {editing ? (
        <PaymentFormDialog
          open={Boolean(editing)}
          onOpenChange={(open) => !open && setEditing(null)}
          clients={clients}
          paymentId={editing.id}
          defaultValues={{
            clientId: editing.clientId,
            amount: editing.amount,
            method: editing.method as PaymentFormDefaultMethod,
            status: editing.status as PaymentFormDefaultStatus,
            paidAt: new Date(editing.paidAt).toISOString().slice(0, 10),
            notes: editing.notes ?? "",
          }}
          onSaved={() => router.refresh()}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Excluir pagamento?"
        description={`Isso removerá o pagamento de ${deleting?.client.name ?? "cliente"} permanentemente.`}
        onConfirm={handleDelete}
      />
    </div>
  )
}

type PaymentFormDefaultMethod = "CASH" | "CREDIT_CARD" | "DEBIT_CARD" | "PIX" | "BANK_TRANSFER" | "OTHER"
type PaymentFormDefaultStatus = "PENDING" | "PAID" | "CANCELLED" | "REFUNDED"
