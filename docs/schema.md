# Modelo de Dados Conceitual

Referência para implementação do schema Prisma. **Não é o schema literal** — é o modelo conceitual com todas as entidades, campos, relacionamentos e constraints extraídos da documentação.

**Convenções Prisma do projeto:**
- Tabelas: **snake_case plural** via `@@map` (ex: `@@map("restaurants")`)
- Campos: **camelCase**
- Enums: **UPPER_CASE**
- PK: UUID em todos os modelos
- Multi-tenancy: `restaurantId` em todas as entidades vinculadas a restaurante
- Soft delete: `deletedAt` onde indicado
- Timestamps: `createdAt` + `updatedAt` em todos os modelos

---

## Enums

### Role
```
SUPER_ADMIN   -- Equipe interna OChefia (cross-tenant)
OWNER         -- Dono do restaurante
MANAGER       -- Gerente
WAITER        -- Garçom
KITCHEN       -- Operador de KDS (acessa qualquer Local de Preparo)
```

### OrderItemStatus
```
QUEUED        -- Na fila
PREPARING     -- Preparando
READY         -- Pronto
DELIVERED     -- Entregue
CANCELLED     -- Cancelado
```

### DeliveryGroupType
```
NORMAL        -- Itens com immediateDelivery = false
IMMEDIATE     -- Itens com immediateDelivery = true
WAITER_DIRECT -- Itens com destino "Garçom" (sem KDS)
```

### PaymentMethod
```
PIX
CASH
CARD_DEBIT
CARD_CREDIT
```

### PaymentStatus
```
PENDING
CONFIRMED
CANCELLED
```

### JoinRequestStatus
```
PENDING
APPROVED
REJECTED
EXPIRED
```

### TableStatus
```
FREE
OCCUPIED
```

### CallReason
```
WAITER
BILL
OTHER
```

### CallStatus
```
OPEN
RESOLVED
```

### EstablishmentStatus
```
ACTIVE
SUSPENDED
```

### BillingPaymentStatus
```
PAID
PENDING
OVERDUE
```

### EscalationLevel
```
LEVEL_1       -- Re-notificação ao garçom do setor
LEVEL_2       -- Admin + todos os garçons
```

### ProductDestination
```
PICKUP_POINT  -- Vai para KDS do Local de Preparo vinculado ao Ponto de Entrega
WAITER        -- Entrega direta pelo garçom, sem KDS
```

---

## Módulo Auth / Restaurant

### Restaurant
`@@map("restaurants")`

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| name | String | Sanitizar HTML |
| slug | String | Unique. Usado na URL `/{slug}/mesa/{mesaId}` |
| cnpj | String? | Opcional na Fase 1 |
| ownerName | String | Nome do responsável |
| email | String | Email do responsável |
| phone | String? | Telefone do responsável |
| logoUrl | String? | URL da logo (filesystem local Fase 1) |
| status | EstablishmentStatus | Default `ACTIVE` |
| deletedAt | DateTime? | Soft delete |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Relacionamentos:** has many User, Table, Sector, PreparationLocation, Category, Tag, Product, Order, Payment, TableSession, Call, Staff/Employee, Schedule, DayTeam, Shift

**Índices:** `slug` (unique)

---

### RestaurantSettings
`@@map("restaurant_settings")`

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| restaurantId | UUID | FK → Restaurant. Unique (1:1) |
| serviceChargePercent | Decimal | Default `10`. Taxa de serviço (%) |
| themeName | String? | Nome do tema |
| primaryColor | String? | Cor primária (hex) |
| secondaryColor | String? | Cor secundária (hex) |
| backgroundColor | String? | Cor de fundo (hex) |
| pickupReminderInterval | Int | Default `3`. Minutos — intervalo de re-notificação nível 1 |
| pickupEscalationTimeout | Int | Default `10`. Minutos — tempo para escalar ao nível 2 |
| orderDelayThreshold | Int | Default `15`. Minutos — threshold para alerta de pedido atrasado |
| idleTableThreshold | Int | Default `30`. Minutos — threshold para alerta de mesa ociosa |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Índices:** `restaurantId` (unique)

---

### User
`@@map("users")`

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| restaurantId | UUID? | FK → Restaurant. Null para SUPER_ADMIN |
| name | String | |
| email | String | Unique |
| passwordHash | String | bcrypt |
| role | Role | SUPER_ADMIN, OWNER, MANAGER, WAITER, KITCHEN |
| pin | String? | Senha numérica do garçom (hash). Usado no clock-in |
| phone | String? | |
| temporary | Boolean | Default `false`. Funcionário temporário |
| fixedWeekdays | Int[]? | Dias fixos da semana (0-6). Null = avulso |
| active | Boolean | Default `true` |
| deletedAt | DateTime? | Soft delete (desativação) |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Relacionamentos:** belongs to Restaurant (opcional para SUPER_ADMIN). Has many Shift, OrderItem (via claimedByStaffId), AuditLog

**Índices:** `email` (unique), `restaurantId` + `role`, `restaurantId` + `active`

**Notas:**
- SUPER_ADMIN não tem `restaurantId` — acesso cross-tenant
- Criado via seed ou comando interno (sem registro público para SUPER_ADMIN)
- Staff/Employee é o mesmo modelo User com roles específicas

---

## Módulo Tables / Setores

### Table
`@@map("tables")`

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| restaurantId | UUID | FK → Restaurant. Multi-tenancy |
| sectorId | UUID | FK → Sector. Obrigatório — toda mesa pertence a 1 setor |
| name | String | Nome/número da mesa (ex: "Mesa 1", "VIP 3") |
| status | TableStatus | Default `FREE` |
| deletedAt | DateTime? | Soft delete. Só se não tiver sessão ativa. Histórico preservado |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Relacionamentos:** belongs to Restaurant, belongs to Sector, has many TableSession

**Índices:** `restaurantId` + `name` (unique, excluindo deletados), `restaurantId` + `sectorId`, `restaurantId` + `status`

---

### Sector
`@@map("sectors")`

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| restaurantId | UUID | FK → Restaurant. Multi-tenancy |
| name | String | Ex: "Salão Principal", "Terraço", "VIP" |
| isDefault | Boolean | Default `false`. Um setor default criado automaticamente com o restaurante |
| deletedAt | DateTime? | Soft delete. Só se não tiver mesas vinculadas |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Relacionamentos:** belongs to Restaurant, has many Table, has many SectorPickupPointMapping, has many DayTeamSectorAssignment

**Índices:** `restaurantId` + `name` (unique, excluindo deletados)

---

### SectorPickupPointMapping
`@@map("sector_pickup_point_mappings")`

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| sectorId | UUID | FK → Sector |
| preparationLocationId | UUID | FK → PreparationLocation |
| pickupPointId | UUID | FK → PickupPoint |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Constraint:** Unique (`sectorId`, `preparationLocationId`) — cada setor tem exatamente 1 ponto de entrega por local de preparo

**Relacionamentos:** belongs to Sector, belongs to PreparationLocation, belongs to PickupPoint

**Notas:** Mapeamento obrigatório — `POST /tables/:id/open` bloqueia se incompleto (erro `SESSION_011`)

---

## Módulo Session

### TableSession
`@@map("table_sessions")`

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| restaurantId | UUID | FK → Restaurant. Multi-tenancy |
| tableId | UUID | FK → Table. Atualizado na transferência de mesa |
| token | String | Unique. Criptograficamente seguro: UUID v4 ou `crypto.randomBytes(32).toString('hex')` |
| active | Boolean | Default `true`. False quando sessão fechada |
| personCount | Int? | Quantidade inicial de pessoas |
| openedAt | DateTime | |
| closedAt | DateTime? | |
| closedByStaffId | UUID? | FK → User. Quem fechou a sessão |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Relacionamentos:** belongs to Restaurant, belongs to Table, has many Person, has many Order, has many Payment, has many JoinRequest, has many ActivityLog

**Índices:** `token` (unique), `restaurantId` + `active`, `tableId` + `active`

---

### Person
`@@map("people")`

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| sessionId | UUID | FK → TableSession |
| name | String | Sanitizar HTML. Pode ser genérico ("Pessoa 1") |
| phone | String? | Número WhatsApp verificado |
| phoneVerified | Boolean | Default `false` |
| serviceChargeEnabled | Boolean | Default `true`. Toggle individual por garçom |
| consentGivenAt | DateTime | Timestamp do consentimento LGPD, preenchido no momento do OTP |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Relacionamentos:** belongs to TableSession, has many OrderItemPerson (M:N com OrderItem), has many Payment

**Índices:** `sessionId`, `phone` + `sessionId`

**Notas:**
- Unicidade de telefone: um telefone verificado só pode estar em 1 sessão ativa por vez (erro `SESSION_008`)
- Dados pessoais sujeitos a LGPD — anonimização após 90 dias
- **Participações múltiplas:** Se uma pessoa já quitou sua parte e retorna via QR Code, é criada uma nova Person (nova participação). Exibição: se houver mais de uma participação do mesmo telefone na sessão, mostra numeração (ex: "Maria ①", "Maria ②"). Cada participação é independente com seus próprios itens e pagamentos.

---

### JoinRequest
`@@map("join_requests")`

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| sessionId | UUID | FK → TableSession |
| phone | String | Telefone verificado do entrante |
| phoneLast4 | String | Últimos 4 dígitos (exibido na notificação) |
| status | JoinRequestStatus | Default `PENDING` |
| respondedByPersonId | UUID? | FK → Person. Quem aprovou/rejeitou |
| expiresAt | DateTime | 5 minutos após criação |
| lastRemindedAt | DateTime? | Última notificação enviada |
| reminderCount | Int | Default `0` |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Relacionamentos:** belongs to TableSession, belongs to Person (respondedBy)

**Índices:** `sessionId` + `status`, `phone` + `status`

---

### ActivityLog
`@@map("activity_logs")`

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| sessionId | UUID | FK → TableSession |
| action | String | Ex: "order_created", "person_reassigned", "item_cancelled" |
| description | String | Texto legível para exibição (pt-BR) |
| actorName | String? | Nome de quem executou a ação |
| metadata | Json? | Dados estruturados (personIds, de/para, motivo, etc.) |
| createdAt | DateTime | |

**Relacionamentos:** belongs to TableSession

**Índices:** `sessionId` + `createdAt`

**Notas:** Log de atividade da sessão, visível para todos os membros da mesa. Registra pedidos, reatribuições, cancelamentos. Formato legível para leigos.

---

## Módulo KDS / Locais de Preparo

### PreparationLocation
`@@map("preparation_locations")`

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| restaurantId | UUID | FK → Restaurant. Multi-tenancy |
| name | String | Ex: "Cozinha Principal", "Pizzaria", "Bar" |
| active | Boolean | Default `true` |
| deletedAt | DateTime? | Soft delete. Só se não tem produtos vinculados |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Relacionamentos:** belongs to Restaurant, has many PickupPoint, has many SectorPickupPointMapping

**Índices:** `restaurantId` + `name` (unique, excluindo deletados), `restaurantId` + `active`

---

### PickupPoint
`@@map("pickup_points")`

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| preparationLocationId | UUID | FK → PreparationLocation |
| name | String | Ex: "Pass principal", "Balcão do bar". Default "Padrão" |
| autoDelivery | Boolean | Default `false`. Se true, operador do KDS entrega direto na mesa |
| isDefault | Boolean | Default `false`. Criado automaticamente com o Local de Preparo |
| deletedAt | DateTime? | Soft delete. Só se não é o único e não tem produtos vinculados |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Relacionamentos:** belongs to PreparationLocation, has many Product, has many SectorPickupPointMapping

**Índices:** `preparationLocationId` + `name` (unique, excluindo deletados)

---

## Módulo Menu

### Category
`@@map("categories")`

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| restaurantId | UUID | FK → Restaurant. Multi-tenancy |
| name | String | Sanitizar HTML |
| sortOrder | Int | Default `0`. Ordenação no cardápio |
| active | Boolean | Default `true` |
| deletedAt | DateTime? | Soft delete |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Relacionamentos:** belongs to Restaurant, has many Product

**Índices:** `restaurantId` + `sortOrder`, `restaurantId` + `name` (unique, excluindo deletados)

---

### Tag
`@@map("tags")`

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| restaurantId | UUID | FK → Restaurant. Multi-tenancy |
| name | String | Ex: "vegano", "sem glúten", "picante", "sugestão do chef" |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Relacionamentos:** belongs to Restaurant, has many ProductTag (M:N com Product)

**Índices:** `restaurantId` + `name` (unique)

---

### Product
`@@map("products")`

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| restaurantId | UUID | FK → Restaurant. Multi-tenancy |
| categoryId | UUID | FK → Category |
| name | String | Sanitizar HTML |
| description | String? | Sanitizar HTML |
| price | Decimal | Preço em BRL |
| destination | ProductDestination | `PICKUP_POINT` ou `WAITER` — mutuamente exclusivos |
| pickupPointId | UUID? | FK → PickupPoint. Obrigatório se destination = PICKUP_POINT |
| immediateDelivery | Boolean | Default `false`. Itens que podem ser entregues antes dos demais |
| available | Boolean | Default `true`. Toggle de disponibilidade em tempo real |
| sortOrder | Int | Default `0` |
| deletedAt | DateTime? | Soft delete |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Relacionamentos:** belongs to Restaurant, belongs to Category, belongs to PickupPoint (opcional), has many ProductImage, has many ProductTag, has many OrderItem

**Índices:** `restaurantId` + `categoryId` + `available`, `restaurantId` + `available`, `pickupPointId`

**Notas:**
- `pickupPointId` e `destination: WAITER` são mutuamente exclusivos (erro `MENU_004` se ambos ou nenhum)
- O KDS do Local de Preparo é determinado pelo PickupPoint vinculado ao Product

---

### ProductImage
`@@map("product_images")`

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| productId | UUID | FK → Product |
| url | String | URL da imagem (filesystem local Fase 1, S3 Fase 2) |
| thumbnailUrl | String | 200px |
| mediumUrl | String | 600px |
| sortOrder | Int | Default `0`. Primeira imagem (0) = capa |
| createdAt | DateTime | |

**Relacionamentos:** belongs to Product

**Índices:** `productId` + `sortOrder`

**Notas:** Max 5MB, JPEG/PNG/WebP. Resize com sharp (thumb 200px, medium 600px, original). UUID como nome no storage.

---

### ProductTag
`@@map("product_tags")`

| Campo | Tipo | Notas |
|---|---|---|
| productId | UUID | FK → Product |
| tagId | UUID | FK → Tag |

**Constraint:** PK composta (`productId`, `tagId`)

**Relacionamentos:** belongs to Product, belongs to Tag

---

## Módulo Orders

### Order
`@@map("orders")`

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| restaurantId | UUID | FK → Restaurant. Multi-tenancy |
| sessionId | UUID | FK → TableSession |
| orderNumber | Int | Sequencial por restaurante por dia. Exibido no KDS e notificações |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Relacionamentos:** belongs to Restaurant, belongs to TableSession, has many OrderItem

**Índices:** `restaurantId` + `createdAt`, `sessionId`, `restaurantId` + `orderNumber`

**Notas:** Cada envio do carrinho = 1 Order. Pedidos diferentes são independentes entre si.

---

### OrderItem
`@@map("order_items")`

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| orderId | UUID | FK → Order |
| productId | UUID | FK → Product |
| quantity | Int | Default `1` |
| unitPrice | Decimal | Preço no momento do pedido (snapshot) |
| status | OrderItemStatus | Default `QUEUED` |
| notes | String? | Observações do cliente (ex: "bem passado", "sem cebola"). Exibido em destaque amarelo no KDS |
| deliveryGroup | DeliveryGroupType | Calculado: NORMAL, IMMEDIATE, ou WAITER_DIRECT |
| pickupPointId | UUID? | FK → PickupPoint. Snapshot do destino no momento do pedido |
| preparationLocationId | UUID? | FK → PreparationLocation. Determinado pelo PickupPoint |
| claimedByStaffId | UUID? | FK → User. Garçom que assumiu a retirada (claim por grupo) |
| claimedAt | DateTime? | Quando o claim foi feito |
| cancelledByName | String? | Nome de quem cancelou |
| cancelledByStaffId | UUID? | FK → User. Staff que cancelou (se aplicável) |
| cancelReason | String? | Motivo do cancelamento. Obrigatório para OWNER/MANAGER cancelando Pronto/Entregue |
| readyAt | DateTime? | Quando marcado como Pronto |
| startedAt | DateTime? | Preenchido na transição para PREPARING. Usado para recalcular timers do KDS após restart |
| deliveredAt | DateTime? | Quando marcado como Entregue |
| cancelledAt | DateTime? | Quando cancelado |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Relacionamentos:** belongs to Order, belongs to Product, belongs to PickupPoint (opcional), belongs to PreparationLocation (opcional), belongs to User (claimedBy), has many OrderItemPerson (M:N com Person)

**Índices:** `orderId`, `status`, `orderId` + `deliveryGroup`, `claimedByStaffId`, `preparationLocationId` + `status`

**Máquina de estados:**
```
QUEUED → PREPARING → READY → DELIVERED
  ↓          ↓
CANCELLED  CANCELLED (staff apenas)

Pronto/Entregue → CANCELLED (apenas OWNER/MANAGER, motivo obrigatório)
Destino "Garçom": QUEUED → DELIVERED (pula PREPARING e READY)
```

---

### OrderItemPerson
`@@map("order_item_people")`

| Campo | Tipo | Notas |
|---|---|---|
| orderItemId | UUID | FK → OrderItem |
| personId | UUID | FK → Person |

**Constraint:** PK composta (`orderItemId`, `personId`)

**Relacionamentos:** belongs to OrderItem, belongs to Person

**Notas:** Obrigatório pelo menos 1 pessoa por item. Valor divide igual entre selecionados. Reatribuição feita exclusivamente pelo cliente.

---

## Módulo Payments

### Payment
`@@map("payments")`

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| restaurantId | UUID | FK → Restaurant. Multi-tenancy |
| sessionId | UUID | FK → TableSession |
| personId | UUID | FK → Person |
| method | PaymentMethod | PIX, CASH, CARD_DEBIT, CARD_CREDIT |
| status | PaymentStatus | Default `PENDING` |
| amount | Decimal | Valor total (itens da pessoa + taxa de serviço se aplicável) |
| serviceChargeAmount | Decimal? | Valor da taxa de serviço individual |
| pixQrCode | String? | QR Code para pagamento Pix |
| pixExternalId | String? | ID externo do provedor Pix. Usado para idempotency do webhook |
| confirmedAt | DateTime? | |
| cancelledAt | DateTime? | |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Relacionamentos:** belongs to Restaurant, belongs to TableSession, belongs to Person

**Índices:** `sessionId` + `personId`, `restaurantId` + `createdAt`, `pixExternalId` (unique, onde não null), `status`

**Notas:**
- Pagamento individual por pessoa
- PIX gera QR Code; CASH e CARD são registro manual pelo staff
- Taxa de garçom calculada forward-only no momento do pagamento
- Webhook Pix: validação de assinatura síncrona + idempotency via `pixExternalId`

---

## Módulo Staff

### Shift
`@@map("shifts")`

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| restaurantId | UUID | FK → Restaurant. Multi-tenancy |
| staffId | UUID | FK → User |
| clockInAt | DateTime | Hora de início do turno |
| clockOutAt | DateTime? | Hora de fim do turno |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Relacionamentos:** belongs to Restaurant, belongs to User

**Índices:** `restaurantId` + `staffId` + `clockInAt`, `staffId` + `clockOutAt` (para encontrar turno ativo: clockOutAt IS NULL)

---

### Schedule
`@@map("schedules")`

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| restaurantId | UUID | FK → Restaurant. Multi-tenancy |
| date | Date | Dia da escala |
| staffId | UUID | FK → User |
| active | Boolean | Default `true`. Toggle para desmarcar do dia |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Relacionamentos:** belongs to Restaurant, belongs to User

**Índices:** `restaurantId` + `date`, unique (`restaurantId`, `date`, `staffId`)

**Notas:** Auto-preenchido para permanentes e temporários com dia fixo. Permite ajustes manuais.

---

### DayTeam
`@@map("day_teams")`

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| restaurantId | UUID | FK → Restaurant. Multi-tenancy |
| date | Date | Dia da equipe |
| staffId | UUID | FK → User |
| active | Boolean | Default `true`. Toggle para desmarcar |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Relacionamentos:** belongs to Restaurant, belongs to User, has many DayTeamSectorAssignment

**Índices:** `restaurantId` + `date`, unique (`restaurantId`, `date`, `staffId`)

---

### DayTeamSectorAssignment
`@@map("day_team_sector_assignments")`

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| dayTeamId | UUID | FK → DayTeam |
| sectorId | UUID | FK → Sector |
| createdAt | DateTime | |

**Constraint:** Unique (`dayTeamId`, `sectorId`)

**Relacionamentos:** belongs to DayTeam, belongs to Sector

**Notas:** Um garçom pode ser atribuído a múltiplos setores. Taxa de serviço dividida igualmente entre garçons do mesmo setor.

---

### Call
`@@map("calls")`

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| restaurantId | UUID | FK → Restaurant. Multi-tenancy |
| sessionId | UUID | FK → TableSession |
| tableId | UUID | FK → Table |
| reason | CallReason | WAITER, BILL, OTHER |
| message | String? | Mensagem opcional do cliente |
| status | CallStatus | Default `OPEN` |
| resolvedByStaffId | UUID? | FK → User. Garçom que resolveu |
| resolvedAt | DateTime? | |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Relacionamentos:** belongs to Restaurant, belongs to TableSession, belongs to Table, belongs to User (resolvedBy)

**Índices:** `restaurantId` + `status`, `sessionId`

---

### PickupEscalation
`@@map("pickup_escalations")`

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| restaurantId | UUID | FK → Restaurant. Multi-tenancy |
| orderId | UUID | FK → Order |
| orderItemId | UUID | FK → OrderItem |
| deliveryGroup | DeliveryGroupType | |
| level | EscalationLevel | LEVEL_1 ou LEVEL_2 |
| responsibleStaffId | UUID? | FK → User. Garçom do setor responsável |
| tableId | UUID | FK → Table |
| sectorId | UUID | FK → Sector |
| minutesWaiting | Int | Tempo de espera no momento da escalação |
| createdAt | DateTime | |

**Relacionamentos:** belongs to Restaurant, belongs to Order, belongs to OrderItem, belongs to User (responsible), belongs to Table, belongs to Sector

**Índices:** `restaurantId` + `createdAt`, `responsibleStaffId` + `createdAt`

**Notas:** Registro para auditoria. Consultável na tela Desempenho da Equipe por garçom e período.

---

## Módulo Payments — Faturamento de Garçom

### WaiterFee
`@@map("waiter_fees")`

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| restaurantId | UUID | FK → Restaurant. Multi-tenancy |
| paymentId | UUID | FK → Payment |
| staffId | UUID | FK → User (garçom) |
| amount | Decimal | Valor da taxa de serviço devida ao garçom |
| sectorId | UUID | FK → Sector. Setor no momento do pagamento |
| splitCount | Int | Número de garçons dividindo a taxa naquele setor |
| createdAt | DateTime | |

**Relacionamentos:** belongs to Restaurant, belongs to Payment, belongs to User, belongs to Sector

**Índices:** `restaurantId` + `staffId` + `createdAt`, `paymentId`

**Notas:** Cálculo forward-only no momento do pagamento. Garçons atribuídos ao setor **naquele instante** recebem a taxa.

---

## Módulo Super Admin

### SuperAdminBillingPlan
`@@map("superadmin_billing_plans")`

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| restaurantId | UUID | FK → Restaurant. Unique (1:1) |
| amount | Decimal | Valor do plano base |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Índices:** `restaurantId` (unique)

---

### SuperAdminBillingPayment
`@@map("superadmin_billing_payments")`

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| restaurantId | UUID | FK → Restaurant |
| month | Int | 1-12 |
| year | Int | |
| amount | Decimal | Valor pago/cobrado |
| status | BillingPaymentStatus | PAID, PENDING, OVERDUE |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Relacionamentos:** belongs to Restaurant

**Índices:** `restaurantId` + `year` + `month` (unique)

---

### Module
`@@map("modules")`

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| name | String | Unique. Ex: "estoque", "explorar", "nfce" |
| description | String? | |
| defaultAmount | Decimal | Valor padrão global |
| createdAt | DateTime | |
| updatedAt | DateTime | |

---

### RestaurantModule
`@@map("restaurant_modules")`

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| restaurantId | UUID | FK → Restaurant |
| moduleId | UUID | FK → Module |
| enabled | Boolean | Default `false` |
| customAmount | Decimal? | Override do valor padrão (null = usa defaultAmount) |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Constraint:** Unique (`restaurantId`, `moduleId`)

**Relacionamentos:** belongs to Restaurant, belongs to Module

---

## Módulo Auditoria

### AuditLog
`@@map("audit_logs")`

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| userId | UUID | FK → User. Quem executou a ação |
| action | String | Ex: "establishment_suspended", "role_changed", "data_deleted", "force_close_session", "item_cancelled_by_owner" |
| targetType | String | Ex: "Restaurant", "User", "OrderItem", "TableSession" |
| targetId | UUID | ID da entidade alvo |
| metadata | Json? | Dados adicionais (antes/depois, motivo, etc.) |
| ipAddress | String? | IP de origem da request |
| source | String? | Ex: "admin", "kds", "waiter", "superadmin" |
| correlationId | String? | Para vincular com logs do Winston |
| createdAt | DateTime | Imutável — nunca deletar ou alterar |

**Índices:** `userId` + `createdAt`, `targetType` + `targetId`, `action`, `correlationId`

**Notas:**
- Registra ações administrativas críticas: suspensão/ativação de estabelecimento, alteração de plano/cobrança, habilitar/desabilitar módulos, alteração de roles, exclusão LGPD, force-close de sessão, cancelamento de item Pronto/Entregue
- **Imutável** — nunca deletar ou alterar registros
- Ações no KDS registradas com `source: 'kds'` e `preparationLocationId` no metadata

---

## Diagrama de Relacionamentos (resumo)

```
Restaurant 1──N User
Restaurant 1──1 RestaurantSettings
Restaurant 1──N Table
Restaurant 1──N Sector
Restaurant 1──N PreparationLocation
Restaurant 1──N Category
Restaurant 1──N Tag
Restaurant 1──N Product
Restaurant 1──N Order
Restaurant 1──N Payment
Restaurant 1──N Call
Restaurant 1──N Shift
Restaurant 1──N Schedule
Restaurant 1──N DayTeam

Sector 1──N Table
Sector 1──N SectorPickupPointMapping
Sector 1──N DayTeamSectorAssignment

PreparationLocation 1──N PickupPoint
PickupPoint 1──N Product (onde destination = PICKUP_POINT)
PickupPoint 1──N SectorPickupPointMapping

Table 1──N TableSession
TableSession 1──N Person
TableSession 1──N Order
TableSession 1──N Payment
TableSession 1──N JoinRequest
TableSession 1──N ActivityLog
TableSession 1──N Call

Category 1──N Product
Product N──N Tag (via ProductTag)
Product 1──N ProductImage
Product 1──N OrderItem

Order 1──N OrderItem
OrderItem N──N Person (via OrderItemPerson)

Person 1──N Payment

User 1──N Shift
User 1──N DayTeam
User 1──N WaiterFee
User 1──N AuditLog

DayTeam 1──N DayTeamSectorAssignment

Restaurant 1──1 SuperAdminBillingPlan
Restaurant 1──N SuperAdminBillingPayment
Restaurant 1──N RestaurantModule
Module 1──N RestaurantModule
```
