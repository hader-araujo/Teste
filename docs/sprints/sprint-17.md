# Sprint 17 — Staff + Escala + Equipe do Dia

**Endpoints (~14):**
- GET `/staff` — Listar funcionários. **Paginação:** query `page` e `limit` (default 50, max 100).
- POST `/staff` — Criar funcionário (temporary, fixedWeekdays, pin).
- POST `/staff/invite` — Enviar convite.
- POST `/staff/accept` — Aceitar convite.
- PUT `/staff/:id` — Atualizar funcionário.
- DELETE `/staff/:id` — Desativar funcionário.
- POST `/staff/:id/reset-pin` — Resetar PIN do funcionário (OWNER/MANAGER).
- POST `/staff/:id/unlock-pin` — Desbloquear lockout de PIN (OWNER/MANAGER).
- GET `/schedule` — Listar escala por período.
- GET `/schedule/:date` — Programação do dia (quem deveria trabalhar).
- PUT `/schedule/:date` — Definir/atualizar escala do dia.
- GET `/day-team/:date` — Equipe real do dia (quem está trabalhando).
- PUT `/day-team/:date` — Definir equipe do dia.
- PATCH `/day-team/:date/sectors` — Atribuir setores aos garçons do dia.

**Checklist:**
- [ ] CRUD de funcionários com flag temporário, dias fixos, PIN garçom.
- [ ] Sistema de convites (log no console em dev).
- [ ] Frontend admin: tela de funcionários com CRUD (cadastro, edição, desativação, flag temporário, dias fixos, PIN garçom).
- [ ] Frontend admin: tela de escala — calendário por dia, auto-preenchimento com permanentes + temporários com dia pré-definido, ajustes manuais.
- [ ] Frontend admin: tela equipe do dia — equipe ativa + atribuição de setores por garçom (um garçom pode ter mais de 1 setor). Toggle para desmarcar/marcar. Adicionar temporários avulsos.
- [ ] **Cron job "Preenchimento DayTeam":** diário às 04:00, auto-preenche equipe do dia a partir do Schedule semanal (permanentes + temporários com dia fixo). Não sobrescreve se admin já editou manualmente.
- [ ] Endpoint `POST /staff/:id/unlock-pin` — desbloqueia lockout de PIN (OWNER/MANAGER). Limpa chave Redis `pin-lockout:{staffId}`.
- [ ] Error codes padronizados para módulo Staff (STAFF_001 a STAFF_003). Ver `docs/observabilidade.md`.
