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
ORDER_QUEUED      -- Na fila
ORDER_PREPARING   -- Preparando
ORDER_READY       -- Pronto
ORDER_DELIVERED   -- Entregue
ORDER_CANCELLED   -- Cancelado
```

### DeliveryGroupType
```
NORMAL        -- Itens com earlyDelivery = false
EARLY_DELIVERY -- Itens com earlyDelivery = true
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
PAYMENT_PENDING         -- Criado, aguardando pagamento
PAYMENT_CONFIRMED       -- Pago e confirmado (webhook PIX ou staff confirma CASH/CARD)
PAYMENT_CANCELLED       -- Tentativa de pagamento cancelada antes de pagar (garçom cancela PIX / cliente desiste / troca de método)
PAYMENT_EXPIRED         -- PIX expirou 30min sem pagamento (automático, Bull job)
PAYMENT_PENDING_REFUND  -- Devolução solicitada, aguardando confirmação do staff
PAYMENT_REFUNDED        -- Devolução confirmada pelo staff
```

**Máquina de estados:**
```
PAYMENT_PENDING → PAYMENT_CONFIRMED       (webhook PIX ou staff confirma CASH/CARD)
PAYMENT_PENDING → PAYMENT_CANCELLED       (garçom cancela PIX / cliente desiste / troca de método)
PAYMENT_PENDING → PAYMENT_EXPIRED         (Bull job 30min, só PIX)
PAYMENT_CONFIRMED → PAYMENT_PENDING_REFUND (item cancelado após preparo)
PAYMENT_PENDING_REFUND → PAYMENT_REFUNDED  (staff confirma devolução)
```

### JoinRequestStatus
```
JOIN_PENDING
JOIN_APPROVED
JOIN_REJECTED
JOIN_EXPIRED
```

### TableStatus
```
FREE
OCCUPIED
```

**Máquina de estados:**
```
FREE → OCCUPIED   (POST /tables/:id/open ou POST /tables/:id/open-staff cria sessão)
OCCUPIED → FREE   (POST /tables/:id/close ou POST /tables/:id/force-close fecha sessão)
                   (Auto-close de sessão vazia via Bull job também transiciona para FREE)
```
- Transferência de mesa (`PATCH /tables/:id/transfer`) **não muda status** — a mesa de origem fica FREE (sessão saiu) e a de destino fica OCCUPIED (sessão entrou).

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

### ActorType
```
CLIENT        -- Ação feita pelo cliente
STAFF         -- Ação feita pelo staff (garçom, gerente, dono)
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

**Relacionamentos:** has many User, Table, Sector, PreparationLocation, Category, Tag, Product, Order, Payment, TableSession, Call, Staff/Employee, Schedule, DayTeam, Shift, StaffInvite, PickupEscalation, WaiterFee

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
| maxPeoplePerSession | Int | Default `100`. Limite máximo de pessoas por sessão de mesa |
| claimTimeout | Int | Default `5`. Minutos — tempo para garçom retirar grupo após claim antes de expirar |
| waiterOfflineAlertTimeout | Int | Default `5`. Minutos — tempo de desconexão WebSocket de garçom com turno ativo antes de gerar alerta ao admin |
| longSessionThreshold | Int | Default `6`. Horas — tempo de sessão aberta antes de gerar alerta no dashboard |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Índices:** `restaurantId` (unique)

**Constraints:** serviceChargePercent 0-100, pickupReminderInterval >= 1, pickupEscalationTimeout >= 1, orderDelayThreshold >= 1, idleTableThreshold >= 1, maxPeoplePerSession >= 1, claimTimeout >= 1, waiterOfflineAlertTimeout >= 1, longSessionThreshold >= 1

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
| pin | String? | PIN numérico 4 dígitos (hash). Obrigatório para WAITER e KITCHEN. Usado no login por PIN (`POST /auth/pin`) e clock-in |
| phone | String? | Telefone WhatsApp do funcionário. Usado para envio de convite (`POST /staff/invite`) e contato interno |
| temporary | Boolean | Default `false`. Funcionário temporário |
| fixedWeekdays | Int[]? | Dias fixos da semana (0-6). Null = avulso |
| active | Boolean | Default `true` |
| deletedAt | DateTime? | Soft delete (desativação) |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Relacionamentos:** belongs to Restaurant (opcional para SUPER_ADMIN). Has many Shift, Schedule, OrderItem (via claimedByStaffId), AuditLog

**Índices:** `email` (unique), `restaurantId` + `role`, `restaurantId` + `active`

**Notas:**
- SUPER_ADMIN não tem `restaurantId` — acesso cross-tenant
- Criado via seed ou comando interno (sem registro público para SUPER_ADMIN)
- Staff/Employee é o mesmo modelo User com roles específicas

---

### StaffInvite
`@@map("staff_invites")`

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| restaurantId | UUID | FK → Restaurant |
| email | String | Email do convidado |
| role | Role | Role atribuída (WAITER, KITCHEN, MANAGER) |
| token | UUID | Token único enviado no link do convite |
| expiresAt | DateTime | Expiração (72h após criação) |
| acceptedAt | DateTime? | Quando o convite foi aceito |
| invalidatedAt | DateTime? | Quando invalidado por novo convite para o mesmo email |
| createdAt | DateTime | |

**Relacionamentos:** belongs to Restaurant

**Índices:** `token` (unique), `restaurantId` + `email`

**Notas:**
- Convite duplicado: se já existe convite pendente (não expirado, não aceito) para o mesmo email, o anterior é invalidado automaticamente
- Apenas o convite mais recente é válido
- Link enviado via WhatsApp pelo admin (em dev, log no console)

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

**Índices:** `token` (unique), `restaurantId` + `active`, `tableId` + `active` (unique parcial WHERE active = true — garante apenas 1 sessão ativa por mesa)

---

### Person
`@@map("people")`

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| sessionId | UUID | FK → TableSession |
| name | String | Min 1, max 50 caracteres. Sanitizar HTML. Pode ser genérico ("Pessoa 1") |
| phone | String? | Número WhatsApp verificado |
| phoneVerified | Boolean | Default `false` |
| serviceChargeEnabled | Boolean | Default `true`. Toggle individual por garçom |
| consentGivenAt | DateTime? | Timestamp do consentimento LGPD, preenchido no momento do OTP. Null para pessoas criadas via `open-staff` — sem dados pessoais identificáveis (sem telefone, sem OTP, nome pode ser genérico), não requer base legal adicional para retenção |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Relacionamentos:** belongs to TableSession, has many OrderItemPerson (M:N com OrderItem), has many Payment

**Índices:** `sessionId`, `phone` + `sessionId`

**Notas:**
- Unicidade de telefone: um telefone verificado só pode estar em 1 sessão ativa por restaurante (erro `SESSION_008`). Pode estar em restaurantes diferentes simultaneamente
- Dados pessoais sujeitos a LGPD — anonimização após 90 dias
- **Participações múltiplas:** Se uma pessoa já quitou sua parte e retorna via QR Code, é criada uma nova Person (nova participação). `consentGivenAt` é copiado da Person anterior (mesmo telefone, mesma sessão) — registra o momento real do consentimento original, não do retorno. Exibição: se houver mais de uma participação do mesmo telefone na sessão, mostra numeração (ex: "Maria ①", "Maria ②"). Cada participação é independente com seus próprios itens e pagamentos.

---

### JoinRequest
`@@map("join_requests")`

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| sessionId | UUID | FK → TableSession |
| name | String | Nome do entrante, informado antes de solicitar aprovação. Min 1, max 50. Sanitizar HTML |
| phone | String | Telefone verificado do entrante |
| phoneLast4 | String | Últimos 4 dígitos (exibido na notificação) |
| status | JoinRequestStatus | Default `JOIN_PENDING` |
| otpFailed | Boolean | Default `false`. True quando cliente esgotou tentativas de OTP (3x). Garçom vê na tela de aprovação com indicação diferenciada para aprovar manualmente |
| respondedByPersonId | UUID? | FK → Person. Quem aprovou/rejeitou (quando cliente aprova) |
| respondedByUserId | UUID? | FK → User. Quem aprovou/rejeitou (quando garçom aprova). Sempre um dos dois preenchido, nunca ambos |
| expiresAt | DateTime | 5 minutos após criação |
| lastRemindedAt | DateTime? | Última notificação enviada |
| reminderCount | Int | Default `0` |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Relacionamentos:** belongs to TableSession, belongs to Person (respondedByPerson), belongs to User (respondedByUser)

**Índices:** `sessionId` + `status`, `phone` + `status`

---

### ActivityLog
`@@map("activity_logs")`

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| sessionId | UUID | FK → TableSession |
| actorPersonId | UUID? | FK → Person. Quem executou a ação (nome via JOIN — anonimização automática por cascata) |
| actorStaffId | UUID? | FK → User. Se ação foi executada por staff |
| action | String | Convenção: `{módulo}_{ação}` em snake_case. Valores conhecidos: `order_created`, `order_cancelled`, `item_cancelled`, `person_added`, `person_removed`, `person_reassigned`, `payment_initiated`, `payment_confirmed`, `payment_cancelled`, `payment_refunded`, `service_charge_toggled`, `session_opened`, `session_closed` |
| metadata | Json | Dados estruturados para renderização no frontend: `{ productName?, quantity?, personIds?, fromPersonId?, toPersonId?, reason? }`. Nunca armazena nomes de pessoas — usa IDs e resolve via JOIN |
| createdAt | DateTime | |

**Relacionamentos:** belongs to TableSession, belongs to Person (actorPerson), belongs to User (actorStaff)

**Índices:** `sessionId` + `createdAt`

**Notas:**
- Log de atividade da sessão, visível para todos os membros da mesa. Registra pedidos, reatribuições, cancelamentos.
- Sem `actorName` nem `description` em texto livre — evita dados pessoais hardcoded.
- Frontend renderiza a mensagem combinando `action` + `metadata` + nome da Person (via JOIN).
- Quando Person é anonimizada (90 dias), ActivityLog automaticamente mostra "Pessoa Anonimizada" sem job extra.

---

## Módulo KDS / Locais de Preparo

### PreparationLocation
`@@map("preparation_locations")`

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| restaurantId | UUID | FK → Restaurant. Multi-tenancy |
| name | String | Ex: "Cozinha Principal", "Pizzaria", "Bar" |
| kdsWarningMinutes | Int | Default `10`. Minutos — threshold para cor amarela (atenção) no KDS |
| kdsCriticalMinutes | Int | Default `15`. Minutos — threshold para cor vermelha (atrasado) no KDS |
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
| kitchenDelivery | Boolean | Default `false`. Se true, operador do KDS entrega direto na mesa |
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
| description | String? | Sanitizar HTML. Max 500 chars |
| price | Decimal | Preço em BRL. Constraint: >= 0 |
| destination | ProductDestination | `PICKUP_POINT` ou `WAITER` — mutuamente exclusivos |
| pickupPointId | UUID? | FK → PickupPoint. Obrigatório se destination = PICKUP_POINT |
| earlyDelivery | Boolean | Default `false`. Itens que podem ser entregues antes dos demais |
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
| orderNumber | Int | Sequencial por restaurante por dia. Reseta à meia-noite `America/Sao_Paulo` (fixo na Fase 1). Exibido no KDS e notificações. Sessão pode cruzar meia-noite — orderNumber é do pedido, não da sessão |
| source | ActorType | CLIENT ou STAFF. Default CLIENT |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Relacionamentos:** belongs to Restaurant, belongs to TableSession, has many OrderItem

**Índices:** `restaurantId` + `DATE(createdAt)` + `orderNumber` (unique — garante unicidade diária), `sessionId`, `restaurantId` + `createdAt`

**Notas:** Cada envio do carrinho = 1 Order. Pedidos diferentes são independentes entre si. **Pedido enviado é imutável** — não existe edição de quantidade, produto ou observações após envio. Para corrigir, cancelar o item (se ainda Na fila) e refazer via novo pedido. Limitação intencional da Fase 1.

---

### OrderItem
`@@map("order_items")`

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| orderId | UUID | FK → Order |
| productId | UUID | FK → Product |
| quantity | Int | Default `1` |
| unitPrice | Decimal | Preço no momento do pedido (snapshot). Constraint: >= 0 |
| status | OrderItemStatus | Default `ORDER_QUEUED` |
| notes | String? | Observações do cliente (ex: "bem passado", "sem cebola"). Max 200 chars. Exibido em destaque amarelo no KDS |
| deliveryGroup | DeliveryGroupType | Calculado: NORMAL, EARLY_DELIVERY, ou WAITER_DIRECT |
| pickupPointId | UUID? | FK → PickupPoint. Snapshot do destino no momento do pedido |
| preparationLocationId | UUID? | FK → PreparationLocation. Determinado pelo PickupPoint |
| claimedByStaffId | UUID? | FK → User. Garçom que assumiu a retirada (claim por grupo) |
| claimedAt | DateTime? | Quando o claim foi feito |
| cancelledByStaffId | UUID? | FK → User. Staff que cancelou (se aplicável). Nome via JOIN — sem dados pessoais hardcoded |
| cancelReason | String? | Motivo do cancelamento. Max 300 chars. Obrigatório para OWNER/MANAGER cancelando Pronto/Entregue |
| readyAt | DateTime? | Quando marcado como Pronto |
| startedAt | DateTime? | Preenchido na transição para ORDER_PREPARING. Usado para recalcular timers do KDS após restart |
| deliveredAt | DateTime? | Quando marcado como Entregue |
| cancelledAt | DateTime? | Quando cancelado |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Relacionamentos:** belongs to Order, belongs to Product, belongs to PickupPoint (opcional), belongs to PreparationLocation (opcional), belongs to User (claimedBy), has many OrderItemPerson (M:N com Person)

**Índices:** `orderId`, `status`, `orderId` + `deliveryGroup`, `claimedByStaffId`, `preparationLocationId` + `status`

**Máquina de estados:**
```
ORDER_QUEUED → ORDER_PREPARING → ORDER_READY → ORDER_DELIVERED
  ↓                ↓
ORDER_CANCELLED  ORDER_CANCELLED (staff apenas)

Pronto/Entregue → ORDER_CANCELLED (apenas OWNER/MANAGER, motivo obrigatório)
Destino "Garçom": ORDER_QUEUED → ORDER_DELIVERED (pula ORDER_PREPARING e ORDER_READY)
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
| status | PaymentStatus | Default `PAYMENT_PENDING` |
| amount | Decimal | Valor total (itens da pessoa + taxa de serviço se aplicável). Constraint: >= 0 |
| serviceChargeAmount | Decimal? | Valor da taxa de serviço individual |
| initiatedBy | ActorType | CLIENT ou STAFF — quem iniciou o pagamento |
| initiatedByStaffId | UUID? | FK → User. Preenchido quando staff iniciou (garçom registrou o pagamento) |
| pixQrCode | String? | QR Code para pagamento Pix |
| pixExternalId | String? | ID externo do provedor Pix. Usado para idempotency do webhook |
| confirmedAt | DateTime? | |
| confirmedByStaffId | UUID? | FK → User. Quem confirmou manualmente — CASH/CARD sempre, PIX quando webhook falha. Null se PIX confirmado via webhook (audit trail) |
| cancelledAt | DateTime? | |
| cancelledByStaffId | UUID? | FK → User. Quem cancelou (null se foi o próprio cliente) |
| cancelReason | String? | Motivo do cancelamento. Max 300 chars (opcional, preenchido pelo staff) |
| refundedByStaffId | UUID? | FK → User. Quem confirmou a devolução (audit trail) |
| refundedAt | DateTime? | Quando a devolução foi confirmada |
| refundMethod | PaymentMethod? | Método usado na devolução (pode diferir do original, ex: pagou PIX, devolveu CASH) |
| refundAmount | Decimal? | Valor calculado da devolução. Fórmula: `itemPrice / numberOfPersons` (proporcional à divisão do item). Preenchido automaticamente ao criar PAYMENT_PENDING_REFUND. Staff confirma com este valor |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Relacionamentos:** belongs to Restaurant, belongs to TableSession, belongs to Person, belongs to User (multiple FKs: initiatedByStaffId, confirmedByStaffId, cancelledByStaffId, refundedByStaffId)

**Índices:** `sessionId` + `personId`, `restaurantId` + `createdAt`, `pixExternalId` (unique, onde não null), `status`, `method` + `status` + `createdAt` (para job de expiração PIX)

**Notas:**
- Pagamento individual por pessoa. `personId` indica quem está pagando, `amount` o valor dos itens dessa pessoa + taxa de serviço
- Qualquer método (PIX, CASH, CARD) pode ser iniciado pelo cliente OU pelo garçom
- `initiatedBy` registra quem iniciou: `CLIENT` (via app) ou `STAFF` (via comanda/detalhe da mesa)
- PIX gera QR Code automaticamente. Confirmação via webhook (automática) ou garçom (manual se webhook falhar)
- CASH e CARD: garçom sempre confirma manualmente após receber o pagamento físico
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

**Índices:** `restaurantId` + `staffId` + `clockInAt`, `staffId` + `clockOutAt` (para encontrar turno ativo: clockOutAt IS NULL), `restaurantId` + `clockOutAt` (para buscar garçons com turno ativo)

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
| message | String? | Mensagem opcional do cliente. Max 300 chars |
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
| action | String | Convenção: `{módulo}_{ação}` em snake_case. Valores conhecidos: `establishment_suspended`, `establishment_activated`, `role_changed`, `data_deleted`, `force_close_session`, `item_cancelled_by_owner`, `module_enabled`, `module_disabled`, `plan_changed`, `billing_payment_registered`, `staff_pin_reset` |
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
- **Imutável** — nunca deletar ou alterar registros. Base legal LGPD: Art. 16, I e II (obrigação legal de rastreabilidade de ações administrativas + exercício regular de direitos)
- **Sem dados pessoais de clientes:** metadata nunca armazena nomes/telefones de clientes, apenas IDs de entidades (personId, sessionId, etc.). Quando Person é anonimizada, o JOIN retorna "Pessoa Anonimizada". Mesma regra do ActivityLog
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
Restaurant 1──N StaffInvite
Restaurant 1──N TableSession
Restaurant 1──N PickupEscalation
Restaurant 1──N WaiterFee

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
OrderItem N──1 PickupPoint
OrderItem N──1 PreparationLocation

Person 1──N Payment

User 1──N Shift
User 1──N Schedule
User 1──N DayTeam
User 1──N WaiterFee
User 1──N AuditLog
Payment N──1 User (multiple FKs: initiatedByStaffId, confirmedByStaffId, cancelledByStaffId, refundedByStaffId)

DayTeam 1──N DayTeamSectorAssignment

Restaurant 1──1 SuperAdminBillingPlan
Restaurant 1──N SuperAdminBillingPayment
Restaurant 1──N RestaurantModule
Module 1──N RestaurantModule
```
