import { MobileSidebar } from "@/components/layout/mobile-sidebar"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { GlobalSearch } from "@/components/layout/global-search"
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
    <header className="glass sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/70 px-4 lg:px-6">
      <MobileSidebar
        clinicName={clinicName}
        userName={user.name}
        userEmail={user.email}
        userImage={user.image}
      />

      <Breadcrumb />

      <div className="ml-auto flex flex-1 justify-end md:flex-none">
        <GlobalSearch />
      </div>

      <div className="flex items-center gap-1 md:ml-3">
        <NotificationsMenu notifications={notifications} unreadCount={unreadCount} />
        <ThemeToggle />
        <UserMenu name={user.name} email={user.email} image={user.image} />
      </div>
    </header>
  )
}
