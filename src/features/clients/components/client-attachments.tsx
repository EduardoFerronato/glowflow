"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Paperclip, Trash2, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/empty-state"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { UploadButton } from "@/lib/uploadthing"
import { addClientAttachmentAction, deleteClientAttachmentAction } from "@/features/clients/actions"
import { formatDate } from "@/utils/format"

export interface ClientAttachmentEntry {
  id: string
  name: string
  url: string
  size: number | null
  createdAt: Date
}

function formatSize(bytes: number | null) {
  if (!bytes) return ""
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function ClientAttachments({
  clientId,
  attachments,
}: {
  clientId: string
  attachments: ClientAttachmentEntry[]
}) {
  const router = useRouter()
  const [deleting, setDeleting] = React.useState<string | null>(null)

  async function handleDelete() {
    if (!deleting) return
    const result = await deleteClientAttachmentAction(clientId, deleting)
    if (!result.success) {
      toast.error(result.message)
      return
    }
    toast.success("Anexo removido.")
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <UploadButton
          endpoint="clientAttachment"
          onClientUploadComplete={async (res) => {
            const file = res?.[0]
            if (!file) return
            const result = await addClientAttachmentAction(clientId, {
              name: file.name,
              url: file.url,
              fileType: file.type,
              size: file.size,
            })
            if (!result.success) {
              toast.error(result.message)
              return
            }
            toast.success("Anexo adicionado!")
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
            button: ({ isUploading }) => (isUploading ? "Enviando..." : "Adicionar anexo"),
          }}
          appearance={{
            button:
              "h-9 rounded-lg bg-secondary px-3 text-xs font-medium text-secondary-foreground ut-uploading:opacity-70",
            allowedContent: "hidden",
          }}
        />
      </div>

      {attachments.length === 0 ? (
        <EmptyState
          icon={Paperclip}
          title="Nenhum anexo"
          description="Adicione documentos, exames ou termos assinados."
        />
      ) : (
        <ul className="divide-y divide-border/60">
          {attachments.map((file) => (
            <li key={file.id} className="flex items-center justify-between gap-3 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Paperclip className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(file.createdAt)}
                    {file.size ? ` · ${formatSize(file.size)}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button asChild size="icon" variant="ghost">
                  <a href={file.url} target="_blank" rel="noopener noreferrer" download>
                    <Download className="size-4" />
                  </a>
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => setDeleting(file.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Remover anexo?"
        description="Essa ação não pode ser desfeita."
        onConfirm={handleDelete}
      />
    </div>
  )
}
