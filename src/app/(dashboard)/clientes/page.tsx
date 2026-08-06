import { requireSession } from "@/lib/session"
import { listClients } from "@/services/client.service"
import { PageHeader } from "@/components/shared/page-header"
import { ClientsTable } from "@/features/clients/components/clients-table"

export const metadata = { title: "Clientes" }

export default async function ClientesPage() {
  const session = await requireSession()
  const clients = await listClients(session.user.clinicId)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clientes"
        description={`${clients.length} clientes cadastrados`}
      />
      <ClientsTable clients={clients} />
    </div>
  )
}
