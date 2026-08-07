"use client"

import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"

import { navGroups } from "@/components/layout/nav-items"

export function Breadcrumb() {
  const pathname = usePathname()
  const item = navGroups
    .flatMap((g) => g.items)
    .find((i) => pathname === i.href || pathname.startsWith(`${i.href}/`))

  const isDetail = item && pathname !== item.href

  if (!item) return null

  return (
    <div className="hidden items-center gap-1.5 text-sm sm:flex">
      <span className="text-muted-foreground">{item.label}</span>
      {isDetail ? (
        <>
          <ChevronRight className="size-3.5 text-muted-foreground/50" />
          <span className="font-medium text-foreground">Detalhes</span>
        </>
      ) : null}
    </div>
  )
}
