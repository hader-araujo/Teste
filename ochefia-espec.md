# OChefia — Especificação Técnica Completa (SPEC.md)

> Este documento é a fonte única de verdade do projeto OChefia. Deve ser consultado pelo agente de desenvolvimento (Claude Code) e pelos desenvolvedores para guiar toda a implementação.

---

## 1. O Que É o OChefia

SaaS em nuvem para gestão completa de bares e restaurantes no Brasil. Cardápio digital via QR Code, autoatendimento, KDS (Kitchen Display System), gestão de salão e dashboard gerencial — tudo em tempo real.

---

## 2. Fases do Produto

### Fase 1 — MVP
- Cliente lê QR Code da mesa → abre cardápio no navegador (PWA) → faz pedido → acompanha conta → paga → vai embora.
- Sem download de app, sem cadastro do cliente.
- Sessão vinculada à mesa (não ao celular). Fechar e reabrir o navegador mantém os pedidos. Sessão encerra ao fechar a conta.
- Público-alvo: vender para donos de bares/restaurantes.

### Fase 2 — Plataforma
- App nativo (iOS/Android) para o consumidor final.
- Cadastro do cliente, histórico, favoritos, fidelidade.
- Tela "Explorar": listar estabelecimentos parceiros, lotação em tempo real, reserva de mesa, pré-pedido.
- Ao ler QR Code logado no app, sessão da mesa se vincula ao perfil do cliente.

---

## 3. Módulos Funcionais

### 3.1. Módulo Gerencial (Dashboard/Backoffice) — Rota: `/admin`
Acesso: Dono/Gerente via computador ou tablet.

- Mapa de mesas em tempo real (livres, ocupadas, aguardando limpeza, tempo de permanência).
- Métricas: tempo médio de atendimento, tempo de preparo por prato, ticket médio por mesa.
- Financeiro: fechamento de caixa, relatórios de faturamento. (Emissão de NFC-e/SAT fica para fase futura ou integração com serviço terceiro como Focus NFe).
- Estoque: baixa automática de ingredientes por prato vendido, alertas de estoque mínimo.
- Cardápio: CRUD de categorias e produtos, habilitar/desabilitar itens em tempo real, precificação dinâmica (Happy Hour automático).
- Gestão de funcionários: cadastro de garçons, cozinheiros, gerentes com permissões por role.

### 3.2. Módulo KDS (Kitchen Display System) — Rota: `/kds`
Acesso: Cozinha e Bar via tablet ou monitor.

- Roteamento automático: bebidas → tela do bar; pratos → tela da cozinha.
- Fila de produção com temporizadores e cores (Verde: no prazo, Amarelo: atenção, Vermelho: atrasado).
- Alertas visuais e sonoros para pedido novo ou pedido urgente.
- Clique no prato para ver ficha técnica (ingredientes, modo de preparo, foto do empratamento).
- Botão "Pronto" que notifica o garçom para retirada.

### 3.3. Módulo Cliente (Cardápio Digital) — Rota: `/cardapio/:slug/mesa/:mesaId`
Acesso: Cliente via QR Code no navegador.

- Cardápio com fotos, descrições, filtros (vegano, sem glúten, etc).
- Upselling: sugestões automáticas de adicionais e acompanhamentos.
- Carrinho e envio de pedido.
- Acompanhamento da conta em tempo real.
- Racha de conta: dividir igual, por item, ou cada um paga o seu.
- Pagamento: Pix com QR Code (baixa automática) e Apple/Google Pay (fase futura).
- Botão "O Chefia": chamado ao garçom com motivo (limpar mesa, pedir gelo, dúvida, conta).

### 3.4. Módulo Garçom — Rota: `/garcom`
Acesso: Celular do garçom (PWA salvo na tela inicial).

- Comanda mobile: lançar pedidos rápidos para qualquer mesa.
- Lista de mesas atribuídas com status.
- Notificações push: "Fritas da Mesa 12 prontas na cozinha", "Mesa 04 chamou — motivo: pedir a conta".
- Histórico de pedidos da mesa aberta.

### 3.5. Módulo Explorar (Fase 2) — Rota: `/explorar`
Acesso: App nativo (iOS/Android).

- Listagem de estabelecimentos parceiros com fotos, cardápio, avaliações, horários.
- Mapa e filtros (culinária, preço, aberto agora, distância).
- Lotação em tempo real.
- Reserva de mesa.
- Pré-pedido antes de chegar.
- Perfil do consumidor: histórico, favoritos, fidelidade.

---

## 4. Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| Linguagem | TypeScript (em todo o projeto) |
| Backend | Node.js + NestJS |
| Real-time | Socket.IO (integrado ao NestJS via @nestjs/websockets) |
| Frontend Web | Next.js 14+ (App Router) + React 18+ + Tailwind CSS |
| App Mobile | Capacitor + React (Fase 2) |
| ORM | Prisma |
| Banco Principal | PostgreSQL (com Row-Level Security para multi-tenant) |
| Cache/Sessões | Redis |
| Monorepo | Turborepo |
| Package Manager | pnpm |
| Testes | Jest (unit) + Supertest (e2e API) + Playwright (e2e web) |
| CI/CD | GitHub Actions |
| Infra | Docker + Docker Compose (dev) / Kubernetes ou AWS ECS (prod) |
| Autenticação | JWT (access + refresh token) |
| Documentação API | Swagger/OpenAPI (auto-gerado pelo NestJS) |

---

## 5. Estrutura do Monorepo

```
ochefia/
├── apps/
│   ├── api/                          # NestJS Backend
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/             # Autenticação JWT, login, registro
│   │   │   │   │   ├── auth.controller.ts
│   │   │   │   │   ├── auth.service.ts
│   │   │   │   │   ├── auth.module.ts
│   │   │   │   │   ├── guards/
│   │   │   │   │   │   ├── jwt-auth.guard.ts
│   │   │   │   │   │   └── roles.guard.ts
│   │   │   │   │   └── strategies/
│   │   │   │   │       └── jwt.strategy.ts
│   │   │   │   ├── restaurant/       # CRUD restaurante, config
│   │   │   │   ├── table/            # CRUD mesas, sessões de mesa
│   │   │   │   ├── menu/             # Categorias, produtos, adicionais
│   │   │   │   ├── order/            # Pedidos, itens, status
│   │   │   │   ├── payment/          # Pagamentos, Pix, racha de conta
│   │   │   │   ├── kds/              # Fila da cozinha/bar, roteamento
│   │   │   │   ├── waiter/           # Chamados, atribuição de mesas
│   │   │   │   ├── stock/            # Estoque, ingredientes, baixas
│   │   │   │   └── dashboard/        # Métricas, relatórios
│   │   │   ├── common/
│   │   │   │   ├── decorators/       # @Roles(), @CurrentUser(), @Tenant()
│   │   │   │   ├── filters/          # Exception filters
│   │   │   │   ├── interceptors/     # Logging, transform
│   │   │   │   ├── pipes/            # Validation pipes
│   │   │   │   └── middleware/        # Tenant middleware (RLS)
│   │   │   ├── gateway/
│   │   │   │   └── events.gateway.ts # WebSocket gateway (Socket.IO)
│   │   │   ├── prisma/
│   │   │   │   └── prisma.service.ts
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── seed.ts               # Dados iniciais para dev
│   │   ├── test/
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── web/                          # Next.js PWA
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (admin)/          # Route group — Dashboard gerencial
│   │   │   │   │   ├── admin/
│   │   │   │   │   │   ├── page.tsx          # Dashboard principal
│   │   │   │   │   │   ├── mesas/page.tsx    # Mapa de mesas
│   │   │   │   │   │   ├── cardapio/page.tsx # Gestão de cardápio
│   │   │   │   │   │   ├── estoque/page.tsx  # Controle de estoque
│   │   │   │   │   │   ├── financeiro/page.tsx
│   │   │   │   │   │   └── equipe/page.tsx
│   │   │   │   ├── (kds)/            # Route group — KDS
│   │   │   │   │   └── kds/
│   │   │   │   │       └── page.tsx          # Tela da cozinha/bar
│   │   │   │   ├── (garcom)/         # Route group — Garçom
│   │   │   │   │   └── garcom/
│   │   │   │   │       ├── page.tsx          # Painel do garçom
│   │   │   │   │       └── mesa/[id]/page.tsx
│   │   │   │   ├── (cliente)/        # Route group — Cardápio digital
│   │   │   │   │   └── [slug]/
│   │   │   │   │       └── mesa/
│   │   │   │   │           └── [mesaId]/
│   │   │   │   │               ├── page.tsx      # Cardápio
│   │   │   │   │               ├── carrinho/page.tsx
│   │   │   │   │               └── conta/page.tsx
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx          # Landing page do OChefia
│   │   │   ├── components/
│   │   │   │   ├── ui/               # Componentes base (Button, Card, Modal, etc)
│   │   │   │   ├── admin/            # Componentes do dashboard
│   │   │   │   ├── kds/              # Componentes do KDS
│   │   │   │   ├── garcom/           # Componentes do garçom
│   │   │   │   └── cliente/          # Componentes do cardápio digital
│   │   │   ├── hooks/
│   │   │   │   ├── useSocket.ts      # Re-exporta do shared
│   │   │   │   └── useSession.ts
│   │   │   ├── lib/
│   │   │   │   └── api.ts            # Cliente HTTP (fetch wrapper)
│   │   │   └── providers/
│   │   │       ├── SocketProvider.tsx
│   │   │       └── SessionProvider.tsx
│   │   ├── public/
│   │   │   ├── manifest.json         # PWA manifest
│   │   │   ├── sw.js                 # Service Worker
│   │   │   └── icons/
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── mobile/                       # Capacitor App (Fase 2)
│       ├── src/                      # Compartilha componentes React do web
│       ├── android/
│       ├── ios/
│       ├── capacitor.config.ts
│       └── package.json
│
├── packages/
│   └── shared/                       # Código compartilhado web + mobile + api
│       ├── src/
│       │   ├── types/                # Interfaces TypeScript
│       │   │   ├── restaurant.ts
│       │   │   ├── table.ts
│       │   │   ├── menu.ts
│       │   │   ├── order.ts
│       │   │   ├── payment.ts
│       │   │   └── user.ts
│       │   ├── constants/
│       │   │   ├── order-status.ts
│       │   │   └── socket-events.ts  # Nomes de eventos WebSocket
│       │   ├── utils/
│       │   │   ├── currency.ts       # Formatação BRL
│       │   │   ├── split-bill.ts     # Lógica de racha de conta
│       │   │   └── validators.ts
│       │   └── index.ts
│       └── package.json
│
├── docker-compose.yml                # PostgreSQL + Redis + API + Web (dev)
├── turbo.json
├── pnpm-workspace.yaml
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Lint, test, build
│       └── deploy.yml
├── .env.example
├── README.md
└── package.json
```

---

## 6. Schema do Banco de Dados (Prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// MULTI-TENANT: Tudo vinculado a um Restaurant
// ============================================

model Restaurant {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique          // URL amigável: "ze-bar"
  logo        String?
  address     String?
  phone       String?
  openingHours Json?                    // { "mon": { "open": "11:00", "close": "23:00" }, ... }
  pixKey      String?                   // Chave Pix para pagamentos
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relações
  users       User[]
  tables      Table[]
  categories  MenuCategory[]
  products    Product[]
  orders      Order[]
  ingredients Ingredient[]
  settings    RestaurantSettings?

  @@map("restaurants")
}

model RestaurantSettings {
  id              String     @id @default(cuid())
  restaurantId    String     @unique
  restaurant      Restaurant @relation(fields: [restaurantId], references: [id])
  
  happyHourEnabled  Boolean  @default(false)
  happyHourStart    String?  // "17:00"
  happyHourEnd      String?  // "19:00"
  happyHourDiscount Float?   // 0.15 = 15%
  
  autoAcceptOrders  Boolean  @default(false) // Se true, pedido vai direto pro KDS
  avgPrepTime       Int      @default(20)    // Minutos — tempo médio de preparo padrão

  @@map("restaurant_settings")
}

// ============================================
// USUÁRIOS E AUTENTICAÇÃO
// ============================================

enum UserRole {
  OWNER       // Dono — acesso total
  MANAGER     // Gerente — acesso ao admin sem config financeira sensível
  WAITER      // Garçom
  KITCHEN     // Cozinheiro
  BAR         // Barman
}

model User {
  id           String     @id @default(cuid())
  restaurantId String
  restaurant   Restaurant @relation(fields: [restaurantId], references: [id])
  
  name         String
  email        String     @unique
  passwordHash String
  role         UserRole
  isActive     Boolean    @default(true)
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  @@map("users")
}

// ============================================
// MESAS E SESSÕES
// ============================================

enum TableStatus {
  AVAILABLE   // Livre
  OCCUPIED    // Ocupada
  CLEANING    // Aguardando limpeza
  RESERVED    // Reservada (Fase 2)
}

model Table {
  id           String      @id @default(cuid())
  restaurantId String
  restaurant   Restaurant  @relation(fields: [restaurantId], references: [id])
  
  number       Int                      // Número da mesa (exibição)
  seats        Int         @default(4)  // Capacidade
  status       TableStatus @default(AVAILABLE)
  qrCode       String?                  // URL ou hash do QR Code
  posX         Float?                   // Posição X no mapa de mesas
  posY         Float?                   // Posição Y no mapa de mesas
  
  sessions     TableSession[]

  @@unique([restaurantId, number])
  @@map("tables")
}

model TableSession {
  id           String    @id @default(cuid())
  tableId      String
  table        Table     @relation(fields: [tableId], references: [id])
  
  token        String    @unique @default(cuid()) // Token na URL para o cliente reconectar
  customerName String?                             // Opcional
  peopleCount  Int       @default(1)
  openedAt     DateTime  @default(now())
  closedAt     DateTime?
  isActive     Boolean   @default(true)
  
  orders       Order[]
  payments     Payment[]
  callRequests CallRequest[]

  @@map("table_sessions")
}

// ============================================
// CARDÁPIO
// ============================================

model MenuCategory {
  id           String     @id @default(cuid())
  restaurantId String
  restaurant   Restaurant @relation(fields: [restaurantId], references: [id])
  
  name         String                    // "Hambúrgueres", "Bebidas", "Sobremesas"
  description  String?
  sortOrder    Int        @default(0)
  isActive     Boolean    @default(true)
  
  products     Product[]

  @@map("menu_categories")
}

model Product {
  id           String       @id @default(cuid())
  restaurantId String
  restaurant   Restaurant   @relation(fields: [restaurantId], references: [id])
  categoryId   String
  category     MenuCategory @relation(fields: [categoryId], references: [id])
  
  name         String                        // "X-Bacon Artesanal"
  description  String?                       // "Blend 180g, bacon crocante, queijo cheddar..."
  price        Float
  image        String?                       // URL da foto
  prepTime     Int?                          // Minutos estimados de preparo
  isAvailable  Boolean      @default(true)   // Desabilitar quando acabar
  isActive     Boolean      @default(true)   // Soft delete
  sortOrder    Int          @default(0)
  
  // Filtros
  isVegan      Boolean      @default(false)
  isVegetarian Boolean      @default(false)
  isGlutenFree Boolean      @default(false)
  isSpicy      Boolean      @default(false)
  
  // Roteamento KDS
  destination  KDSDestination @default(KITCHEN)
  
  // Ficha técnica
  recipe       String?        // Modo de preparo (markdown)
  platingImage String?        // Foto do empratamento padrão
  
  // Relações
  addons       ProductAddon[]
  ingredients  ProductIngredient[]
  orderItems   OrderItem[]
  upsells      UpsellRule[]    @relation("SourceProduct")
  upsellOf     UpsellRule[]    @relation("SuggestedProduct")

  @@map("products")
}

enum KDSDestination {
  KITCHEN
  BAR
  BOTH
}

model ProductAddon {
  id        String  @id @default(cuid())
  productId String
  product   Product @relation(fields: [productId], references: [id])
  
  name      String  // "Adicionar bacon"
  price     Float   // 4.00
  isActive  Boolean @default(true)

  @@map("product_addons")
}

model UpsellRule {
  id                 String  @id @default(cuid())
  sourceProductId    String
  sourceProduct      Product @relation("SourceProduct", fields: [sourceProductId], references: [id])
  suggestedProductId String
  suggestedProduct   Product @relation("SuggestedProduct", fields: [suggestedProductId], references: [id])
  
  message            String  // "Combina perfeitamente com um Chopp Artesanal"
  isActive           Boolean @default(true)

  @@map("upsell_rules")
}

// ============================================
// ESTOQUE
// ============================================

model Ingredient {
  id           String     @id @default(cuid())
  restaurantId String
  restaurant   Restaurant @relation(fields: [restaurantId], references: [id])
  
  name         String                  // "Pão brioche"
  unit         String                  // "un", "kg", "l", "ml"
  currentStock Float      @default(0)
  minStock     Float      @default(0)  // Alerta quando atingir
  costPerUnit  Float?                  // Custo unitário
  
  products     ProductIngredient[]

  @@map("ingredients")
}

model ProductIngredient {
  id           String     @id @default(cuid())
  productId    String
  product      Product    @relation(fields: [productId], references: [id])
  ingredientId String
  ingredient   Ingredient @relation(fields: [ingredientId], references: [id])
  
  quantity     Float                   // Quantidade do ingrediente usado por unidade do produto

  @@unique([productId, ingredientId])
  @@map("product_ingredients")
}

// ============================================
// PEDIDOS
// ============================================

enum OrderStatus {
  PENDING     // Aguardando confirmação (se autoAccept = false)
  CONFIRMED   // Confirmado, na fila do KDS
  PREPARING   // Em preparo
  READY       // Pronto para retirada
  DELIVERED   // Entregue na mesa
  CANCELLED   // Cancelado
}

model Order {
  id             String       @id @default(cuid())
  restaurantId   String
  restaurant     Restaurant   @relation(fields: [restaurantId], references: [id])
  tableSessionId String
  tableSession   TableSession @relation(fields: [tableSessionId], references: [id])
  
  status         OrderStatus  @default(PENDING)
  notes          String?                          // Observações gerais do pedido
  createdAt      DateTime     @default(now())
  confirmedAt    DateTime?
  readyAt        DateTime?
  deliveredAt    DateTime?
  
  items          OrderItem[]

  @@map("orders")
}

model OrderItem {
  id        String      @id @default(cuid())
  orderId   String
  order     Order       @relation(fields: [orderId], references: [id])
  productId String
  product   Product     @relation(fields: [productId], references: [id])
  
  quantity  Int         @default(1)
  unitPrice Float                       // Preço no momento do pedido (pode ter Happy Hour)
  addons    Json?                       // [{ "name": "Bacon extra", "price": 4.00 }]
  notes     String?                     // "Sem cebola", "Mal passado"
  status    OrderStatus @default(PENDING)

  @@map("order_items")
}

// ============================================
// PAGAMENTOS
// ============================================

enum PaymentMethod {
  PIX
  CREDIT_CARD
  DEBIT_CARD
  CASH
  APPLE_PAY
  GOOGLE_PAY
}

enum PaymentStatus {
  PENDING
  CONFIRMED
  FAILED
  REFUNDED
}

model Payment {
  id             String        @id @default(cuid())
  tableSessionId String
  tableSession   TableSession  @relation(fields: [tableSessionId], references: [id])
  
  method         PaymentMethod
  status         PaymentStatus @default(PENDING)
  amount         Float
  paidBy         String?                          // Nome de quem pagou (no racha)
  pixCode        String?                          // Código Pix copia-e-cola
  externalId     String?                          // ID do gateway de pagamento
  createdAt      DateTime      @default(now())
  confirmedAt    DateTime?

  @@map("payments")
}

// ============================================
// CHAMADOS DO CLIENTE (Botão "O Chefia")
// ============================================

enum CallRequestType {
  WAITER        // Chamar garçom genérico
  CLEAN_TABLE   // Limpar mesa
  ICE           // Pedir gelo
  MENU_HELP     // Dúvida no cardápio
  CHECK_PLEASE  // Pedir a conta
  URGENT        // Urgência
  OTHER
}

enum CallRequestStatus {
  OPEN
  ACKNOWLEDGED  // Garçom viu
  RESOLVED      // Resolvido
}

model CallRequest {
  id             String            @id @default(cuid())
  tableSessionId String
  tableSession   TableSession      @relation(fields: [tableSessionId], references: [id])
  
  type           CallRequestType
  status         CallRequestStatus @default(OPEN)
  message        String?
  createdAt      DateTime          @default(now())
  resolvedAt     DateTime?

  @@map("call_requests")
}
```

---

## 7. Eventos WebSocket (Socket.IO)

Arquivo de referência: `packages/shared/src/constants/socket-events.ts`

```typescript
export const SOCKET_EVENTS = {
  // Cliente → Servidor
  ORDER_CREATED: 'order:created',           // Cliente fez um novo pedido
  CALL_REQUEST: 'call:request',             // Cliente apertou "O Chefia"
  PAYMENT_INITIATED: 'payment:initiated',   // Cliente iniciou pagamento

  // Servidor → KDS
  KDS_NEW_ORDER: 'kds:new-order',           // Novo pedido na fila
  KDS_ORDER_CANCELLED: 'kds:order-cancelled',

  // KDS → Servidor
  KDS_STATUS_UPDATE: 'kds:status-update',   // Cozinha mudou status (preparing/ready)

  // Servidor → Garçom
  WAITER_ORDER_READY: 'waiter:order-ready', // Prato pronto pra retirar
  WAITER_CALL: 'waiter:call',               // Cliente chamou
  WAITER_NEW_ORDER: 'waiter:new-order',     // Novo pedido na mesa dele

  // Servidor → Cliente
  CLIENT_ORDER_UPDATE: 'client:order-update',     // Status do pedido mudou
  CLIENT_SESSION_UPDATE: 'client:session-update',  // Conta atualizada

  // Servidor → Admin
  ADMIN_TABLE_UPDATE: 'admin:table-update',        // Status de mesa mudou
  ADMIN_METRICS_UPDATE: 'admin:metrics-update',    // Métricas atualizaram
} as const;
```

---

## 8. Endpoints da API (RESTful)

Base URL: `/api/v1`

### Auth
| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/register` | Registro de restaurante + owner |
| POST | `/auth/login` | Login → retorna JWT |
| POST | `/auth/refresh` | Refresh token |
| GET | `/auth/me` | Dados do usuário logado |

### Restaurant
| Método | Rota | Descrição |
|---|---|---|
| GET | `/restaurants/:slug` | Dados públicos do restaurante |
| PUT | `/restaurants/:id` | Atualizar dados (OWNER/MANAGER) |
| GET | `/restaurants/:id/settings` | Configurações |
| PUT | `/restaurants/:id/settings` | Atualizar configurações |

### Tables
| Método | Rota | Descrição |
|---|---|---|
| GET | `/tables` | Listar mesas do restaurante |
| POST | `/tables` | Criar mesa |
| PUT | `/tables/:id` | Atualizar mesa |
| DELETE | `/tables/:id` | Remover mesa |
| POST | `/tables/:id/open` | Abrir sessão da mesa |
| POST | `/tables/:id/close` | Fechar sessão (encerrar conta) |
| GET | `/tables/:id/session` | Sessão ativa da mesa |

### Table Session (acesso público via token)
| Método | Rota | Descrição |
|---|---|---|
| GET | `/session/:token` | Dados da sessão (pedidos, conta) |
| POST | `/session/:token/join` | Cliente entrar na sessão |

### Menu
| Método | Rota | Descrição |
|---|---|---|
| GET | `/menu/:restaurantSlug` | Cardápio público (com cache Redis) |
| GET | `/menu/categories` | Listar categorias (admin) |
| POST | `/menu/categories` | Criar categoria |
| PUT | `/menu/categories/:id` | Atualizar categoria |
| GET | `/menu/products` | Listar produtos (admin) |
| POST | `/menu/products` | Criar produto |
| PUT | `/menu/products/:id` | Atualizar produto |
| PATCH | `/menu/products/:id/availability` | Toggle disponibilidade |

### Orders
| Método | Rota | Descrição |
|---|---|---|
| POST | `/orders` | Criar pedido (via sessão token) |
| GET | `/orders` | Listar pedidos (admin, filtros) |
| GET | `/orders/:id` | Detalhes do pedido |
| PATCH | `/orders/:id/status` | Atualizar status (KDS/garçom) |
| PATCH | `/orders/items/:id/status` | Atualizar status de item individual |

### Payments
| Método | Rota | Descrição |
|---|---|---|
| POST | `/payments` | Iniciar pagamento |
| GET | `/payments/:id/status` | Verificar status |
| POST | `/payments/pix/webhook` | Webhook de confirmação Pix |

### Call Requests
| Método | Rota | Descrição |
|---|---|---|
| POST | `/calls` | Criar chamado (cliente) |
| GET | `/calls` | Listar chamados abertos (garçom) |
| PATCH | `/calls/:id/acknowledge` | Garçom viu |
| PATCH | `/calls/:id/resolve` | Garçom resolveu |

### Stock
| Método | Rota | Descrição |
|---|---|---|
| GET | `/stock/ingredients` | Listar ingredientes |
| POST | `/stock/ingredients` | Criar ingrediente |
| PUT | `/stock/ingredients/:id` | Atualizar estoque |
| GET | `/stock/alerts` | Ingredientes abaixo do mínimo |

### Dashboard
| Método | Rota | Descrição |
|---|---|---|
| GET | `/dashboard/overview` | Métricas gerais em tempo real |
| GET | `/dashboard/revenue` | Faturamento por período |
| GET | `/dashboard/popular-items` | Itens mais vendidos |

### Staff
| Método | Rota | Descrição |
|---|---|---|
| GET | `/staff` | Listar funcionários |
| POST | `/staff` | Criar funcionário |
| PUT | `/staff/:id` | Atualizar funcionário |
| DELETE | `/staff/:id` | Desativar funcionário |

---

## 9. Segurança

- **Multi-tenant:** Toda query passa por um middleware que injeta o `restaurantId` do JWT. PostgreSQL RLS como segunda camada de proteção.
- **Autenticação:** JWT com access token (15min) + refresh token (7 dias). Refresh token armazenado em httpOnly cookie.
- **Sessão do cliente (público):** Não usa JWT. Usa token único da TableSession na URL. Validado por IP + cookie como camada extra.
- **Roles:** OWNER > MANAGER > WAITER > KITCHEN/BAR. Cada endpoint tem `@Roles()` decorator.
- **Rate Limiting:** Limite de requisições por IP (express-rate-limit).
- **Validação:** Todos os inputs validados com class-validator + ValidationPipe global.
- **LGPD:** Dados sensíveis criptografados. Endpoint para exclusão de dados do cliente.
- **HTTPS:** Obrigatório. TLS 1.3.
- **WAF:** Web Application Firewall contra injeção SQL, XSS e DDoS.

---

## 10. Docker Compose (Desenvolvimento Local)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: ochefia
      POSTGRES_USER: ochefia
      POSTGRES_PASSWORD: ochefia_dev
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'

  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    ports:
      - '3001:3001'
    environment:
      DATABASE_URL: postgresql://ochefia:ochefia_dev@postgres:5432/ochefia
      REDIS_URL: redis://redis:6379
      JWT_SECRET: dev-secret-change-in-production
    depends_on:
      - postgres
      - redis

  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    ports:
      - '3000:3000'
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001
      NEXT_PUBLIC_WS_URL: ws://localhost:3001
    depends_on:
      - api

volumes:
  postgres_data:
```

---

## 11. Roadmap de Sprints

### Sprint 0 — Scaffolding e Documentação Estrutural

Antes de escrever qualquer linha de código, criar toda a estrutura de pastas do monorepo e dentro de cada pasta relevante criar um arquivo `README.md` que define:

1. **Propósito:** O que essa pasta resolve e por que existe.
2. **Responsabilidades:** O que deve e o que NÃO deve estar aqui.
3. **Padrão de código:** Convenções de nomenclatura, estrutura de arquivos, padrão de exports.
4. **Exemplos:** Exemplo mínimo de como um arquivo nessa pasta deve ser escrito.

Arquivos `README.md` a serem criados:

- [ ] **`apps/api/README.md`** — Backend NestJS. A API segue Clean Architecture, é RESTful (JSON), versionada (`/api/v1`), e todo endpoint deve ser validado com class-validator, documentado com Swagger decorators e protegido por guards de autenticação e roles. Cada módulo (auth, order, menu, etc.) é autocontido com seu próprio controller, service, module e DTOs. Nenhuma regra de negócio pode existir no controller — toda lógica fica no service.

- [ ] **`apps/api/src/modules/README.md`** — Cada módulo representa um domínio de negócio (ex: `order`, `menu`, `table`). Estrutura obrigatória por módulo: `*.module.ts`, `*.controller.ts`, `*.service.ts`, pasta `dto/` com input/output DTOs, pasta `guards/` se necessário. O controller recebe a request, valida com DTO e delega pro service. O service contém a lógica de negócio e chama o Prisma. Nunca importar um service de outro módulo diretamente — usar o sistema de exports do NestJS.

- [ ] **`apps/api/src/common/README.md`** — Código transversal reutilizado por todos os módulos. Inclui decorators customizados (`@Roles()`, `@CurrentUser()`, `@Tenant()`), exception filters globais, interceptors (logging, transform), pipes de validação e middleware (ex: tenant middleware que injeta restaurantId). Nenhuma regra de negócio específica de um domínio deve estar aqui.

- [ ] **`apps/api/src/gateway/README.md`** — WebSocket gateway usando Socket.IO via `@nestjs/websockets`. Responsável por toda comunicação em tempo real. Os nomes de eventos devem ser importados de `@ochefia/shared/constants/socket-events`. Cada evento emitido deve ter um tipo definido no pacote shared. O gateway não contém lógica de negócio — ele chama os services dos módulos.

- [ ] **`apps/api/prisma/README.md`** — Schema do banco de dados, migrations e seed. Toda alteração no banco deve ser feita via Prisma migrate. O schema é a fonte de verdade da modelagem. O seed (`seed.ts`) deve popular o banco com dados realistas para desenvolvimento (restaurante de teste, mesas, cardápio completo, pedidos de exemplo). Convenções: nomes de tabela em snake_case plural (`@@map`), campos em camelCase, enums em UPPER_CASE.

- [ ] **`apps/web/README.md`** — Frontend Next.js (App Router) com PWA. Serve 4 interfaces em um único projeto via route groups: `(cliente)`, `(kds)`, `(garcom)`, `(admin)`. Cada route group tem seu próprio layout. Estilização exclusivamente com Tailwind CSS — nenhum CSS customizado salvo exceções justificadas. Componentes devem ser client components (`'use client'`) apenas quando necessário (interatividade, hooks). Páginas são server components por padrão.

- [ ] **`apps/web/src/components/README.md`** — Componentes React organizados por módulo (`ui/`, `admin/`, `kds/`, `garcom/`, `cliente/`). A pasta `ui/` contém componentes base reutilizáveis (Button, Card, Modal, Input, etc) que não têm lógica de negócio. As demais pastas contêm componentes específicos de cada módulo. Todo componente deve ser exportado como named export. Props devem ser tipadas com interface (não type alias). Componentes com mais de 150 linhas devem ser quebrados.

- [ ] **`apps/web/src/hooks/README.md`** — Custom hooks do frontend. Hooks que são específicos do web ficam aqui. Hooks compartilhados com mobile devem ficar em `packages/shared`. Nomenclatura: sempre prefixar com `use` (ex: `useSession`, `useSocket`, `useCart`). Cada hook em seu próprio arquivo.

- [ ] **`apps/web/src/providers/README.md`** — Context providers do React (SocketProvider, SessionProvider, etc). Cada provider encapsula um contexto global da aplicação. Devem ser client components. Montados no layout raiz ou no layout do route group apropriado.

- [ ] **`apps/mobile/README.md`** — App nativo iOS/Android via Capacitor (Fase 2). Reaproveita componentes React do projeto web via pacote shared. Contém configurações nativas (capacitor.config.ts), pastas `android/` e `ios/` geradas pelo Capacitor, e telas exclusivas do app (Explorar, Perfil, Login do consumidor). Só será desenvolvido após o MVP web estar estável.

- [ ] **`packages/shared/README.md`** — Pacote compartilhado entre web, mobile e API. Contém: tipos TypeScript (`types/`), constantes (`constants/`), funções utilitárias (`utils/`). Nenhuma dependência de framework (React, NestJS, Next.js) é permitida aqui — apenas TypeScript puro. Tudo deve ser exportado pelo `index.ts` raiz. Este pacote é publicado internamente no monorepo como `@ochefia/shared`.

- [ ] **`packages/shared/src/types/README.md`** — Interfaces e types TypeScript que definem o contrato de dados entre frontend e backend. Devem espelhar os models do Prisma mas sem dependência do Prisma. Um arquivo por entidade (`restaurant.ts`, `order.ts`, `menu.ts`, etc). Usar `interface` (não `type`) para objetos. Exportar também os enums usados nos status (OrderStatus, TableStatus, etc).

- [ ] **`packages/shared/src/constants/README.md`** — Constantes compartilhadas. Inclui nomes de eventos WebSocket (`socket-events.ts`), status codes de negócio, e valores fixos. Tudo exportado como `const` com `as const` para type safety.

- [ ] **`packages/shared/src/utils/README.md`** — Funções utilitárias puras (sem side effects). Inclui formatação de moeda BRL (`currency.ts`), lógica de racha de conta (`split-bill.ts`), validadores (`validators.ts`). Toda função deve ser testada unitariamente. Sem dependências externas pesadas.

Ao final desta sprint, o repositório deve ter toda a árvore de pastas criada (mesmo que vazia, com apenas o README.md) e qualquer desenvolvedor ou agente de IA deve conseguir entender o propósito e o padrão de cada parte do projeto apenas lendo os READMEs.

### Sprint 1-2 — Fundação
- [ ] Setup monorepo Turborepo + pnpm.
- [ ] NestJS com estrutura de módulos, Prisma, PostgreSQL.
- [ ] Docker Compose rodando local.
- [ ] Módulo auth completo (register, login, JWT, roles).
- [ ] CRUD de restaurante e mesas.
- [ ] Seed com dados de teste.

### Sprint 3-4 — Cardápio e Pedidos
- [ ] CRUD de categorias, produtos, adicionais.
- [ ] Cache do cardápio no Redis.
- [ ] Endpoint público do cardápio por slug.
- [ ] Frontend: tela do cardápio digital (Next.js).
- [ ] Carrinho e criação de pedido.
- [ ] Sessão de mesa (token na URL + cookie).

### Sprint 5-6 — KDS e Tempo Real
- [ ] WebSocket gateway (Socket.IO).
- [ ] Roteamento de pedidos (cozinha vs. bar).
- [ ] Frontend: tela KDS com fila, cores e temporizadores.
- [ ] Fluxo completo: cliente pede → KDS recebe → cozinha prepara → marca pronto.

### Sprint 7-8 — Garçom e Chamados
- [ ] Módulo garçom (comanda mobile).
- [ ] Botão "O Chefia" (chamados com tipo).
- [ ] Notificações para o garçom (pedido pronto, chamado de mesa).
- [ ] Frontend: tela do garçom (PWA).

### Sprint 9-10 — Pagamento e Conta
- [ ] Acompanhamento da conta em tempo real.
- [ ] Racha de conta (igual, por item, individual).
- [ ] Integração Pix (geração de QR Code + webhook de confirmação).
- [ ] Fechamento de mesa.

### Sprint 11-12 — Dashboard e Estoque
- [ ] Dashboard gerencial (mapa de mesas, métricas).
- [ ] Controle de estoque com baixa automática.
- [ ] Alertas de estoque mínimo.
- [ ] Relatórios de faturamento.

### Sprint 13+ — Fase 2 (Plataforma)
- [ ] App nativo com Capacitor (iOS/Android).
- [ ] Cadastro/login do consumidor final.
- [ ] Tela "Explorar" com estabelecimentos.
- [ ] Lotação em tempo real, reserva de mesa, pré-pedido.
- [ ] Programa de fidelidade.
- [ ] Emissão de NFC-e/SAT (integração com Focus NFe ou similar).
