"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { LogOut, Settings, UserRound, ChevronsUpDown } from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { authClient } from "@/lib/auth-client"
import { initials } from "@/utils/initials"
import { cn } from "@/lib/utils"

interface SidebarProfileProps {
  clinicName: string
  userName: string
  userEmail: string
  userImage?: string | null
  collapsed?: boolean
  planLabel?: string
}

export function SidebarProfile({
  clinicName,
  userName,
  userEmail,
  userImage,
  collapsed = false,
  planLabel = "Plano Profissional",
}: SidebarProfileProps) {
  const router = useRouter()

  async function handleSignOut() {
    await authClient.signOut()
    toast.success("Sessão encerrada.")
    router.push("/login")
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "group flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-sidebar-accent/60",
            collapsed && "justify-center px-0"
          )}
        >
          <Avatar className="size-8 shrink-0 ring-1 ring-sidebar-border">
            {userImage ? <AvatarImage src={userImage} alt={userName} /> : null}
            <AvatarFallback className="bg-primary text-[11px] text-primary-foreground">
              {initials(clinicName)}
            </AvatarFallback>
          </Avatar>
          {!collapsed ? (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-sidebar-foreground">
                  {clinicName}
                </p>
                <Badge
                  variant="outline"
                  className="mt-0.5 h-4 border-champagne bg-champagne/40 px-1.5 text-[10px] font-medium text-champagne-foreground"
                >
                  {planLabel}
                </Badge>
              </div>
              <ChevronsUpDown className="size-3.5 shrink-0 text-sidebar-foreground/40" />
            </>
          ) : null}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span className="text-sm font-medium">{userName}</span>
          <span className="text-xs font-normal text-muted-foreground">{userEmail}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/perfil">
            <UserRound className="size-4" />
            Perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/configuracoes">
            <Settings className="size-4" />
            Configurações
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
          <LogOut className="size-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
