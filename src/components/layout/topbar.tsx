import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { MobileSidebar } from "@/components/layout/mobile-sidebar"
import { NotificationsMenu } from "@/components/layout/notifications-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserMenu } from "@/components/layout/user-menu"
import { listRecentNotifications, countUnreadNotifications } from "@/services/notification.service"

interface TopbarProps {
  clinicName: string
  user: { id: string; name: string; email: string; image?: string | null; clinicId: string }
}

export async function Topbar({ clinicName, user }: TopbarProps) {
  const [notifications, unreadCount] = await Promise.all([
    listRecentNotifications(user.clinicId, user.id),
    countUnreadNotifications(user.clinicId, user.id),
  ])

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/70 bg-background/80 px-4 backdrop-blur supports-backdrop-filter:bg-background/60 lg:px-6">
      <MobileSidebar />

      <div className="hidden flex-col sm:flex">
        <p className="text-sm font-medium leading-tight">{clinicName}</p>
        <p className="text-xs text-muted-foreground leading-tight">Painel de gestão</p>
      </div>

      <div className="relative ml-auto hidden max-w-xs flex-1 md:block">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar clientes, agendamentos..." className="pl-9" />
      </div>

      <div className="ml-auto flex items-center gap-1 md:ml-3">
        <NotificationsMenu notifications={notifications} unreadCount={unreadCount} />
        <ThemeToggle />
        <UserMenu name={user.name} email={user.email} image={user.image} />
      </div>
    </header>
  )
}
