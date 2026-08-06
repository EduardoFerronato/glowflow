import {
  LayoutDashboard,
  CalendarDays,
  Users,
  UserRound,
  Sparkles,
  Wallet,
  PackageSearch,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react"

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Agenda", href: "/agenda", icon: CalendarDays },
  { label: "Clientes", href: "/clientes", icon: Users },
  { label: "Profissionais", href: "/profissionais", icon: UserRound },
  { label: "Procedimentos", href: "/procedimentos", icon: Sparkles },
  { label: "Financeiro", href: "/financeiro", icon: Wallet },
  { label: "Estoque", href: "/estoque", icon: PackageSearch },
  { label: "Relatórios", href: "/relatorios", icon: BarChart3 },
  { label: "Configurações", href: "/configuracoes", icon: Settings },
]
