import { requireSession } from "@/lib/session"
import { listAllProcedures } from "@/services/procedure.service"
import { PageHeader } from "@/components/shared/page-header"
import { ProceduresTable } from "@/features/procedures/components/procedures-table"

export const metadata = { title: "Procedimentos" }

export default async function ProcedimentosPage() {
  const session = await requireSession()
  const procedures = await listAllProcedures(session.user.clinicId)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Procedimentos"
        description="Gerencie os procedimentos oferecidos pela sua clínica."
      />
      <ProceduresTable procedures={procedures} />
    </div>
  )
}
