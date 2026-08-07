"use client"

import * as React from "react"
import { X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

export function TagInput({
  value,
  onChange,
  placeholder = "Adicionar tag e pressionar Enter",
}: {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}) {
  const [draft, setDraft] = React.useState("")

  function addTag() {
    const tag = draft.trim()
    if (!tag || value.includes(tag)) {
      setDraft("")
      return
    }
    onChange([...value, tag])
    setDraft("")
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag))
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {value.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1 pr-1">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="rounded-full p-0.5 hover:bg-foreground/10"
              aria-label={`Remover tag ${tag}`}
            >
              <X className="size-2.5" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault()
            addTag()
          }
        }}
        onBlur={addTag}
        placeholder={placeholder}
      />
    </div>
  )
}
