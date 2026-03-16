# Sprint 6 — Upload de Imagens + Frontend Cardápio Admin

Upload de imagens de produtos e frontend admin do cardápio. Backend do CRUD na Sprint 5.

**Endpoints (~2):**
- POST `/upload/product-images` — Upload de imagens de produto (multipart, max 5 por request).
- DELETE `/upload/product-images/:imageId` — Remover imagem de produto.

**Checklist:**
- [ ] StorageService com interface (`upload`, `delete`, `getUrl`).
- [ ] Implementação Local (filesystem com volume Docker). `STORAGE_DRIVER=local`.
- [ ] Fila Bull `ochefia-image-resize` para resize assíncrono com Sharp (thumb 200px, media 600px, original). **Propagar `correlationId`** nos dados do job Bull.
- [ ] Validação de MIME type real com `file-type` (não confiar na extensão). Aceitar apenas JPEG/PNG/WebP. Tamanho máximo: 5MB por arquivo, 5 arquivos por request.
- [ ] Sanitizar nome do arquivo (usar UUID como nome no storage).
- [ ] Upload com preview, reordenação e remoção de imagens.
- [ ] Frontend admin: tela cardápio CRUD (categorias, tags, produtos com fotos).

**Referências:** `docs/modulos.md` (Upload de imagens, Storage de Imagens), `docs/api-endpoints.md` (Upload), `docs/seguranca.md` (Upload de Imagens), `docs/deploy.md` (fila `ochefia-image-resize`).
