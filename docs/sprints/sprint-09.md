# Sprint 9 — Pedidos Backend + Grupos de Entrega

Backend de pedidos. Frontend do carrinho e conta na Sprint 10.

**Endpoints (~10):**
- POST `/orders` — Criar pedido (cada item com `personIds[]` obrigatório e `notes?` opcional).
- GET `/orders` — Listar pedidos (admin, filtros). **Paginação:** query `page` e `limit` (default 20, max 100).
- GET `/orders/:id` — Detalhes do pedido.
- GET `/session/:token/bill` — Conta detalhada com divisão por pessoa, taxa de serviço e totais.
- PATCH `/orders/items/:id/status` — Status de item individual.
- PATCH `/orders/:id/cancel` — Cancelar pedido inteiro.
- PATCH `/orders/items/:id/cancel` — Cancelar item individual.
- PATCH `/orders/items/:id/people` — Reatribuir pessoas a um item.
- GET `/session/:token/activity-log` — Log de atividade de pedidos e reatribuições.

**Checklist:**
- [ ] Criação de pedido com seleção de pessoas por item e campo `notes` (observação) por item.
- [ ] Grupos de entrega por pedido: itens normais (garçom notificado quando todos ficarem prontos), itens `earlyDelivery` (notificado quando todos os antecipados ficarem prontos), itens destino "Garçom" (entrega direta). Internamente, itens roteados para o KDS do Local de Preparo correspondente.
- [ ] Máquina de estados do pedido: Na fila → Preparando → Pronto → Entregue + Cancelado. Cancelamento permitido apenas enquanto status = "Na fila".
- [ ] **Cancelamento de pedido:** `PATCH /orders/:id/cancel` — cancelar pedido inteiro — somente se TODOS os itens estão ORDER_QUEUED. Se algum item já está ORDER_PREPARING ou além, retorna erro.
- [ ] **Cancelamento de item:** `PATCH /orders/items/:id/cancel` — cancela item individual (apenas se "Na fila"). Cliente pode cancelar próprios itens (session token) se status ORDER_QUEUED.
- [ ] **Cancelamento de item Pronto/Entregue (OWNER/MANAGER):** mesmo endpoint, mas com role check. Requer motivo obrigatório. Registra em AuditLog. Se o item já foi pago (Payment PAYMENT_CONFIRMED), cria automaticamente PAYMENT_PENDING_REFUND no Payment correspondente. Cálculo: `refundAmount = itemPrice / numberOfPersons` — cada pessoa que já pagou recebe refund da sua parte proporcional; quem não pagou simplesmente deixa de ser cobrada.
- [ ] **Log de atividade de pedidos:** registrar todas as ações (criação de pedido, reatribuição de pessoas, cancelamentos) em formato estruturado. Renderizar como texto legível no frontend (ex: "Picanha - José realizou o pedido / Para: José e Antônio").
- [ ] QueueService abstraction (interface única para Bull + Redis; preparada para futura migração para SQS na Fase 2).
- [ ] Error codes padronizados para módulo Orders (ORDER_001 a ORDER_006). Ver `docs/observabilidade.md`.
- [ ] **orderNumber:** sequencial por restaurante por dia. Implementar via counter atômico: `SELECT MAX(orderNumber) + 1` dentro de transação Prisma, filtrado por restaurantId + data (America/Sao_Paulo). Reset automático à meia-noite.
- [ ] Endpoint GET /session/:token/bill — dados da conta com divisão por pessoa, taxa de serviço e totais.
