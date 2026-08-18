"use client"

import dynamic from "next/dynamic"

import { Skeleton } from "@/components/ui/skeleton"

const RevenueTrendChartLazy = dynamic(
  () => import("@/features/reports/components/revenue-trend-chart"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-72 w-full rounded-xl" />,
  }
)

export default RevenueTrendChartLazy
