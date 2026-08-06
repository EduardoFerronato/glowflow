import "server-only"

import { prisma } from "@/lib/prisma"

export async function listProcedures(clinicId: string) {
  return prisma.procedure.findMany({
    where: { clinicId, active: true },
    orderBy: { name: "asc" },
  })
}
