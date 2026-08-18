import { Input } from "@/components/ui/input"
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

export function ColorField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : "#000000"}
            onChange={(e) => onChange(e.target.value)}
            className="size-9 shrink-0 cursor-pointer rounded-lg border border-border bg-transparent p-0.5"
            aria-label={label}
          />
          <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="#e11d5f" />
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}
