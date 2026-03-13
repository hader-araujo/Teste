# Sprint 16 — Garçom: Claim + Taxa de Serviço + Comanda

**Endpoints (~3):**
- PATCH `/orders/:id/delivery-groups/:group/claim` — Garçom assume retirada do grupo de entrega inteiro.
- PATCH `/session/:token/service-charge` — Toggle taxa de serviço (garçom only). Body: `{ enabled, personId? }`. Sem `personId` = aplica para todos; com `personId` = toggle individual.
- PATCH `/tables/:id/transfer` — Transferência de mesa (cross-sector). Permite mover sessão ativa para outra mesa.

**Checklist:**
- [ ] **Claim de retirada por grupo:** `PATCH /orders/:id/delivery-groups/:group/claim` — garçom assume retirada do grupo de entrega inteiro (`group` = `normal` ou `immediate`). Body: `{ staffId }`. Registra `claimedByStaffId` em todos os itens do grupo. Some da tela dos outros garçons via WebSocket (`waiter:pickup-claimed`).
- [ ] Frontend garçom: detalhe da mesa (pedidos por pessoa). Itens com status "Pronto" exibem botão "Retirar" (claim).
- [ ] **Toggle taxa de serviço** por pessoa ou por mesa toda (garçom). Toggle geral como atalho + toggle individual por pessoa na tela de detalhe da mesa. Se desliga o geral, todos desligam. Se religa, todos religam. Individual altera o geral para estado parcial (checkbox indeterminado). Usa endpoint `PATCH /session/:token/service-charge`.
- [ ] **Transferência de mesa:** `PATCH /tables/:id/transfer` — permite mover sessão ativa para outra mesa, incluindo cross-sector. Atualiza o setor da sessão e notifica garçons envolvidos via WebSocket.
- [ ] Frontend garçom: comanda rápida.
