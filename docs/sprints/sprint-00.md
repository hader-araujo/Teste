# Sprint 0 — Scaffolding + Monorepo + Docker

Setup completo da infraestrutura de desenvolvimento. Ao final, `pnpm install && docker compose up` funciona.

**Pré-requisito:** nenhum.

**Checklist:**
- [ ] Criar toda a estrutura de pastas do monorepo (`apps/api`, `apps/web`, `packages/shared`).
- [ ] Turborepo + pnpm workspace configurados.
- [ ] Docker Compose com PostgreSQL (5433) e Redis (6380).
- [ ] Prisma schema inicial (modelos base: Restaurant, User, Table).
- [ ] ESLint, Prettier, tsconfig compartilhado.
- [ ] `packages/shared` com estrutura básica e build funcional.
- [ ] NestJS scaffolding com módulo raiz.
- [ ] Next.js 14 App Router scaffolding.
- [ ] `README.md` em cada pasta relevante.
- [ ] Endpoint `GET /health` e `GET /health/ready` (health check básico + readiness).
- [ ] **Git hooks (husky + lint-staged):** pre-commit roda `pnpm test` e `pnpm lint`. Commit bloqueado se falhar.
- [ ] **Claude Code hooks:** configurar `.claude/hooks/` com pre-commit que roda testes e lint antes de commitar. Funciona quando Claude está trabalhando no projeto.
- [ ] **Claude Code skills:** criar skills para workflows repetitivos: `create-nest-module` (scaffolding módulo NestJS), `create-migration` (migração Prisma), `add-endpoint` (endpoint com controller + service + spec + doc).
