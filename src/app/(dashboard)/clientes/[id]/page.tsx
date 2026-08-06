import { notFound } from "next/navigation"

import { requireSession } from "@/lib/session"
import { getClientProfile } from "@/services/client.service"
import { PageHeader } from "@/components/shared/page-header"
import { ClientProfile } from "@/features/clients/components/client-profile"

export const metadata = { title: "Perfil do cliente" }

export default async function ClientProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await requireSession()
  const client = await getClientProfile(session.user.clinicId, id)

  if (!client) notFound()

  return (
    <div className="space-y-6">
      <PageHeader title={client.name} description="Perfil completo do cliente" />
      <ClientProfile client={client} />
    </div>
  )
}
