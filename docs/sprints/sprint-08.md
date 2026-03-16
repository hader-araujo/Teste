# Sprint 8 — Aprovação de Entrantes + Cache Cardápio

Backend do fluxo de aprovação e cache do cardápio. Frontend na Sprint 9.

**Endpoints (~7):**
- POST `/session/:token/join` — Solicitar entrada em sessão existente (nunca cria sessão). Auto-aprova se telefone já participou, senão cria solicitação pendente. **Pré-requisito:** WhatsApp verificado.
- GET `/session/:token/join/pending` — Listar solicitações pendentes de aprovação.
- PATCH `/session/:token/join/:requestId/approve` — Aprovar novo membro.
- PATCH `/session/:token/join/:requestId/reject` — Rejeitar novo membro.
- POST `/session/:token/join/:requestId/remind` — Reenviar notificação (cooldown 60s).
- GET `/session/:token/join/:requestId/status` — Verificar status da solicitação.
- DELETE `/session/:token/join/reset-limit` — Staff reseta limite de re-solicitações (body: `{ phone }`). Para casos legítimos após 3 tentativas.
- GET `/menu/:restaurantSlug` — Cardápio público (com cache Redis).

**Checklist:**
- [ ] **Sistema de aprovação de novos entrantes:** primeiro cliente cria sessão automaticamente; novos entrantes entram em fila de aprovação após verificação WhatsApp. Retorna erro `SESSION_007` se telefone não verificado.
- [ ] **Timeout de aprovação:** solicitação expira após 5 minutos sem resposta. Status muda para `JOIN_EXPIRED` automaticamente via job Bull.
- [ ] **Auto-renotificação:** a cada 60 segundos sem resposta, reenviar notificação automaticamente aos membros da mesa (dentro do período de 5 minutos).
- [ ] **Notificação via polling HTTP (sem WebSocket):** membros da mesa consultam `GET /session/:token/join/pending` a cada 10s para ver solicitações pendentes. WebSocket substituirá este polling na Sprint 13.
- [ ] Entrante pode re-solicitar após rejeição ou expiração. Máximo 3 tentativas por telefone por sessão (SESSION_014).
- [ ] Endpoint `DELETE /session/:token/join/reset-limit` para staff resetar o limite de re-solicitações em casos legítimos.
- [ ] Reentrada: reconhecer membro já aprovado via cookie + telefone verificado.
- [ ] Cache do cardápio no Redis com TTL de 5min + invalidação explícita no CRUD de produtos/categorias.
- [ ] Cache stampede prevention: lock-based refresh ou stale-while-revalidate no cache do cardápio.
- [ ] Error codes padronizados para módulo Session — aprovação (SESSION_007, SESSION_014). Ver `docs/observabilidade.md`.

**Referências:** `docs/modulos.md` (seção aprovação), `docs/api-endpoints.md`, `docs/seguranca.md`.
