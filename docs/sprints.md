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
│   ├── dashboard.html          <- Metricas, fila de pedidos, chamados
│   ├── mesas.html              <- Mapa de mesas com status
│   ├── cardapio-admin.html     <- CRUD categorias, tags e produtos (com upload de fotos, destino: cozinha/bar/garcom)
│   ├── faturamento.html        <- Faturamento diario, mensal e taxas de garcom
│   ├── staff.html              <- Gestao de equipe + convites + flag temporario + flag entrega (BAR)
│   ├── escala.html             <- Programacao de escala (calendario por dia, proximos dias)
│   ├── equipe-do-dia.html      <- Equipe trabalhando hoje + distribuicao de mesas por garcom
│   └── settings.html           <- Configuracoes (nome/logo do estabelecimento, taxa de servico, tema/cores com preview, modo de distribuicao de mesas)
├── kds/
│   ├── cozinha.html            <- Fila de producao (dark mode, temporizadores, cores)
│   └── bar.html                <- Fila de producao do bar
└── garcom/
    ├── clock-in.html           <- Ativacao de turno (senha do garcom)
    ├── mesas.html              <- Lista de mesas atribuidas
    ├── chamados.html           <- Chamados abertos + notificacoes
    ├── mesa-detalhe.html       <- Pedidos da mesa com divisao por pessoa
    └── comanda.html            <- Lancar pedido rapido
```

**Checklist:**
- [x] `style-guide.html` — paleta de cores, tipografia, todos os componentes base renderizados.
- [x] Telas do **cliente** — fluxo completo: WhatsApp -> pessoas -> cardapio -> produto -> carrinho (com selecao de pessoas) -> pedidos -> conta -> pagamento.
- [x] Telas do **admin** — login -> dashboard -> mesas -> cardapio CRUD (com tags e destino: cozinha/bar/garcom) -> faturamento (diario, mensal, taxas garcom) -> staff (com temporario + flag entrega BAR + senha garcom) -> escala -> equipe do dia (com distribuicao de mesas) -> settings (com nome/logo do estabelecimento e modo de distribuicao).
- [x] Telas do **KDS** — cozinha e bar com fila, cores de status, temporizadores.
- [x] Telas do **garcom** — ativacao de turno (clock-in com senha) -> mesas -> chamados -> detalhe da mesa -> comanda.
- [x] Navegacao funcional entre todas as telas (links).
- [x] Interacoes JS: adicionar ao carrinho, selecionar pessoas, trocar abas, mudar status no KDS.
- [x] Responsivo: cliente e garcom em mobile (375px), admin e KDS em desktop/tablet (1024px+).
- [x] Tela de **Settings** com selecao de tema + color picker + preview do cardapio.
- [x] Prototipos do cliente devem demonstrar pelo menos 2 temas diferentes (Classico + Escuro) para validar que o theming funciona.
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

## Sprint 2 — Tables + Component Library + Layout Admin

**Endpoints (~7):**
- GET `/tables` — Listar mesas do restaurante.
- POST `/tables` — Criar mesa.
- PUT `/tables/:id` — Atualizar mesa.
- DELETE `/tables/:id` — Remover mesa.
- POST `/tables/:id/open` — Abrir sessao da mesa.
- POST `/tables/:id/close` — Fechar sessao.
- GET `/tables/:id/session` — Sessao ativa da mesa.

**Checklist:**
- [ ] CRUD de mesas + sessao (open/close).
- [ ] Biblioteca de componentes base (Button, Input, Badge, Modal, Toggle, Skeleton, Spinner).
- [ ] Toast notifications (sonner).
- [ ] AdminSidebar fixa com navegacao, avatar e role.
- [ ] Layout admin com sidebar + mobile top bar.
- [ ] Tela de login frontend (Next.js).
- [ ] Skeleton loading nos componentes base.
- [ ] Sentry integrado no Next.js (client-side error tracking).
- [ ] Componentes base com `aria-label`, `role` e `focus-visible` corretos.

---

## Sprint 3 — Menu CRUD Backend + Upload de Imagens

**Endpoints (~12):**
- GET `/menu/categories` — Listar categorias (admin).
- POST `/menu/categories` — Criar categoria.
- PUT `/menu/categories/:id` — Atualizar categoria.
- DELETE `/menu/categories/:id` — Remover categoria.
- GET `/menu/tags` — Listar tags de produto.
- POST `/menu/tags` — Criar tag.
- PUT `/menu/tags/:id` — Atualizar tag.
- DELETE `/menu/tags/:id` — Remover tag.
- GET `/menu/products` — Listar produtos (admin).
- POST `/menu/products` — Criar produto (inclui `destination` e `tagIds[]`).
- PUT `/menu/products/:id` — Atualizar produto.
- PATCH `/menu/products/:id/availability` — Toggle disponibilidade.
- POST `/upload/product-images` — Upload de imagens (multipart, max 5).
- DELETE `/upload/product-images/:imageId` — Remover imagem.

**Checklist:**
- [ ] CRUD de categorias.
- [ ] CRUD de tags de produto (vegano, sem gluten, picante, etc).
- [ ] CRUD de produtos com campo `destination` (kitchen/bar/waiter).
- [ ] StorageService com interface (upload, delete, getUrl).
- [ ] Implementacao Local (dev) e S3 (prod). Em prod, upload via presigned URL direto ao S3.
- [ ] Resize com sharp (thumb 200px, media 600px, original) — processado via fila assincrona (Bull/Redis em dev, SQS em prod).
- [ ] Validacao de MIME type real com `file-type` (nao confiar na extensao). Aceitar apenas JPEG/PNG/WebP.
- [ ] Sanitizar nome do arquivo (usar UUID como nome no storage).
- [ ] Upload com preview, reordenacao e remocao.
- [ ] Frontend admin: tela cardapio CRUD.
- [ ] Sanitizacao de inputs de texto livre (nome de categoria, nome/descricao de produto) contra XSS.

---

## Sprint 4 — Sessao de Mesa + WhatsApp OTP + Cardapio Frontend

**Endpoints (~9):**
- GET `/session/:token` — Dados da sessao.
- POST `/session/:token/join` — Cliente entrar na sessao.
- POST `/session/:token/phone` — Enviar OTP via WhatsApp.
- POST `/session/:token/phone/verify` — Confirmar OTP.
- GET `/session/:token/people` — Listar pessoas na sessao.
- POST `/session/:token/people` — Adicionar pessoa na mesa.
- DELETE `/session/:token/people/:personId` — Remover pessoa.
- PATCH `/session/:token/service-charge` — Toggle taxa de servico.
- GET `/menu/:restaurantSlug` — Cardapio publico (com cache Redis).

**Checklist:**
- [ ] Sessao de mesa via token criptograficamente seguro (UUID v4 ou `crypto.randomBytes(32)`) na URL + cookie.
- [ ] Verificacao WhatsApp via OTP de 6 digitos. Rate limit: 3 envios por sessao, cooldown 60s. OTP expira em 5min, max 5 tentativas.
- [ ] Envio de OTP via fila assincrona (Bull/Redis em dev, SQS em prod).
- [ ] CRUD de pessoas na mesa.
- [ ] Cache do cardapio no Redis com TTL de 5min + invalidacao explicita no CRUD de produtos/categorias.
- [ ] Frontend cliente: tela WhatsApp.
- [ ] Frontend cliente: tela pessoas (+ botao no header de TODAS as telas).
- [ ] Frontend cliente: cardapio com galeria, categorias, filtros.
- [ ] Frontend cliente: detalhe do produto.
- [ ] Cache stampede prevention: lock-based refresh ou stale-while-revalidate no cache do cardapio.
- [ ] Sanitizacao de nomes de pessoas na mesa contra XSS.
- [ ] Mitigacao de session sharing: binding do token ao cookie do dispositivo.

---

## Sprint 5 — Carrinho + Pedidos + Pagamento Pix

**Endpoints (~10):**
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

**Checklist:**
- [ ] Criacao de pedido com selecao de pessoas por item.
- [ ] Sub-pedidos automaticos por destino (cozinha/bar/garcom) com sufixo.
- [ ] Status: Na fila -> Preparando -> Pronto -> Entregue.
- [ ] Pagamento individual Pix com QR Code por pessoa.
- [ ] Webhook Pix com validacao de assinatura do provedor (HMAC-SHA256 ou mTLS). Processamento via fila assincrona.
- [ ] Whitelist de IPs do provedor Pix como camada extra de seguranca.
- [ ] Frontend cliente: carrinho com selecao de pessoas.
- [ ] Frontend cliente: tela "Meus Pedidos" com status e reatribuicao.
- [ ] Frontend cliente: conta com divisao por pessoa + taxa servico.
- [ ] Frontend cliente: pagamento Pix com QR Code.
- [ ] QueueService abstraction (interface unica para Bull/Redis em dev e SQS em prod).
- [ ] Circuit breaker (`opossum`) no provedor Pix com thresholds definidos (timeout 15s, 3 falhas em 60s, reset 120s).
- [ ] Abstracacao de provedor de pagamento (PaymentProviderService) para evitar lock-in.

---

## Sprint 6 — WebSocket Gateway + KDS Backend

Infraestrutura de tempo real. Zero endpoints REST novos.

**Checklist:**
- [ ] WebSocket gateway (Socket.IO).
- [ ] **Redis Adapter (`@socket.io/redis-adapter`)** para sincronizar rooms entre multiplas instancias (obrigatorio para scaling).
- [ ] Rooms: restaurant, kds, kds:kitchen, kds:bar, waiter, admin, session.
- [ ] Roteamento de pedidos por destino do produto.
- [ ] Eventos: order:created, kds:new-order, kds:status-update.
- [ ] Eventos: client:order-update, client:session-update.
- [ ] Eventos: waiter:order-ready, waiter:call, waiter:new-order.
- [ ] Eventos: admin:table-update, admin:metrics-update.
- [ ] KDS backend: fila de producao e transicoes de status.
- [ ] Logica de reconexao: ao reconectar, cliente faz fetch REST para sincronizar estado perdido.
- [ ] Testar Socket.IO com 2+ containers simultaneous (validar Redis Adapter funciona corretamente).
- [ ] Cleanup de rooms orfas (sessoes fechadas, clientes desconectados) para prevenir memory leak.
- [ ] Monitorar contagem de listeners por room para detectar leaks.

---

## Sprint 7 — KDS Frontend + Fluxo BAR

Frontend do KDS. Zero endpoints REST novos.

**Checklist:**
- [ ] Frontend KDS cozinha (dark mode, temporizadores, cores de status).
- [ ] Frontend KDS bar (mesma base, fila separada).
- [ ] Cores: Verde (no prazo), Amarelo (atencao), Vermelho (atrasado).
- [ ] Alertas visuais e sonoros para pedido novo/urgente.
- [ ] Clique no prato para ficha tecnica (ingredientes, modo de preparo, foto).
- [ ] Botao "Pronto" com logica:
  - Cozinha: notifica garcom para retirada.
  - Bar sem flag entrega: notifica garcom para retirada.
  - Bar com flag entrega: status Pronto -> Entregue no KDS.
- [ ] Indicador de conexao WebSocket.

---

## Sprint 8 — Staff + Escala + Equipe do Dia

**Endpoints (~9):**
- GET `/staff` — Listar funcionarios.
- POST `/staff` — Criar funcionario (temporary, fixedWeekdays, delivers, pin).
- POST `/staff/invite` — Enviar convite.
- POST `/staff/accept` — Aceitar convite.
- PUT `/staff/:id` — Atualizar funcionario.
- DELETE `/staff/:id` — Desativar funcionario.
- GET `/schedule` — Listar escala por periodo.
- GET `/schedule/day/:date` — Equipe do dia.
- PUT `/schedule/day/:date` — Definir equipe do dia.
- PATCH `/schedule/day/:date/tables` — Distribuir mesas entre garcons.

**Checklist:**
- [ ] CRUD de funcionarios com flag temporario, dias fixos, flag entrega BAR, senha garcom.
- [ ] Sistema de convites (log no console em dev).
- [ ] Tela escala: calendario por dia, auto-preenchimento, ajustes manuais.
- [ ] Tela equipe do dia: equipe ativa + distribuicao de mesas por garcom.
- [ ] Config modo distribuicao (todos vs. automatico) em Settings.

---

## Sprint 9 — Modulo Garcom + Clock-in + Chamados

**Endpoints (~8):**
- POST `/shifts/clock-in` — Garcom inicia turno (staffId + pin).
- POST `/shifts/clock-out` — Garcom encerra turno.
- GET `/shifts` — Listar turnos por periodo.
- GET `/shifts/active` — Garcons com turno ativo.
- POST `/calls` — Criar chamado (cliente).
- GET `/calls` — Listar chamados abertos (garcom).
- PATCH `/calls/:id/acknowledge` — Garcom viu.
- PATCH `/calls/:id/resolve` — Garcom resolveu.

**Checklist:**
- [ ] Clock-in/out com senha do garcom. Registro de tempo de servico. Rate limit: 5 tentativas por staffId em 15min, lockout de 15min.
- [ ] Sistema de chamados com tipo (chamar garcom, pedir conta, outro).
- [ ] Frontend garcom: clock-in com senha.
- [ ] Frontend garcom: lista de mesas atribuidas.
- [ ] Frontend garcom: chamados abertos.
- [ ] Frontend garcom: detalhe da mesa (pedidos por pessoa).
- [ ] Frontend garcom: comanda rapida.
- [ ] Botao "O Chefia" no cliente: modal com motivo + mensagem + enviar.

---

## Sprint 10 — Push Notifications + Real-time Garcom

Infraestrutura de notificacoes. Zero endpoints REST novos.

**Checklist:**
- [ ] Push notifications via Service Worker + Web Push API.
- [ ] **Service Worker com cache do cardapio para suporte offline** (leitura do cardapio funciona sem internet).
- [ ] Notificacao: prato pronto para retirada.
- [ ] Notificacao: chamado de mesa.
- [ ] Notificacao: bebida pronta (para retirada no bar).
- [ ] Real-time admin: table update, metrics update via WebSocket.
- [ ] Toggle taxa de servico por sessao (garcom).
- [ ] Funcionario BAR com flag "tambem entrega" recebe notificacao propria.
- [ ] Service Worker com estrategia de cache para cardapio (suporte offline para leitura do cardapio).

---

## Sprint 11 — Faturamento + Dashboard

**Endpoints (~6):**
- GET `/billing/daily` — Faturamento do dia.
- GET `/billing/monthly` — Faturamento mensal.
- GET `/billing/cashier` — Fechamento de caixa.
- GET `/billing/waiter-fees` — Taxas de garcom por periodo.
- GET `/dashboard/overview` — Metricas gerais em tempo real.
- GET `/dashboard/popular-items` — Itens mais vendidos.

**Checklist:**
- [ ] Faturamento diario: receita, pedidos, ticket medio, comparativo.
- [ ] Faturamento mensal: receita acumulada, grafico por dia, comparativo.
- [ ] Fechamento de caixa: valores por forma de pagamento.
- [ ] Taxas de garcom: valor devido a cada garcom no periodo.
- [ ] Dashboard: tempo medio bar/cozinha/garcom, ticket medio, mesas ativas. **Metricas pre-calculadas em Redis** (atualizadas por evento, nao calculadas a cada request).
- [ ] Itens populares.
- [ ] Metricas pre-calculadas em Redis com invalidacao por evento (nao calcular a cada request).

---

## Sprint 12 — Settings + Theming + Dashboard Avancado

Frontend puro. Zero endpoints REST novos.

**Checklist:**
- [ ] Frontend admin: settings com nome/logo do estabelecimento.
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

**Endpoints (~4):**
- GET `/superadmin/modules` — Listar modulos com valor padrao.
- PUT `/superadmin/modules/:moduleId` — Atualizar modulo.
- GET `/superadmin/establishments/:id/modules` — Modulos do estabelecimento.
- PUT `/superadmin/establishments/:id/modules/:moduleId` — Habilitar/desabilitar + valor.

**Checklist:**
- [ ] Sistema de modulos: padrao + extras.
- [ ] Habilitar/desabilitar modulos por estabelecimento.
- [ ] Valor global e override por estabelecimento.
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
- [ ] Infra: configurar auto-scaling ECS (CPU > 70% scale out, < 30% scale in, min 2, max 10).
- [ ] Infra: configurar RDS Proxy para connection pooling.
- [ ] Validacao visual final.
- [ ] axe-core integrado nos testes e2e (Playwright) para validacao automatica de acessibilidade.
- [ ] Teste de carga multi-tenant: validar isolamento de dados entre restaurantes sob carga (100+ req/s).
- [ ] Validar database indexing: indices compostos em (restaurantId, status) para orders, (restaurantId, createdAt) para sessoes.
- [ ] Bundle analysis com `@next/bundle-analyzer` — code splitting por modulo (admin vs cliente vs garcom).
- [ ] DLQ processing strategy documentada e testada.
- [ ] Rotacao de JWT_SECRET testada (suportar 2 secrets simultaneos durante transicao).

---

## Sprint 16+ — Fase 2 (Plataforma + Estoque) — NAO IMPLEMENTAR ATE AVISO EXPLICITO
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
