# Sprint 2 — Auth + Restaurant + Seed

**Endpoints (~10):**
- POST `/auth/register` — Registro de restaurante + owner.
- POST `/auth/login` — Login com email+senha → JWT. Usado por Admin e Super Admin.
- POST `/auth/pin` — Login com PIN → JWT. Usado por Garçom (WAITER) e KDS (KITCHEN). Rate limiting: 5 tentativas/15min + lockout 15min.
- POST `/auth/refresh` — Refresh token.
- GET `/auth/me` — Dados do usuário logado.
- GET `/restaurants/:slug` — Dados públicos do restaurante.
- GET `/restaurants/:slug/staff-list` — Público. Lista de funcionários ativos (WAITER/KITCHEN) para tela de login PIN.
- PUT `/restaurants/:id` — Atualizar dados (OWNER/MANAGER).
- GET `/restaurants/:id/settings` — Configurações.
- PUT `/restaurants/:id/settings` — Atualizar configurações.

**Checklist:**
- [ ] Módulo Auth completo (register, login, JWT access 15min + refresh 7d, roles).
- [ ] Roles: OWNER, MANAGER, WAITER, KITCHEN.
- [ ] Adicionar role `SUPER_ADMIN` ao enum de roles no schema Prisma (será usado na Sprint 24).
- [ ] Refresh token em httpOnly cookie com `SameSite=Strict`.
- [ ] **Suporte a dual JWT_SECRET** para rotação: validar token com secret atual e anterior simultaneamente. Ver `docs/seguranca.md` seção Rotação de Secrets.
- [ ] Rate limit específico em `/auth/login` (5 tentativas por IP em 15min).
- [ ] `POST /auth/pin` — autenticação por PIN para staff operacional (WAITER, KITCHEN). Rate limiting: 5 tentativas/15min + lockout 15min. Retorna JWT igual ao `/auth/login`.
- [ ] Rate limit específico em `/auth/refresh` (10 tentativas por IP em 15min).
- [ ] Rate limit `POST /auth/register`: 3 requests por IP por hora (conforme seguranca.md).
- [ ] CSRF token (sync token pattern) para proteção de requests com cookie.
- [ ] CRUD de restaurante. Sanitização de `Restaurant.name` contra XSS via `class-transformer`.
- [ ] Winston logger + Correlation ID middleware.
- [ ] ValidationPipe global + Swagger.
- [ ] **Campos de configuração em `RestaurantSettings`** com valores default: `serviceChargePercent` (10), `pickupReminderInterval` (3min), `pickupEscalationTimeout` (10min), `orderDelayThreshold` (15min), `idleTableThreshold` (30min), `maxPeoplePerSession` (100), `claimTimeout` (5min), `waiterOfflineAlertTimeout` (5min), `longSessionThreshold` (6h), `otpMaxSendsPerPhone` (5). Tela de edição na Sprint 23 — até lá, usar defaults.
- [ ] Seed com dados de teste (dono@ze-bar.com / senha123, slug ze-bar).
- [ ] Error codes padronizados para módulo Auth (AUTH_001, AUTH_002, AUTH_003). Ver `docs/observabilidade.md` seção Error Codes.
