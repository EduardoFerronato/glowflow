import { requireSession } from "@/lib/session"
import { listAllProfessionals } from "@/services/professional.service"
import { PageHeader } from "@/components/shared/page-header"
import { ProfessionalsTable } from "@/features/professionals/components/professionals-table"

export const metadata = { title: "Profissionais" }

export default async function ProfissionaisPage() {
  const session = await requireSession()
  const professionals = await listAllProfessionals(session.user.clinicId)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profissionais"
        description="Gerencie a equipe que atende sua clínica."
      />
      <ProfessionalsTable professionals={professionals} />
    </div>
  )
}
