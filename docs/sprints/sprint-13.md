# Sprint 13 — KDS Backend + WebSocket Avançado

Backend do KDS e funcionalidades avançadas de WebSocket. Zero endpoints REST novos.

**Checklist:**
- [ ] Roteamento de pedidos por Ponto de Entrega → Local de Preparo do produto. Produtos com destino "Garçom" vão direto para o garçom do setor.
- [ ] KDS backend: fila de produção e transições de status.
- [ ] **Deduplicação de eventos:** garçom em múltiplos setores (múltiplas rooms) não deve receber evento duplicado. Usar `Set` de socketIds notificados antes de emitir para múltiplas rooms. Ver `docs/websocket-events.md` seção Deduplicação.
- [ ] **Backpressure:** usar `socket.volatile.emit()` para eventos não-críticos (metrics-update). Eventos críticos (order-update, payment-update) usam `emit()` normal.
- [ ] Testar Socket.IO com Redis Adapter (validar que eventos passam pelo Redis corretamente).
- [ ] Cleanup de rooms órfãs (sessões fechadas, clientes desconectados) para prevenir memory leak.
- [ ] Monitorar contagem de listeners por room para detectar leaks.
- [ ] Lógica de reconexão: ao reconectar, cliente faz fetch REST para sincronizar estado perdido.
- [ ] Error codes padronizados para módulo KDS (KDS_001, KDS_002). Ver `docs/observabilidade.md`.
