# GlowFlow

SaaS de gestão para clínicas de estética. MVP em construção — Fase 1 concluída (fundação, autenticação, dashboard, agenda e clientes).

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · Framer Motion · React Hook Form + Zod · TanStack Query · Prisma 7 (SQLite em dev) · Better Auth · UploadThing · Recharts · @dnd-kit

## Como rodar

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000). Login de demonstração (dados fictícios via seed):

- **E-mail:** `demo@glowflow.app`
- **Senha:** `glowflow123`

Para popular o banco novamente do zero, apague `dev.db` e rode:

```bash
npx prisma migrate dev
npx prisma db seed
```

## Variáveis de ambiente

Copie `.env.example` para `.env` e ajuste conforme necessário. Em dev, `UPLOADTHING_TOKEN` pode ficar vazio — o upload de fotos simplesmente não funcionará até você configurar uma conta em [uploadthing.com](https://uploadthing.com).

## Migrando de SQLite para MySQL (produção)

1. Instale o driver: `npm install @prisma/adapter-mariadb mariadb`
2. Em `prisma/schema.prisma`, troque `provider = "sqlite"` por `provider = "mysql"` no bloco `datasource`.
3. Em `src/lib/prisma.ts`, troque o adapter `PrismaBetterSqlite3` por `PrismaMariaDb` (veja `.agents/skills/prisma-upgrade-v7/references/driver-adapters.md` para o exemplo completo).
4. Atualize `DATABASE_URL` para a connection string do MySQL.
5. Rode `npx prisma migrate deploy`.

## Estrutura

```
prisma/            schema, migrations, seed
src/app/            rotas (App Router)
src/components/     UI (shadcn) + componentes compartilhados
src/features/        lógica de domínio por módulo (schema, actions, components)
src/services/        camada de acesso a dados (única a falar com o Prisma)
src/lib/             auth, prisma, uploadthing, utils
src/utils/            formatadores (moeda, data, telefone, cpf)
```

## Notas de segurança

- Toda mutação passa por Zod antes de tocar o banco.
- Toda query de negócio é filtrada por `clinicId` da sessão — nunca por um id vindo do client.
- Rate limit básico configurado no Better Auth (20 req/60s).
- CSRF: Server Actions do Next 15 validam a origin nativamente.

## Próximos módulos (fases seguintes)

- Profissionais, Procedimentos, Financeiro, Estoque (CRUD completo)
- Relatórios, Configurações, Perfil, notificações/lembretes automáticos
- Passe de responsividade/atalhos de teclado e revisão de segurança final
