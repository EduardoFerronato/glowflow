import { Logo } from "@/components/shared/logo"

export function LoginShowcase() {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[oklch(0.17_0.014_40)] via-[oklch(0.13_0.009_40)] to-[oklch(0.09_0.006_40)] p-12 text-white lg:flex">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-32 -right-32 size-[440px] rounded-full bg-[oklch(0.78_0.1_78_/_0.3)] blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-[-4rem] left-[-4rem] size-96 rounded-full bg-[oklch(0.62_0.11_35_/_0.28)] blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-1/3 left-1/4 size-64 rounded-full bg-[oklch(0.55_0.07_300_/_0.16)] blur-[90px]"
        aria-hidden
      />

      <Logo className="relative z-10 [&_span]:text-white" />

      <div className="relative z-10 max-w-md space-y-5">
        <p className="text-xs font-medium tracking-[0.2em] text-white/50 uppercase">
          GlowFlow
        </p>
        <h1 className="font-display text-4xl leading-[1.15] font-medium tracking-tight text-balance text-white italic">
          Sua clínica, sob controle — do agendamento ao caixa.
        </h1>
        <p className="max-w-sm text-sm leading-relaxed text-white/65">
          Agenda, clientes, financeiro e estoque reunidos numa única plataforma,
          pensada para o ritmo de uma clínica de estética.
        </p>
      </div>

      <p className="relative z-10 text-xs text-white/40">
        © {new Date().getFullYear()} GlowFlow. Todos os direitos reservados.
      </p>
    </div>
  )
}
