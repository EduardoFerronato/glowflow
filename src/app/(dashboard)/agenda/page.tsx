import { requireSession } from "@/lib/session"
import { listClients } from "@/services/client.service"
import { listProfessionals } from "@/services/professional.service"
import { listProcedures } from "@/services/procedure.service"
import { listDistinctRooms } from "@/services/appointment.service"
import { PageHeader } from "@/components/shared/page-header"
import { AgendaView } from "@/features/agenda/components/agenda-view"

export const metadata = { title: "Agenda" }

export default async function AgendaPage() {
  const session = await requireSession()
  const clinicId = session.user.clinicId

  const [clients, professionals, procedures, rooms] = await Promise.all([
    listClients(clinicId),
    listProfessionals(clinicId),
    listProcedures(clinicId),
    listDistinctRooms(clinicId),
  ])

  return (
    <div className="space-y-6">
      <PageHeader title="Agenda" description="Gerencie os horários da sua clínica." />
      <AgendaView
        clients={clients}
        professionals={professionals}
        procedures={procedures}
        rooms={rooms}
      />
    </div>
  )
}
