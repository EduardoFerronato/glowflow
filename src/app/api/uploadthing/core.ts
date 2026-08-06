import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"

import { getSession } from "@/lib/session"

const f = createUploadthing()

export const ourFileRouter = {
  clientPhoto: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await getSession()
      if (!session) throw new UploadThingError("Não autenticado.")
      return { clinicId: session.user.clinicId }
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl }
    }),

  clinicLogo: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await getSession()
      if (!session) throw new UploadThingError("Não autenticado.")
      return { clinicId: session.user.clinicId }
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
