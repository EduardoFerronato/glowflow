"use client"

import { Camera, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UploadButton } from "@/lib/uploadthing"
import { cn } from "@/lib/utils"

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("")
}

export function PhotoUpload({
  name,
  photo,
  onChange,
}: {
  name: string
  photo?: string
  onChange: (url: string) => void
}) {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="size-16 border border-border">
        {photo ? <AvatarImage src={photo} alt={name} /> : null}
        <AvatarFallback className="bg-accent text-accent-foreground">
          {name ? initials(name) : <Camera className="size-5" />}
        </AvatarFallback>
      </Avatar>
      <UploadButton
        endpoint="clientPhoto"
        onClientUploadComplete={(res) => {
          const url = res?.[0]?.url
          if (url) {
            onChange(url)
            toast.success("Foto enviada!")
          }
        }}
        onUploadError={(error) => {
          toast.error(
            error.message.includes("token")
              ? "Upload não configurado (defina UPLOADTHING_TOKEN)."
              : `Falha no upload: ${error.message}`
          )
        }}
        content={{
          button: ({ isUploading }) =>
            isUploading ? <Loader2 className="size-4 animate-spin" /> : "Enviar foto",
        }}
        appearance={{
          button: cn(
            "h-9 rounded-lg bg-secondary px-3 text-xs font-medium text-secondary-foreground ut-uploading:opacity-70"
          ),
          allowedContent: "hidden",
        }}
      />
    </div>
  )
}
