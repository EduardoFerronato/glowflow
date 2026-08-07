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

export interface NavGroup {
  label: string
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    label: "Visão geral",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Agenda", href: "/agenda", icon: CalendarDays },
    ],
  },
  {
    label: "Clientes & equipe",
    items: [
      { label: "Clientes", href: "/clientes", icon: Users },
      { label: "Profissionais", href: "/profissionais", icon: UserRound },
    ],
  },
  {
    label: "Operação",
    items: [
      { label: "Procedimentos", href: "/procedimentos", icon: Sparkles },
      { label: "Financeiro", href: "/financeiro", icon: Wallet },
      { label: "Estoque", href: "/estoque", icon: PackageSearch },
      { label: "Relatórios", href: "/relatorios", icon: BarChart3 },
    ],
  },
  {
    label: "Sistema",
    items: [{ label: "Configurações", href: "/configuracoes", icon: Settings }],
  },
]

export const navItems: NavItem[] = navGroups.flatMap((group) => group.items)
