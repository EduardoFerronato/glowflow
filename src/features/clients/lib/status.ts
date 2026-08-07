export interface ClientStatusMeta {
  value: "ACTIVE" | "INACTIVE" | "VIP"
  label: string
  badgeClassName: string
}

export const CLIENT_STATUSES: ClientStatusMeta[] = [
  {
    value: "ACTIVE",
    label: "Ativo",
    badgeClassName: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  },
  {
    value: "INACTIVE",
    label: "Inativo",
    badgeClassName: "bg-muted text-muted-foreground",
  },
  {
    value: "VIP",
    label: "VIP",
    badgeClassName: "bg-champagne text-champagne-foreground",
  },
]

export const CLIENT_STATUS_LABEL: Record<string, string> = Object.fromEntries(
  CLIENT_STATUSES.map((s) => [s.value, s.label])
)

export function clientStatusMeta(status: string): ClientStatusMeta {
  return CLIENT_STATUSES.find((s) => s.value === status) ?? CLIENT_STATUSES[0]
}
