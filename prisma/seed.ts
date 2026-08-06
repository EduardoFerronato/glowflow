import "dotenv/config"

import { prisma } from "../src/lib/prisma"
import { auth } from "../src/lib/auth"
import {
  AppointmentStatus,
  PaymentMethod,
  StockMovementType,
  NotificationType,
  ReminderType,
} from "../src/generated/prisma/enums"

const OWNER_EMAIL = "demo@glowflow.app"
const OWNER_PASSWORD = "glowflow123"

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function daysFromNow(days: number, hour = 9, minute = 0) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  d.setHours(hour, minute, 0, 0)
  return d
}

const FIRST_NAMES = [
  "Ana", "Beatriz", "Camila", "Daniela", "Fernanda", "Gabriela", "Helena",
  "Isabela", "Juliana", "Larissa", "Mariana", "Natália", "Patrícia", "Rafaela",
  "Sofia", "Tatiana", "Valentina", "Bianca", "Carolina", "Débora", "Eduarda",
  "Flávia", "Giovanna", "Letícia", "Vitória", "Amanda", "Bruna", "Cecília",
  "Luana", "Priscila",
]
const LAST_NAMES = [
  "Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves",
  "Pereira", "Lima", "Gomes", "Costa", "Ribeiro", "Martins", "Carvalho",
  "Almeida", "Barbosa", "Nascimento", "Araújo", "Cardoso", "Correia",
]

async function main() {
  const existing = await prisma.clinic.findFirst({ where: { name: "GlowFlow Estética" } })
  if (existing) {
    console.log("Seed já aplicado. Pulando (apague dev.db para re-semear do zero).")
    return
  }

  console.log("Criando clínica e configurações...")
  const clinic = await prisma.clinic.create({
    data: {
      name: "GlowFlow Estética",
      phone: "(11) 98765-4321",
      address: "Av. Paulista, 1000 — São Paulo, SP",
      settings: {
        create: {
          primaryColor: "#e11d5f",
          secondaryColor: "#f5a3bd",
        },
      },
    },
  })

  console.log("Criando usuário administrador (login de demonstração)...")
  const signUp = await auth.api.signUpEmail({
    body: {
      name: "Camila Andrade",
      email: OWNER_EMAIL,
      password: OWNER_PASSWORD,
      clinicId: clinic.id,
      role: "OWNER",
    } as never,
  })
  const ownerUserId = signUp.user.id

  console.log("Criando profissionais...")
  const professionalNames = [
    { name: "Camila Andrade", specialty: "Dermatologista Esteticista", color: "#e11d5f", userId: ownerUserId },
    { name: "Rodrigo Nunes", specialty: "Esteticista Corporal", color: "#c2410c" },
    { name: "Juliana Prado", specialty: "Especialista em Skincare", color: "#7c3aed" },
    { name: "Marina Torres", specialty: "Micropigmentadora", color: "#0891b2" },
  ]
  const professionals = []
  for (const p of professionalNames) {
    professionals.push(
      await prisma.professional.create({
        data: {
          clinicId: clinic.id,
          name: p.name,
          specialty: p.specialty,
          color: p.color,
          userId: p.userId,
          email: `${p.name.toLowerCase().split(" ")[0]}@glowflow.app`,
        },
      })
    )
  }

  console.log("Criando procedimentos...")
  const procedureData = [
    { name: "Limpeza de Pele Profunda", price: 180, duration: 60, category: "Facial", color: "#e11d5f" },
    { name: "Peeling Químico", price: 250, duration: 45, category: "Facial", color: "#db2777" },
    { name: "Botox", price: 890, duration: 30, category: "Facial", color: "#a21caf" },
    { name: "Preenchimento Labial", price: 1200, duration: 45, category: "Facial", color: "#9333ea" },
    { name: "Drenagem Linfática", price: 150, duration: 60, category: "Corporal", color: "#c2410c" },
    { name: "Massagem Modeladora", price: 170, duration: 60, category: "Corporal", color: "#ea580c" },
    { name: "Radiofrequência Corporal", price: 220, duration: 50, category: "Corporal", color: "#d97706" },
    { name: "Micropigmentação de Sobrancelha", price: 450, duration: 90, category: "Micropigmentação", color: "#0891b2" },
    { name: "Design de Sobrancelha", price: 80, duration: 30, category: "Sobrancelhas", color: "#0e7490" },
    { name: "Hidratação Capilar", price: 130, duration: 45, category: "Capilar", color: "#059669" },
  ]
  const procedures = []
  for (const p of procedureData) {
    procedures.push(await prisma.procedure.create({ data: { ...p, clinicId: clinic.id } }))
  }

  console.log("Criando clientes...")
  const clients = []
  for (let i = 0; i < 32; i++) {
    const first = pick(FIRST_NAMES)
    const last = pick(LAST_NAMES)
    const birth = new Date(
      randomInt(1970, 2004),
      randomInt(0, 11),
      randomInt(1, 28)
    )
    const ddd = pick(["11", "21", "31", "41", "51"])
    const phone = `(${ddd}) 9${randomInt(1000, 9999)}-${randomInt(1000, 9999)}`
    clients.push(
      await prisma.client.create({
        data: {
          clinicId: clinic.id,
          name: `${first} ${last}`,
          phone,
          whatsapp: phone,
          email: `${first.toLowerCase()}.${last.toLowerCase()}@email.com`,
          birthDate: birth,
          cpf: `${randomInt(100, 999)}.${randomInt(100, 999)}.${randomInt(100, 999)}-${randomInt(10, 99)}`,
          instagram: `@${first.toLowerCase()}${last.toLowerCase()}`,
          notes: pick([
            "Pele sensível, evitar ácidos fortes.",
            "Prefere horários pela manhã.",
            "Cliente fidelizada, indicou 3 amigas.",
            null,
            null,
          ]),
        },
      })
    )
  }

  console.log("Criando agendamentos e pagamentos...")
  const appointmentStatuses = [
    AppointmentStatus.COMPLETED,
    AppointmentStatus.CONFIRMED,
    AppointmentStatus.SCHEDULED,
    AppointmentStatus.CANCELLED,
  ]
  let completedCount = 0
  let paymentsCreated = 0

  for (let dayOffset = -30; dayOffset <= 14; dayOffset++) {
    const appointmentsToday = dayOffset < 0 || dayOffset === 0 ? randomInt(1, 4) : randomInt(0, 3)
    for (let i = 0; i < appointmentsToday; i++) {
      const client = pick(clients)
      const professional = pick(professionals)
      const procedure = pick(procedures)
      const hour = randomInt(9, 18)
      const start = daysFromNow(dayOffset, hour, pick([0, 15, 30, 45]))
      const end = new Date(start.getTime() + procedure.duration * 60000)

      let status: AppointmentStatus
      if (dayOffset < 0) {
        status = pick([
          AppointmentStatus.COMPLETED,
          AppointmentStatus.COMPLETED,
          AppointmentStatus.COMPLETED,
          AppointmentStatus.CANCELLED,
        ])
      } else if (dayOffset === 0) {
        status = pick([AppointmentStatus.CONFIRMED, AppointmentStatus.SCHEDULED, AppointmentStatus.COMPLETED])
      } else {
        status = pick([AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED])
      }

      const appointment = await prisma.appointment.create({
        data: {
          clinicId: clinic.id,
          clientId: client.id,
          professionalId: professional.id,
          procedureId: procedure.id,
          room: pick(["Sala 1", "Sala 2", "Sala 3"]),
          startTime: start,
          endTime: end,
          status,
        },
      })

      if (status === AppointmentStatus.COMPLETED) {
        completedCount++
        await prisma.payment.create({
          data: {
            clinicId: clinic.id,
            clientId: client.id,
            appointmentId: appointment.id,
            amount: procedure.price,
            method: pick([
              PaymentMethod.PIX,
              PaymentMethod.CREDIT_CARD,
              PaymentMethod.DEBIT_CARD,
              PaymentMethod.CASH,
            ]),
            paidAt: start,
          },
        })
        paymentsCreated++
      }
    }
  }
  void appointmentStatuses

  console.log("Criando despesas...")
  const expenseCategories = ["Aluguel", "Produtos", "Marketing", "Salários", "Equipamentos", "Manutenção"]
  for (let i = 0; i < 18; i++) {
    await prisma.expense.create({
      data: {
        clinicId: clinic.id,
        description: pick([
          "Compra de insumos descartáveis",
          "Aluguel do espaço",
          "Campanha Instagram Ads",
          "Folha de pagamento",
          "Manutenção de equipamento a laser",
          "Compra de cosméticos profissionais",
        ]),
        amount: randomInt(150, 4500),
        category: pick(expenseCategories),
        supplier: pick(["Fornecedor A", "Fornecedor B", null, null]),
        date: daysFromNow(-randomInt(0, 45)),
      },
    })
  }

  console.log("Criando itens de estoque...")
  const stockItems = [
    { name: "Ácido Hialurônico 1ml", category: "Preenchimento", unit: "un" },
    { name: "Toxina Botulínica 100U", category: "Injetáveis", unit: "un" },
    { name: "Sérum Vitamina C", category: "Skincare", unit: "frasco" },
    { name: "Máscara Facial Hidratante", category: "Skincare", unit: "un" },
    { name: "Luvas Descartáveis (caixa)", category: "Descartáveis", unit: "caixa" },
    { name: "Algodão", category: "Descartáveis", unit: "pacote" },
    { name: "Óleo de Massagem", category: "Corporal", unit: "frasco" },
    { name: "Protetor Solar FPS 50", category: "Skincare", unit: "frasco" },
    { name: "Agulhas para Micropigmentação", category: "Micropigmentação", unit: "un" },
    { name: "Pigmento para Sobrancelha", category: "Micropigmentação", unit: "un" },
    { name: "Álcool 70%", category: "Descartáveis", unit: "litro" },
    { name: "Creme Anestésico Tópico", category: "Injetáveis", unit: "tubo" },
  ]
  for (const item of stockItems) {
    const min = randomInt(5, 15)
    const low = Math.random() < 0.35
    const quantity = low ? randomInt(0, min - 1) : randomInt(min + 5, min + 40)
    const stock = await prisma.stock.create({
      data: {
        clinicId: clinic.id,
        name: item.name,
        category: item.category,
        unit: item.unit,
        minQuantity: min,
        quantity,
        supplier: pick(["Fornecedor A", "Fornecedor B", "Distribuidora Beauty"]),
        expiryDate: Math.random() < 0.5 ? daysFromNow(randomInt(30, 400)) : null,
      },
    })
    await prisma.stockMovement.create({
      data: {
        stockId: stock.id,
        type: StockMovementType.IN,
        quantity: quantity + randomInt(5, 20),
        reason: "Compra inicial",
        date: daysFromNow(-randomInt(10, 60)),
      },
    })
    await prisma.stockMovement.create({
      data: {
        stockId: stock.id,
        type: StockMovementType.OUT,
        quantity: randomInt(1, 10),
        reason: "Uso em procedimento",
        date: daysFromNow(-randomInt(0, 9)),
      },
    })
  }

  console.log("Criando notificações e lembretes...")
  await prisma.notification.createMany({
    data: [
      {
        clinicId: clinic.id,
        userId: ownerUserId,
        type: NotificationType.STOCK,
        title: "Estoque baixo",
        message: "Alguns produtos estão com estoque abaixo do mínimo.",
      },
      {
        clinicId: clinic.id,
        userId: ownerUserId,
        type: NotificationType.APPOINTMENT,
        title: "Novo agendamento",
        message: "Você tem novos agendamentos confirmados para hoje.",
      },
      {
        clinicId: clinic.id,
        userId: ownerUserId,
        type: NotificationType.BIRTHDAY,
        title: "Aniversário de cliente",
        message: "Um cliente faz aniversário essa semana.",
        read: true,
      },
      {
        clinicId: clinic.id,
        userId: ownerUserId,
        type: NotificationType.PAYMENT,
        title: "Pagamento recebido",
        message: "Um novo pagamento foi registrado.",
        read: true,
      },
    ],
  })

  for (const client of clients.slice(0, 5)) {
    await prisma.reminder.create({
      data: {
        clinicId: clinic.id,
        clientId: client.id,
        type: ReminderType.BIRTHDAY,
        title: `Aniversário de ${client.name}`,
        remindAt: daysFromNow(randomInt(1, 20)),
      },
    })
  }

  console.log("\nSeed concluído com sucesso!")
  console.log(`  Clínica: ${clinic.name}`)
  console.log(`  Clientes: ${clients.length}`)
  console.log(`  Procedimentos: ${procedures.length}`)
  console.log(`  Profissionais: ${professionals.length}`)
  console.log(`  Agendamentos concluídos: ${completedCount} | Pagamentos: ${paymentsCreated}`)
  console.log(`\n  Login de demonstração:`)
  console.log(`  Email: ${OWNER_EMAIL}`)
  console.log(`  Senha: ${OWNER_PASSWORD}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
