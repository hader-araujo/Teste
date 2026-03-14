# Sprint 2 — Auth + Restaurant + Seed

**Endpoints (~8):**
- POST `/auth/register` — Registro de restaurante + owner.
- POST `/auth/login` — Login -> retorna JWT.
- POST `/auth/refresh` — Refresh token.
- GET `/auth/me` — Dados do usuário logado.
- GET `/restaurants/:slug` — Dados públicos do restaurante.
- PUT `/restaurants/:id` — Atualizar dados (OWNER/MANAGER).
- GET `/restaurants/:id/settings` — Configurações.
- PUT `/restaurants/:id/settings` — Atualizar configurações.

**Checklist:**
- [ ] Módulo Auth completo (register, login, JWT access 15min + refresh 7d, roles).
- [ ] Roles: OWNER, MANAGER, WAITER, KITCHEN.
- [ ] Adicionar role `SUPER_ADMIN` ao enum de roles no schema Prisma (será usado na Sprint 22).
- [ ] Refresh token em httpOnly cookie com `SameSite=Strict`.
- [ ] **Suporte a dual JWT_SECRET** para rotação: validar token com secret atual e anterior simultaneamente. Ver `docs/seguranca.md` seção Rotação de Secrets.
- [ ] Rate limit específico em `/auth/login` (5 tentativas por IP em 15min).
- [ ] Rate limit específico em `/auth/refresh` (10 tentativas por IP em 15min).
- [ ] CSRF token (sync token pattern) para proteção de requests com cookie.
- [ ] CRUD de restaurante. Sanitização de `Restaurant.name` contra XSS via `class-transformer`.
- [ ] Winston logger + Correlation ID middleware.
- [ ] ValidationPipe global + Swagger.
- [ ] **Campos de configuração em `RestaurantSettings`** com valores default: `serviceChargePercent` (10), `pickupReminderInterval` (3min), `pickupEscalationTimeout` (10min), `orderDelayThreshold` (15min), `idleTableThreshold` (30min). Tela de edição na Sprint 21 — até lá, usar defaults.
- [ ] Seed com dados de teste (dono@ze-bar.com / senha123, slug ze-bar).
- [ ] Error codes padronizados para módulo Auth (AUTH_001, AUTH_002, AUTH_003). Ver `docs/observabilidade.md` seção Error Codes.
