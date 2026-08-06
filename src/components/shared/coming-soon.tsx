import { Construction } from "lucide-react"

import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"

export function ComingSoon({ title }: { title: string }) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} />
      <EmptyState
        icon={Construction}
        title="Módulo em construção"
        description="Esse módulo chega nas próximas fases do desenvolvimento do GlowFlow."
      />
    </div>
  )
}
