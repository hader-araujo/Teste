# Sprint 11 — Pagamento (Pix + Dinheiro + Cartão)

**Endpoints (~8):**
- POST `/session/:token/payments` — Cliente inicia pagamento. Body: `{ personId, method }`. Registra `initiatedBy: CLIENT`.
- POST `/payments` — Staff inicia pagamento. Roles: WAITER, MANAGER, OWNER. Body: `{ sessionId, personId, method }`. Registra `initiatedBy: STAFF` + `initiatedByStaffId`.
- GET `/payments/:id/status` — Verificar status (inclui quem iniciou, quem confirmou).
- PATCH `/payments/:id/confirm` — Staff confirma pagamento. Qualquer método. Obrigatório para CASH/CARD, fallback manual para PIX.
- POST `/payments/pix/webhook` — Webhook de confirmação Pix (automático).
- PATCH `/payments/:id/cancel` — Staff cancela pagamento pendente. Body: `{ reason? }`.
- PATCH `/session/:token/payments/:id/cancel` — Cliente cancela o próprio pagamento pendente.
- PATCH `/payments/:id/refund` — Staff confirma devolução. Body: `{ method, amount }`.

**Checklist:**
- [ ] **Fluxo unificado de pagamento (todos os métodos):**
  - Cliente ou garçom inicia pagamento (PIX, CASH ou CARD) → status `PENDING`.
  - **PIX:** webhook confirma automaticamente → `CONFIRMED`. Se webhook falha, garçom confirma manualmente via `PATCH /payments/:id/confirm`.
  - **CASH/CARD:** garçom confirma via `PATCH /payments/:id/confirm` → `CONFIRMED`.
  - Campos de audit trail: `initiatedBy` (CLIENT/STAFF), `initiatedByStaffId`, `confirmedByStaffId`, `confirmedAt`.
- [ ] Pagamento individual Pix com QR Code por pessoa.
- [ ] Webhook Pix com validação de assinatura **síncrona** (retorna 400 se inválida, só enfileira após validação). **Idempotência:** `externalId` do provedor como constraint unique na tabela `Payment`. Se webhook chega 2x com mesmo `externalId`, segunda chamada retorna 200 sem reprocessar. Processamento via fila assíncrona (Bull + Redis). **Propagar `correlationId`** nos dados do job Bull.
- [ ] Whitelist de IPs do provedor Pix como camada extra de segurança.
- [ ] Circuit breaker (`opossum`) no provedor Pix com thresholds definidos (timeout 15s, 3 falhas em 60s, reset 120s).
- [ ] Abstração de provedor de pagamento (PaymentProviderService) para evitar lock-in.
- [ ] Frontend cliente: pagamento com seleção de método (PIX, Dinheiro, Débito, Crédito).
- [ ] **Expiração de Pix pendente:** job Bull que verifica pagamentos Pix com status `PENDING` há mais de 30 minutos e marca como `EXPIRED`. Emite `client:payment-cancelled` com `reason: 'expired'`. Frontend exibe "Pagamento expirado — tente novamente" com botão para gerar novo QR Code.
- [ ] **Cancelamento:** staff cancela via `PATCH /payments/:id/cancel`, cliente cancela via `PATCH /session/:token/payments/:id/cancel`. Só status `PENDING`. Emite `client:payment-cancelled` com `reason: 'staff_cancelled'`.
- [ ] **Devolução:** `PATCH /payments/:id/refund` (WAITER+). Transição `PENDING_REFUND → REFUNDED`. Método de devolução pode diferir do original.
- [ ] Error codes padronizados para módulo Payments (PAY_001 a PAY_006). Ver `docs/observabilidade.md`.

**Referências:** `docs/api-endpoints.md` (Payments), `docs/seguranca.md` (Pix/webhook), `docs/modulos.md` (Conta e Pagamento), `docs/schema.md` (Payment, PaymentStatus).
