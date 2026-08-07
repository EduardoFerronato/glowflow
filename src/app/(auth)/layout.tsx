import { Logo } from "@/components/shared/logo"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-primary via-primary to-[oklch(0.4_0.06_35)] p-10 text-primary-foreground lg:flex">
        <div
          className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-champagne/40 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 size-72 rounded-full bg-lilac/30 blur-3xl"
          aria-hidden
        />
        <Logo className="relative z-10 [&_span]:text-primary-foreground" />
        <div className="relative z-10 space-y-4">
          <h2 className="font-display max-w-md text-3xl font-medium leading-tight tracking-tight">
            Gestão completa para sua clínica de estética.
          </h2>
          <p className="max-w-sm text-sm text-primary-foreground/80">
            Agenda, clientes, financeiro e estoque em um só lugar — com a
            experiência premium que sua clínica merece.
          </p>
        </div>
        <p className="relative z-10 text-xs text-primary-foreground/60">
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
