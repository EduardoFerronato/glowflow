"use server"

import { revalidatePath } from "next/cache"

import { requireSession } from "@/lib/session"
import { markAllNotificationsRead, markNotificationRead } from "@/services/notification.service"

export async function markAllNotificationsReadAction() {
  const session = await requireSession()
  await markAllNotificationsRead(session.user.clinicId, session.user.id)
  revalidatePath("/", "layout")
}

export async function markNotificationReadAction(id: string) {
  const session = await requireSession()
  await markNotificationRead(session.user.clinicId, id)
  revalidatePath("/", "layout")
}
