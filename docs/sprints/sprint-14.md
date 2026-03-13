# Sprint 14 — Staff + Escala + Equipe do Dia

**Endpoints (~10):**
- GET `/staff` — Listar funcionários. **Paginação:** query `page` e `limit` (default 50, max 100).
- POST `/staff` — Criar funcionário (temporary, fixedWeekdays, pin).
- POST `/staff/invite` — Enviar convite.
- POST `/staff/accept` — Aceitar convite.
- PUT `/staff/:id` — Atualizar funcionário.
- DELETE `/staff/:id` — Desativar funcionário.
- GET `/schedule` — Listar escala por período.
- GET `/schedule/day/:date` — Equipe do dia.
- PUT `/schedule/day/:date` — Definir equipe do dia.
- PATCH `/schedule/day/:date/sectors` — Atribuir setores aos garçons do dia.

**Checklist:**
- [ ] CRUD de funcionários com flag temporário, dias fixos, senha garçom.
- [ ] Sistema de convites (log no console em dev).
- [ ] Frontend admin: tela de funcionários com CRUD (cadastro, edição, desativação, flag temporário, dias fixos, senha garçom).
- [ ] Frontend admin: tela de escala — calendário por dia, auto-preenchimento com permanentes + temporários com dia pré-definido, ajustes manuais.
- [ ] Frontend admin: tela equipe do dia — equipe ativa + atribuição de setores por garçom (um garçom pode ter mais de 1 setor). Toggle para desmarcar/marcar. Adicionar temporários avulsos.
- [ ] Error codes padronizados para módulo Staff (STAFF_001 a STAFF_003). Ver `docs/observabilidade.md`.
