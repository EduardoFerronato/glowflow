import "server-only"

import { prisma } from "@/lib/prisma"

export async function listProfessionals(clinicId: string) {
  return prisma.professional.findMany({
    where: { clinicId, active: true },
    orderBy: { name: "asc" },
  })
}
