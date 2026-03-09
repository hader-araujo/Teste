# CLAUDE.md — OChefia

SaaS de gestao para bares/restaurantes no Brasil. Monorepo TypeScript: NestJS + Prisma + PostgreSQL (backend), Next.js 14 App Router + Tailwind (frontend), Socket.IO (real-time), Redis (cache), Turborepo + pnpm.

---

## REGRA OBRIGATORIA: TDD (Test-Driven Development)

**ESTA REGRA E INVIOLAVEL.**

Ciclo **sempre**: RED (teste falhando) -> GREEN (codigo minimo) -> REFACTOR.

- **Proibido** criar/modificar codigo de producao sem teste escrito ANTES.
- **Proibido** commitar sem testes passando.
- Bug encontrado? Teste que reproduz primeiro, depois corrigir.
- Testes nao sao opcionais, nao sao "para depois". Sao a **primeira coisa**.

---

## Visao Geral

**OChefia** e um SaaS para gestao de bares e restaurantes no Brasil. Cardapio digital via QR Code, autoatendimento, KDS, modulo garcom e dashboard gerencial — tudo em tempo real, sem hardware especializado.

**Fase 1 (MVP):** QR Code -> PWA -> pedido -> conta -> pagamento. Sem download, sem cadastro. Sessao vinculada a mesa.

**Fase 2 — NAO IMPLEMENTAR ATE AVISO EXPLICITO.** App nativo com cadastro, historico, explorar, reserva, fidelidade. Apenas referencia arquitetural.

---

## Estado Atual do Repositorio

**Sprint P — Prototipos HTML.** O repositorio contem apenas `CLAUDE.md`, `docs/` e `prototypes/`. A estrutura de codigo (apps/, packages/, docker) ainda nao foi criada — sera criada na Sprint 0. Ver `docs/sprints.md`.

---

## Quick Start

> **ATENCAO:** Os comandos abaixo so funcionam apos Sprint 0 criar a estrutura do monorepo.

```bash
# Node 20 obrigatorio
source ~/.nvm/nvm.sh && nvm use 20

# Instalar dependencias
pnpm install

# Docker (PostgreSQL 5433, Redis 6380 — portas padrao ocupadas)
docker compose up -d postgres redis

# Build shared primeiro (dependencia dos apps)
pnpm --filter @ochefia/shared build

# Dev
pnpm --filter @ochefia/api dev     # Backend porta 3001
pnpm --filter @ochefia/web dev     # Frontend porta 3000

# Testes
pnpm --filter @ochefia/api test    # Jest watch
pnpm test                          # Tudo via Turborepo
```

---

## Gotchas

- **Node 20 via nvm**: Sempre `source ~/.nvm/nvm.sh && nvm use 20` antes de rodar comandos.
- **Portas nao-padrao**: PostgreSQL em **5433**, Redis em **6380** (as portas padrao estao ocupadas no host).
- **Shared deve ser buildado primeiro**: `pnpm --filter @ochefia/shared build` antes de buildar api ou web.
- **tsconfig da API nao tem paths para @ochefia/shared**: Depende do workspace symlink + shared compilado.
- **Seed**: Executar de `apps/api/` com `npx ts-node -r tsconfig-paths/register prisma/seed.ts`. User: `dono@ze-bar.com / senha123` (OWNER), slug `ze-bar`.

---

## Estrutura do Monorepo

> **Nota:** Esta e a estrutura planejada. Sera criada na Sprint 0.

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

**Containers (4 no total):** `ochefia-api` (3001), `ochefia-web` (3000), `ochefia-postgres` (5433), `ochefia-redis` (6380). Logs rodam dentro do container da API (Winston stdout), nao sao container separado. Imagens em filesystem local (volume Docker). Filas via Bull + Redis. Sem AWS na Fase 1 — ver `docs/deploy.md`.

---

## Decisoes Arquiteturais

- **Multi-tenancy** via `restaurantId` em todas as queries. Ver @docs/seguranca.md
- **Sessao do cliente** vinculada a mesa via `sessionToken`, sem cadastro. Verificacao via OTP WhatsApp.
- **Socket.IO rooms** por `restaurantId` para real-time (KDS, garcom, dashboard).
- **QR Code** gera URL permanente `/{slug}/mesa/{tableId}`. Sessao criada no primeiro acesso.
- **Pix simulado** na Fase 1. Webhook recebe confirmacao. Ver @docs/api-endpoints.md

---

## Convencoes de Codigo

### Geral
- TypeScript estrito. Nunca usar `any`.
- Variaveis/funcoes: **camelCase**. Arquivos: **kebab-case**. Classes: **PascalCase**. Enums: **UPPER_CASE**.
- Exportacoes nomeadas — nunca `export default` (salvo paginas Next.js).

### Backend (NestJS — `apps/api`)
- Logica de negocio no **Service**. Controller apenas recebe, valida com DTO e delega.
- Nunca importar Service de outro modulo diretamente — usar exports/imports NestJS.
- Inputs validados com `class-validator` + `ValidationPipe` global.
- Endpoints documentados com Swagger. Protegidos com `JwtAuthGuard` + `@Roles()`.
- Estrutura por modulo: `*.module.ts`, `*.controller.ts`, `*.controller.spec.ts`, `*.service.ts`, `*.service.spec.ts`, `dto/`.

### Frontend (Next.js — `apps/web`)
- Server Components por padrao. `'use client'` so quando necessario.
- Tailwind CSS exclusivo. Componentes >150 linhas devem ser quebrados.
- Props tipadas com `interface`. Named exports.
- Organizacao: `components/ui/`, `components/admin/`, `components/kds/`, `components/garcom/`, `components/cliente/`.
- **Toda a interface (labels, botoes, mensagens, placeholders) deve ser 100% em pt-BR com acentuacao correta.** Codigo (variaveis, funcoes, classes) permanece em ingles.
- **Acentuacao obrigatoria:** Todo texto em portugues visivel ao usuario (UI, prototipos, mensagens de erro, placeholders, toasts) DEVE usar acentuacao correta (ã, é, ç, ô, í, ú, etc). Nunca escrever "Adicao" em vez de "Adição", "voce" em vez de "você", "pedido esta pronto" em vez de "pedido está pronto". Isso se aplica a prototipos HTML, componentes React, mensagens de toast, e qualquer texto renderizado na tela.

### Shared (`packages/shared`)
- TypeScript puro. Zero dependencias de framework. Tudo exportado pelo `index.ts`.

### Banco (Prisma)
- Tabelas: **snake_case plural** via `@@map`. Campos: **camelCase**. Enums: **UPPER_CASE**.
- Alteracoes via `prisma migrate dev`. Schema em `apps/api/prisma/schema.prisma`.

### Testes
| Tipo | Ferramenta | Local |
|---|---|---|
| Unitario | Jest | `apps/api/src/**/*.spec.ts`, `packages/shared/src/**/*.spec.ts` |
| Integracao | Jest + Supertest | `apps/api/test/**/*.e2e-spec.ts` |
| E2E | Playwright | `apps/web/e2e/**/*.spec.ts` |
| Contrato | Jest | `apps/api/test/contracts/**/*.spec.ts` |

---

## Antes de cada commit

1. `pnpm test` — todos os testes devem passar.
2. `pnpm lint` — zero warnings/errors.
3. Nunca `git add .` — adicionar arquivos especificos por nome.
4. Commits atomicos: 1 feature ou 1 fix por commit. Nunca misturar mudancas nao relacionadas.
5. Se esqueceu de comitar e tem mudancas de 2 tarefas, separar em commits distintos.

---

## REGRA OBRIGATORIA: Consultar docs/ antes de implementar

**A especificacao completa do projeto esta nos arquivos `docs/`.** Este CLAUDE.md contem apenas convencoes e regras gerais. Os detalhes de negocio, endpoints, design, modulos e sprints estao em `docs/`.

**ANTES de implementar qualquer tarefa**, voce DEVE:
1. Identificar quais arquivos de `docs/` sao relevantes para a tarefa.
2. Ler esses arquivos com a ferramenta Read.
3. So entao comecar a implementacao.

**Referencia de docs (usar @imports):**

See @docs/sprints.md for roadmap completo de sprints com checklists
See @docs/api-endpoints.md for todos os endpoints REST
See @docs/websocket-events.md for eventos Socket.IO + rooms
See @docs/design-system.md for cores, tipografia, componentes, theming
See @docs/modulos.md for descricao funcional de todos os modulos
See @docs/fluxos.md for fluxos de navegacao passo a passo de cada perfil (cliente, garcom, admin, KDS, super admin)
See @docs/deploy.md for deploy Docker (Fase 1), AWS (Fase 2), Super Admin
See @docs/seguranca.md for seguranca, multi-tenancy, LGPD, audit log, webhook Pix, rate limits, upload
See @docs/observabilidade.md for logs, Winston, Correlation ID, metricas de negocio
