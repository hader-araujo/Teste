# Sprint 5 — Menu CRUD Backend

Backend do cardápio. Upload de imagens e frontend admin na Sprint 6.

**Endpoints (~14):**
- GET `/menu/categories` — Listar categorias (admin).
- POST `/menu/categories` — Criar categoria.
- PUT `/menu/categories/:id` — Atualizar categoria.
- DELETE `/menu/categories/:id` — Remover categoria.
- PATCH `/menu/categories/:id/availability` — Toggle disponibilidade da categoria (oculta/exibe todos os produtos).
- GET `/menu/tags` — Listar tags de produto.
- POST `/menu/tags` — Criar tag.
- PUT `/menu/tags/:id` — Atualizar tag.
- DELETE `/menu/tags/:id` — Remover tag.
- GET `/menu/products` — Listar produtos (admin).
- POST `/menu/products` — Criar produto (inclui `pickupPointId` ou `destination: 'waiter'`, `earlyDelivery?: bool`, e `tagIds[]`).
- PUT `/menu/products/:id` — Atualizar produto.
- DELETE `/menu/products/:id` — Remover produto (soft delete, só se não tem pedidos ativos vinculados).
- PATCH `/menu/products/:id/availability` — Toggle disponibilidade.

**Checklist:**
- [ ] CRUD de categorias.
- [ ] CRUD de tags de produto (vegano, sem glúten, picante, etc).
- [ ] CRUD de produtos com campo `pickupPointId` (Ponto de Entrega vinculado a Local de Preparo) ou `destination: 'waiter'` (entrega direta pelo garçom). Flag `earlyDelivery` (boolean, default `false`) para itens que podem ser entregues antes dos demais (ex: drinks).
- [ ] Sanitização de inputs de texto livre (nome de categoria, nome/descrição de produto, nome de tag) contra XSS via `class-transformer`.
- [ ] Error codes padronizados para módulo Menu (MENU_001 a MENU_005). Ver `docs/observabilidade.md`.
