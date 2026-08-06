import { Logo } from "@/components/shared/logo"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-primary via-[#c2185b] to-[#7c1d3f] p-10 text-white lg:flex">
        <div
          className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-white/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 size-72 rounded-full bg-white/10 blur-3xl"
          aria-hidden
        />
        <Logo className="relative z-10 [&_span]:text-white" />
        <div className="relative z-10 space-y-4">
          <h2 className="max-w-md text-3xl font-semibold leading-tight tracking-tight">
            Gestão completa para sua clínica de estética.
          </h2>
          <p className="max-w-sm text-sm text-white/80">
            Agenda, clientes, financeiro e estoque em um só lugar — com a
            experiência premium que sua clínica merece.
          </p>
        </div>
        <p className="relative z-10 text-xs text-white/60">
          © {new Date().getFullYear()} GlowFlow. Todos os direitos reservados.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center gap-8 px-6 py-12">
        <div className="w-full max-w-sm lg:hidden">
          <Logo />
        </div>
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  )
}
