# Sprint 12 — WebSocket Gateway + Infraestrutura Real-Time

Infraestrutura de tempo real. Zero endpoints REST novos.

**Checklist:**
- [ ] WebSocket gateway (Socket.IO).
- [ ] **Redis Adapter (`@socket.io/redis-adapter`)** configurado desde a Fase 1 (preparação para scaling horizontal na Fase 2).
- [ ] Rooms: restaurant, kds (geral), kds:{prepLocationId} (por Local de Preparo), waiter (geral), waiter:sector:{sectorId} (por setor), admin, session.
- [ ] Eventos client->server: order:created, call:request, payment:initiated.
- [ ] Eventos server->KDS: kds:new-order, kds:status-update.
- [ ] Eventos server->cliente: client:order-update, client:session-update.
- [ ] Eventos de aprovação: session:join-request, session:join-approved, session:join-rejected, session:join-remind.
- [ ] **Migrar notificações de aprovação de polling HTTP para WebSocket:** substituir o polling de `GET /session/:token/join/pending` (Sprint 7) por eventos `session:join-request` e `session:join-remind` em tempo real.
- [ ] Eventos server->garçom: waiter:order-ready, waiter:pickup-claimed, waiter:pickup-reminder, waiter:pickup-escalation, waiter:call, waiter:new-order.
- [ ] Eventos server->admin: admin:table-update, admin:metrics-update, admin:pickup-escalation.
- [ ] **Rate limit de eventos** client→server: máximo 10 eventos/s por socket. Desconectar sockets que excedem.
- [ ] **Propagação de `correlationId`** nos eventos WebSocket para tracing end-to-end.
- [ ] Atualizar **CSP** no Helmet para incluir `connect-src 'self' wss://*.ochefia.com.br` (WebSocket).
- [ ] **Componente reutilizável de indicador de conexão** WebSocket + **polling HTTP como fallback** quando desconectado (banner "Reconectando..." + fetch REST a cada 10s). Ver `docs/websocket-events.md` seção Reconexão.
