"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { navGroups } from "@/components/layout/nav-items"

interface SidebarNavProps {
  collapsed?: boolean
  onNavigate?: () => void
}

export function SidebarNav({ collapsed = false, onNavigate }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-4 px-3">
      {navGroups.map((group) => (
        <div key={group.label} className="flex flex-col gap-0.5">
          {!collapsed ? (
            <p className="px-3 pb-1 text-[11px] font-medium tracking-wide text-sidebar-foreground/40 uppercase">
              {group.label}
            </p>
          ) : null}
          {group.items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                )}
              >
                {active ? (
                  <motion.span
                    layoutId="sidebar-active-indicator"
                    className="absolute top-1.5 bottom-1.5 left-0 w-[3px] rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 38 }}
                  />
                ) : null}
                <Icon
                  className={cn(
                    "size-[1.15rem] shrink-0 transition-colors",
                    active
                      ? "text-primary"
                      : "text-sidebar-foreground/60 group-hover:text-sidebar-accent-foreground"
                  )}
                />
                {!collapsed ? <span className="truncate">{item.label}</span> : null}
              </Link>
            )
          })}
        </div>
      ))}
    </nav>
  )
}
