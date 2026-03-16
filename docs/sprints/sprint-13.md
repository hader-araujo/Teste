# Sprint 13 — WebSocket Gateway + Infraestrutura Real-Time

Infraestrutura base de tempo real. Zero endpoints REST novos. Sprint 14 implementa os eventos.

**Checklist:**
- [ ] WebSocket gateway (Socket.IO). Autenticação via `auth.token` (JWT para staff) ou `auth.sessionToken` (token de sessão para cliente) no handshake. Middleware valida e insere socket nas rooms apropriadas. Ver `docs/websocket-events.md` seção Autenticação.
- [ ] **Redis Adapter (`@socket.io/redis-adapter`)** configurado desde a Fase 1 (preparação para scaling horizontal na Fase 2).
- [ ] Rooms: `restaurant:{id}`, `restaurant:{id}:kds`, `restaurant:{id}:kds:{prepLocationId}`, `restaurant:{id}:waiter`, `restaurant:{id}:waiter:sector:{sectorId}`, `restaurant:{id}:admin`, `session:{token}`.
- [ ] **Rate limit de eventos** client→server: máximo 10 eventos/s por socket. Desconectar sockets que excedem.
- [ ] **Propagação de `correlationId`** nos eventos WebSocket para tracing end-to-end.
- [ ] Atualizar **CSP** no Helmet para incluir `connect-src 'self' wss://*.ochefia.com.br` (WebSocket).
- [ ] **Componente reutilizável de indicador de conexão** WebSocket + **polling HTTP como fallback** quando desconectado (banner "Reconectando..." + fetch REST a cada 10s). Ver `docs/websocket-events.md` seção Reconexão.
- [ ] **Job Bull `ochefia-session-cleanup`:** fecha sessões vazias (sem pedidos) abertas há mais de `idleTableThreshold` minutos. Job periódico. Sessões com pedidos nunca são fechadas automaticamente.
- [ ] **Deduplicação de eventos** para garçons em múltiplos setores: usar `Set` de socketIds antes de emitir para múltiplas rooms.
- [ ] **Backpressure:** eventos não-críticos (metrics-update) usam `socket.volatile.emit()`. Eventos críticos (order-update, payment-update) usam emit normal.
