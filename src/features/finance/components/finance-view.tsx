"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PaymentsTable, type PaymentRow } from "@/features/finance/components/payments-table"
import { ExpensesTable, type ExpenseRow } from "@/features/finance/components/expenses-table"

export function FinanceView({
  payments,
  expenses,
  clients,
}: {
  payments: PaymentRow[]
  expenses: ExpenseRow[]
  clients: { id: string; name: string }[]
}) {
  return (
    <Tabs defaultValue="receitas">
      <TabsList>
        <TabsTrigger value="receitas">Receitas</TabsTrigger>
        <TabsTrigger value="despesas">Despesas</TabsTrigger>
      </TabsList>

      <TabsContent value="receitas">
        <PaymentsTable payments={payments} clients={clients} />
      </TabsContent>

      <TabsContent value="despesas">
        <ExpensesTable expenses={expenses} />
      </TabsContent>
    </Tabs>
  )
}
