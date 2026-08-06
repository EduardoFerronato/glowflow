"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Bell, CalendarClock, Cake, PackageX, Wallet, Info } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { markAllNotificationsReadAction, markNotificationReadAction } from "@/features/dashboard/actions"

type NotificationItem = {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt: Date
}

const ICONS: Record<string, React.ElementType> = {
  APPOINTMENT: CalendarClock,
  BIRTHDAY: Cake,
  STOCK: PackageX,
  PAYMENT: Wallet,
  SYSTEM: Info,
}

export function NotificationsMenu({
  notifications,
  unreadCount,
}: {
  notifications: NotificationItem[]
  unreadCount: number
}) {
  const router = useRouter()
  const [pending, startTransition] = React.useTransition()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notificações">
          <Bell className="size-[18px]" />
          {unreadCount > 0 ? (
            <span className="absolute right-1.5 top-1.5 flex size-2 rounded-full bg-primary" />
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-3 py-2.5">
          <p className="text-sm font-medium">Notificações</p>
          {unreadCount > 0 ? (
            <button
              className="text-xs text-primary hover:underline disabled:opacity-50"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  await markAllNotificationsReadAction()
                  router.refresh()
                })
              }
            >
              Marcar todas como lidas
            </button>
          ) : null}
        </div>
        <ScrollArea className="max-h-80">
          {notifications.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              Nenhuma notificação por aqui.
            </p>
          ) : (
            <div className="flex flex-col">
              {notifications.map((n) => {
                const Icon = ICONS[n.type] ?? Info
                return (
                  <button
                    key={n.id}
                    onClick={() =>
                      startTransition(async () => {
                        if (!n.read) await markNotificationReadAction(n.id)
                        router.refresh()
                      })
                    }
                    className={cn(
                      "flex gap-3 border-b px-3 py-3 text-left text-sm transition-colors last:border-b-0 hover:bg-muted/60",
                      !n.read && "bg-accent/40"
                    )}
                  >
                    <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground">{n.title}</p>
                      <p className="line-clamp-2 text-xs text-muted-foreground">{n.message}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground/70">
                        {formatDistanceToNow(n.createdAt, { addSuffix: true, locale: ptBR })}
                      </p>
                    </div>
                    {!n.read ? (
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                    ) : null}
                  </button>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
