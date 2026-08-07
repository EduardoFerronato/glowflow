"use client"

import * as React from "react"

import {
  PremiumCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/shared/premium-card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RevenueAreaChartLazy from "@/features/dashboard/components/revenue-area-chart-lazy"

interface RevenueChartProps {
  weekly: { label: string; value: number }[]
  monthly: { label: string; value: number }[]
}

export function RevenueChart({ weekly, monthly }: RevenueChartProps) {
  const [range, setRange] = React.useState<"weekly" | "monthly">("weekly")
  const data = range === "weekly" ? weekly : monthly

  return (
    <PremiumCard hover>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle className="font-display text-lg font-medium">Receita</CardTitle>
          <CardDescription>
            {range === "weekly" ? "Últimos 7 dias" : "Últimos 6 meses"}
          </CardDescription>
        </div>
        <Tabs value={range} onValueChange={(v) => setRange(v as "weekly" | "monthly")}>
          <TabsList>
            <TabsTrigger value="weekly">Semanal</TabsTrigger>
            <TabsTrigger value="monthly">Mensal</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <RevenueAreaChartLazy data={data} />
      </CardContent>
    </PremiumCard>
  )
}
