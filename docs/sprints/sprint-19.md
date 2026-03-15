# Sprint 19 — Faturamento

**Endpoints (~4):**
- GET `/billing/daily` — Faturamento do dia.
- GET `/billing/monthly` — Faturamento mensal.
- GET `/billing/cashier` — Fechamento de caixa.
- GET `/billing/waiter-fees` — Taxas de garçom por período.

**Checklist:**
- [ ] **Lógica de criação de WaiterFee:** ao confirmar pagamento (`PATCH /payments/:id/confirm` ou webhook PIX), se pessoa tem `serviceChargeEnabled = true`: buscar garçons ativos no setor da mesa (via DayTeamSectorAssignment + shift ativo), dividir taxa igualmente, criar 1 WaiterFee por garçom. Itens com `kitchenDelivery = true` também geram taxa (garçom atendeu a mesa como um todo).
- [ ] Faturamento diário: receita, pedidos, ticket médio, comparativo. Campo 'devoluções do dia' no faturamento diário (soma de PAYMENT_REFUNDED no período).
- [ ] Faturamento mensal: receita acumulada, gráfico por dia, comparativo.
- [ ] Fechamento de caixa: valores por forma de pagamento.
- [ ] Taxas de garçom: valor devido a cada garçom no período.
- [ ] Frontend admin: tela de faturamento.
