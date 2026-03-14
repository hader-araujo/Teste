# Sprint 5 — Menu CRUD Backend + Upload de Imagens

**Endpoints (~14):**
- GET `/menu/categories` — Listar categorias (admin).
- POST `/menu/categories` — Criar categoria.
- PUT `/menu/categories/:id` — Atualizar categoria.
- DELETE `/menu/categories/:id` — Remover categoria.
- GET `/menu/tags` — Listar tags de produto.
- POST `/menu/tags` — Criar tag.
- PUT `/menu/tags/:id` — Atualizar tag.
- DELETE `/menu/tags/:id` — Remover tag.
- GET `/menu/products` — Listar produtos (admin).
- POST `/menu/products` — Criar produto (inclui `pickupPointId` ou `destination: 'waiter'`, `immediateDelivery?: bool`, e `tagIds[]`).
- PUT `/menu/products/:id` — Atualizar produto.
- PATCH `/menu/products/:id/availability` — Toggle disponibilidade.
- POST `/upload/product-images` — Upload de imagens (multipart, max 5).
- DELETE `/upload/product-images/:imageId` — Remover imagem.

**Checklist:**
- [ ] CRUD de categorias.
- [ ] CRUD de tags de produto (vegano, sem glúten, picante, etc).
- [ ] CRUD de produtos com campo `pickupPointId` (Ponto de Entrega vinculado a Local de Preparo) ou `destination: 'waiter'` (entrega direta pelo garçom). Flag `immediateDelivery` (boolean, default `false`) para itens que podem ser entregues antes dos demais (ex: drinks).
- [ ] StorageService com interface (upload, delete, getUrl).
- [ ] Implementação Local (filesystem com volume Docker). `STORAGE_DRIVER=local`.
- [ ] Resize com sharp (thumb 200px, media 600px, original) — processado via fila assíncrona (Bull + Redis). **Propagar `correlationId`** nos dados do job Bull.
- [ ] Validação de MIME type real com `file-type` (não confiar na extensão). Aceitar apenas JPEG/PNG/WebP.
- [ ] Sanitizar nome do arquivo (usar UUID como nome no storage).
- [ ] Upload com preview, reordenação e remoção.
- [ ] Frontend admin: tela cardápio CRUD.
- [ ] Sanitização de inputs de texto livre (nome de categoria, nome/descrição de produto, nome de tag) contra XSS via `class-transformer`.
- [ ] Error codes padronizados para módulo Menu (MENU_001 a MENU_004). Ver `docs/observabilidade.md`.
