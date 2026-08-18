"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { formatCurrency } from "@/utils/format"

const chartConfig = {
  revenue: {
    label: "Receita",
    color: "var(--chart-1)",
  },
  expense: {
    label: "Despesa",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export default function CashFlowChart({
  data,
}: {
  data: { label: string; revenue: number; expense: number }[]
}) {
  return (
    <ChartContainer config={chartConfig} className="h-72 w-full">
      <BarChart data={data} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />}
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expense" fill="var(--color-expense)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
