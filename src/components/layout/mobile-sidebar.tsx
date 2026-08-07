"use client"

import * as React from "react"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Logo } from "@/components/shared/logo"
import { SidebarNav } from "@/components/layout/sidebar-nav"
import { SidebarProfile } from "@/components/layout/sidebar-profile"

interface MobileSidebarProps {
  clinicName: string
  userName: string
  userEmail: string
  userImage?: string | null
}

export function MobileSidebar({
  clinicName,
  userName,
  userEmail,
  userImage,
}: MobileSidebarProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menu">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex w-72 flex-col p-0">
        <SheetHeader className="h-16 justify-center border-b border-sidebar-border px-4">
          <SheetTitle asChild>
            <Logo />
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-3">
          <SidebarNav onNavigate={() => setOpen(false)} />
        </div>
        <div className="border-t border-sidebar-border p-2">
          <SidebarProfile
            clinicName={clinicName}
            userName={userName}
            userEmail={userEmail}
            userImage={userImage}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
