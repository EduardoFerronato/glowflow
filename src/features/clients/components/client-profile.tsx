"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Phone,
  Mail,
  Cake,
  AtSign,
  IdCard,
  Pencil,
  CalendarClock,
  Receipt,
  Sparkles,
  Clock,
  StickyNote,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmptyState } from "@/components/shared/empty-state"
import { ClientFormDialog } from "@/features/clients/components/client-form-dialog"
import {
  ClientPhotoGallery,
  type ClientPhotoEntry,
} from "@/features/clients/components/client-photo-gallery"
import {
  ClientAttachments,
  type ClientAttachmentEntry,
} from "@/features/clients/components/client-attachments"
import { formatCurrency, formatDate, formatDateTime } from "@/utils/format"
import { initials } from "@/utils/initials"
import { STATUS_LABEL } from "@/features/agenda/lib/status"
import { clientStatusMeta } from "@/features/clients/lib/status"
import { PAYMENT_METHOD_LABEL as METHOD_LABEL } from "@/features/finance/lib/labels"

interface AppointmentEntry {
  id: string
  startTime: Date
  status: string
  notes: string | null
  procedure: { name: string; price: number }
  professional: { name: string }
}
interface PaymentEntry {
  id: string
  amount: number
  method: string
  paidAt: Date
}

export interface ClientProfileData {
  id: string
  name: string
  phone: string | null
  whatsapp: string | null
  email: string | null
  birthDate: Date | null
  cpf: string | null
  instagram: string | null
  notes: string | null
  photo: string | null
  status: string
  tags: string[]
  createdAt: Date
  appointments: AppointmentEntry[]
  payments: PaymentEntry[]
  photos: ClientPhotoEntry[]
  attachments: ClientAttachmentEntry[]
}

export function ClientProfile({ client }: { client: ClientProfileData }) {
  const router = useRouter()
  const [editOpen, setEditOpen] = React.useState(false)

  const totalSpent = client.payments.reduce((sum, p) => sum + p.amount, 0)
  const completedCount = client.appointments.filter((a) => a.status === "COMPLETED").length

  const procedureStats = React.useMemo(() => {
    const map = new Map<string, { count: number; total: number }>()
    for (const appt of client.appointments) {
      const key = appt.procedure.name
      const entry = map.get(key) ?? { count: 0, total: 0 }
      entry.count += 1
      if (appt.status === "COMPLETED") entry.total += appt.procedure.price
      map.set(key, entry)
    }
    return Array.from(map.entries()).map(([name, stats]) => ({ name, ...stats }))
  }, [client.appointments])

  type TimelineEvent = {
    id: string
    date: Date
    icon: React.ReactNode
    label: string
    detail: string
  }

  const timeline: TimelineEvent[] = React.useMemo(() => {
    const events: TimelineEvent[] = [
      {
        id: `created-${client.id}`,
        date: client.createdAt,
        icon: <Sparkles className="size-3.5" />,
        label: "Cliente cadastrado",
        detail: "Início do relacionamento com a clínica",
      },
      ...client.appointments.map((a) => ({
        id: `appt-${a.id}`,
        date: a.startTime,
        icon: <CalendarClock className="size-3.5" />,
        label: `${a.procedure.name} · ${STATUS_LABEL[a.status] ?? a.status}`,
        detail: `com ${a.professional.name}`,
      })),
      ...client.payments.map((p) => ({
        id: `pay-${p.id}`,
        date: p.paidAt,
        icon: <Receipt className="size-3.5" />,
        label: `Pagamento de ${formatCurrency(p.amount)}`,
        detail: METHOD_LABEL[p.method] ?? p.method,
      })),
    ]
    return events.sort((a, b) => b.date.getTime() - a.date.getTime())
  }, [client])

  return (
    <div className="space-y-6">
      <Card className="border-border/70 shadow-soft">
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="size-16 border border-border">
              {client.photo ? <AvatarImage src={client.photo} alt={client.name} /> : null}
              <AvatarFallback className="bg-primary text-lg text-primary-foreground">
                {initials(client.name)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold">{client.name}</h2>
                <Badge
                  variant="secondary"
                  className={clientStatusMeta(client.status).badgeClassName}
                >
                  {clientStatusMeta(client.status).label}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                {client.phone ? (
                  <span className="flex items-center gap-1">
                    <Phone className="size-3.5" /> {client.phone}
                  </span>
                ) : null}
                {client.email ? (
                  <span className="flex items-center gap-1">
                    <Mail className="size-3.5" /> {client.email}
                  </span>
                ) : null}
                {client.birthDate ? (
                  <span className="flex items-center gap-1">
                    <Cake className="size-3.5" /> {formatDate(client.birthDate)}
                  </span>
                ) : null}
              </div>
              {client.tags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {client.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="font-normal">
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Total gasto</p>
              <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(totalSpent)}
              </p>
            </div>
            <Button variant="outline" onClick={() => setEditOpen(true)}>
              <Pencil className="size-4" />
              Editar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="dados">
        <TabsList className="flex-wrap">
          <TabsTrigger value="dados">Dados</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
          <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
          <TabsTrigger value="fotos">Fotos</TabsTrigger>
          <TabsTrigger value="anexos">Anexos</TabsTrigger>
          <TabsTrigger value="procedimentos">Procedimentos</TabsTrigger>
          <TabsTrigger value="timeline">Linha do tempo</TabsTrigger>
          <TabsTrigger value="observacoes">Observações</TabsTrigger>
        </TabsList>

        <TabsContent value="dados">
          <Card className="border-border/70 shadow-soft">
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoRow icon={Phone} label="Telefone" value={client.phone} />
              <InfoRow icon={Phone} label="WhatsApp" value={client.whatsapp} />
              <InfoRow icon={Mail} label="E-mail" value={client.email} />
              <InfoRow
                icon={Cake}
                label="Nascimento"
                value={client.birthDate ? formatDate(client.birthDate) : null}
              />
              <InfoRow icon={IdCard} label="CPF" value={client.cpf} />
              <InfoRow icon={AtSign} label="Instagram" value={client.instagram} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historico">
          <Card className="border-border/70 shadow-soft">
            <CardContent>
              {client.appointments.length === 0 ? (
                <EmptyState
                  icon={CalendarClock}
                  title="Sem histórico"
                  description="Os agendamentos deste cliente aparecerão aqui."
                />
              ) : (
                <ul className="divide-y divide-border/60">
                  {client.appointments.map((a) => (
                    <li key={a.id} className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium">{a.procedure.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {a.professional.name} · {formatDateTime(a.startTime)}
                        </p>
                      </div>
                      <Badge variant="secondary">{STATUS_LABEL[a.status] ?? a.status}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pagamentos">
          <Card className="border-border/70 shadow-soft">
            <CardContent>
              {client.payments.length === 0 ? (
                <EmptyState
                  icon={Receipt}
                  title="Sem pagamentos"
                  description="Os pagamentos deste cliente aparecerão aqui."
                />
              ) : (
                <ul className="divide-y divide-border/60">
                  {client.payments.map((p) => (
                    <li key={p.id} className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium">{METHOD_LABEL[p.method] ?? p.method}</p>
                        <p className="text-xs text-muted-foreground">{formatDateTime(p.paidAt)}</p>
                      </div>
                      <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        +{formatCurrency(p.amount)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fotos">
          <Card className="border-border/70 shadow-soft">
            <CardContent>
              <ClientPhotoGallery clientId={client.id} photos={client.photos} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="anexos">
          <Card className="border-border/70 shadow-soft">
            <CardContent>
              <ClientAttachments clientId={client.id} attachments={client.attachments} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="procedimentos">
          <Card className="border-border/70 shadow-soft">
            <CardContent>
              {procedureStats.length === 0 ? (
                <EmptyState
                  icon={Sparkles}
                  title="Nenhum procedimento"
                  description="Os procedimentos realizados aparecerão aqui."
                />
              ) : (
                <ul className="divide-y divide-border/60">
                  {procedureStats.map((p) => (
                    <li key={p.name} className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.count}x realizado</p>
                      </div>
                      <p className="text-sm font-semibold">{formatCurrency(p.total)}</p>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-3 text-xs text-muted-foreground">
                {completedCount} procedimento(s) concluído(s) no total.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card className="border-border/70 shadow-soft">
            <CardContent>
              {timeline.length === 0 ? (
                <EmptyState icon={Clock} title="Sem atividade" description="A linha do tempo aparecerá aqui." />
              ) : (
                <ol className="relative space-y-5 border-l border-border/60 pl-5">
                  {timeline.map((event) => (
                    <li key={event.id} className="relative">
                      <span className="absolute -left-[27px] flex size-5 items-center justify-center rounded-full bg-accent text-accent-foreground ring-4 ring-card">
                        {event.icon}
                      </span>
                      <p className="text-sm font-medium">{event.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {event.detail} · {formatDateTime(event.date)}
                      </p>
                    </li>
                  ))}
                </ol>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="observacoes">
          <Card className="border-border/70 shadow-soft">
            <CardContent>
              {client.notes ? (
                <p className="whitespace-pre-wrap text-sm text-foreground">{client.notes}</p>
              ) : (
                <EmptyState
                  icon={StickyNote}
                  title="Nenhuma observação"
                  description="Clique em editar para adicionar observações sobre este cliente."
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ClientFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        clientId={client.id}
        defaultValues={{
          name: client.name,
          phone: client.phone ?? "",
          whatsapp: client.whatsapp ?? "",
          email: client.email ?? "",
          birthDate: client.birthDate ? new Date(client.birthDate).toISOString().slice(0, 10) : "",
          cpf: client.cpf ?? "",
          instagram: client.instagram ?? "",
          notes: client.notes ?? "",
          photo: client.photo ?? "",
          status: client.status as "ACTIVE" | "INACTIVE" | "VIP",
          tags: client.tags,
        }}
        onSaved={() => router.refresh()}
      />
    </div>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string | null
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
        <Icon className="size-4" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value || "—"}</p>
      </div>
    </div>
  )
}
