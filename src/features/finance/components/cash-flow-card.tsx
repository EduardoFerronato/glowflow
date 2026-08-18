import {
  PremiumCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/shared/premium-card"
import CashFlowChartLazy from "@/features/finance/components/cash-flow-chart-lazy"

export function CashFlowCard({
  data,
}: {
  data: { label: string; revenue: number; expense: number }[]
}) {
  return (
    <PremiumCard hover>
      <CardHeader>
        <CardTitle className="font-display text-lg font-medium">Fluxo de caixa</CardTitle>
        <CardDescription>Receita e despesas nos últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <CashFlowChartLazy data={data} />
      </CardContent>
    </PremiumCard>
  )
}
