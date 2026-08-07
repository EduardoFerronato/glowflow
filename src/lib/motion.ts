/**
 * Shared Framer Motion primitives so every animation in the app uses the
 * same easing/duration language instead of ad-hoc values per component.
 */

export const EASE_OUT = [0.16, 1, 0.3, 1] as const

export const SPRING_SNAPPY = { type: "spring", stiffness: 500, damping: 38 } as const
export const SPRING_SOFT = { type: "spring", stiffness: 320, damping: 32 } as const

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.18, ease: EASE_OUT },
}

export const fadeInUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.32, ease: EASE_OUT },
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.97 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.22, ease: EASE_OUT },
}

export function staggerDelay(index: number, step = 0.05) {
  return { delay: index * step }
}
