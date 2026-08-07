import { z } from "zod"

export const clinicInfoSchema = z.object({
  name: z.string().min(2, "Informe o nome da clínica."),
  phone: z.string().optional(),
  address: z.string().optional(),
  logo: z.string().optional(),
})
export type ClinicInfoFormInput = z.infer<typeof clinicInfoSchema>

const dayRange = z
  .object({
    open: z.boolean(),
    start: z.string(),
    end: z.string(),
  })
  .refine((d) => !d.open || d.start < d.end, {
    message: "Horário final deve ser após o inicial.",
    path: ["end"],
  })

export const businessHoursSchema = z.object({
  mon: dayRange,
  tue: dayRange,
  wed: dayRange,
  thu: dayRange,
  fri: dayRange,
  sat: dayRange,
  sun: dayRange,
})
export type BusinessHoursFormInput = z.infer<typeof businessHoursSchema>

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Cor inválida.")

export const colorsSchema = z.object({
  primaryColor: hexColor,
  secondaryColor: hexColor,
})
export type ColorsFormInput = z.infer<typeof colorsSchema>
