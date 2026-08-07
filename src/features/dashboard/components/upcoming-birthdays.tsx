import Link from "next/link"
import { Cake } from "lucide-react"

import {
  PremiumCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/shared/premium-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/shared/empty-state"
import { initials } from "@/utils/initials"

interface BirthdayRow {
  id: string
  name: string
  photo: string | null
  daysUntil: number
}

function daysLabel(days: number) {
  if (days === 0) return "Hoje"
  if (days === 1) return "Amanhã"
  return `em ${days} dias`
}

export function UpcomingBirthdays({ clients }: { clients: BirthdayRow[] }) {
  return (
    <PremiumCard hover className="h-full">
      <CardHeader>
        <CardTitle className="font-display text-lg font-medium">Aniversariantes</CardTitle>
        <CardDescription>Próximos 31 dias</CardDescription>
      </CardHeader>
      <CardContent>
        {clients.length === 0 ? (
          <EmptyState
            icon={Cake}
            title="Nenhum aniversário próximo"
            description="Aniversariantes do mês aparecerão aqui."
          />
        ) : (
          <ul className="space-y-1">
            {clients.map((client) => (
              <li key={client.id}>
                <Link
                  href={`/clientes/${client.id}`}
                  className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted/60"
                >
                  <Avatar className="size-8">
                    {client.photo ? <AvatarImage src={client.photo} alt={client.name} /> : null}
                    <AvatarFallback className="bg-accent text-[11px] text-accent-foreground">
                      {initials(client.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="flex-1 truncate text-sm font-medium">{client.name}</span>
                  <Badge
                    variant="outline"
                    className="border-champagne bg-champagne/40 text-[10px] text-champagne-foreground"
                  >
                    {daysLabel(client.daysUntil)}
                  </Badge>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </PremiumCard>
  )
}
