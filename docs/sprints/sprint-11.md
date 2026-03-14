# Sprint 11 — Pagamento (Pix + Dinheiro + Cartão)

**Endpoints (~6):**
- POST `/payments` — Iniciar pagamento individual por pessoa. Body: `{ sessionToken, personId, method: 'PIX' | 'CASH' | 'CARD_DEBIT' | 'CARD_CREDIT' }`.
- GET `/payments/:id/status` — Verificar status.
- PATCH `/payments/:id/confirm` — Staff confirma recebimento de pagamento CASH/CARD (WAITER/MANAGER/OWNER).
- POST `/payments/pix/webhook` — Webhook de confirmação Pix.
- GET `/payments/session/:token` — Listar pagamentos da sessão.
- POST `/payments/manual` — Registrar pagamento manual (OWNER/MANAGER). Para quando cliente pagou mas webhook falhou.

**Checklist:**
- [ ] **Fluxo por método de pagamento:**
  - **PIX:** cliente inicia pelo app → gera QR Code → webhook confirma automaticamente → status `CONFIRMED`.
  - **CASH/CARD:** cliente seleciona método no app → sistema cria pagamento com status `AWAITING_STAFF` → garçom recebe notificação → garçom confirma via `PATCH /payments/:id/confirm` → status `CONFIRMED`.
- [ ] Pagamento individual Pix com QR Code por pessoa.
- [ ] Webhook Pix com validação de assinatura **síncrona** (retorna 400 se inválida, só enfileira após validação). **Idempotência:** `externalId` do provedor como constraint unique na tabela `Payment`. Se webhook chega 2x com mesmo `externalId`, segunda chamada retorna 200 sem reprocessar. Processamento via fila assíncrona (Bull + Redis). **Propagar `correlationId`** nos dados do job Bull.
- [ ] Whitelist de IPs do provedor Pix como camada extra de segurança.
- [ ] Circuit breaker (`opossum`) no provedor Pix com thresholds definidos (timeout 15s, 3 falhas em 60s, reset 120s).
- [ ] Abstração de provedor de pagamento (PaymentProviderService) para evitar lock-in.
- [ ] Frontend cliente: pagamento Pix com QR Code.
- [ ] **Expiração de Pix pendente:** job Bull que verifica pagamentos Pix com status `PENDING` há mais de 15 minutos e marca como `EXPIRED`. Frontend exibe "Pagamento expirado — tente novamente" com botão para gerar novo QR Code.
- [ ] **Pagamento manual (fallback):** endpoint `POST /payments/manual` (OWNER/MANAGER) para registrar pagamento quando cliente pagou mas webhook não chegou. Body: `{ sessionToken, personId, method, amount }`. Registra em AuditLog.
- [ ] Error codes padronizados para módulo Payments (PAY_001 a PAY_004). Ver `docs/observabilidade.md`.
