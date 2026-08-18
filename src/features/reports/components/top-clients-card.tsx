import Link from "next/link"
import { Trophy } from "lucide-react"

import {
  PremiumCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/shared/premium-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EmptyState } from "@/components/shared/empty-state"
import { formatCurrency } from "@/utils/format"
import { initials } from "@/utils/initials"

interface TopClientRow {
  id: string
  name: string
  photo: string | null
  total: number
  paymentsCount: number
}

export function TopClientsCard({ clients }: { clients: TopClientRow[] }) {
  return (
    <PremiumCard hover className="h-full">
      <CardHeader>
        <CardTitle className="font-display text-lg font-medium">Melhores clientes</CardTitle>
        <CardDescription>Por valor total pago</CardDescription>
      </CardHeader>
      <CardContent>
        {clients.length === 0 ? (
          <EmptyState
            icon={Trophy}
            title="Nenhum pagamento ainda"
            description="O ranking de clientes aparecerá aqui."
          />
        ) : (
          <ul className="space-y-1">
            {clients.map((client, index) => (
              <li key={client.id}>
                <Link
                  href={`/clientes/${client.id}`}
                  className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted/60"
                >
                  <span className="w-4 shrink-0 text-xs font-medium text-muted-foreground">
                    {index + 1}
                  </span>
                  <Avatar className="size-8">
                    {client.photo ? <AvatarImage src={client.photo} alt={client.name} /> : null}
                    <AvatarFallback className="bg-accent text-[11px] text-accent-foreground">
                      {initials(client.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{client.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {client.paymentsCount} pagamento{client.paymentsCount === 1 ? "" : "s"}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold">
                    {formatCurrency(client.total)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </PremiumCard>
  )
}
