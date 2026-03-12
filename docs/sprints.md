# Roadmap de Sprints

## Sprint P — Prototipos HTML (antes de tudo)
Prototipos funcionais em HTML puro + CSS + JS vanilla. Sem React, sem NestJS, sem frameworks. Dados mockados hardcoded com valores realistas brasileiros (restaurante "Ze do Bar", pratos reais, precos reais, nomes reais). Interacoes basicas com JS vanilla (carrinho, selecao de pessoas, troca de abas, mudanca de status). Nao persiste dados — e apenas para validacao visual e de fluxo.

**Estrutura:**
```
prototypes/
├── index.html                  <- Hub com links para todas as telas
├── style-guide.html            <- Design system: cores, tipografia, componentes base
├── css/
│   └── style.css               <- CSS compartilhado (variaveis, componentes, layout)
├── js/
│   └── app.js                  <- JS compartilhado (interacoes, dados mock, navegacao)
├── cliente/
│   ├── whatsapp.html           <- Tela de verificacao WhatsApp
│   ├── pessoas.html            <- Cadastro de pessoas na mesa
│   ├── cardapio.html           <- Cardapio com fotos, categorias, filtros
│   ├── produto.html            <- Detalhe do produto com galeria de fotos
│   ├── carrinho.html           <- Carrinho com selecao de pessoas por item
│   ├── pedidos.html            <- Meus Pedidos (agrupado, com status e reatribuicao)
│   ├── conta.html              <- Conta com divisao por pessoa + taxa de servico
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
│   ├── clock-in.html           <- Ativacao de turno (senha do garcom)
│   ├── mesas.html              <- Lista de mesas dos setores atribuídos
│   ├── chamados.html           <- Chamados abertos + notificacoes
│   ├── mesa-abrir.html         <- Abrir mesa (quantidade de pessoas + nomes)
│   ├── mesa-detalhe.html       <- Pedidos da mesa com divisao por pessoa
│   └── comanda.html            <- Lancar pedido rapido
└── superadmin/
    ├── login.html              <- Login do Super Admin (mesmo layout, branding OChefia)
    ├── dashboard.html          <- Painel principal: KPIs (total estabelecimentos, ativos, suspensos, inadimplentes), ultimos acessos, alertas
    ├── estabelecimentos.html   <- Listagem de todos os estabelecimentos com filtros (status, inadimplente) + paginacao
    ├── estabelecimento-novo.html    <- Cadastro de novo estabelecimento (nome, slug, CNPJ, responsavel, email, telefone)
    ├── estabelecimento-detalhe.html <- Detalhes do estabelecimento (dados, status, modulos ativos, historico de cobranca)
    ├── cobranca.html           <- Gestao de cobranca: valor do plano, registro de pagamentos mensais, historico, status (pago/pendente/atrasado)
    ├── modulos.html            <- Gestao de modulos: listar modulos disponiveis, habilitar/desabilitar por estabelecimento, valores (global e override)
    └── monitoramento.html      <- Métricas de uso, últimos acessos, pedidos/mês por estabelecimento
```

**Checklist:**
- [x] `style-guide.html` — paleta de cores, tipografia, todos os componentes base renderizados.
- [x] Telas do **cliente** — fluxo completo: WhatsApp -> pessoas -> cardapio -> produto -> carrinho (com selecao de pessoas) -> pedidos -> conta -> pagamento.
- [x] Telas do **admin** — login -> dashboard (KPIs dinâmicos por Local de Preparo + seção alertas) -> mesas (filtros: todas/com problema/ociosas + delete de mesa) -> cardápio CRUD (com tags, Ponto de Entrega ou "Garçom", flag entrega imediata) -> locais de preparo (CRUD + pontos de entrega com flag auto-entrega) -> setores (CRUD + mesas + mapeamento de pontos de entrega) -> desempenho da equipe (métricas por garçom e por Local de Preparo) -> faturamento (diário, mensal, taxas garçom, escalações) -> staff (com temporário + senha garçom) -> escala -> equipe do dia (com atribuição de setores) -> settings (com nome/logo do estabelecimento, escalação de retirada).
- [x] Telas do **KDS** — tela única por Local de Preparo com fila, cores de status, temporizadores. Mockar pelo menos 2 locais (ex: "Cozinha Principal" e "Bar").
- [x] Telas do **garçom** — ativação de turno (clock-in com senha) -> chamados (tab principal, com banner de notificação) -> mesas agrupadas por setor -> abrir mesa (pessoas + nomes) -> detalhe da mesa (com botão "Retirar" em itens prontos) -> comanda.
- [x] Navegacao funcional entre todas as telas (links, incluindo Super Admin).
- [x] Interacoes JS: adicionar ao carrinho, selecionar pessoas, trocar abas, mudar status no KDS, claim de retirada no garçom.
- [x] Responsivo: cliente e garcom em mobile (375px), admin e KDS em desktop/tablet (1024px+).
- [x] Tela de **Settings** com seleção de tema + color picker + preview do cardápio + parâmetros de escalação de retirada (`pickupReminderInterval`, `pickupEscalationTimeout`).
- [x] Prototipos do cliente devem demonstrar pelo menos 2 temas diferentes (Classico + Escuro) para validar que o theming funciona.
- [x] Telas do **Super Admin** — login -> dashboard (KPIs: total estabelecimentos, ativos, suspensos, inadimplentes) -> listagem de estabelecimentos (com filtros de status e inadimplencia, paginacao) -> cadastro de novo estabelecimento (nome, slug, CNPJ, responsavel, email, telefone) -> detalhe do estabelecimento (dados, status ativo/suspenso, modulos ativos, historico de cobranca) -> cobranca (valor do plano base, registro de pagamentos mensais, status pago/pendente/atrasado, indicadores de inadimplencia) -> modulos (listar modulos disponiveis com valor padrao, habilitar/desabilitar por estabelecimento, valor override) -> monitoramento (métricas de uso por estabelecimento, últimos acessos, pedidos/mês).
- [x] Navegacao Super Admin: sidebar propria com branding OChefia (nao do restaurante). Menu: Dashboard, Estabelecimentos, Modulos, Monitoramento. Cobranca e acessada dentro do detalhe do estabelecimento (nao e item separado na sidebar).
- [x] Interacoes JS Super Admin: filtros na listagem, alterar status de estabelecimento, registrar pagamento, toggle de modulos, ordenação por métricas no monitoramento.
- [x] Responsivo Super Admin: desktop-first (mesma diretriz do admin).
- [ ] Validacao visual aprovada pelo usuario antes de prosseguir para Sprint 0.

---

## Sprint 0 — Scaffolding + Monorepo + Docker

Setup completo da infraestrutura de desenvolvimento. Ao final, `pnpm install && docker compose up` funciona.

**Checklist:**
- [ ] Criar toda a estrutura de pastas do monorepo (`apps/api`, `apps/web`, `packages/shared`).
- [ ] Turborepo + pnpm workspace configurados.
- [ ] Docker Compose com PostgreSQL (5433) e Redis (6380).
- [ ] Prisma schema inicial (modelos base: Restaurant, User, Table).
- [ ] ESLint, Prettier, tsconfig compartilhado.
- [ ] `packages/shared` com estrutura basica e build funcional.
- [ ] NestJS scaffolding com modulo raiz.
- [ ] Next.js 14 App Router scaffolding.
- [ ] `README.md` em cada pasta relevante.
- [ ] Endpoint `GET /health` e `GET /health/ready` (health check basico + readiness).
- [ ] Helmet configurado (headers de seguranca HTTP).
- [ ] CORS configurado para origens permitidas.
- [ ] CI/CD pipeline basico (GitHub Actions): lint + test em PRs.
- [ ] Dependabot configurado para scanning de vulnerabilidades.
- [ ] `pnpm audit` como step do CI.

---

## Sprint 1 — Auth + Restaurant + Seed

**Endpoints (~8):**
- POST `/auth/register` — Registro de restaurante + owner.
- POST `/auth/login` — Login -> retorna JWT.
- POST `/auth/refresh` — Refresh token.
- GET `/auth/me` — Dados do usuario logado.
- GET `/restaurants/:slug` — Dados publicos do restaurante.
- PUT `/restaurants/:id` — Atualizar dados (OWNER/MANAGER).
- GET `/restaurants/:id/settings` — Configuracoes.
- PUT `/restaurants/:id/settings` — Atualizar configuracoes.

**Checklist:**
- [ ] Modulo Auth completo (register, login, JWT access 15min + refresh 7d, roles).
- [ ] Roles: OWNER, MANAGER, WAITER, KITCHEN, BAR.
- [ ] Refresh token em httpOnly cookie com `SameSite=Strict`.
- [ ] Rate limit especifico em `/auth/login` (5 tentativas por IP em 15min).
- [ ] CRUD de restaurante.
- [ ] Winston logger + Correlation ID middleware.
- [ ] ValidationPipe global + Swagger.
- [ ] Seed com dados de teste (dono@ze-bar.com / senha123, slug ze-bar).
- [ ] Tabela `AuditLog` no Prisma schema (para uso em sprints futuras).
- [ ] Rate limit especifico em `/auth/refresh` (10 tentativas por IP em 15min).
- [ ] CSRF token (sync token pattern) para protecao de requests com cookie.
- [ ] Error codes padronizados para modulo Auth (AUTH_001, AUTH_002, AUTH_003).

---

## Sprint 2 — Tables + Setores + Locais de Preparo + Component Library + Layout Admin

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

**Checklist:**
- [ ] CRUD de mesas + sessão (open/close). Mesa com `sectorId` obrigatório. Delete = soft delete (só se sem sessão ativa; histórico preservado; permite recriar com mesmo nome/número).
- [ ] CRUD de Locais de Preparo (nome). Criação gera 1 Ponto de Entrega default automaticamente.
- [ ] CRUD de Pontos de Entrega (nome, `autoDelivery` flag, vinculado a Local de Preparo).
- [ ] CRUD de Setores (nome). Setor default criado automaticamente com o restaurante.
- [ ] Mapeamento obrigatório Setor ↔ Local de Preparo: para cada setor, qual Ponto de Entrega usar por Local de Preparo.
- [ ] Seed com dados de teste: 2 Locais de Preparo ("Cozinha Principal", "Bar"), 1 Setor default ("Salão"), mesas vinculadas.
- [ ] Biblioteca de componentes base (Button, Input, Badge, Modal, Toggle, Skeleton, Spinner).
- [ ] Toast notifications (sonner).
- [ ] AdminSidebar fixa com navegação, avatar e role.
- [ ] Layout admin com sidebar + mobile top bar.
- [ ] Tela de login frontend (Next.js).
- [ ] Skeleton loading nos componentes base.
- [ ] Sentry integrado no Next.js (client-side error tracking).
- [ ] Componentes base com `aria-label`, `role` e `focus-visible` corretos.

---

## Sprint 3 — Menu CRUD Backend + Upload de Imagens

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
- [ ] CRUD de tags de produto (vegano, sem gluten, picante, etc).
- [ ] CRUD de produtos com campo `pickupPointId` (Ponto de Entrega vinculado a Local de Preparo) ou `destination: 'waiter'` (entrega direta pelo garçom). Flag `immediateDelivery` (boolean, default `false`) para itens que podem ser entregues antes dos demais (ex: drinks).
- [ ] StorageService com interface (upload, delete, getUrl).
- [ ] Implementacao Local (filesystem com volume Docker). `STORAGE_DRIVER=local`.
- [ ] Resize com sharp (thumb 200px, media 600px, original) — processado via fila assincrona (Bull + Redis).
- [ ] Validacao de MIME type real com `file-type` (nao confiar na extensao). Aceitar apenas JPEG/PNG/WebP.
- [ ] Sanitizar nome do arquivo (usar UUID como nome no storage).
- [ ] Upload com preview, reordenacao e remocao.
- [ ] Frontend admin: tela cardapio CRUD.
- [ ] Sanitizacao de inputs de texto livre (nome de categoria, nome/descricao de produto) contra XSS.

---

## Sprint 4 — Sessao de Mesa + WhatsApp OTP + Aprovacao + Cardapio Frontend

**Endpoints (~14):**
- GET `/session/:token` — Dados da sessao.
- POST `/session/:token/join` — Solicitar entrada na sessao (cria sessao se primeira pessoa, ou cria solicitacao pendente).
- POST `/session/:token/phone` — Enviar OTP via WhatsApp.
- POST `/session/:token/phone/verify` — Confirmar OTP.
- GET `/session/:token/join/pending` — Listar solicitacoes pendentes de aprovacao.
- PATCH `/session/:token/join/:requestId/approve` — Aprovar novo membro.
- PATCH `/session/:token/join/:requestId/reject` — Rejeitar novo membro.
- POST `/session/:token/join/:requestId/remind` — Reenviar notificacao (cooldown 60s).
- GET `/session/:token/join/:requestId/status` — Verificar status da solicitacao.
- GET `/session/:token/people` — Listar pessoas na sessao.
- POST `/session/:token/people` — Adicionar pessoa na mesa.
- DELETE `/session/:token/people/:personId` — Remover pessoa.
- PATCH `/session/:token/service-charge` — Toggle taxa de servico (garcom only).
- GET `/menu/:restaurantSlug` — Cardapio publico (com cache Redis).

**Checklist:**
- [ ] Sessao de mesa via token criptograficamente seguro (UUID v4 ou `crypto.randomBytes(32)`) na URL + cookie.
- [ ] Verificacao WhatsApp via OTP de 6 digitos. Rate limit: 3 envios por sessao, cooldown 60s. OTP expira em 5min, max 5 tentativas.
- [ ] Envio de OTP via fila assincrona (Bull + Redis).
- [ ] **Tela de escolha apos QR Code:** "Entrar na mesa" ou "Ver cardapio" (read-only sem sessao).
- [ ] **Modo read-only do cardapio:** acesso publico com precos, sem poder fazer pedidos, sem identificacao.
- [ ] **Sistema de aprovacao de novos entrantes:** primeiro cliente cria sessao automaticamente; novos entrantes entram em fila de aprovacao apos verificacao WhatsApp.
- [ ] **Tela de espera para entrantes:** mensagem de aguardo + botao "Lembrar mesa" (cooldown 60s) + botao "Ver cardapio" (read-only) + botao "Cancelar".
- [ ] **Notificacao de novo entrante:** push notification + alerta in-app para membros aprovados.
- [ ] **Tela de pessoas com aprovacao:** exibir entrantes pendentes com botoes aprovar/rejeitar.
- [ ] Reentrada: reconhecer membro ja aprovado via cookie + telefone verificado.
- [ ] CRUD de pessoas na mesa.
- [ ] Cache do cardapio no Redis com TTL de 5min + invalidacao explicita no CRUD de produtos/categorias.
- [ ] Frontend cliente: tela WhatsApp.
- [ ] Frontend cliente: tela pessoas (+ botao no header de TODAS as telas).
- [ ] Frontend cliente: cardapio com galeria, categorias, filtros.
- [ ] Frontend cliente: detalhe do produto.
- [ ] Cache stampede prevention: lock-based refresh ou stale-while-revalidate no cache do cardapio.
- [ ] Endpoint `PATCH /session/:token/service-charge` para toggle de taxa de serviço (backend — uso pelo garçom na Sprint 10). Body: `{ enabled, personId? }`. Sem `personId` = aplica para todos; com `personId` = toggle individual.
- [ ] Sanitizacao de nomes de pessoas na mesa contra XSS.

---

## Sprint 5 — Carrinho + Pedidos + Pagamento Pix

**Endpoints (~12):**
- POST `/orders` — Criar pedido (cada item com `personIds[]` obrigatorio).
- GET `/orders` — Listar pedidos (admin, filtros).
- GET `/orders/:id` — Detalhes do pedido.
- PATCH `/orders/:id/status` — Atualizar status.
- PATCH `/orders/items/:id/status` — Status de item individual.
- PATCH `/orders/items/:id/people` — Reatribuir pessoas a um item.
- POST `/payments` — Iniciar pagamento individual por pessoa.
- GET `/payments/:id/status` — Verificar status.
- POST `/payments/pix/webhook` — Webhook de confirmacao Pix.
- GET `/payments/session/:token` — Listar pagamentos da sessao.
- GET `/session/:token/bill` — Conta detalhada com divisao por pessoa.
- GET `/session/:token/activity-log` — Log de atividade de pedidos e reatribuicoes.

**Checklist:**
- [ ] Criacao de pedido com selecao de pessoas por item.
- [ ] Grupos de entrega por pedido: itens normais (garçom notificado quando todos ficarem prontos), itens `immediateDelivery` (notificado quando todos os imediatos ficarem prontos), itens destino "Garçom" (entrega direta). Internamente, itens roteados para o KDS do Local de Preparo correspondente.
- [ ] Status: Na fila -> Preparando -> Pronto -> Entregue.
- [ ] **Log de atividade de pedidos:** registrar todas as acoes (criacao de pedido, reatribuicao de pessoas) em formato estruturado. Renderizar como texto legivel no frontend (ex: "Picanha - José realizou o pedido / Para: José e Antônio").
- [ ] **Aba "Historico" na tela de Conta:** exibe log de atividade completo, visivel para todos os membros da mesa.
- [ ] Pagamento individual Pix com QR Code por pessoa.
- [ ] Webhook Pix com validacao de assinatura do provedor (HMAC-SHA256 ou mTLS). Processamento via fila assincrona (Bull + Redis).
- [ ] Whitelist de IPs do provedor Pix como camada extra de seguranca.
- [ ] Frontend cliente: carrinho com selecao de pessoas.
- [ ] Frontend cliente: tela "Meus Pedidos" com status e reatribuicao.
- [ ] Frontend cliente: conta com divisao por pessoa + taxa servico + aba historico.
- [ ] Frontend cliente: pagamento Pix com QR Code.
- [ ] QueueService abstraction (interface unica para Bull + Redis; preparada para futura migracao para SQS na Fase 2).
- [ ] Circuit breaker (`opossum`) no provedor Pix com thresholds definidos (timeout 15s, 3 falhas em 60s, reset 120s).
- [ ] Abstracacao de provedor de pagamento (PaymentProviderService) para evitar lock-in.

---

## Sprint 6 — WebSocket Gateway + KDS Backend

Infraestrutura de tempo real. Zero endpoints REST novos.

**Checklist:**
- [ ] WebSocket gateway (Socket.IO).
- [ ] **Redis Adapter (`@socket.io/redis-adapter`)** configurado desde a Fase 1 (preparacao para scaling horizontal na Fase 2).
- [ ] Rooms: restaurant, kds (geral), kds:{prepLocationId} (por Local de Preparo), waiter (geral), waiter:sector:{sectorId} (por setor), admin, session.
- [ ] Roteamento de pedidos por Ponto de Entrega → Local de Preparo do produto. Produtos com destino "Garçom" vão direto para o garçom do setor.
- [ ] Eventos client->server: order:created, call:request, payment:initiated.
- [ ] Eventos server->KDS: kds:new-order, kds:status-update.
- [ ] Eventos server->cliente: client:order-update, client:session-update.
- [ ] Eventos de aprovacao: session:join-request, session:join-approved, session:join-rejected, session:join-remind.
- [ ] Eventos server->garcom: waiter:order-ready, waiter:pickup-claimed, waiter:call, waiter:new-order.
- [ ] Eventos server->admin: admin:table-update, admin:metrics-update.
- [ ] KDS backend: fila de producao e transicoes de status.
- [ ] Logica de reconexao: ao reconectar, cliente faz fetch REST para sincronizar estado perdido.
- [ ] Testar Socket.IO com Redis Adapter (validar que eventos passam pelo Redis corretamente).
- [ ] Cleanup de rooms orfas (sessoes fechadas, clientes desconectados) para prevenir memory leak.
- [ ] Monitorar contagem de listeners por room para detectar leaks.

---

## Sprint 7 — KDS Frontend + Fluxo BAR

Frontend do KDS. Zero endpoints REST novos.

**Checklist:**
- [ ] Frontend KDS genérico — uma tela por Local de Preparo (dark mode, temporizadores, cores de status).
- [ ] Header exibe nome do Local de Preparo. Seleção de Local de Preparo ao abrir o KDS.
- [ ] Cores: Verde (no prazo), Amarelo (atenção), Vermelho (atrasado).
- [ ] Alertas visuais e sonoros para pedido novo/urgente.
- [ ] Clique no prato para ficha técnica (ingredientes, modo de preparo, foto).
- [ ] Botão "Pronto" com lógica:
  - Ponto de Entrega com `autoEntrega = false`: notifica garçom(ns) do setor para retirada.
  - Ponto de Entrega com `autoEntrega = true`: operador entrega direto. KDS exibe "Pronto" e "Entregue".
- [ ] Indicador de conexão WebSocket.

---

## Sprint 8 — Staff + Escala + Equipe do Dia

**Endpoints (~10):**
- GET `/staff` — Listar funcionarios.
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
- [ ] Tela escala: calendário por dia, auto-preenchimento, ajustes manuais.
- [ ] Tela equipe do dia: equipe ativa + atribuição de setores por garçom (um garçom pode ter mais de 1 setor).

---

## Sprint 9 — Modulo Garcom + Clock-in + Chamados

**Endpoints (~7):**
- POST `/shifts/clock-in` — Garcom inicia turno (staffId + pin).
- POST `/shifts/clock-out` — Garcom encerra turno.
- GET `/shifts` — Listar turnos por periodo.
- GET `/shifts/active` — Garcons com turno ativo.
- POST `/calls` — Criar chamado (cliente).
- GET `/calls` — Listar chamados abertos (garcom).
- PATCH `/calls/:id/resolve` — Garcom resolveu.

**Checklist:**
- [ ] Clock-in/out com senha do garcom. Registro de tempo de servico. Rate limit: 5 tentativas por staffId em 15min, lockout de 15min.
- [ ] Sistema de chamados com tipo (chamar garcom, pedir conta, outro).
- [ ] Frontend garcom: clock-in com senha.
- [ ] Frontend garçom: lista de mesas dos setores atribuídos (agrupadas por setor).
- [ ] Frontend garcom: chamados abertos.
- [ ] Frontend garcom: detalhe da mesa (pedidos por pessoa). Itens com status "Pronto" exibem botão "Retirar" (claim).
- [ ] **Claim de retirada:** `PATCH /orders/items/:id/claim` — garçom assume item pronto. Some da tela dos outros garçons via WebSocket (`waiter:pickup-claimed`). Registra `claimedByStaffId`.
- [ ] Frontend garcom: comanda rapida.
- [ ] Botao "O Chefia" no cliente: modal com motivo + mensagem + enviar.

---

## Sprint 10 — Push Notifications + Real-time Garcom

Infraestrutura de notificacoes. Zero endpoints REST novos.

**Checklist:**
- [ ] Push notifications via Service Worker + Web Push API.
- [ ] **Service Worker com cache do cardapio para suporte offline** (leitura do cardapio funciona sem internet).
- [ ] Notificação: item pronto para retirada (com indicação do Ponto de Entrega).
- [ ] Notificação: chamado de mesa.
- [ ] **Escalação de retirada nível 1:** job que verifica itens com status "Pronto" sem "Entregue" há mais de `pickupReminderInterval` minutos. Reenvia push + alerta in-app ao(s) garçom(ns) do setor. Repete a cada intervalo até entrega ou escalação nível 2.
- [ ] **Escalação de retirada nível 2:** item "Pronto" sem "Entregue" há mais de `pickupEscalationTimeout` minutos. Notifica admin (push + alerta dashboard) + todos os garçons ativos. Registra ocorrência para relatório.
- [ ] **Registro de escalações:** salvar cada ocorrência (garçom responsável, item, mesa, tempo de espera, nível) para consulta em relatório do admin.
- [ ] Real-time admin: table update, metrics update via WebSocket, alerta de escalação de retirada (nível 2).
- [ ] Toggle taxa de serviço por pessoa ou por mesa toda (garçom). Toggle geral como atalho + toggle individual por pessoa na tela de detalhe da mesa.
- [ ] Pontos de Entrega com `autoEntrega = true`: operador recebe notificação própria (sem notificar garçom). Não passa por escalação.
- [ ] Service Worker com estratégia de cache para cardápio (suporte offline para leitura do cardápio).

---

## Sprint 11 — Faturamento + Dashboard

**Endpoints (~13):**
- GET `/billing/daily` — Faturamento do dia.
- GET `/billing/monthly` — Faturamento mensal.
- GET `/billing/cashier` — Fechamento de caixa.
- GET `/billing/waiter-fees` — Taxas de garçom por período.
- GET `/dashboard/overview` — Métricas gerais em tempo real (dinâmico por Local de Preparo).
- GET `/dashboard/popular-items` — Itens mais vendidos.
- GET `/dashboard/alerts` — Alertas: pedidos atrasados, chamados sem resposta, escalações ativas, mesas ociosas.
- GET `/staff/:id/performance` — Métricas individuais do funcionário por período.
- GET `/staff/performance/summary` — Resumo de desempenho de todos os funcionários.
- GET `/preparation-locations/:id/performance` — Métricas do Local de Preparo por período.
- GET `/staff/pickup-escalations` — Relatório de escalações de retirada por garçom.

**Checklist:**
- [ ] Faturamento diario: receita, pedidos, ticket medio, comparativo.
- [ ] Faturamento mensal: receita acumulada, grafico por dia, comparativo.
- [ ] Fechamento de caixa: valores por forma de pagamento.
- [ ] Taxas de garçom: valor devido a cada garçom no período.
- [ ] Dashboard: tempo médio de preparo por Local de Preparo (**dinâmico**, baseado nos cadastrados — não fixo), tempo médio de entrega por garçom, mesas ativas. **Métricas pré-calculadas em Redis** (atualizadas por evento, não calculadas a cada request).
- [ ] **Dashboard alertas:** seção de alertas em tempo real — pedidos atrasados (tempo > threshold), chamados sem resposta, escalações ativas, mesas ociosas (sem novo pedido há mais de X minutos).
- [ ] Itens populares.
- [ ] Metricas pre-calculadas em Redis com invalidacao por evento (nao calcular a cada request).
- [ ] **Tela "Desempenho da Equipe":** métricas por garçom (tempo médio de entrega Pronto→Entregue, pedidos atendidos, escalações nível 1 e 2, taxa de serviço acumulada) e por Local de Preparo (tempo médio de preparo Na fila→Pronto, pedidos produzidos, itens mais demorados). Filtro por período (dia/semana/mês). Inclui **relatório de escalações de retirada** (movido de Faturamento — é métrica operacional, não financeira).

---

## Sprint 12 — Settings + Theming + Dashboard Avancado

Frontend puro. Zero endpoints REST novos.

**Checklist:**
- [ ] Frontend admin: settings com nome/logo do estabelecimento, parâmetros de escalação de retirada (`pickupReminderInterval` default 3min, `pickupEscalationTimeout` default 10min).
- [ ] Theming: selecao de tema pronto + color picker personalizado.
- [ ] Temas prontos: Classico, Escuro, Rustico, Moderno, Tropical, Personalizado.
- [ ] Preview em tempo real na tela de Settings.
- [ ] CSS custom properties no cardapio do cliente.
- [ ] Validacao de contraste WCAG AA.
- [ ] 2 temas demonstrados (Classico + Escuro) no cardapio.
- [ ] Mapa de mesas visual no dashboard (drag & drop ou grid).
- [ ] Graficos no dashboard (receita, pedidos).

---

## Sprint 13 — Super Admin: Estabelecimentos + Cobranca

**Endpoints (~9):**
- GET `/superadmin/establishments` — Listar todos (com filtros).
- POST `/superadmin/establishments` — Cadastrar novo.
- GET `/superadmin/establishments/:id` — Detalhes.
- PUT `/superadmin/establishments/:id` — Atualizar.
- PATCH `/superadmin/establishments/:id/status` — Alterar status.
- GET `/superadmin/establishments/:id/billing` — Historico de cobrancas.
- PUT `/superadmin/establishments/:id/billing/plan` — Definir valor do plano.
- POST `/superadmin/establishments/:id/billing/payments` — Registrar pagamento.
- PATCH `/superadmin/establishments/:id/billing/payments/:paymentId` — Atualizar status.

**Checklist:**
- [ ] Role SUPER_ADMIN no sistema de auth.
- [ ] CRUD de estabelecimentos (nome, slug, CNPJ, responsavel, email, telefone).
- [ ] Suspensao de estabelecimentos.
- [ ] Sistema de cobranca: valor do plano, registro de pagamentos, status.
- [ ] Painel `/superadmin` com listagem, filtros, indicadores de inadimplencia.
- [ ] Seed com usuario SUPER_ADMIN.

---

## Sprint 14 — Super Admin: Modulos + Monitoramento

**Endpoints (~7):**
- GET `/superadmin/modules` — Listar modulos com valor padrao.
- PUT `/superadmin/modules/:moduleId` — Atualizar modulo.
- GET `/superadmin/establishments/:id/modules` — Modulos do estabelecimento.
- PUT `/superadmin/establishments/:id/modules/:moduleId` — Habilitar/desabilitar + valor.
- GET `/superadmin/monitoring/overview` — Metricas globais (total pedidos/mes, mesas ativas, estabelecimentos por status).
- GET `/superadmin/monitoring/establishments` — Metricas de uso por estabelecimento (pedidos/mes, mesas ativas, ultimo acesso). **Paginacao:** query `page` e `limit` (default 20, max 100). Ordenavel por qualquer metrica.
- GET `/superadmin/monitoring/establishments/:id/activity` — Historico de atividade de um estabelecimento (ultimos acessos, pedidos recentes).

**Checklist:**
- [ ] Sistema de modulos: padrao + extras.
- [ ] Habilitar/desabilitar modulos por estabelecimento.
- [ ] Valor global e override por estabelecimento.
- [ ] Endpoints de monitoramento: metricas globais, metricas por estabelecimento, historico de atividade.
- [ ] Metricas de uso por estabelecimento (pedidos/mes, mesas ativas).
- [ ] Ultimo acesso de cada estabelecimento.

---

## Sprint 15 — E2E Tests + Polish + Performance + Resiliencia

**Checklist:**
- [ ] Testes e2e com Playwright: fluxo completo do cliente (QR -> WhatsApp -> cardapio -> pedido -> pagamento).
- [ ] Testes e2e com Playwright: fluxo admin (login -> dashboard -> mesas -> cardapio).
- [ ] Testes e2e com Playwright: fluxo garcom (clock-in -> mesas -> chamados -> comanda).
- [ ] Testes de contrato (API).
- [ ] Testes de integracao (Supertest).
- [ ] Skeleton loading em todas as telas que faltam.
- [ ] Revisao de acessibilidade (botoes 44x44px, contraste WCAG AA, labels).
- [ ] Performance: otimizar queries lentas (monitorar N+1 com `prisma.$on('query')`), verificar cache Redis.
- [ ] Performance: lazy loading de imagens no cardapio (`loading="lazy"` + WebP + placeholder blur).
- [ ] Performance: paginacao em todos os endpoints de listagem (orders, staff, establishments).
- [ ] Resiliencia: circuit breaker (`opossum`) para dependencias externas (WhatsApp API, Pix provider).
- [ ] Resiliencia: modo degradado quando Redis cai (fallback para banco direto).
- [ ] Resiliencia: timeout de sessao — alerta no admin para sessoes abertas ha mais de 6 horas.
- [ ] Resiliencia: graceful shutdown (drenar WebSocket, fechar conexoes banco/Redis em SIGTERM).
- [ ] Seguranca: LGPD — endpoint `DELETE /session/:token/data` para exclusao de dados pessoais.
- [ ] Seguranca: job agendado para anonimizar dados pessoais de sessoes fechadas ha mais de 90 dias.
- [ ] Infra: Docker Compose de producao otimizado (healthchecks, restart policies, resource limits).
- [ ] Validacao visual final.
- [ ] axe-core integrado nos testes e2e (Playwright) para validacao automatica de acessibilidade.
- [ ] Teste de carga multi-tenant: validar isolamento de dados entre restaurantes sob carga (100+ req/s).
- [ ] Validar database indexing: indices compostos em (restaurantId, status) para orders, (restaurantId, createdAt) para sessoes.
- [ ] Bundle analysis com `@next/bundle-analyzer` — code splitting por modulo (admin vs cliente vs garcom).
- [ ] Bull failed jobs processing strategy documentada e testada.
- [ ] Rotacao de JWT_SECRET testada (suportar 2 secrets simultaneos durante transicao).

---

## Sprint 16 — Fase 2: Migracao para AWS — NAO IMPLEMENTAR ATE AVISO EXPLICITO
**Apenas referencia arquitetural. Migrar para AWS quando precisar escalar alem de um servidor.**
- [ ] **Infra:** Migrar containers para ECS Fargate.
- [ ] **Infra:** Migrar PostgreSQL para RDS Multi-AZ + RDS Proxy.
- [ ] **Infra:** Migrar Redis para ElastiCache.
- [ ] **Infra:** Migrar imagens de filesystem local para S3 + CloudFront.
- [ ] **Infra:** Migrar filas de Bull + Redis para SQS + DLQ.
- [ ] **Infra:** Configurar auto-scaling ECS (CPU > 70% scale out, < 30% scale in, min 2, max 10).
- [ ] **Infra:** CloudWatch (logs, metricas, alarmes) + X-Ray (tracing).
- [ ] **Infra:** WAF, Secrets Manager, ECR, Route 53, ACM.
- [ ] **Infra:** CI/CD com deploy para ECR + ECS rolling update.
- [ ] Ver `docs/deploy.md` secao "Fase 2 — Migracao para AWS" para detalhes completos.

---

## Sprint 17+ — Fase 2: Plataforma + Estoque — NAO IMPLEMENTAR ATE AVISO EXPLICITO
**Apenas referencia arquitetural. Nao iniciar ate o usuario pedir. Cada item e um modulo extra pago.**
- [ ] **Modulo Estoque:** Controle de estoque com baixa automatica por pedido.
- [ ] **Modulo Estoque:** Alertas de estoque minimo em tempo real.
- [ ] **Modulo Estoque:** CRUD de ingredientes e vinculos com produtos.
- [ ] **Modulo Explorar:** App nativo com Capacitor (iOS/Android).
- [ ] **Modulo Explorar:** Cadastro/login do consumidor final.
- [ ] **Modulo Explorar:** Tela "Explorar" com estabelecimentos.
- [ ] **Modulo Explorar:** Lotacao em tempo real, reserva de mesa, pre-pedido.
- [ ] **Modulo Explorar:** Programa de fidelidade.
- [ ] **Modulo NFC-e/SAT:** Emissao fiscal (integracao com Focus NFe ou similar).
