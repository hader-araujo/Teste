# Sprint 11 — Frontend Carrinho + Pedidos + Conta

Frontend do fluxo de pedidos do cliente. Zero endpoints REST novos (backend na Sprint 10).

**Endpoints usados (criados na Sprint 10):**
- POST `/orders` — Criar pedido.
- GET `/orders/:id` — Detalhes do pedido.
- PATCH `/orders/items/:id/people` — Reatribuir pessoas a um item.
- GET `/session/:token/bill` — Conta detalhada com divisão por pessoa + taxa de serviço.
- GET `/session/:token/activity-log` — Log de atividade de pedidos e reatribuições.

**Checklist:**
- [ ] Frontend cliente: carrinho com seleção de pessoas por item e campo de observação (notes) por item.
- [ ] Frontend cliente: tela "Meus Pedidos" com status em tempo real e reatribuição de pessoas.
- [ ] Frontend cliente: conta com divisão por pessoa + taxa de serviço, organizada em 3 abas:
  - **Visão geral:** total da mesa, total por pessoa, taxa de serviço.
  - **Por pessoa:** itens consumidos por cada pessoa com valores individuais.
  - **Histórico:** log de atividade completo (criação de pedidos, reatribuições, cancelamentos), visível para todos os membros da mesa.
- [ ] Frontend cliente: reatribuição de itens entre pessoas (arrastar ou selecionar).
- [ ] Carrinho persiste em localStorage (sem backend de carrinho na Fase 1).
