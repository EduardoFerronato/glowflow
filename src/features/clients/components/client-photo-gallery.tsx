"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ImageIcon, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/shared/empty-state"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UploadButton } from "@/lib/uploadthing"
import { addClientPhotoAction, deleteClientPhotoAction } from "@/features/clients/actions"
import { formatDate } from "@/utils/format"

const CATEGORY_LABEL: Record<string, string> = {
  BEFORE: "Antes",
  AFTER: "Depois",
  GENERAL: "Geral",
}

export interface ClientPhotoEntry {
  id: string
  url: string
  category: string
  takenAt: Date
}

export function ClientPhotoGallery({
  clientId,
  photos,
}: {
  clientId: string
  photos: ClientPhotoEntry[]
}) {
  const router = useRouter()
  const [uploadCategory, setUploadCategory] = React.useState<"BEFORE" | "AFTER" | "GENERAL">(
    "GENERAL"
  )
  const [filter, setFilter] = React.useState<"ALL" | "BEFORE" | "AFTER" | "GENERAL">("ALL")
  const [deleting, setDeleting] = React.useState<string | null>(null)

  const filtered = filter === "ALL" ? photos : photos.filter((p) => p.category === filter)

  async function handleDelete() {
    if (!deleting) return
    const result = await deleteClientPhotoAction(clientId, deleting)
    if (!result.success) {
      toast.error(result.message)
      return
    }
    toast.success("Foto removida.")
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {(["ALL", "BEFORE", "AFTER", "GENERAL"] as const).map((value) => (
            <Button
              key={value}
              type="button"
              size="sm"
              variant={filter === value ? "secondary" : "ghost"}
              onClick={() => setFilter(value)}
            >
              {value === "ALL" ? "Todas" : CATEGORY_LABEL[value]}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={uploadCategory}
            onValueChange={(value) => setUploadCategory(value as typeof uploadCategory)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BEFORE">Antes</SelectItem>
              <SelectItem value="AFTER">Depois</SelectItem>
              <SelectItem value="GENERAL">Geral</SelectItem>
            </SelectContent>
          </Select>
          <UploadButton
            endpoint="clientGalleryPhoto"
            onClientUploadComplete={async (res) => {
              const url = res?.[0]?.url
              if (!url) return
              const result = await addClientPhotoAction(clientId, {
                url,
                category: uploadCategory,
              })
              if (!result.success) {
                toast.error(result.message)
                return
              }
              toast.success("Foto adicionada!")
              router.refresh()
            }}
            onUploadError={(error) => {
              toast.error(
                error.message.includes("token")
                  ? "Upload não configurado (defina UPLOADTHING_TOKEN)."
                  : `Falha no upload: ${error.message}`
              )
            }}
            content={{
              button: ({ isUploading }) => (isUploading ? "Enviando..." : "Adicionar foto"),
            }}
            appearance={{
              button:
                "h-9 rounded-lg bg-secondary px-3 text-xs font-medium text-secondary-foreground ut-uploading:opacity-70",
              allowedContent: "hidden",
            }}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="Nenhuma foto"
          description="Adicione fotos de antes/depois ou fotos gerais do cliente."
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((photo) => (
            <div
              key={photo.id}
              className="group relative overflow-hidden rounded-xl border border-border/70"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.url} alt="" className="aspect-square w-full object-cover" />
              <div className="absolute inset-x-0 top-0 flex items-center justify-between p-2">
                <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                  {CATEGORY_LABEL[photo.category] ?? photo.category}
                </Badge>
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="size-7 bg-background/80 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
                  onClick={() => setDeleting(photo.id)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
              <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 text-[11px] text-white">
                {formatDate(photo.takenAt)}
              </p>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Remover foto?"
        description="Essa ação não pode ser desfeita."
        onConfirm={handleDelete}
      />
    </div>
  )
}
