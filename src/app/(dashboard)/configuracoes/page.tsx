import { requireSession } from "@/lib/session"
import { getClinicSettings } from "@/services/settings.service"
import { PageHeader } from "@/components/shared/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GeneralSettingsForm } from "@/features/settings/components/general-settings-form"
import { BusinessHoursForm } from "@/features/settings/components/business-hours-form"
import { AppearanceSettingsForm } from "@/features/settings/components/appearance-settings-form"
import type { BusinessHoursFormInput } from "@/features/settings/schema"

export const metadata = { title: "Configurações" }

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const

export default async function ConfiguracoesPage() {
  const session = await requireSession()
  const settings = await getClinicSettings(session.user.clinicId)

  const businessHours = DAYS.reduce((acc, day) => {
    const range = settings.businessHours[day]
    acc[day] = {
      open: Boolean(range),
      start: range?.[0] ?? "09:00",
      end: range?.[1] ?? "19:00",
    }
    return acc
  }, {} as BusinessHoursFormInput)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurações"
        description="Personalize os dados, horários e cores da sua clínica."
      />

      <Tabs defaultValue="geral">
        <TabsList>
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="horarios">Horário de funcionamento</TabsTrigger>
          <TabsTrigger value="aparencia">Aparência</TabsTrigger>
        </TabsList>

        <TabsContent value="geral">
          <GeneralSettingsForm
            defaultValues={{
              name: settings.name,
              phone: settings.phone ?? "",
              address: settings.address ?? "",
              logo: settings.logo ?? "",
            }}
          />
        </TabsContent>

        <TabsContent value="horarios">
          <BusinessHoursForm defaultValues={businessHours} />
        </TabsContent>

        <TabsContent value="aparencia">
          <AppearanceSettingsForm
            defaultValues={{
              primaryColor: settings.primaryColor,
              secondaryColor: settings.secondaryColor,
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
