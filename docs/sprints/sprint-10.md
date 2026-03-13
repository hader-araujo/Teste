# Sprint 10 — Pagamento Pix

**Endpoints (~4):**
- POST `/payments` — Iniciar pagamento individual por pessoa.
- GET `/payments/:id/status` — Verificar status.
- POST `/payments/pix/webhook` — Webhook de confirmação Pix.
- GET `/payments/session/:token` — Listar pagamentos da sessão.

**Checklist:**
- [ ] Pagamento individual Pix com QR Code por pessoa.
- [ ] Webhook Pix com validação de assinatura **síncrona** (retorna 400 se inválida, só enfileira após validação). Idempotency via `externalId` do provedor. Processamento via fila assíncrona (Bull + Redis). **Propagar `correlationId`** nos dados do job Bull.
- [ ] Whitelist de IPs do provedor Pix como camada extra de segurança.
- [ ] Circuit breaker (`opossum`) no provedor Pix com thresholds definidos (timeout 15s, 3 falhas em 60s, reset 120s).
- [ ] Abstração de provedor de pagamento (PaymentProviderService) para evitar lock-in.
- [ ] Frontend cliente: pagamento Pix com QR Code.
- [ ] Error codes padronizados para módulo Payments (PAY_001 a PAY_004). Ver `docs/observabilidade.md`.
