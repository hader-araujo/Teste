# Sprint 14 — WebSocket Eventos + Push Notifications Base

Implementação de todos os eventos WebSocket sobre a infraestrutura da Sprint 13. Zero endpoints REST novos.

**Checklist:**
- [ ] Eventos client→server: `order:created`, `call:request`, `payment:initiated`.
- [ ] Eventos server→KDS: `kds:new-order`, `kds:item-cancelled`, `kds:table-transferred`.
- [ ] Eventos KDS→server: `kds:status-update`.
- [ ] Eventos server→cliente: `client:order-update`, `client:session-update`, `client:payment-confirmed`, `client:payment-cancelled`, `client:payment-refunded`, `client:session-closed`, `client:table-transferred`.
- [ ] Eventos de aprovação: `session:join-request`, `session:join-approved`, `session:join-rejected`, `session:join-remind`.
- [ ] **Migrar notificações de aprovação de polling HTTP para WebSocket:** substituir o polling de `GET /session/:token/join/pending` (Sprint 9) por eventos `session:join-request` e `session:join-remind` em tempo real.
- [ ] Eventos server→garçom: `waiter:order-ready`, `waiter:pickup-claimed`, `waiter:pickup-reminder`, `waiter:pickup-escalation`, `waiter:claim-expiring`, `waiter:claim-expired`, `waiter:call`, `waiter:new-order`, `waiter:order-cancelled`, `waiter:mapping-incomplete`, `waiter:session-opened`, `waiter:table-transferred`, `waiter:payment-requested`.
- [ ] Eventos server→admin: `admin:table-update`, `admin:metrics-update`, `admin:pickup-escalation`, `admin:mapping-incomplete`, `admin:no-waiter-alert`, `admin:waiter-offline`, `admin:pin-lockout`.
