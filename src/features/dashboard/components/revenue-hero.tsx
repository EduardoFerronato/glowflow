"use client"

import * as React from "react"

import { PremiumCard, CardContent } from "@/components/shared/premium-card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RevenueAreaChartLazy from "@/features/dashboard/components/revenue-area-chart-lazy"
import { formatCurrency } from "@/utils/format"
import { cn } from "@/lib/utils"

interface MiniStat {
  label: string
  value: string
  trend?: { value: number; positive: boolean }
}

interface RevenueHeroProps {
  monthRevenue: number
  comparisonRevenue: number
  weekly: { label: string; value: number }[]
  monthly: { label: string; value: number }[]
  stats: MiniStat[]
  periodLabel: string
}

export function RevenueHero({
  monthRevenue,
  comparisonRevenue,
  weekly,
  monthly,
  stats,
  periodLabel,
}: RevenueHeroProps) {
  const [range, setRange] = React.useState<"weekly" | "monthly">("weekly")
  const data = range === "weekly" ? weekly : monthly
  const positive = comparisonRevenue >= 0

  return (
    <PremiumCard hover className="overflow-hidden">
      <CardContent className="space-y-8 p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2.5">
            <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Receita · {periodLabel}
            </p>
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="font-display text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
                {formatCurrency(monthRevenue)}
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
                  positive
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                    : "bg-destructive/10 text-destructive"
                )}
              >
                {positive ? "↑" : "↓"} {Math.abs(comparisonRevenue)}% vs. mês anterior
              </span>
            </div>
          </div>

          <Tabs value={range} onValueChange={(v) => setRange(v as "weekly" | "monthly")}>
            <TabsList>
              <TabsTrigger value="weekly">7 dias</TabsTrigger>
              <TabsTrigger value="monthly">6 meses</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <RevenueAreaChartLazy data={data} />

        <div className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-border/60 pt-6 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="space-y-1">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <div className="flex items-baseline gap-1.5">
                <p className="text-lg font-semibold tracking-tight text-foreground">
                  {stat.value}
                </p>
                {stat.trend ? (
                  <span
                    className={cn(
                      "text-xs font-medium",
                      stat.trend.positive
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-destructive"
                    )}
                  >
                    {stat.trend.positive ? "+" : ""}
                    {stat.trend.value}%
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </PremiumCard>
  )
}
