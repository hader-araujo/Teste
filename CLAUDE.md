# CLAUDE.md — OChefia

Guia de referencia para o agente de desenvolvimento. Consulte sempre antes de implementar qualquer coisa.

---

## Visao Geral

**OChefia** e um SaaS para gestao de bares e restaurantes no Brasil. Cardapio digital via QR Code, autoatendimento, KDS (Kitchen Display System), modulo garcom e dashboard gerencial — tudo em tempo real, sem hardware especializado.

**Fase 1 (MVP):** Cliente le QR Code -> abre PWA no navegador -> faz pedido -> acompanha conta -> paga -> vai embora. Sem download, sem cadastro. Sessao vinculada a mesa (nao ao celular). Fechar e reabrir o navegador mantem os pedidos. Sessao encerra ao fechar a conta. Publico-alvo: vender para donos de bares/restaurantes.

**Fase 2 (Plataforma):** App nativo iOS/Android com cadastro de consumidor, historico, tela "Explorar", reserva de mesa, pre-pedido e fidelidade. Ao ler QR Code logado no app, sessao da mesa se vincula ao perfil do cliente. Sem o app, funciona como visitante anonimo (Fase 1).

---

## Estrutura do Monorepo

```
ochefia/
├── apps/
│   ├── api/          -> NestJS Backend (porta 3001)
│   ├── web/          -> Next.js PWA (porta 3000)
│   └── mobile/       -> Capacitor + React (Fase 2)
├── packages/
│   └── shared/       -> @ochefia/shared — tipos, constantes, utils
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml
```

---

## Stack Tecnologica

| Camada | Tecnologia |
|---|---|
| Linguagem | TypeScript em todo o projeto |
| Backend | Node.js + NestJS |
| Real-time | Socket.IO via `@nestjs/websockets` |
| Frontend Web | Next.js 14+ (App Router) + React 18+ + Tailwind CSS |
| App Mobile | Capacitor + React (Fase 2) |
| ORM | Prisma |
| Banco Principal | PostgreSQL com Row-Level Security (multi-tenant) |
| Cache / Sessoes | Redis |
| Monorepo | Turborepo |
| Package Manager | pnpm |
| Testes | Jest (unit) + Supertest (e2e API) + Playwright (e2e web) |
| CI/CD | GitHub Actions |
| Infra | Docker + Docker Compose (dev) / Kubernetes ou AWS ECS (prod) |
| Autenticacao | JWT (access 15min + refresh 7 dias em httpOnly cookie) |
| Documentacao API | Swagger/OpenAPI auto-gerado pelo NestJS |

---

## Modulos Funcionais

### Modulo Gerencial (Dashboard/Backoffice) — Rota: `/admin`
Acesso: Dono/Gerente via computador ou tablet.

- Mapa de mesas em tempo real (livres, ocupadas, aguardando limpeza, tempo de permanencia).
- Metricas: tempo medio de atendimento, tempo de preparo por prato, ticket medio por mesa.
- Financeiro: fechamento de caixa, relatorios de faturamento. (Emissao de NFC-e/SAT fica para fase futura ou integracao com servico terceiro como Focus NFe).
- Estoque: baixa automatica de ingredientes por prato vendido, alertas de estoque minimo.
- Cardapio: CRUD de categorias e produtos, habilitar/desabilitar itens em tempo real, precificacao dinamica (Happy Hour automatico).
- Gestao de funcionarios: cadastro de garcons, cozinheiros, gerentes com permissoes por role.

### Modulo KDS (Kitchen Display System) — Rota: `/kds`
Acesso: Cozinha e Bar via tablet ou monitor.

- Roteamento automatico: bebidas -> tela do bar; pratos -> tela da cozinha.
- Fila de producao com temporizadores e cores (Verde: no prazo, Amarelo: atencao, Vermelho: atrasado).
- Alertas visuais e sonoros para pedido novo ou pedido urgente.
- Clique no prato para ver ficha tecnica (ingredientes, modo de preparo, foto do empratamento).
- Botao "Pronto" que notifica o garcom para retirada.

### Modulo Cliente (Cardapio Digital) — Rota: `/[slug]/mesa/[mesaId]`
Acesso: Cliente via QR Code no navegador.

- **Identificacao via WhatsApp (obrigatoria):** Ao abrir a sessao pela primeira vez, o cliente informa o numero de WhatsApp. O sistema envia um OTP de 6 digitos via WhatsApp. Apos confirmar, o numero fica salvo na sessao (`phone` + `phoneVerified = true`). Objetivo: ter o contato do cliente registrado para eventuais pendencias. Nenhuma funcionalidade ativa usa esse numero alem do armazenamento.
- Cardapio com fotos, descricoes, filtros (vegano, sem gluten, etc).
- Upselling: sugestoes automaticas de adicionais e acompanhamentos (ex: "Que tal adicionar bacon por R$ 4,00?" / "Combina com um Chopp Artesanal").
- Carrinho e envio de pedido.
- Acompanhamento da conta em tempo real.
- Racha de conta: dividir igual, por item, ou cada um paga o seu.
- Pagamento: Pix com QR Code (baixa automatica) e Apple/Google Pay (fase futura).
- Botao "O Chefia": chamado ao garcom com motivo (limpar mesa, pedir gelo, duvida, conta).

### Modulo Garcom — Rota: `/garcom`
Acesso: Celular do garcom (PWA salvo na tela inicial).

- Comanda mobile: lancar pedidos rapidos para qualquer mesa.
- Lista de mesas atribuidas com status.
- Notificacoes push: "Fritas da Mesa 12 prontas na cozinha", "Mesa 04 chamou — motivo: pedir a conta".
- Historico de pedidos da mesa aberta.

### Modulo Explorar (Fase 2) — Rota: `/explorar`
Acesso: App nativo (iOS/Android).

- Listagem de estabelecimentos parceiros com fotos, cardapio, avaliacoes, horarios.
- Mapa e filtros (culinaria, preco, aberto agora, distancia).
- Lotacao em tempo real.
- Reserva de mesa.
- Pre-pedido antes de chegar.
- Perfil do consumidor: historico, favoritos, fidelidade.

---

## Convencoes de Codigo

### Geral
- TypeScript estrito em todo o projeto. Nunca usar `any`.
- Nomes de variaveis e funcoes em **camelCase**.
- Nomes de arquivos em **kebab-case** (ex: `auth.service.ts`, `order-status.ts`).
- Nomes de classes em **PascalCase**.
- Enums em **UPPER_CASE**.
- Exportacoes nomeadas (`export const`, `export function`, `export class`) — nunca `export default` salvo em paginas Next.js.

### Backend (NestJS — `apps/api`)
- Arquitetura Clean: toda logica de negocio fica no **Service**. O **Controller** apenas recebe, valida com DTO e delega.
- Nunca importar um Service de outro modulo diretamente — usar o sistema de exports/imports do NestJS.
- Todos os inputs validados com `class-validator` + `ValidationPipe` global.
- Todos os endpoints documentados com decorators Swagger (`@ApiTags`, `@ApiOperation`, `@ApiResponse`).
- Todo endpoint protegido com `@UseGuards(JwtAuthGuard)` + `@Roles()` salvo rotas publicas explicitas.
- Estrutura obrigatoria por modulo:
  ```
  *.module.ts
  *.controller.ts
  *.service.ts
  dto/
    create-*.dto.ts
    update-*.dto.ts
  ```

### Frontend (Next.js — `apps/web`)
- Paginas sao **Server Components** por padrao.
- Usar `'use client'` apenas quando necessario (interatividade, hooks de estado/efeito).
- Estilizacao exclusivamente com **Tailwind CSS**. Sem CSS customizado salvo excecoes justificadas e documentadas.
- Componentes com mais de 150 linhas devem ser quebrados em componentes menores.
- Props tipadas com `interface` (nao `type alias`) para objetos.
- Componentes exportados como **named exports**.
- Organizacao de componentes:
  ```
  components/ui/       -> Componentes base (Button, Card, Modal, Input) — sem logica de negocio
  components/admin/    -> Dashboard gerencial
  components/kds/      -> KDS
  components/garcom/   -> Modulo garcom
  components/cliente/  -> Cardapio digital
  ```

### Pacote Compartilhado (`packages/shared`)
- Apenas TypeScript puro. **Nenhuma** dependencia de framework (React, NestJS, Next.js).
- Tudo exportado pelo `index.ts` raiz.
- Tipos espelham os models do Prisma mas **sem dependencia do Prisma**.
- Usar `interface` para objetos, enums para status.
- Funcoes utilitarias devem ser puras (sem side effects) e testadas unitariamente.

### Banco de Dados (Prisma)
- Nomes de tabela em **snake_case plural** via `@@map` (ex: `@@map("order_items")`).
- Campos em **camelCase** no schema.
- Enums em **UPPER_CASE**.
- Toda alteracao no banco via `prisma migrate dev` — nunca alterar manualmente.
- O schema em `apps/api/prisma/schema.prisma` e a fonte de verdade da modelagem.

### WebSocket (Socket.IO)
- Nomes de eventos sempre importados de `@ochefia/shared/constants/socket-events`.
- O gateway (`events.gateway.ts`) nao contem logica de negocio — chama os Services dos modulos.
- Todo evento emitido deve ter um tipo definido no pacote shared.

---

## Seguranca

- **Multi-tenant:** Middleware injeta `restaurantId` do JWT em toda query. PostgreSQL RLS como segunda camada.
- **Sessao do cliente (publica):** Nao usa JWT. Usa token unico da `TableSession` na URL + cookie. Sem login do cliente no MVP. Validado por IP + cookie como camada extra.
- **Identificacao via WhatsApp:** Ao abrir a sessao, cliente informa numero -> sistema envia OTP via WhatsApp -> confirma -> salva `phone` + `phoneVerified = true` na sessao. Nenhuma acao automatica usa o numero alem do armazenamento.
- **Autenticacao:** JWT com access token (15min) + refresh token (7 dias). Refresh token armazenado em httpOnly cookie.
- **Rate Limiting:** Por IP via `express-rate-limit`.
- **Validacao:** `class-validator` + `ValidationPipe` global.
- **LGPD:** Dados sensiveis criptografados. Endpoint de exclusao de dados do cliente obrigatorio.
- **HTTPS/TLS 1.3** obrigatorio em producao.
- **WAF:** Web Application Firewall contra injecao SQL, XSS e DDoS.

---

## Multi-Tenancy

Toda entidade do banco esta vinculada a um `Restaurant` por `restaurantId`. O middleware de tenant injeta o `restaurantId` do JWT autenticado em toda query. PostgreSQL RLS garante isolamento como segunda camada de protecao.

Sessoes de clientes (publicas) sao isoladas pelo `token` unico da `TableSession` — sem JWT, sem autenticacao, mas a sessao so acessa dados daquela mesa/restaurante.

---

## Roles e Permissoes

```
OWNER    -> Acesso total
MANAGER  -> Admin sem configuracoes financeiras sensiveis
WAITER   -> Modulo garcom + chamados
KITCHEN  -> KDS (cozinha)
BAR      -> KDS (bar)
```

---

## Roteamento KDS

- Produtos com `destination: KITCHEN` -> tela da cozinha.
- Produtos com `destination: BAR` -> tela do bar.
- Produtos com `destination: BOTH` -> ambas as telas.

---

## Eventos WebSocket (Socket.IO)

Arquivo de referencia: `packages/shared/src/constants/socket-events.ts`

```typescript
export const SOCKET_EVENTS = {
  // Cliente -> Servidor
  ORDER_CREATED: 'order:created',           // Cliente fez um novo pedido
  CALL_REQUEST: 'call:request',             // Cliente apertou "O Chefia"
  PAYMENT_INITIATED: 'payment:initiated',   // Cliente iniciou pagamento

  // Servidor -> KDS
  KDS_NEW_ORDER: 'kds:new-order',           // Novo pedido na fila
  KDS_ORDER_CANCELLED: 'kds:order-cancelled',

  // KDS -> Servidor
  KDS_STATUS_UPDATE: 'kds:status-update',   // Cozinha mudou status (preparing/ready)

  // Servidor -> Garcom
  WAITER_ORDER_READY: 'waiter:order-ready', // Prato pronto pra retirar
  WAITER_CALL: 'waiter:call',               // Cliente chamou
  WAITER_NEW_ORDER: 'waiter:new-order',     // Novo pedido na mesa dele

  // Servidor -> Cliente
  CLIENT_ORDER_UPDATE: 'client:order-update',     // Status do pedido mudou
  CLIENT_SESSION_UPDATE: 'client:session-update',  // Conta atualizada

  // Servidor -> Admin
  ADMIN_TABLE_UPDATE: 'admin:table-update',        // Status de mesa mudou
  ADMIN_METRICS_UPDATE: 'admin:metrics-update',    // Metricas atualizaram

  // Estoque
  STOCK_ALERT_TRIGGERED: 'stock:alert-triggered',
  STOCK_UPDATED: 'stock:updated',
} as const;
```

---

## Endpoints da API (RESTful)

Base URL: `/api/v1`

### Auth
| Metodo | Rota | Descricao |
|---|---|---|
| POST | `/auth/register` | Registro de restaurante + owner |
| POST | `/auth/login` | Login -> retorna JWT |
| POST | `/auth/refresh` | Refresh token |
| GET | `/auth/me` | Dados do usuario logado |

### Restaurant
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/restaurants/:slug` | Dados publicos do restaurante |
| PUT | `/restaurants/:id` | Atualizar dados (OWNER/MANAGER) |
| GET | `/restaurants/:id/settings` | Configuracoes |
| PUT | `/restaurants/:id/settings` | Atualizar configuracoes |

### Tables
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/tables` | Listar mesas do restaurante |
| POST | `/tables` | Criar mesa |
| PUT | `/tables/:id` | Atualizar mesa |
| DELETE | `/tables/:id` | Remover mesa |
| POST | `/tables/:id/open` | Abrir sessao da mesa |
| POST | `/tables/:id/close` | Fechar sessao (encerrar conta) |
| GET | `/tables/:id/session` | Sessao ativa da mesa |

### Table Session (acesso publico via token)
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/session/:token` | Dados da sessao (pedidos, conta) |
| POST | `/session/:token/join` | Cliente entrar na sessao |
| POST | `/session/:token/phone` | Enviar OTP via WhatsApp para o numero informado |
| POST | `/session/:token/phone/verify` | Confirmar OTP e salvar numero verificado na sessao |

### Menu
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/menu/:restaurantSlug` | Cardapio publico (com cache Redis) |
| GET | `/menu/categories` | Listar categorias (admin) |
| POST | `/menu/categories` | Criar categoria |
| PUT | `/menu/categories/:id` | Atualizar categoria |
| GET | `/menu/products` | Listar produtos (admin) |
| POST | `/menu/products` | Criar produto |
| PUT | `/menu/products/:id` | Atualizar produto |
| PATCH | `/menu/products/:id/availability` | Toggle disponibilidade |

### Orders
| Metodo | Rota | Descricao |
|---|---|---|
| POST | `/orders` | Criar pedido (via sessao token) |
| GET | `/orders` | Listar pedidos (admin, filtros) |
| GET | `/orders/:id` | Detalhes do pedido |
| PATCH | `/orders/:id/status` | Atualizar status (KDS/garcom) |
| PATCH | `/orders/items/:id/status` | Atualizar status de item individual |

### Payments
| Metodo | Rota | Descricao |
|---|---|---|
| POST | `/payments` | Iniciar pagamento |
| GET | `/payments/:id/status` | Verificar status |
| POST | `/payments/pix/webhook` | Webhook de confirmacao Pix |

### Call Requests
| Metodo | Rota | Descricao |
|---|---|---|
| POST | `/calls` | Criar chamado (cliente) |
| GET | `/calls` | Listar chamados abertos (garcom) |
| PATCH | `/calls/:id/acknowledge` | Garcom viu |
| PATCH | `/calls/:id/resolve` | Garcom resolveu |

### Stock
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/stock/ingredients` | Listar ingredientes |
| POST | `/stock/ingredients` | Criar ingrediente |
| PUT | `/stock/ingredients/:id` | Atualizar estoque |
| GET | `/stock/alerts` | Ingredientes abaixo do minimo |

### Dashboard
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/dashboard/overview` | Metricas gerais em tempo real |
| GET | `/dashboard/revenue` | Faturamento por periodo |
| GET | `/dashboard/popular-items` | Itens mais vendidos |

### Staff
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/staff` | Listar funcionarios |
| POST | `/staff` | Criar funcionario |
| POST | `/staff/invite` | Enviar convite (log no console em dev) |
| POST | `/staff/accept` | Aceitar convite e criar conta (publico) |
| PUT | `/staff/:id` | Atualizar funcionario |
| DELETE | `/staff/:id` | Desativar funcionario |

---

## Fase Atual

**Sprint 0 — Scaffolding e Documentacao Estrutural**

Criar toda a estrutura de pastas do monorepo com `README.md` em cada pasta relevante, definindo proposito, responsabilidades, padroes e exemplos. Nenhum codigo de negocio ainda.

Proximo: Sprint 1-2 (Fundacao) — setup Turborepo + pnpm, NestJS, Prisma, PostgreSQL, Docker Compose, modulo auth, CRUD restaurante/mesas, seed.

---

## Roadmap de Sprints

### Sprint 0 — Scaffolding e Documentacao Estrutural
- [ ] Criar toda a estrutura de pastas do monorepo com `README.md` em cada pasta relevante.

### Sprint 1-2 — Fundacao
- [ ] Setup monorepo Turborepo + pnpm.
- [ ] NestJS com estrutura de modulos, Prisma, PostgreSQL.
- [ ] Docker Compose rodando local.
- [ ] Modulo auth completo (register, login, JWT, roles).
- [ ] CRUD de restaurante e mesas.
- [ ] Seed com dados de teste.

### Sprint 3-4 — Cardapio e Pedidos
- [ ] CRUD de categorias, produtos, adicionais.
- [ ] Cache do cardapio no Redis.
- [ ] Endpoint publico do cardapio por slug.
- [ ] Frontend: tela do cardapio digital (Next.js).
- [ ] Carrinho e criacao de pedido.
- [ ] Sessao de mesa (token na URL + cookie).
- [ ] Coleta e verificacao de WhatsApp via OTP (tela obrigatoria ao abrir a sessao).

### Sprint 5-6 — KDS e Tempo Real
- [ ] WebSocket gateway (Socket.IO).
- [ ] Roteamento de pedidos (cozinha vs. bar).
- [ ] Frontend: tela KDS com fila, cores e temporizadores.
- [ ] Fluxo completo: cliente pede -> KDS recebe -> cozinha prepara -> marca pronto.

### Sprint 7-8 — Garcom, Chamados, Staff e Estoque
- [ ] Modulo garcom (comanda mobile).
- [ ] Botao "O Chefia" (chamados com tipo).
- [ ] Notificacoes para o garcom (pedido pronto, chamado de mesa).
- [ ] Frontend: tela do garcom (PWA).
- [ ] CRUD de ingredientes e alertas de estoque.
- [ ] Gestao de equipe com convites.
- [ ] Testes e2e (Supertest + Playwright).

### Sprint 9 — UI/UX e Componentes Base
- [ ] Biblioteca de componentes base (Button, Input, Badge, Modal, Toggle, Skeleton, Spinner).
- [ ] Toast notifications (sonner).
- [ ] Skeleton loading em todas as telas.
- [ ] Refactor KDS e admin para usar componentes base.

### Sprint 10 — Layout e Navegacao
- [ ] AdminSidebar fixa com navegacao, avatar e role.
- [ ] Layout admin com sidebar + mobile top bar.
- [ ] Redesign da pagina de login.
- [ ] KDS layout com indicador de conexao WebSocket.

### Sprint 11 — QR Code Pix, Relatorios, Notificacoes Push
- [ ] QR Code Pix com baixa automatica.
- [ ] Relatorios de faturamento e itens populares.
- [ ] Notificacoes push para o garcom.
- [ ] Racha de conta no frontend.

### Sprint 12+ — Dashboard Avancado e Otimizacoes
- [ ] Dashboard gerencial avancado (mapa de mesas visual, graficos).
- [ ] Controle de estoque com baixa automatica por pedido.
- [ ] Alertas de estoque minimo em tempo real.

### Sprint 13+ — Fase 2 (Plataforma)
- [ ] App nativo com Capacitor (iOS/Android).
- [ ] Cadastro/login do consumidor final.
- [ ] Tela "Explorar" com estabelecimentos.
- [ ] Lotacao em tempo real, reserva de mesa, pre-pedido.
- [ ] Programa de fidelidade.
- [ ] Emissao de NFC-e/SAT (integracao com Focus NFe ou similar).
