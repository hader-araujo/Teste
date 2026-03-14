# CLAUDE.md — OChefia

SaaS de gestão para bares/restaurantes no Brasil. Monorepo TypeScript: NestJS + Prisma + PostgreSQL (backend), Next.js 14 App Router + Tailwind (frontend), Socket.IO (real-time), Redis (cache), Turborepo + pnpm.

---

## REGRAS OBRIGATÓRIAS

1. **TDD inviolável.** RED → GREEN → REFACTOR. Teste primeiro, código depois. Sem exceções. Ver `.claude/rules/testing.md`.
2. **Consultar `docs/` antes de implementar.** Identificar docs relevantes → ler com Read → só então implementar.
3. **Planejar antes de executar tarefas complexas.** Para features novas ou refatorações grandes: apresentar plano (arquivos a criar/modificar, ordem, testes a escrever) e aguardar aprovação. O plano antecede o TDD — primeiro decide O QUE fazer, depois executa com TDD.

---

## Visão Geral

**OChefia** é um SaaS para gestão de bares e restaurantes no Brasil. Cardápio digital via QR Code, autoatendimento, KDS, módulo garçom e dashboard gerencial — tudo em tempo real, sem hardware especializado.

**Fase 1 (MVP):** QR Code → PWA → pedido → conta → pagamento. Sem download, sem cadastro. Sessão vinculada a mesa.

**Fase 2 — NÃO IMPLEMENTAR ATÉ AVISO EXPLÍCITO.**

---

## Estado Atual do Repositório

**Sprint P — Protótipos HTML.** O repositório contém apenas `CLAUDE.md`, `docs/` e `prototypes/`. A estrutura de código (apps/, packages/, docker) ainda não foi criada — será criada na Sprint 0. Ver `docs/sprints.md`.

---

## Quick Start

> **ATENÇÃO:** Os comandos abaixo só funcionam após Sprint 0 criar a estrutura do monorepo.

```bash
source ~/.nvm/nvm.sh && nvm use 20
pnpm install
docker compose up -d postgres redis
pnpm --filter @ochefia/shared build
pnpm --filter @ochefia/api dev     # Backend porta 3001
pnpm --filter @ochefia/web dev     # Frontend porta 3000
pnpm test                          # Tudo via Turborepo
```

---

## Gotchas

- **Node 20 via nvm**: Sempre `source ~/.nvm/nvm.sh && nvm use 20` antes de rodar comandos.
- **Portas não-padrão**: PostgreSQL em **5433**, Redis em **6380** (as portas padrão estão ocupadas no host).
- **Shared deve ser buildado primeiro**: `pnpm --filter @ochefia/shared build` antes de buildar api ou web.
- **tsconfig da API não tem paths para @ochefia/shared**: Depende do workspace symlink + shared compilado.
- **Seed**: Executar de `apps/api/` com `npx ts-node -r tsconfig-paths/register prisma/seed.ts`. Dados de teste no CLAUDE.local.md.

---

## Estrutura do Monorepo

> **Nota:** Estrutura planejada. Será criada na Sprint 0.

```
ochefia/
├── apps/
│   ├── api/          -> NestJS Backend (porta 3001)
│   ├── web/          -> Next.js PWA (porta 3000)
│   └── mobile/       -> Capacitor + React (Fase 2)
├── packages/
│   └── shared/       -> @ochefia/shared — tipos, constantes, utils
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml
```

**Containers (4 no total):** `ochefia-api` (3001), `ochefia-web` (3000), `ochefia-postgres` (5433), `ochefia-redis` (6380).

---

## Decisões Arquiteturais

- **Multi-tenancy** via `restaurantId` em todas as queries.
- **Sessão do cliente** vinculada a mesa via `sessionToken`, sem cadastro. Verificação via OTP WhatsApp.
- **Socket.IO rooms** por `restaurantId` para real-time (KDS, garçom, dashboard).
- **QR Code** gera URL permanente `/{slug}/mesa/{tableId}`. Sessão criada no primeiro acesso.
- **Pagamento** Pix (simulado na Fase 1) + dinheiro + cartão (registro manual).

---

## Convenções de Código

Detalhes completos em `.claude/rules/`:
- `.claude/rules/coding.md` — convenções gerais TypeScript, naming, exports
- `.claude/rules/testing.md` — TDD, tipos de teste, pré-commit
- `.claude/rules/backend.md` — NestJS, Prisma, shared
- `.claude/rules/frontend.md` — Next.js, Tailwind, idioma pt-BR
- `.claude/rules/git.md` — commits, prefixos, mensagens em português

---

## Docs sob demanda (ler ANTES de implementar a feature relevante)

See @docs/sprints.md for índice do roadmap. Detalhes de cada sprint em `docs/sprints/sprint-XX.md`.

- `docs/modulos.md` — descrição funcional de todos os módulos
- `docs/fluxos.md` — fluxos de navegação passo a passo de cada perfil
- `docs/design-system.md` — cores, tipografia, componentes, theming
- `docs/seguranca.md` — segurança, multi-tenancy, LGPD, rate limits, upload
- `docs/api-endpoints.md` — endpoints REST
- `docs/websocket-events.md` — eventos Socket.IO
- `docs/deploy.md` — deploy Docker/AWS
- `docs/observabilidade.md` — logs, Winston, Correlation ID, métricas
- `docs/design-cliente.md` — specs da interface do cliente
- `docs/design-staff.md` — specs do KDS e garçom
- `docs/design-admin.md` — specs do dashboard admin
- `docs/design-superadmin.md` — specs do backoffice super admin
- `docs/schema.md` — modelo de dados conceitual (entidades, campos, relacionamentos, enums)
- `docs/glossario.md` — glossário de termos de negócio, técnicos e siglas
