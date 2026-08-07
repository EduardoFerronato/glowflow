import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card"

interface PremiumCardProps extends React.ComponentProps<typeof Card> {
  hover?: boolean
}

/**
 * Standard elevated surface for the app: soft shadow + generous radius.
 * Replaces the `border-border/70 shadow-soft rounded-2xl` className that used
 * to be repeated by hand across ~17 files.
 */
export function PremiumCard({ className, hover = false, ...props }: PremiumCardProps) {
  return (
    <Card
      className={cn(
        "rounded-2xl shadow-soft",
        hover && "transition-shadow duration-300 hover:shadow-soft-lg",
        className
      )}
      {...props}
    />
  )
}
