import { Logo } from "@/components/shared/logo"

export function LoginShowcase() {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[oklch(0.32_0.05_35)] via-[oklch(0.24_0.035_35)] to-[oklch(0.15_0.015_40)] p-12 text-primary-foreground lg:flex">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-32 -right-32 size-[420px] rounded-full bg-champagne/25 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 size-80 rounded-full bg-lilac/20 blur-3xl"
        aria-hidden
      />

      <Logo className="relative z-10 [&_span]:text-primary-foreground" />

      <div className="relative z-10 max-w-md space-y-5">
        <p className="text-xs font-medium tracking-[0.2em] text-primary-foreground/55 uppercase">
          GlowFlow
        </p>
        <h1 className="font-display text-4xl leading-[1.15] font-medium tracking-tight text-balance italic">
          Sua clínica, sob controle — do agendamento ao caixa.
        </h1>
        <p className="max-w-sm text-sm leading-relaxed text-primary-foreground/70">
          Agenda, clientes, financeiro e estoque reunidos numa única plataforma,
          pensada para o ritmo de uma clínica de estética.
        </p>
      </div>

      <p className="relative z-10 text-xs text-primary-foreground/45">
        © {new Date().getFullYear()} GlowFlow. Todos os direitos reservados.
      </p>
    </div>
  )
}
