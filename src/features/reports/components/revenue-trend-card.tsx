import {
  PremiumCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/shared/premium-card"
import RevenueTrendChartLazy from "@/features/reports/components/revenue-trend-chart-lazy"

export function RevenueTrendCard({ data }: { data: { label: string; value: number }[] }) {
  return (
    <PremiumCard hover>
      <CardHeader>
        <CardTitle className="font-display text-lg font-medium">Receita ao longo do tempo</CardTitle>
        <CardDescription>Últimos 12 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <RevenueTrendChartLazy data={data} />
      </CardContent>
    </PremiumCard>
  )
}
