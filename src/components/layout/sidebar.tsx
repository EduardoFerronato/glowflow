"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"

import { Logo } from "@/components/shared/logo"
import { SidebarNav } from "@/components/layout/sidebar-nav"
import { SidebarProfile } from "@/components/layout/sidebar-profile"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarProps {
  clinicName: string
  userName: string
  userEmail: string
  userImage?: string | null
}

export function Sidebar({ clinicName, userName, userEmail, userImage }: SidebarProps) {
  const [collapsed, setCollapsed] = React.useState(false)

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 260 }}
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
      className="sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex"
    >
      <div
        className={cn(
          "flex h-16 items-center px-4",
          collapsed ? "justify-center" : "justify-start"
        )}
      >
        <Logo iconOnly={collapsed} />
      </div>

      <div className="flex-1 overflow-y-auto py-3">
        <SidebarNav collapsed={collapsed} />
      </div>

      <div className="flex flex-col gap-1 border-t border-sidebar-border p-2">
        <SidebarProfile
          clinicName={clinicName}
          userName={userName}
          userEmail={userEmail}
          userImage={userImage}
          collapsed={collapsed}
        />
        <Button
          variant="ghost"
          size="icon"
          className="w-full justify-center text-sidebar-foreground/60 hover:text-sidebar-foreground"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          {collapsed ? (
            <PanelLeftOpen className="size-4" />
          ) : (
            <PanelLeftClose className="size-4" />
          )}
        </Button>
      </div>
    </motion.aside>
  )
}
