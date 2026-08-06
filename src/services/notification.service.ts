import "server-only"

import { prisma } from "@/lib/prisma"

export async function listRecentNotifications(clinicId: string, userId: string, limit = 8) {
  return prisma.notification.findMany({
    where: { clinicId, OR: [{ userId }, { userId: null }] },
    orderBy: { createdAt: "desc" },
    take: limit,
  })
}

export async function countUnreadNotifications(clinicId: string, userId: string) {
  return prisma.notification.count({
    where: { clinicId, OR: [{ userId }, { userId: null }], read: false },
  })
}

export async function markNotificationRead(clinicId: string, id: string) {
  return prisma.notification.updateMany({
    where: { id, clinicId },
    data: { read: true },
  })
}

export async function markAllNotificationsRead(clinicId: string, userId: string) {
  return prisma.notification.updateMany({
    where: { clinicId, OR: [{ userId }, { userId: null }], read: false },
    data: { read: true },
  })
}
