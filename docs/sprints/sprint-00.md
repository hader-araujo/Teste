# Sprint 0 — Scaffolding + Monorepo + Docker

Setup completo da infraestrutura de desenvolvimento. Ao final, `pnpm install && docker compose up` funciona.

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
- [ ] Helmet configurado com **Content Security Policy (CSP)** restritiva: `default-src 'self'`, `script-src 'self'`, `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`, `font-src 'self' https://fonts.gstatic.com`, `img-src 'self' data:`, `connect-src 'self'`. Revisar ao adicionar WebSocket (Sprint 11) e imagens externas (Fase 2). Ver `docs/seguranca.md` seção CSP.
- [ ] CORS configurado para origens permitidas.
- [ ] **Rate limiting global** por IP via `express-rate-limit` como middleware. Endpoints sensíveis terão limits específicos adicionais nas sprints seguintes.
- [ ] **Setup de sanitização** com `class-transformer` para campos de texto livre. Configurar como parte do `ValidationPipe` global. Campos afetados listados em `docs/seguranca.md` seção Sanitização de Input.
- [ ] CI/CD pipeline básico (GitHub Actions): lint + test em PRs.
- [ ] Dependabot configurado para scanning de vulnerabilidades.
- [ ] `pnpm audit` como step do CI.
- [ ] Criar `docs/patterns.md` com exemplos canônicos de código por camada.
- [ ] Criar `docs/decisions/` com ADRs das decisões arquiteturais (Socket.IO, Prisma, Bull, etc).
