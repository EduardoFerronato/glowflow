"use client"

import { Building2, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { UploadButton } from "@/lib/uploadthing"
import { cn } from "@/lib/utils"

export function LogoUpload({
  logo,
  onChange,
}: {
  logo?: string
  onChange: (url: string) => void
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex size-16 items-center justify-center overflow-hidden rounded-2xl border border-border bg-accent text-accent-foreground">
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt="Logo da clínica" className="size-full object-cover" />
        ) : (
          <Building2 className="size-6" />
        )}
      </div>
      <UploadButton
        endpoint="clinicLogo"
        onClientUploadComplete={(res) => {
          const url = res?.[0]?.url
          if (url) {
            onChange(url)
            toast.success("Logo enviada!")
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
            isUploading ? <Loader2 className="size-4 animate-spin" /> : "Enviar logo",
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
