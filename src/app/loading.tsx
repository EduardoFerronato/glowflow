import { Logo } from "@/components/shared/logo"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-muted/30">
      <Logo />
      <div className="flex items-center gap-1.5">
        <span className="size-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
        <span className="size-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
        <span className="size-2 animate-bounce rounded-full bg-primary" />
      </div>
    </div>
  )
}
