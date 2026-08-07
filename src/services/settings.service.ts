import "server-only"

import { prisma } from "@/lib/prisma"

export interface BusinessHours {
  mon: [string, string] | null
  tue: [string, string] | null
  wed: [string, string] | null
  thu: [string, string] | null
  fri: [string, string] | null
  sat: [string, string] | null
  sun: [string, string] | null
}

const DEFAULT_HOURS: BusinessHours = {
  mon: ["09:00", "19:00"],
  tue: ["09:00", "19:00"],
  wed: ["09:00", "19:00"],
  thu: ["09:00", "19:00"],
  fri: ["09:00", "19:00"],
  sat: ["09:00", "13:00"],
  sun: null,
}

export async function getClinicSettings(clinicId: string) {
  const clinic = await prisma.clinic.findUniqueOrThrow({
    where: { id: clinicId },
    include: { settings: true },
  })

  const settings =
    clinic.settings ??
    (await prisma.settings.create({ data: { clinicId } }))

  let businessHours: BusinessHours
  try {
    businessHours = { ...DEFAULT_HOURS, ...JSON.parse(settings.businessHours) }
  } catch {
    businessHours = DEFAULT_HOURS
  }

  return {
    id: clinic.id,
    name: clinic.name,
    phone: clinic.phone,
    address: clinic.address,
    logo: clinic.logo,
    primaryColor: settings.primaryColor,
    secondaryColor: settings.secondaryColor,
    businessHours,
  }
}

export interface ClinicInfoInput {
  name: string
  phone?: string
  address?: string
  logo?: string
}

export async function updateClinicInfo(clinicId: string, data: ClinicInfoInput) {
  return prisma.clinic.update({ where: { id: clinicId }, data })
}

export async function updateBusinessHours(clinicId: string, businessHours: BusinessHours) {
  return prisma.settings.upsert({
    where: { clinicId },
    create: { clinicId, businessHours: JSON.stringify(businessHours) },
    update: { businessHours: JSON.stringify(businessHours) },
  })
}

export interface ColorsInput {
  primaryColor: string
  secondaryColor: string
}

export async function updateColors(clinicId: string, data: ColorsInput) {
  return prisma.settings.upsert({
    where: { clinicId },
    create: { clinicId, ...data },
    update: data,
  })
}
