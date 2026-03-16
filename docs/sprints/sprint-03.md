# Sprint 3 — Tables + Setores + Locais de Preparo (Backend)

Backend puro dos módulos de estrutura operacional. Frontend na Sprint 4.

**Endpoints (~20):**
- GET `/tables` — Listar mesas do restaurante.
- POST `/tables` — Criar mesa (body inclui `sectorId` obrigatório).
- PUT `/tables/:id` — Atualizar mesa.
- DELETE `/tables/:id` — Soft delete de mesa (só se fechada, histórico preservado, permite recriar com mesmo nome).
- POST `/tables/:id/open` — Abrir sessão da mesa (estrutura base). Sprint 7 adiciona OTP + body `{ phone, personCount?, names? }`. Sprint 18 adiciona `open-staff`.
- POST `/tables/:id/close` — Fechar sessão (requer pagamentos quitados).
- POST `/tables/:id/force-close` — Forçar fechamento de sessão (OWNER/MANAGER). Cancela pagamentos pendentes.
- GET `/tables/:id/session` — Sessão ativa da mesa.
- GET `/preparation-locations` — Listar locais de preparo.
- POST `/preparation-locations` — Criar local de preparo (gera 1 Ponto de Entrega default).
- PUT `/preparation-locations/:id` — Atualizar local de preparo.
- DELETE `/preparation-locations/:id` — Remover local de preparo.
- GET `/preparation-locations/:id/pickup-points` — Listar pontos de entrega.
- POST `/preparation-locations/:id/pickup-points` — Criar ponto de entrega.
- PUT `/pickup-points/:id` — Atualizar ponto de entrega.
- DELETE `/pickup-points/:id` — Remover ponto de entrega.
- GET `/sectors` — Listar setores.
- POST `/sectors` — Criar setor.
- PUT `/sectors/:id` — Atualizar setor.
- DELETE `/sectors/:id` — Remover setor.
- PUT `/sectors/:id/pickup-point-mappings` — Definir mapeamento de pontos de entrega por local de preparo.
- GET `/sectors/:id/pickup-point-mappings` — Listar mapeamentos do setor.

**Checklist:**
- [ ] CRUD de mesas + sessão (open/close). Mesa com `sectorId` obrigatório. Soft delete via campo `deletedAt` (nullable timestamp). `GET /tables` retorna apenas `deletedAt IS NULL`. Só permite deletar se sem sessão ativa. Recriar = criar nova mesa (novo ID) com mesmo nome/número. Histórico preservado para métricas.
- [ ] **Force-close de sessão:** `POST /tables/:id/force-close` (OWNER/MANAGER). Fecha sessão mesmo com pagamentos pendentes — marca pendentes como `PAYMENT_CANCELLED`. Body: `{ confirm: true }` (obrigatório, previne chamada acidental). Registra em AuditLog com motivo.
- [ ] **Concorrência em `POST /tables/:id/open`:** usar `SELECT ... FOR UPDATE` (ou constraint unique em `sessions` com `tableId` + `status = 'ACTIVE'`) para garantir apenas uma sessão ativa por mesa. Retornar erro `SESSION_002` se mesa já tem sessão ativa.
- [ ] CRUD de Locais de Preparo (nome). Criação gera 1 Ponto de Entrega default automaticamente. Campos `kdsWarningMinutes` (default 10) e `kdsCriticalMinutes` (default 15) — thresholds de cor no KDS, configuráveis por Local de Preparo.
- [ ] CRUD de Pontos de Entrega (nome, `kitchenDelivery` flag, vinculado a Local de Preparo).
- [ ] CRUD de Setores (nome). Setor default criado automaticamente com o restaurante.
- [ ] Mapeamento obrigatório Setor ↔ Local de Preparo: para cada setor, qual Ponto de Entrega usar por Local de Preparo.
- [ ] Seed com dados de teste: 2 Locais de Preparo ("Cozinha Principal", "Bar"), 1 Setor default ("Salão"), mesas vinculadas.
- [ ] Error codes padronizados para módulo Setores (SECTOR_001 a SECTOR_003). Ver `docs/observabilidade.md`.
