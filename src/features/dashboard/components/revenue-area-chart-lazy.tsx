"use client"

import dynamic from "next/dynamic"

import { Skeleton } from "@/components/ui/skeleton"

const RevenueAreaChartLazy = dynamic(
  () => import("@/features/dashboard/components/revenue-area-chart"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-72 w-full rounded-xl" />,
  }
)

export default RevenueAreaChartLazy
