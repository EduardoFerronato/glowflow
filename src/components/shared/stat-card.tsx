"use client"

import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: string
  icon: React.ReactNode
  trend?: {
    value: string
    positive: boolean
  }
  index?: number
  className?: string
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  index = 0,
  className,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-soft transition-shadow hover:shadow-soft-lg",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
        </div>
        <div className="flex size-9 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-transform group-hover:scale-105 [&_svg]:size-4">
          {icon}
        </div>
      </div>
      {trend ? (
        <p
          className={cn(
            "mt-3 text-xs font-medium",
            trend.positive ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"
          )}
        >
          {trend.positive ? "↑" : "↓"} {trend.value}
        </p>
      ) : null}
    </motion.div>
  )
}
