import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  iconOnly?: boolean
  size?: number
}

export function Logo({ className, iconOnly = false, size = 28 }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="glowflow-mark" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#f472a0" />
            <stop offset="1" stopColor="#e11d5f" />
          </linearGradient>
        </defs>
        <path
          d="M20 2C20 2 8 14.5 8 23a12 12 0 0 0 24 0C32 14.5 20 2 20 2Z"
          fill="url(#glowflow-mark)"
        />
        <path
          d="M20 12c0 4.5-6 8-6 13.5a6 6 0 0 0 12 0c0-5.5-6-9-6-13.5Z"
          fill="white"
          fillOpacity="0.55"
        />
      </svg>
      {!iconOnly ? (
        <span className="text-lg font-semibold tracking-tight text-foreground">
          GlowFlow
        </span>
      ) : null}
    </div>
  )
}
