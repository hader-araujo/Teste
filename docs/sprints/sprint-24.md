# Sprint 24 — Performance + Resiliência

Otimizações e preparação para produção. Zero endpoints REST novos.

**Checklist:**
- [ ] Performance: otimizar queries lentas (monitorar N+1 com `prisma.$on('query')`), verificar cache Redis.
- [ ] Performance: lazy loading de imagens no cardápio (`loading="lazy"` + WebP + placeholder blur).
- [ ] Performance: paginação em todos os endpoints de listagem (orders, staff, establishments).
- [ ] Performance: bundle analysis com `@next/bundle-analyzer` — code splitting por módulo (admin vs cliente vs garçom).
- [ ] Resiliência: circuit breaker (`opossum`) para dependências externas restantes (WhatsApp API — Pix já coberto na Sprint 10).
- [ ] Resiliência: modo degradado quando Redis cai (fallback para banco direto no cardápio, métricas calculadas on-demand). Ver `docs/observabilidade.md` seção Modo Degradado.
- [ ] Resiliência: timeout de sessão — alerta no admin para sessões abertas há mais de 6 horas.
- [ ] Resiliência: graceful shutdown (drenar WebSocket, fechar conexões banco/Redis em SIGTERM).
- [ ] Validar database indexing: índices compostos em (restaurantId, status) para orders, (restaurantId, createdAt) para sessões.
- [ ] Teste de carga multi-tenant: validar isolamento de dados entre restaurantes sob carga (100+ req/s).
- [ ] Bull failed jobs processing strategy documentada e testada.
- [ ] Infra: Docker Compose de produção otimizado (healthchecks, restart policies, resource limits).
