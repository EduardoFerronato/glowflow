import { redirect } from "next/navigation"

import { getSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { PageTransition } from "@/components/layout/page-transition"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect("/login")

  const clinic = await prisma.clinic.findUnique({
    where: { id: session.user.clinicId },
    select: { name: true },
  })

  return (
    <div className="flex min-h-screen w-full bg-muted/30">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar
          clinicName={clinic?.name ?? "GlowFlow"}
          user={{
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
            clinicId: session.user.clinicId,
          }}
        />
        <main className="flex-1 px-4 py-6 lg:px-6 lg:py-8">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  )
}
