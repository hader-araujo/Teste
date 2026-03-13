# Roadmap de Sprints

## Sprint P — Protótipos HTML (antes de tudo)
Protótipos funcionais em HTML puro + CSS + JS vanilla. Sem React, sem NestJS, sem frameworks. Dados mockados hardcoded com valores realistas brasileiros (restaurante "Zé do Bar", pratos reais, preços reais, nomes reais). Interações básicas com JS vanilla (carrinho, seleção de pessoas, troca de abas, mudança de status). Não persiste dados — é apenas para validação visual e de fluxo.

**Estrutura:**
```
prototypes/
├── index.html                  <- Hub com links para todas as telas
├── style-guide.html            <- Design system: cores, tipografia, componentes base
├── css/
│   └── style.css               <- CSS compartilhado (variáveis, componentes, layout)
├── js/
│   └── app.js                  <- JS compartilhado (interações, dados mock, navegação)
├── cliente/
│   ├── whatsapp.html           <- Tela de verificação WhatsApp
│   ├── pessoas.html            <- Cadastro de pessoas na mesa
│   ├── cardapio.html           <- Cardápio com fotos, categorias, filtros
│   ├── produto.html            <- Detalhe do produto com galeria de fotos
│   ├── carrinho.html           <- Carrinho com seleção de pessoas por item
│   ├── pedidos.html            <- Meus Pedidos (agrupado, com status e reatribuição)
│   ├── conta.html              <- Conta com divisão por pessoa + taxa de serviço
│   └── pagamento.html          <- QR Code Pix individual por pessoa
├── admin/
│   ├── login.html              <- Tela de login
│   ├── dashboard.html          <- Métricas dinâmicas por Local de Preparo, pedidos recentes, chamados, seção alertas
│   ├── mesas.html              <- Mapa de mesas com status + filtros (todas/com problema/ociosas) + delete de mesa
│   ├── cardapio-admin.html     <- CRUD categorias, tags e produtos (com upload de fotos, Ponto de Entrega ou "Garçom", flag entrega imediata)
│   ├── locais-preparo.html     <- CRUD de Locais de Preparo + Pontos de Entrega (com flag auto-entrega)
│   ├── setores.html            <- CRUD de Setores + mesas vinculadas + mapeamento de Pontos de Entrega por Local de Preparo
│   ├── desempenho.html         <- Desempenho da equipe: métricas por garçom e por Local de Preparo
│   ├── faturamento.html        <- Faturamento diário, mensal e taxas de garçom
│   ├── staff.html              <- Gestão de equipe + convites + flag temporário + senha garçom
│   ├── escala.html             <- Programação de escala (calendário por dia, próximos dias)
│   ├── equipe-do-dia.html      <- Equipe trabalhando hoje + atribuição de setores por garçom
│   └── settings.html           <- Configurações (nome/logo do estabelecimento, taxa de serviço, tema/cores com preview)
├── kds/
│   └── kds.html                <- Fila de produção por Local de Preparo (dark mode, temporizadores, cores)
├── garcom/
│   ├── clock-in.html           <- Ativação de turno (senha do garçom)
│   ├── mesas.html              <- Lista de mesas dos setores atribuídos
│   ├── chamados.html           <- Chamados abertos + notificações
│   ├── mesa-abrir.html         <- Abrir mesa (quantidade de pessoas + nomes)
│   ├── mesa-detalhe.html       <- Pedidos da mesa com divisão por pessoa
│   └── comanda.html            <- Lançar pedido rápido
└── superadmin/
    ├── login.html              <- Login do Super Admin (mesmo layout, branding OChefia)
    ├── dashboard.html          <- Painel principal: KPIs (total estabelecimentos, ativos, suspensos, inadimplentes), últimos acessos, alertas
    ├── estabelecimentos.html   <- Listagem de todos os estabelecimentos com filtros (status, inadimplente) + paginação
    ├── estabelecimento-novo.html    <- Cadastro de novo estabelecimento (nome, slug, CNPJ, responsável, email, telefone)
    ├── estabelecimento-detalhe.html <- Detalhes do estabelecimento (dados, status, módulos ativos, histórico de cobrança)
    ├── cobranca.html           <- Gestão de cobrança: valor do plano, registro de pagamentos mensais, histórico, status (pago/pendente/atrasado)
    ├── modulos.html            <- Gestão de módulos: listar módulos disponíveis, habilitar/desabilitar por estabelecimento, valores (global e override)
    └── monitoramento.html      <- Métricas de uso, últimos acessos, pedidos/mês por estabelecimento
```

**Checklist:**
- [x] `style-guide.html` — paleta de cores, tipografia, todos os componentes base renderizados.
- [x] Telas do **cliente** — fluxo completo: WhatsApp -> pessoas -> cardápio -> produto -> carrinho (com seleção de pessoas) -> pedidos -> conta -> pagamento.
- [x] Telas do **admin** — login -> dashboard (KPIs dinâmicos por Local de Preparo + seção alertas) -> mesas (filtros: todas/com problema/ociosas + delete de mesa) -> cardápio CRUD (com tags, Ponto de Entrega ou "Garçom", flag entrega imediata) -> locais de preparo (CRUD + pontos de entrega com flag auto-entrega) -> setores (CRUD + mesas + mapeamento de pontos de entrega) -> desempenho da equipe (métricas por garçom e por Local de Preparo) -> faturamento (diário, mensal, taxas garçom, escalações) -> staff (com temporário + senha garçom) -> escala -> equipe do dia (com atribuição de setores) -> settings (com nome/logo do estabelecimento, escalação de retirada).
- [x] Telas do **KDS** — tela única por Local de Preparo com fila, cores de status, temporizadores. Mockar pelo menos 2 locais (ex: "Cozinha Principal" e "Bar").
- [x] Telas do **garçom** — ativação de turno (clock-in com senha) -> chamados (tab principal, com banner de notificação) -> mesas agrupadas por setor -> abrir mesa (pessoas + nomes) -> detalhe da mesa (com botão "Retirar" em itens prontos) -> comanda.
- [x] Navegação funcional entre todas as telas (links, incluindo Super Admin).
- [x] Interações JS: adicionar ao carrinho, selecionar pessoas, trocar abas, mudar status no KDS, claim de retirada no garçom.
- [x] Responsivo: cliente e garçom em mobile (375px), admin e KDS em desktop/tablet (1024px+).
- [x] Tela de **Settings** com seleção de tema + color picker + preview do cardápio + parâmetros de escalação de retirada (`pickupReminderInterval`, `pickupEscalationTimeout`).
- [x] Protótipos do cliente devem demonstrar pelo menos 2 temas diferentes (Clássico + Escuro) para validar que o theming funciona.
- [x] Telas do **Super Admin** — login -> dashboard (KPIs: total estabelecimentos, ativos, suspensos, inadimplentes) -> listagem de estabelecimentos (com filtros de status e inadimplência, paginação) -> cadastro de novo estabelecimento (nome, slug, CNPJ, responsável, email, telefone) -> detalhe do estabelecimento (dados, status ativo/suspenso, módulos ativos, histórico de cobrança) -> cobrança (valor do plano base, registro de pagamentos mensais, status pago/pendente/atrasado, indicadores de inadimplência) -> módulos (listar módulos disponíveis com valor padrão, habilitar/desabilitar por estabelecimento, valor override) -> monitoramento (métricas de uso por estabelecimento, últimos acessos, pedidos/mês).
- [x] Navegação Super Admin: sidebar própria com branding OChefia (não do restaurante). Menu: Dashboard, Estabelecimentos, Módulos, Monitoramento. Cobrança é acessada dentro do detalhe do estabelecimento (não é item separado na sidebar).
- [x] Interações JS Super Admin: filtros na listagem, alterar status de estabelecimento, registrar pagamento, toggle de módulos, ordenação por métricas no monitoramento.
- [x] Responsivo Super Admin: desktop-first (mesma diretriz do admin).
- [ ] Validação visual aprovada pelo usuário antes de prosseguir para Sprint 0.

---

## Sprint 0 — Scaffolding + Monorepo + Docker

Setup completo da infraestrutura de desenvolvimento. Ao final, `pnpm install && docker compose up` funciona.

**Checklist:**
- [ ] Criar toda a estrutura de pastas do monorepo (`apps/api`, `apps/web`, `packages/shared`).
- [ ] Turborepo + pnpm workspace configurados.
- [ ] Docker Compose com PostgreSQL (5433) e Redis (6380).
- [ ] Prisma schema inicial (modelos base: Restaurant, User, Table).
- [ ] ESLint, Prettier, tsconfig compartilhado.
- [ ] `packages/shared` com estrutura básica e build funcional.
- [ ] NestJS scaffolding com módulo raiz.
- [ ] Next.js 14 App Router scaffolding.
- [ ] `README.md` em cada pasta relevante.
- [ ] Endpoint `GET /health` e `GET /health/ready` (health check básico + readiness).
- [ ] Helmet configurado com **Content Security Policy (CSP)** restritiva: `default-src 'self'`, `script-src 'self'`, `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`, `font-src 'self' https://fonts.gstatic.com`, `img-src 'self' data:`, `connect-src 'self'`. Revisar ao adicionar WebSocket (Sprint 9) e imagens externas (Fase 2). Ver `docs/seguranca.md` seção CSP.
- [ ] CORS configurado para origens permitidas.
- [ ] **Rate limiting global** por IP via `express-rate-limit` como middleware. Endpoints sensíveis terão limits específicos adicionais nas sprints seguintes.
- [ ] **Setup de sanitização** com `class-transformer` para campos de texto livre. Configurar como parte do `ValidationPipe` global. Campos afetados listados em `docs/seguranca.md` seção Sanitização de Input.
- [ ] CI/CD pipeline básico (GitHub Actions): lint + test em PRs.
- [ ] Dependabot configurado para scanning de vulnerabilidades.
- [ ] `pnpm audit` como step do CI.

---

## Sprint 1 — Auth + Restaurant + Seed

**Endpoints (~8):**
- POST `/auth/register` — Registro de restaurante + owner.
- POST `/auth/login` — Login -> retorna JWT.
- POST `/auth/refresh` — Refresh token.
- GET `/auth/me` — Dados do usuário logado.
- GET `/restaurants/:slug` — Dados públicos do restaurante.
- PUT `/restaurants/:id` — Atualizar dados (OWNER/MANAGER).
- GET `/restaurants/:id/settings` — Configurações.
- PUT `/restaurants/:id/settings` — Atualizar configurações.

**Checklist:**
- [ ] Módulo Auth completo (register, login, JWT access 15min + refresh 7d, roles).
- [ ] Roles: OWNER, MANAGER, WAITER, KITCHEN, BAR.
- [ ] Refresh token em httpOnly cookie com `SameSite=Strict`.
- [ ] **Suporte a dual JWT_SECRET** para rotação: validar token com secret atual e anterior simultaneamente. Ver `docs/seguranca.md` seção Rotação de Secrets.
- [ ] Rate limit específico em `/auth/login` (5 tentativas por IP em 15min).
- [ ] Rate limit específico em `/auth/refresh` (10 tentativas por IP em 15min).
- [ ] CSRF token (sync token pattern) para proteção de requests com cookie.
- [ ] CRUD de restaurante. Sanitização de `Restaurant.name` contra XSS via `class-transformer`.
- [ ] Winston logger + Correlation ID middleware.
- [ ] ValidationPipe global + Swagger.
- [ ] Seed com dados de teste (dono@ze-bar.com / senha123, slug ze-bar).
- [ ] Tabela `AuditLog` no Prisma schema (para uso em sprints futuras).
- [ ] **PostgreSQL RLS** como segunda camada de proteção para multi-tenancy. Policies baseadas em `restaurantId` nas tabelas principais. Ver `docs/seguranca.md`.
- [ ] Error codes padronizados para módulo Auth (AUTH_001, AUTH_002, AUTH_003). Ver `docs/observabilidade.md` seção Error Codes.

---

## Sprint 2 — Tables + Setores + Locais de Preparo (Backend)

Backend puro dos módulos de estrutura operacional. Frontend na Sprint 3.

**Endpoints (~20):**
- GET `/tables` — Listar mesas do restaurante.
- POST `/tables` — Criar mesa (body inclui `sectorId` obrigatório).
- PUT `/tables/:id` — Atualizar mesa.
- DELETE `/tables/:id` — Soft delete de mesa (só se fechada, histórico preservado, permite recriar com mesmo nome).
- POST `/tables/:id/open` — Abrir sessão da mesa.
- POST `/tables/:id/close` — Fechar sessão.
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
- [ ] CRUD de mesas + sessão (open/close). Mesa com `sectorId` obrigatório. Delete = soft delete (só se sem sessão ativa; histórico preservado; permite recriar com mesmo nome/número).
- [ ] CRUD de Locais de Preparo (nome). Criação gera 1 Ponto de Entrega default automaticamente.
- [ ] CRUD de Pontos de Entrega (nome, `autoDelivery` flag, vinculado a Local de Preparo).
- [ ] CRUD de Setores (nome). Setor default criado automaticamente com o restaurante.
- [ ] Mapeamento obrigatório Setor ↔ Local de Preparo: para cada setor, qual Ponto de Entrega usar por Local de Preparo.
- [ ] Seed com dados de teste: 2 Locais de Preparo ("Cozinha Principal", "Bar"), 1 Setor default ("Salão"), mesas vinculadas.

---

## Sprint 3 — Component Library + Layout Admin

Frontend puro. Zero endpoints REST novos. Biblioteca de componentes e estrutura visual do admin.

**Checklist:**
- [ ] Biblioteca de componentes base (Button, Input, Badge, Modal, Toggle, Skeleton, Spinner).
- [ ] Toast notifications (sonner).
- [ ] AdminSidebar fixa com navegação, avatar e role.
- [ ] Layout admin com sidebar + mobile top bar.
- [ ] Tela de login frontend (Next.js).
- [ ] Skeleton loading nos componentes base.
- [ ] Sentry integrado no Next.js (client-side error tracking). Propagar `correlationId` como tag.
- [ ] Componentes base com `aria-label`, `role` e `focus-visible` corretos.

---

## Sprint 4 — Menu CRUD Backend + Upload de Imagens

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

---

## Sprint 5 — Sessão de Mesa + WhatsApp OTP + Aprovação (Backend)

Backend da sessão do cliente. Frontend na Sprint 6.

**Endpoints (~14):**
- GET `/session/:token` — Dados da sessão.
- POST `/session/:token/join` — Solicitar entrada na sessão (cria sessão se primeira pessoa, ou cria solicitação pendente).
- POST `/session/:token/phone` — Enviar OTP via WhatsApp.
- POST `/session/:token/phone/verify` — Confirmar OTP.
- GET `/session/:token/join/pending` — Listar solicitações pendentes de aprovação.
- PATCH `/session/:token/join/:requestId/approve` — Aprovar novo membro.
- PATCH `/session/:token/join/:requestId/reject` — Rejeitar novo membro.
- POST `/session/:token/join/:requestId/remind` — Reenviar notificação (cooldown 60s).
- GET `/session/:token/join/:requestId/status` — Verificar status da solicitação.
- GET `/session/:token/people` — Listar pessoas na sessão.
- POST `/session/:token/people` — Adicionar pessoa na mesa.
- DELETE `/session/:token/people/:personId` — Remover pessoa.
- PATCH `/session/:token/service-charge` — Toggle taxa de serviço (garçom only). Body: `{ enabled, personId? }`. Sem `personId` = aplica para todos; com `personId` = toggle individual. Uso pelo garçom na Sprint 12.
- GET `/menu/:restaurantSlug` — Cardápio público (com cache Redis).

**Checklist:**
- [ ] Sessão de mesa via token criptograficamente seguro (UUID v4 ou `crypto.randomBytes(32)`) na URL + cookie.
- [ ] Verificação WhatsApp via OTP de 6 dígitos. Rate limit: 3 envios por sessão, cooldown 60s. OTP expira em 5min, max 5 tentativas.
- [ ] Envio de OTP via fila assíncrona (Bull + Redis). **Propagar `correlationId`** nos dados do job Bull.
- [ ] **Sistema de aprovação de novos entrantes:** primeiro cliente cria sessão automaticamente; novos entrantes entram em fila de aprovação após verificação WhatsApp.
- [ ] Reentrada: reconhecer membro já aprovado via cookie + telefone verificado.
- [ ] CRUD de pessoas na mesa.
- [ ] Cache do cardápio no Redis com TTL de 5min + invalidação explícita no CRUD de produtos/categorias.
- [ ] Cache stampede prevention: lock-based refresh ou stale-while-revalidate no cache do cardápio.
- [ ] Sanitização de nomes de pessoas na mesa contra XSS via `class-transformer`.
- [ ] Error codes padronizados para módulo Session (SESSION_001 a SESSION_007). Ver `docs/observabilidade.md`.

---

## Sprint 6 — Frontend Cliente: WhatsApp + Cardápio + Pessoas

Frontend do cliente. Zero endpoints REST novos.

**Checklist:**
- [ ] **Tela de escolha após QR Code:** "Entrar na mesa" ou "Ver cardápio" (read-only sem sessão).
- [ ] **Modo read-only do cardápio:** acesso público com preços, sem poder fazer pedidos, sem identificação.
- [ ] Frontend cliente: tela WhatsApp (número + OTP). **Exibir texto de consentimento LGPD** claro sobre uso dos dados ao informar telefone (ver `docs/seguranca.md` seção LGPD).
- [ ] Frontend cliente: tela pessoas (+ botão no header de TODAS as telas do cliente).
- [ ] **Tela de pessoas com aprovação:** exibir entrantes pendentes com botões aprovar/rejeitar.
- [ ] **Tela de espera para entrantes:** mensagem de aguardo + botão "Lembrar mesa" (cooldown 60s) + botão "Ver cardápio" (read-only) + botão "Cancelar".
- [ ] **Notificação de novo entrante:** alerta in-app para membros aprovados (push notification na Sprint 13).
- [ ] Frontend cliente: cardápio com galeria, categorias, filtros.
- [ ] Frontend cliente: detalhe do produto.

---

## Sprint 7 — Pedidos + Carrinho

**Endpoints (~8):**
- POST `/orders` — Criar pedido (cada item com `personIds[]` obrigatório).
- GET `/orders` — Listar pedidos (admin, filtros). **Paginação:** query `page` e `limit` (default 20, max 100).
- GET `/orders/:id` — Detalhes do pedido.
- PATCH `/orders/:id/status` — Atualizar status (KDS/garçom).
- PATCH `/orders/items/:id/status` — Status de item individual.
- PATCH `/orders/items/:id/people` — Reatribuir pessoas a um item.
- GET `/session/:token/bill` — Conta detalhada com divisão por pessoa + taxa de serviço.
- GET `/session/:token/activity-log` — Log de atividade de pedidos e reatribuições.

**Checklist:**
- [ ] Criação de pedido com seleção de pessoas por item.
- [ ] Grupos de entrega por pedido: itens normais (garçom notificado quando todos ficarem prontos), itens `immediateDelivery` (notificado quando todos os imediatos ficarem prontos), itens destino "Garçom" (entrega direta). Internamente, itens roteados para o KDS do Local de Preparo correspondente.
- [ ] Status: Na fila -> Preparando -> Pronto -> Entregue.
- [ ] **Log de atividade de pedidos:** registrar todas as ações (criação de pedido, reatribuição de pessoas) em formato estruturado. Renderizar como texto legível no frontend (ex: "Picanha - José realizou o pedido / Para: José e Antônio").
- [ ] **Aba "Histórico" na tela de Conta:** exibe log de atividade completo, visível para todos os membros da mesa.
- [ ] QueueService abstraction (interface única para Bull + Redis; preparada para futura migração para SQS na Fase 2).
- [ ] Frontend cliente: carrinho com seleção de pessoas.
- [ ] Frontend cliente: tela "Meus Pedidos" com status e reatribuição.
- [ ] Frontend cliente: conta com divisão por pessoa + taxa serviço + aba histórico.
- [ ] Error codes padronizados para módulo Orders (ORDER_001 a ORDER_005). Ver `docs/observabilidade.md`.

---

## Sprint 8 — Pagamento Pix

**Endpoints (~4):**
- POST `/payments` — Iniciar pagamento individual por pessoa.
- GET `/payments/:id/status` — Verificar status.
- POST `/payments/pix/webhook` — Webhook de confirmação Pix.
- GET `/payments/session/:token` — Listar pagamentos da sessão.

**Checklist:**
- [ ] Pagamento individual Pix com QR Code por pessoa.
- [ ] Webhook Pix com validação de assinatura do provedor (HMAC-SHA256 ou mTLS). Processamento via fila assíncrona (Bull + Redis). **Propagar `correlationId`** nos dados do job Bull.
- [ ] Whitelist de IPs do provedor Pix como camada extra de segurança.
- [ ] Circuit breaker (`opossum`) no provedor Pix com thresholds definidos (timeout 15s, 3 falhas em 60s, reset 120s).
- [ ] Abstração de provedor de pagamento (PaymentProviderService) para evitar lock-in.
- [ ] Frontend cliente: pagamento Pix com QR Code.
- [ ] Error codes padronizados para módulo Payments (PAY_001 a PAY_004). Ver `docs/observabilidade.md`.

---

## Sprint 9 — WebSocket Gateway + KDS Backend

Infraestrutura de tempo real. Zero endpoints REST novos.

**Checklist:**
- [ ] WebSocket gateway (Socket.IO).
- [ ] **Redis Adapter (`@socket.io/redis-adapter`)** configurado desde a Fase 1 (preparação para scaling horizontal na Fase 2).
- [ ] Rooms: restaurant, kds (geral), kds:{prepLocationId} (por Local de Preparo), waiter (geral), waiter:sector:{sectorId} (por setor), admin, session.
- [ ] Roteamento de pedidos por Ponto de Entrega → Local de Preparo do produto. Produtos com destino "Garçom" vão direto para o garçom do setor.
- [ ] Eventos client->server: order:created, call:request, payment:initiated.
- [ ] Eventos server->KDS: kds:new-order, kds:status-update.
- [ ] Eventos server->cliente: client:order-update, client:session-update.
- [ ] Eventos de aprovação: session:join-request, session:join-approved, session:join-rejected, session:join-remind.
- [ ] Eventos server->garçom: waiter:order-ready, waiter:pickup-claimed, waiter:pickup-reminder, waiter:pickup-escalation, waiter:call, waiter:new-order.
- [ ] Eventos server->admin: admin:table-update, admin:metrics-update, admin:pickup-escalation.
- [ ] KDS backend: fila de produção e transições de status.
- [ ] **Deduplicação de eventos:** garçom em múltiplos setores (múltiplas rooms) não deve receber evento duplicado. Usar `Set` de socketIds notificados antes de emitir para múltiplas rooms. Ver `docs/websocket-events.md` seção Deduplicação.
- [ ] **Backpressure:** usar `socket.volatile.emit()` para eventos não-críticos (metrics-update). Eventos críticos (order-update, payment-update) usam `emit()` normal.
- [ ] **Rate limit de eventos** client→server: máximo 10 eventos/s por socket. Desconectar sockets que excedem.
- [ ] **Propagação de `correlationId`** nos eventos WebSocket para tracing end-to-end.
- [ ] **Componente reutilizável de indicador de conexão** WebSocket + **polling HTTP como fallback** quando desconectado (banner "Reconectando..." + fetch REST a cada 10s). Ver `docs/websocket-events.md` seção Reconexão.
- [ ] Lógica de reconexão: ao reconectar, cliente faz fetch REST para sincronizar estado perdido.
- [ ] Testar Socket.IO com Redis Adapter (validar que eventos passam pelo Redis corretamente).
- [ ] Cleanup de rooms órfãs (sessões fechadas, clientes desconectados) para prevenir memory leak.
- [ ] Monitorar contagem de listeners por room para detectar leaks.
- [ ] Atualizar **CSP** no Helmet para incluir `connect-src 'self' wss://*.ochefia.com.br` (WebSocket).
- [ ] Error codes padronizados para módulo KDS (KDS_001, KDS_002). Ver `docs/observabilidade.md`.

---

## Sprint 10 — KDS Frontend

Frontend do KDS. Zero endpoints REST novos.

**Checklist:**
- [ ] Frontend KDS genérico — uma tela por Local de Preparo (dark mode, temporizadores, cores de status).
- [ ] Header exibe nome do Local de Preparo. Seleção de Local de Preparo ao abrir o KDS.
- [ ] Cores: Verde (no prazo), Amarelo (atenção), Vermelho (atrasado).
- [ ] Alertas visuais e sonoros para pedido novo/urgente.
- [ ] Clique no prato para ficha técnica (ingredientes, modo de preparo, foto).
- [ ] Botão "Pronto" com lógica:
  - Ponto de Entrega com `autoDelivery = false`: notifica garçom(ns) do setor para retirada.
  - Ponto de Entrega com `autoDelivery = true`: operador entrega direto. KDS exibe "Pronto" e "Entregue".
- [ ] Indicador de conexão WebSocket (componente da Sprint 9).
- [ ] Polling HTTP fallback para atualizações KDS quando desconectado (componente da Sprint 9).

---

## Sprint 11 — Staff + Escala + Equipe do Dia

**Endpoints (~10):**
- GET `/staff` — Listar funcionários. **Paginação:** query `page` e `limit` (default 50, max 100).
- POST `/staff` — Criar funcionário (temporary, fixedWeekdays, pin).
- POST `/staff/invite` — Enviar convite.
- POST `/staff/accept` — Aceitar convite.
- PUT `/staff/:id` — Atualizar funcionário.
- DELETE `/staff/:id` — Desativar funcionário.
- GET `/schedule` — Listar escala por período.
- GET `/schedule/day/:date` — Equipe do dia.
- PUT `/schedule/day/:date` — Definir equipe do dia.
- PATCH `/schedule/day/:date/sectors` — Atribuir setores aos garçons do dia.

**Checklist:**
- [ ] CRUD de funcionários com flag temporário, dias fixos, senha garçom.
- [ ] Sistema de convites (log no console em dev).
- [ ] Frontend admin: tela de funcionários com CRUD (cadastro, edição, desativação, flag temporário, dias fixos, senha garçom).
- [ ] Frontend admin: tela de escala — calendário por dia, auto-preenchimento com permanentes + temporários com dia pré-definido, ajustes manuais.
- [ ] Frontend admin: tela equipe do dia — equipe ativa + atribuição de setores por garçom (um garçom pode ter mais de 1 setor). Toggle para desmarcar/marcar. Adicionar temporários avulsos.
- [ ] Error codes padronizados para módulo Staff (STAFF_001 a STAFF_003). Ver `docs/observabilidade.md`.

---

## Sprint 12 — Módulo Garçom + Clock-in + Chamados

**Endpoints (~8):**
- POST `/shifts/clock-in` — Garçom inicia turno (staffId + pin).
- POST `/shifts/clock-out` — Garçom encerra turno.
- GET `/shifts` — Listar turnos por período.
- GET `/shifts/active` — Garçons com turno ativo.
- POST `/calls` — Criar chamado (cliente).
- GET `/calls` — Listar chamados abertos (garçom).
- PATCH `/calls/:id/resolve` — Garçom resolveu.
- PATCH `/orders/:id/delivery-groups/:group/claim` — Garçom assume retirada do grupo de entrega inteiro.

**Checklist:**
- [ ] Clock-in/out com senha do garçom. Registro de tempo de serviço. Rate limit: 5 tentativas por staffId em 15min, lockout de 15min.
- [ ] Sistema de chamados com tipo (chamar garçom, pedir conta, outro).
- [ ] Frontend garçom: clock-in com senha.
- [ ] Frontend garçom: lista de mesas dos setores atribuídos (agrupadas por setor).
- [ ] Frontend garçom: chamados abertos.
- [ ] Frontend garçom: detalhe da mesa (pedidos por pessoa). Itens com status "Pronto" exibem botão "Retirar" (claim).
- [ ] **Claim de retirada por grupo:** `PATCH /orders/:id/delivery-groups/:group/claim` — garçom assume retirada do grupo de entrega inteiro (`group` = `normal` ou `immediate`). Body: `{ staffId }`. Registra `claimedByStaffId` em todos os itens do grupo. Some da tela dos outros garçons via WebSocket (`waiter:pickup-claimed`).
- [ ] **Toggle taxa de serviço** por pessoa ou por mesa toda (garçom). Toggle geral como atalho + toggle individual por pessoa na tela de detalhe da mesa. Se desliga o geral, todos desligam. Se religa, todos religam. Individual altera o geral para estado parcial (checkbox indeterminado). Usa endpoint `PATCH /session/:token/service-charge` (criado na Sprint 5).
- [ ] Frontend garçom: comanda rápida.
- [ ] Botão "O Chefia" no cliente: modal com motivo + mensagem + enviar (usa `POST /calls`).
- [ ] Indicador de conexão WebSocket no garçom (componente da Sprint 9).
- [ ] Polling HTTP fallback no garçom quando desconectado (componente da Sprint 9).

---

## Sprint 13 — Push Notifications + Escalação de Retirada

Infraestrutura de notificações. Zero endpoints REST novos.

**Checklist:**
- [ ] Push notifications via Service Worker + Web Push API.
- [ ] **Service Worker com cache do cardápio para suporte offline** (leitura do cardápio funciona sem internet). Estratégia stale-while-revalidate.
- [ ] Notificação: item pronto para retirada (com indicação do Ponto de Entrega).
- [ ] Notificação: chamado de mesa.
- [ ] **Escalação de retirada nível 1:** job que verifica itens com status "Pronto" sem "Entregue" há mais de `pickupReminderInterval` minutos. Reenvia push + alerta in-app ao(s) garçom(ns) do setor. Repete a cada intervalo até entrega ou escalação nível 2.
- [ ] **Escalação de retirada nível 2:** item "Pronto" sem "Entregue" há mais de `pickupEscalationTimeout` minutos. Notifica admin (push + alerta dashboard via `admin:pickup-escalation`) + todos os garçons ativos (via `waiter:pickup-escalation`). Registra ocorrência para relatório.
- [ ] **Registro de escalações:** salvar cada ocorrência (garçom responsável, item, mesa, tempo de espera, nível) para consulta em relatório do admin (Sprint 14).
- [ ] Pontos de Entrega com `autoDelivery = true`: operador recebe notificação própria (sem notificar garçom). Não passa por escalação.
- [ ] Real-time admin: table update, metrics update via WebSocket, alerta de escalação de retirada (nível 2).
- [ ] Indicador de conexão WebSocket no cliente (pedidos/conta — componente da Sprint 9).
- [ ] Polling HTTP fallback no cliente quando desconectado (componente da Sprint 9).

---

## Sprint 14 — Faturamento + Dashboard + Desempenho

**Endpoints (~12):**
- GET `/billing/daily` — Faturamento do dia.
- GET `/billing/monthly` — Faturamento mensal.
- GET `/billing/cashier` — Fechamento de caixa.
- GET `/billing/waiter-fees` — Taxas de garçom por período.
- GET `/dashboard/overview` — Métricas gerais em tempo real (dinâmico por Local de Preparo).
- GET `/dashboard/popular-items` — Itens mais vendidos.
- GET `/dashboard/alerts` — Alertas: pedidos atrasados, chamados sem resposta, escalações ativas, mesas ociosas, setores sem garçom atribuído.
- GET `/staff/:id/performance` — Métricas individuais do funcionário por período.
- GET `/staff/performance/summary` — Resumo de desempenho de todos os funcionários.
- GET `/preparation-locations/:id/performance` — Métricas do Local de Preparo por período.
- GET `/staff/pickup-escalations` — Relatório de escalações de retirada por garçom.

**Checklist:**
- [ ] Faturamento diário: receita, pedidos, ticket médio, comparativo.
- [ ] Faturamento mensal: receita acumulada, gráfico por dia, comparativo.
- [ ] Fechamento de caixa: valores por forma de pagamento.
- [ ] Taxas de garçom: valor devido a cada garçom no período.
- [ ] Dashboard: tempo médio de preparo por Local de Preparo (**dinâmico**, baseado nos cadastrados — não fixo), tempo médio de entrega por garçom, mesas ativas. **Métricas pré-calculadas em Redis** (atualizadas por evento, não calculadas a cada request).
- [ ] **Dashboard alertas:** seção de alertas em tempo real — pedidos atrasados (tempo > threshold configurável, default 15min), chamados sem resposta, escalações ativas, mesas ociosas (sem novo pedido há mais de X minutos), setores sem garçom atribuído.
- [ ] Itens populares.
- [ ] **Métrica CartAbandonment:** carrinhos criados vs pedidos confirmados. Calculada no Redis a partir de eventos `order:created`. Exibida no dashboard. Ver `docs/observabilidade.md`.
- [ ] **Tela "Desempenho da Equipe":** métricas por garçom (tempo médio de entrega Pronto→Entregue, pedidos atendidos, escalações nível 1 e 2, taxa de serviço acumulada) e por Local de Preparo (tempo médio de preparo Na fila→Pronto, pedidos produzidos, itens mais demorados). Filtro por período (dia/semana/mês). Inclui **relatório de escalações de retirada** por garçom e por período.

---

## Sprint 15 — Settings + Theming + Dashboard Avançado

Frontend puro. Zero endpoints REST novos.

**Checklist:**
- [ ] Frontend admin: settings com nome/logo do estabelecimento, parâmetros de escalação de retirada (`pickupReminderInterval` default 3min, `pickupEscalationTimeout` default 10min).
- [ ] Theming: seleção de tema pronto + color picker personalizado.
- [ ] Temas prontos: Clássico, Escuro, Rústico, Moderno, Tropical, Personalizado.
- [ ] Preview em tempo real na tela de Settings.
- [ ] CSS custom properties no cardápio do cliente.
- [ ] Validação de contraste WCAG AA.
- [ ] 2 temas demonstrados (Clássico + Escuro) no cardápio.
- [ ] Mapa de mesas visual no dashboard (drag & drop ou grid).
- [ ] Gráficos no dashboard (receita, pedidos).

---

## Sprint 16 — Super Admin: Estabelecimentos + Cobrança

**Endpoints (~9):**
- GET `/superadmin/establishments` — Listar todos (com filtros). **Paginação:** query `page` e `limit` (default 20, max 100).
- POST `/superadmin/establishments` — Cadastrar novo.
- GET `/superadmin/establishments/:id` — Detalhes.
- PUT `/superadmin/establishments/:id` — Atualizar.
- PATCH `/superadmin/establishments/:id/status` — Alterar status.
- GET `/superadmin/establishments/:id/billing` — Histórico de cobranças.
- PUT `/superadmin/establishments/:id/billing/plan` — Definir valor do plano.
- POST `/superadmin/establishments/:id/billing/payments` — Registrar pagamento.
- PATCH `/superadmin/establishments/:id/billing/payments/:paymentId` — Atualizar status.

**Checklist:**
- [ ] Role SUPER_ADMIN no sistema de auth.
- [ ] CRUD de estabelecimentos (nome, slug, CNPJ, responsável, email, telefone).
- [ ] Suspensão de estabelecimentos.
- [ ] Sistema de cobrança: valor do plano, registro de pagamentos, status.
- [ ] Painel `/superadmin` com listagem, filtros, indicadores de inadimplência.
- [ ] Seed com usuário SUPER_ADMIN.

---

## Sprint 17 — Super Admin: Módulos + Monitoramento

**Endpoints (~7):**
- GET `/superadmin/modules` — Listar módulos com valor padrão.
- PUT `/superadmin/modules/:moduleId` — Atualizar módulo.
- GET `/superadmin/establishments/:id/modules` — Módulos do estabelecimento.
- PUT `/superadmin/establishments/:id/modules/:moduleId` — Habilitar/desabilitar + valor.
- GET `/superadmin/monitoring/overview` — Métricas globais (total pedidos/mês, mesas ativas, estabelecimentos por status).
- GET `/superadmin/monitoring/establishments` — Métricas de uso por estabelecimento (pedidos/mês, mesas ativas, último acesso). **Paginação:** query `page` e `limit` (default 20, max 100). Ordenável por qualquer métrica.
- GET `/superadmin/monitoring/establishments/:id/activity` — Histórico de atividade de um estabelecimento (últimos acessos, pedidos recentes).

**Checklist:**
- [ ] Sistema de módulos: padrão + extras.
- [ ] Habilitar/desabilitar módulos por estabelecimento.
- [ ] Valor global e override por estabelecimento.
- [ ] Endpoints de monitoramento: métricas globais, métricas por estabelecimento, histórico de atividade.
- [ ] Métricas de uso por estabelecimento (pedidos/mês, mesas ativas).
- [ ] Último acesso de cada estabelecimento.

---

## Sprint 18 — Testes E2E + Acessibilidade

Testes end-to-end e revisão de acessibilidade. Zero endpoints REST novos.

**Checklist:**
- [ ] Testes e2e com Playwright: fluxo completo do cliente (QR -> WhatsApp -> cardápio -> pedido -> pagamento).
- [ ] Testes e2e com Playwright: fluxo admin (login -> dashboard -> mesas -> cardápio).
- [ ] Testes e2e com Playwright: fluxo garçom (clock-in -> mesas -> chamados -> comanda).
- [ ] Testes de contrato (API).
- [ ] Testes de integração (Supertest).
- [ ] axe-core integrado nos testes e2e (Playwright) para validação automática de acessibilidade.
- [ ] Skeleton loading em todas as telas que faltam.
- [ ] Revisão de acessibilidade (botões 44x44px, contraste WCAG AA, labels, `aria-live` em regiões real-time).
- [ ] Validação visual final.

---

## Sprint 19 — Performance + Resiliência

Otimizações e preparação para produção. Zero endpoints REST novos.

**Checklist:**
- [ ] Performance: otimizar queries lentas (monitorar N+1 com `prisma.$on('query')`), verificar cache Redis.
- [ ] Performance: lazy loading de imagens no cardápio (`loading="lazy"` + WebP + placeholder blur).
- [ ] Performance: paginação em todos os endpoints de listagem (orders, staff, establishments).
- [ ] Performance: bundle analysis com `@next/bundle-analyzer` — code splitting por módulo (admin vs cliente vs garçom).
- [ ] Resiliência: circuit breaker (`opossum`) para dependências externas restantes (WhatsApp API — Pix já coberto na Sprint 8).
- [ ] Resiliência: modo degradado quando Redis cai (fallback para banco direto no cardápio, métricas calculadas on-demand). Ver `docs/observabilidade.md` seção Modo Degradado.
- [ ] Resiliência: timeout de sessão — alerta no admin para sessões abertas há mais de 6 horas.
- [ ] Resiliência: graceful shutdown (drenar WebSocket, fechar conexões banco/Redis em SIGTERM).
- [ ] Validar database indexing: índices compostos em (restaurantId, status) para orders, (restaurantId, createdAt) para sessões.
- [ ] Teste de carga multi-tenant: validar isolamento de dados entre restaurantes sob carga (100+ req/s).
- [ ] Bull failed jobs processing strategy documentada e testada.
- [ ] Infra: Docker Compose de produção otimizado (healthchecks, restart policies, resource limits).

---

## Sprint 20 — Segurança Avançada + LGPD

Revisão de segurança e compliance LGPD. Zero endpoints REST novos (exceto LGPD).

**Endpoints (~2):**
- DELETE `/session/:token/data` — LGPD: excluir dados pessoais da sessão.
- GET `/session/:token/data` — LGPD: retornar todos os dados pessoais da sessão (direito de acesso).

**Checklist:**
- [ ] LGPD: endpoint `DELETE /session/:token/data` para exclusão de dados pessoais (telefone, nomes). Pedidos/pagamentos são anonimizados.
- [ ] LGPD: endpoint `GET /session/:token/data` para acesso aos dados pessoais (direito de acesso via telefone verificado). Ver `docs/seguranca.md` seção LGPD.
- [ ] LGPD: job agendado para anonimizar dados pessoais de sessões fechadas há mais de 90 dias.
- [ ] Rotação de JWT_SECRET testada end-to-end (suportar 2 secrets simultâneos — implementação na Sprint 1, teste de rotação aqui).
- [ ] Revisão de segurança: verificar que todos os campos de texto livre passam por sanitização `class-transformer`.
- [ ] Revisão de segurança: verificar que `$queryRaw`/`$executeRaw` (se usados) utilizam `Prisma.sql` para parametrização.
- [ ] Revisão de segurança: verificar que upload de imagens valida MIME type real em todos os endpoints.

---

## Sprint 21 — Fase 2: Migração para AWS — NÃO IMPLEMENTAR ATÉ AVISO EXPLÍCITO
**Apenas referência arquitetural. Migrar para AWS quando precisar escalar além de um servidor.**
- [ ] **Infra:** Migrar containers para ECS Fargate.
- [ ] **Infra:** Migrar PostgreSQL para RDS Multi-AZ + RDS Proxy.
- [ ] **Infra:** Migrar Redis para ElastiCache.
- [ ] **Infra:** Migrar imagens de filesystem local para S3 + CloudFront. Atualizar CSP para incluir `img-src https://*.cloudfront.net`.
- [ ] **Infra:** Migrar filas de Bull + Redis para SQS + DLQ.
- [ ] **Infra:** Configurar auto-scaling ECS (CPU > 70% scale out, < 30% scale in, min 2, max 10).
- [ ] **Infra:** CloudWatch (logs, métricas, alarmes) + X-Ray (tracing).
- [ ] **Infra:** WAF, Secrets Manager, ECR, Route 53, ACM.
- [ ] **Infra:** CI/CD com deploy para ECR + ECS rolling update.
- [ ] Ver `docs/deploy.md` seção "Fase 2 — Migração para AWS" para detalhes completos.

---

## Sprint 22+ — Fase 2: Plataforma + Estoque — NÃO IMPLEMENTAR ATÉ AVISO EXPLÍCITO
**Apenas referência arquitetural. Não iniciar até o usuário pedir. Cada item é um módulo extra pago.**
- [ ] **Módulo Estoque:** Controle de estoque com baixa automática por pedido.
- [ ] **Módulo Estoque:** Alertas de estoque mínimo em tempo real.
- [ ] **Módulo Estoque:** CRUD de ingredientes e vínculos com produtos.
- [ ] **Módulo Explorar:** App nativo com Capacitor (iOS/Android).
- [ ] **Módulo Explorar:** Cadastro/login do consumidor final.
- [ ] **Módulo Explorar:** Tela "Explorar" com estabelecimentos.
- [ ] **Módulo Explorar:** Lotação em tempo real, reserva de mesa, pré-pedido.
- [ ] **Módulo Explorar:** Programa de fidelidade.
- [ ] **Módulo NFC-e/SAT:** Emissão fiscal (integração com Focus NFe ou similar).
