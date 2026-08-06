export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(
    new Date(date)
  )
}

export function formatTime(date: Date | string) {
  return new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date(date))
}

export function formatDateTime(date: Date | string) {
  return `${formatDate(date)} às ${formatTime(date)}`
}

export function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11)
  if (digits.length <= 10) {
    return digits.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, (_, a, b, c) =>
      c ? `(${a}) ${b}-${c}` : b ? `(${a}) ${b}` : a ? `(${a}` : ""
    )
  }
  return digits.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, (_, a, b, c) =>
    c ? `(${a}) ${b}-${c}` : b ? `(${a}) ${b}` : a ? `(${a}` : ""
  )
}

export function formatCpf(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11)
  return digits.replace(/^(\d{3})(\d{0,3})(\d{0,3})(\d{0,2}).*/, (_, a, b, c, d) => {
    let out = a
    if (b) out += `.${b}`
    if (c) out += `.${c}`
    if (d) out += `-${d}`
    return out
  })
}
