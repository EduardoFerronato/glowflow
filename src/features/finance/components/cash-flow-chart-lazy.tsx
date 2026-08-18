"use client"

import dynamic from "next/dynamic"

import { Skeleton } from "@/components/ui/skeleton"

const CashFlowChartLazy = dynamic(
  () => import("@/features/finance/components/cash-flow-chart"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-72 w-full rounded-xl" />,
  }
)

export default CashFlowChartLazy
