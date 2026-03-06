# CLAUDE.md — OChefia

Guia de referencia para o agente de desenvolvimento.

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

## Estrutura do Monorepo

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

**Containers:** `ochefia-api` (3001), `ochefia-web` (3000), `ochefia-postgres` (5433), `ochefia-redis` (6380).

---

## Stack Tecnologica

| Camada | Tecnologia |
|---|---|
| Linguagem | TypeScript estrito |
| Backend | Node.js + NestJS |
| Real-time | Socket.IO via `@nestjs/websockets` |
| Frontend | Next.js 14+ (App Router) + React 18+ + Tailwind CSS |
| ORM | Prisma |
| Banco | PostgreSQL com RLS (multi-tenant) |
| Cache | Redis |
| Monorepo | Turborepo + pnpm |
| Testes | Jest + Supertest + Playwright — **TDD obrigatorio** |
| Logs | Winston JSON estruturado + Correlation ID + CloudWatch (AWS) |
| Autenticacao | JWT (access 15min + refresh 7d httpOnly cookie) |

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
- **Toda a interface (labels, botoes, mensagens, placeholders) deve ser 100% em pt-BR.** Codigo (variaveis, funcoes, classes) permanece em ingles.

### Shared (`packages/shared`)
- TypeScript puro. Zero dependencias de framework. Tudo exportado pelo `index.ts`.

### Banco (Prisma)
- Tabelas: **snake_case plural** via `@@map`. Campos: **camelCase**. Enums: **UPPER_CASE**.
- Alteracoes via `prisma migrate dev`. Schema em `apps/api/prisma/schema.prisma`.

### Storage de Imagens
- **S3 + CloudFront** em producao. Filesystem local apenas em desenvolvimento.
- Interface `StorageService` (`upload`, `delete`, `getUrl`). Implementacoes: Local (dev) e S3 (prod).
- `STORAGE_DRIVER=local|s3`. Resize com `sharp` (thumb 200px, media 600px, original). Max 5MB, JPEG/PNG/WebP.

### Testes
| Tipo | Ferramenta | Local |
|---|---|---|
| Unitario | Jest | `apps/api/src/**/*.spec.ts`, `packages/shared/src/**/*.spec.ts` |
| Integracao | Jest + Supertest | `apps/api/test/**/*.e2e-spec.ts` |
| E2E | Playwright | `apps/web/e2e/**/*.spec.ts` |
| Contrato | Jest | `apps/api/test/contracts/**/*.spec.ts` |

```bash
pnpm --filter @ochefia/api test          # Jest watch
pnpm --filter @ochefia/api test:e2e      # Supertest
pnpm --filter @ochefia/web test:e2e      # Playwright
pnpm test                                # Tudo via Turborepo
```

---

## Roles e Permissoes

```
SUPER_ADMIN -> Painel OChefia (gestao de estabelecimentos, cobranca, modulos) — cross-tenant
OWNER       -> Acesso total ao seu estabelecimento
MANAGER     -> Admin sem config financeiras sensiveis
WAITER      -> Modulo garcom + chamados
KITCHEN     -> KDS (cozinha)
BAR         -> KDS (bar) + flag opcional "tambem entrega" (entrega sem passar por garcom)
```

---

## Fase Atual

**Sprint P — Prototipos HTML**

Prototipos funcionais em HTML + CSS + JS vanilla para todas as telas. Validar UI antes de codigo de producao. Ver `docs/sprints.md` para detalhes e checklist.

Proximo: Sprint 0 (Scaffolding) -> Sprint 1-2 (Fundacao).

---

## REGRA OBRIGATORIA: Consultar docs/ antes de implementar

**A especificacao completa do projeto esta nos arquivos `docs/`.** Este CLAUDE.md contem apenas convencoes e regras gerais. Os detalhes de negocio, endpoints, design, modulos e sprints estao em `docs/`.

**ANTES de implementar qualquer tarefa**, voce DEVE:
1. Identificar quais arquivos de `docs/` sao relevantes para a tarefa.
2. Ler esses arquivos com a ferramenta Read.
3. So entao comecar a implementacao.

**Exemplos:**
- Tarefa envolve UI/CSS? -> Ler `docs/design-system.md`
- Tarefa envolve criar/modificar endpoint? -> Ler `docs/api-endpoints.md`
- Tarefa envolve nova sprint? -> Ler `docs/sprints.md`
- Tarefa envolve regra de negocio de algum modulo? -> Ler `docs/modulos.md`
- Tarefa envolve WebSocket? -> Ler `docs/websocket-events.md`
- Tarefa envolve seguranca/auth? -> Ler `docs/seguranca.md`
- Tarefa envolve infra/docker? -> Ler `docs/deploy.md`
- Tarefa envolve logs? -> Ler `docs/observabilidade.md`

| Arquivo | Conteudo |
|---|---|
| `docs/sprints.md` | Roadmap completo de sprints com checklists |
| `docs/api-endpoints.md` | Todos os endpoints REST |
| `docs/websocket-events.md` | Eventos Socket.IO + rooms |
| `docs/design-system.md` | Cores, tipografia, componentes, theming |
| `docs/modulos.md` | Descricao funcional de todos os modulos |
| `docs/deploy.md` | Deploy AWS, infra cloud, Super Admin |
| `docs/seguranca.md` | Seguranca, multi-tenancy, LGPD |
| `docs/observabilidade.md` | Logs, Winston, Correlation ID |
