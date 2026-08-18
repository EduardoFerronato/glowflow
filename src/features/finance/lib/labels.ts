export const PAYMENT_METHOD_LABEL: Record<string, string> = {
  CASH: "Dinheiro",
  CREDIT_CARD: "Crédito",
  DEBIT_CARD: "Débito",
  PIX: "Pix",
  BANK_TRANSFER: "Transferência",
  OTHER: "Outro",
}

export const paymentMethodValues = [
  "CASH",
  "CREDIT_CARD",
  "DEBIT_CARD",
  "PIX",
  "BANK_TRANSFER",
  "OTHER",
] as const

export const PAYMENT_STATUS_LABEL: Record<string, string> = {
  PENDING: "Pendente",
  PAID: "Pago",
  CANCELLED: "Cancelado",
  REFUNDED: "Estornado",
}

export const paymentStatusValues = ["PENDING", "PAID", "CANCELLED", "REFUNDED"] as const

export const EXPENSE_CATEGORIES = [
  "Aluguel",
  "Fornecedores",
  "Equipamentos",
  "Marketing",
  "Folha de pagamento",
  "Manutenção",
  "Impostos",
  "Outros",
]
