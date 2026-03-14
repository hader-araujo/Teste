# Sprint 1 — Segurança Base + CI/CD + Docs

Hardening de segurança, pipeline de CI e documentação de padrões. Pré-requisito: Sprint 0 completa.

**Checklist:**
- [ ] Helmet configurado com **Content Security Policy (CSP)** restritiva: `default-src 'self'`, `script-src 'self'`, `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`, `font-src 'self' https://fonts.gstatic.com`, `img-src 'self' data:`, `connect-src 'self'`. Revisar ao adicionar WebSocket (Sprint 12) e imagens externas (Fase 2). Ver `docs/seguranca.md` seção CSP.
- [ ] CORS configurado para origens permitidas.
- [ ] **Rate limiting global** por IP via `express-rate-limit` como middleware. Endpoints sensíveis terão limits específicos adicionais nas sprints seguintes.
- [ ] **Setup de sanitização** com `class-transformer` para campos de texto livre. Configurar como parte do `ValidationPipe` global. Campos afetados listados em `docs/seguranca.md` seção Sanitização de Input.
- [ ] CI/CD pipeline básico (GitHub Actions): lint + test em PRs.
- [ ] Dependabot configurado para scanning de vulnerabilidades.
- [ ] `pnpm audit` como step do CI.
- [ ] Criar `docs/patterns.md` com exemplos canônicos de código por camada.
- [ ] Criar `docs/decisions/` com ADRs das decisões arquiteturais (Socket.IO, Prisma, Bull, etc).
- [ ] Tabela `AuditLog` no Prisma schema (para uso em sprints futuras).
- [ ] **PostgreSQL RLS** como segunda camada de proteção para multi-tenancy. Policies baseadas em `restaurantId` nas tabelas principais. Ver `docs/seguranca.md`.
