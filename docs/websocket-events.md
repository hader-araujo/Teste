# Eventos WebSocket (Socket.IO)

Arquivo de referência: `packages/shared/src/constants/socket-events.ts`

```typescript
export const SOCKET_EVENTS = {
  // Cliente -> Servidor
  ORDER_CREATED: 'order:created',           // Cliente fez um novo pedido
  CALL_REQUEST: 'call:request',             // Cliente apertou "O Chefia"
  PAYMENT_INITIATED: 'payment:initiated',   // Cliente iniciou pagamento

  // Servidor -> KDS (por Local de Preparo)
  KDS_NEW_ORDER: 'kds:new-order',           // Novo pedido na fila do Local de Preparo

  // KDS -> Servidor (operador do KDS emite, servidor processa e dispara eventos derivados)
  KDS_STATUS_UPDATE: 'kds:status-update',   // Operador mudou status do item (preparing/ready/delivered)
  KDS_TABLE_TRANSFERRED: 'kds:table-transferred', // Mesa transferida — atualiza número da mesa nos cards do KDS. Room: restaurant:{id}:kds:{prepLocationId}

  // Servidor -> Garcom
  WAITER_ORDER_READY: 'waiter:order-ready', // Grupo de entrega pronto pra retirar (inclui Pontos de Entrega). Emitido **por grupo de entrega**, não por pedido. Se um pedido tem grupo Normal e Antecipado que ficam prontos em momentos diferentes, são 2 eventos separados. Payload inclui `deliveryGroup: 'normal' | 'early_delivery'` e lista de `pickupPoints[]` — enviado a todos do setor
  WAITER_PICKUP_CLAIMED: 'waiter:pickup-claimed', // Garçom assumiu retirada — some da tela dos outros garçons do setor
  WAITER_PICKUP_REMINDER: 'waiter:pickup-reminder', // Re-lembrete: item pronto há X min sem retirada (nível 1)
  WAITER_PICKUP_ESCALATION: 'waiter:pickup-escalation', // URGENTE: item sem retirada há Y min — enviado a TODOS os garçons (nível 2, override do claim)
  WAITER_CLAIM_EXPIRING: 'waiter:claim-expiring',       // Aviso ao garçom que fez claim: 1 min antes do timeout (direto ao socket do garçom)
  WAITER_CLAIM_EXPIRED: 'waiter:claim-expired',         // Claim expirado: notifica garçom original (direto) + re-emite waiter:order-ready para o setor
  WAITER_CALL: 'waiter:call',               // Cliente chamou
  WAITER_SESSION_OPENED: 'waiter:session-opened', // Mesa aberta pelo cliente — garçom do setor recebe para dar boas-vindas e verificar presença física. Também protege contra sessão fantasma (QR Code fotografado remotamente)
  WAITER_NEW_ORDER: 'waiter:new-order',     // Emitido na criação do pedido (POST /orders) para garçons do setor da mesa. Inclui: orderId, tableId, tableName, items[]. Para itens destino "Garçom" (entrega direta), o garçom recebe este evento E já pode entregar imediatamente

  // Servidor -> Cliente
  CLIENT_ORDER_UPDATE: 'client:order-update',     // Status do pedido mudou
  CLIENT_SESSION_UPDATE: 'client:session-update',  // Conta atualizada
  CLIENT_PAYMENT_CONFIRMED: 'client:payment-confirmed', // Pagamento confirmado (webhook Pix ou registro manual CASH/CARD por staff). Payload: { personId, amount, method: 'PIX' | 'CASH' | 'CARD_DEBIT' | 'CARD_CREDIT', confirmedAt }. Room: session:{token}
  CLIENT_PAYMENT_CANCELLED: 'client:payment-cancelled', // Tentativa de pagamento cancelada (garçom cancelou ou PIX expirou). Status muda para PAYMENT_CANCELLED ou PAYMENT_EXPIRED. Payload: { personId, paymentId, method, reason: 'staff_cancelled' | 'expired', cancelledAt }. Room: session:{token}
  CLIENT_SESSION_CLOSED: 'client:session-closed',  // Sessão fechada pelo garçom/admin. Payload: { sessionToken, closedAt }. Room: session:{token}
  CLIENT_TABLE_TRANSFERRED: 'client:table-transferred', // Mesa transferida — atualiza nome da mesa na tela do cliente. Room: session:{token}

  // Aprovacao de entrada na mesa
  SESSION_JOIN_REQUEST: 'session:join-request',     // Novo entrante quer entrar na mesa (notifica membros aprovados)
  SESSION_JOIN_APPROVED: 'session:join-approved',   // Solicitacao aprovada (notifica o entrante)
  SESSION_JOIN_REJECTED: 'session:join-rejected',   // Solicitacao rejeitada (notifica o entrante)
  SESSION_JOIN_REMIND: 'session:join-remind',       // Lembrete de aprovacao pendente (reenvio pelo entrante)

  // Servidor -> Admin
  ADMIN_TABLE_UPDATE: 'admin:table-update',        // Status de mesa mudou
  ADMIN_METRICS_UPDATE: 'admin:metrics-update',    // Metricas atualizaram
  ADMIN_PICKUP_ESCALATION: 'admin:pickup-escalation', // Item sem retirada escalado (nível 2) — alerta no dashboard
  ADMIN_MAPPING_INCOMPLETE: 'admin:mapping-incomplete', // Mapeamento Setor↔Local de Preparo incompleto — alerta urgente
  ADMIN_NO_WAITER_ALERT: 'admin:no-waiter-alert',     // Cliente tentou abrir mesa em setor sem garçom ativo — alerta severo
  ADMIN_WAITER_OFFLINE: 'admin:waiter-offline',       // Garçom com turno ativo desconectado há mais de waiterOfflineAlertTimeout minutos

  // Garçom — alertas operacionais
  WAITER_ORDER_CANCELLED: 'waiter:order-cancelled',       // Pedido cancelado — notifica garçons do setor
  WAITER_MAPPING_INCOMPLETE: 'waiter:mapping-incomplete', // Mesa do setor não pode ser aberta — mapeamento incompleto
  WAITER_TABLE_TRANSFERRED: 'waiter:table-transferred', // Mesa transferida entre setores — notifica origem (remover) e destino (pedidos pendentes/prontos)

  // Estoque (Fase 2 — NAO IMPLEMENTAR)
  STOCK_ALERT_TRIGGERED: 'stock:alert-triggered',
  STOCK_UPDATED: 'stock:updated',
} as const;
```

## Payloads

Estrutura dos dados enviados em cada evento. Todos incluem `correlationId: string` para tracing.

### Cliente → Servidor

| Evento | Payload |
|---|---|
| `order:created` | `{ sessionToken, items: [{ productId, qty, personIds[], notes? }] }` |
| `call:request` | `{ sessionToken, reason: 'waiter' \| 'bill' \| 'other', message? }` |
| `payment:initiated` | `{ sessionToken, personId, method: 'PIX' \| 'CASH' \| 'CARD_DEBIT' \| 'CARD_CREDIT' }` |

### Servidor → KDS

| Evento | Room | Payload |
|---|---|---|
| `kds:new-order` | `restaurant:{id}:kds:{prepLocationId}` | `{ orderId, orderNumber, tableNumber, sectorName, items: [{ itemId, productName, qty, notes?, pickupPointName, kitchenDelivery }], createdAt }` |

### KDS → Servidor

| Evento | Payload |
|---|---|
| `kds:status-update` | `{ orderId, itemId, status: 'order_preparing' \| 'order_ready' \| 'order_delivered', updatedBy: staffId }`. Servidor processa e emite eventos derivados: `client:order-update`, `waiter:order-ready` (quando grupo completo), etc. |

### Servidor → Garçom

| Evento | Room | Payload |
|---|---|---|
| `waiter:session-opened` | `restaurant:{id}:waiter:sector:{sectorId}` | `{ tableId, tableName, personCount, openedAt }`. Garçom vai até a mesa para dar boas-vindas. Se mesa estiver vazia → sessão fantasma, garçom fecha manualmente |
| `waiter:new-order` | `restaurant:{id}:waiter:sector:{sectorId}` | `{ orderId, orderNumber, tableId, tableName, items: [{ itemId, productName, qty, destination }] }` |
| `waiter:order-ready` | `restaurant:{id}:waiter:sector:{sectorId}` | `{ orderId, orderNumber, tableNumber, deliveryGroup: 'normal' \| 'early_delivery', pickupPoints: [{ pointId, pointName, locationName, kitchenDelivery, items: [{ itemId, productName, qty }] }] }` |
| `waiter:pickup-claimed` | `restaurant:{id}:waiter:sector:{sectorId}` | `{ orderId, deliveryGroup, claimedByStaffId, claimedByName }` |
| `waiter:pickup-reminder` | `restaurant:{id}:waiter:sector:{sectorId}` | `{ orderId, orderNumber, tableNumber, deliveryGroup, minutesWaiting, pickupPoints[] }` |
| `waiter:pickup-escalation` | `restaurant:{id}:waiter` | `{ orderId, orderNumber, tableNumber, deliveryGroup, minutesWaiting, pickupPoints[], previousClaimStaffId? }` |
| `waiter:claim-expiring` | direto ao socket do garçom | `{ orderId, orderNumber, deliveryGroup, expiresInSeconds: 60 }` |
| `waiter:claim-expired` | direto ao socket do garçom | `{ orderId, orderNumber, deliveryGroup, expiredAt }` |
| `waiter:call` | `restaurant:{id}:waiter:sector:{sectorId}` | `{ callId, tableNumber, reason, message?, createdAt }` |
| `waiter:order-cancelled` | `restaurant:{id}:waiter:sector:{sectorId}` | `{ orderId, orderNumber, tableName, cancelledByStaffId }` |
| `waiter:table-transferred` | `restaurant:{id}:waiter:sector:{originSectorId}` | `{ tableId, tableName, type: 'removed' }` — mesa saiu do setor |
| `waiter:table-transferred` | `restaurant:{id}:waiter:sector:{destSectorId}` | `{ tableId, tableName, sessionId, sectorId, personCount, pendingOrders: [{ orderId, orderNumber, status, deliveryGroup, itemCount }] }` — mesa chegou no setor com contexto de pedidos pendentes/prontos |

### Servidor → KDS (transferência)

| Evento | Room | Payload |
|---|---|---|
| `kds:table-transferred` | `restaurant:{id}:kds:{prepLocationId}` | `{ orderId, oldTableName, newTableName }` — atualiza número da mesa nos cards |

### Servidor → Cliente (transferência)

| Evento | Room | Payload |
|---|---|---|
| `client:table-transferred` | `session:{token}` | `{ newTableId, newTableName }` — atualiza nome da mesa na tela do cliente |

### Servidor → Cliente

| Evento | Room | Payload |
|---|---|---|
| `client:order-update` | `session:{token}` | `{ orderId, items: [{ itemId, productName, status: 'order_queued' \| 'order_preparing' \| 'order_ready' \| 'order_delivered' \| 'order_cancelled' }] }` |
| `client:session-update` | `session:{token}` | `{ type: 'person-added' \| 'person-removed' \| 'bill-updated', data: { personId?, personName?, amount?, reason? } }` |
| `client:payment-confirmed` | `session:{token}` | `{ personId, amount, method, confirmedAt }` |
| `client:payment-cancelled` | `session:{token}` | `{ personId, paymentId, method, reason: 'staff_cancelled' \| 'expired', cancelledAt }` |
| `client:session-closed` | `session:{token}` | `{ sessionToken, closedAt }` |

### Aprovação de Entrada

**Nota:** o entrante **não entra na room `session:{token}`** até ser aprovado. A confirmação de que a solicitação foi criada vem via HTTP 201 do `POST /session/:token/join`. Eventos de aprovação/rejeição são enviados **direto ao socket do entrante** (não via room). Se o WebSocket do entrante cair durante a espera, o frontend usa `GET /session/:token/join/:requestId/status` como fallback de polling.

| Evento | Room | Payload |
|---|---|---|
| `session:join-request` | `session:{token}` | `{ requestId, name, phoneLast4, requestedAt }` — notifica membros aprovados |
| `session:join-approved` | direto ao socket do entrante | `{ requestId, approvedBy, sessionToken, personId }` |
| `session:join-rejected` | direto ao socket do entrante | `{ requestId, rejectedBy }` |
| `session:join-remind` | `session:{token}` | `{ requestId, phoneLast4, reminderCount }` |

### Servidor → Admin

| Evento | Room | Payload |
|---|---|---|
| `admin:table-update` | `restaurant:{id}:admin` | `{ tableId, status: 'free' \| 'occupied', sessionId?, occupiedSince? }` |
| `admin:metrics-update` | `restaurant:{id}:admin` | `{ activeTables, activeOrders, avgPrepTimeByLocation: { [prepLocationId]: minutes }, revenue }` |
| `admin:pickup-escalation` | `restaurant:{id}:admin` | `{ orderId, orderNumber, tableNumber, minutesWaiting, sectorName }` |
| `admin:mapping-incomplete` | `restaurant:{id}:admin` | `{ sectorId, sectorName, missingLocations: [{ preparationLocationId, preparationLocationName }] }` — alerta urgente de mapeamento incompleto |
| `admin:no-waiter-alert` | `restaurant:{id}:admin` | `{ tableId, tableName, sectorId, sectorName, attemptedAt }` — alerta severo: cliente tentou abrir mesa em setor sem garçom com turno ativo |
| `admin:waiter-offline` | `restaurant:{id}:admin` | `{ staffId, staffName, sectorIds, sectorNames, offlineSince, minutesOffline }` — garçom com turno ativo desconectado há mais de `waiterOfflineAlertTimeout` minutos |

## Autenticação WebSocket

- **Staff (JWT):** token JWT enviado no handshake via `auth.token` no objeto de opções do Socket.IO (`io(url, { auth: { token } })`). Middleware do gateway valida JWT, extrai `restaurantId` e `role`, e associa ao socket. Socket inválido é desconectado com erro `AUTH_002`.
- **Cliente (session token):** token da sessão enviado no handshake via `auth.sessionToken`. Middleware valida que a sessão existe e está ativa. Socket inválido é desconectado com erro `SESSION_001`.
- **Após autenticação:** servidor insere o socket nas rooms apropriadas com base no role/sessão. Staff entra em rooms do restaurante; cliente entra na room `session:{token}`.
- **Reconexão:** Socket.IO reenvia `auth` automaticamente no reconnect. Servidor revalida e re-insere nas rooms.

## Rooms WebSocket

| Room | Formato | Quem entra |
|---|---|---|
| Restaurante geral | `restaurant:{id}` | Todos do restaurante |
| KDS geral | `restaurant:{id}:kds` | Todos os Locais de Preparo — usado para eventos cross-KDS (ex: admin monitorando todos os Locais de Preparo simultaneamente) |
| KDS por Local de Preparo | `restaurant:{id}:kds:{prepLocationId}` | Staff do Local de Preparo específico |
| Garçom geral | `restaurant:{id}:waiter` | Todos os garçons ativos |
| Garçom por setor | `restaurant:{id}:waiter:sector:{sectorId}` | Garçons atribuídos ao setor |
| Admin | `restaurant:{id}:admin` | OWNER/MANAGER |
| Sessão cliente | `session:{token}` | Cliente da mesa |

## Deduplicação de Eventos

- Um garçom pode estar em múltiplos setores (múltiplas rooms `waiter:sector:{sectorId}`). Eventos emitidos para a room geral `waiter` (ex: escalação nível 2) podem coexistir com eventos já recebidos por room de setor.
- **Regra:** o servidor deve emitir cada evento **uma única vez por socket**, usando o socket ID para deduplicar. Implementar via `Set` de socketIds já notificados antes de emitir para múltiplas rooms.
- Eventos de escalação nível 2 (`waiter:pickup-escalation`) são emitidos apenas para a room `waiter` geral — **não** duplicar para rooms de setor.

## Redis Adapter (preparação para scaling)

- Configurar `@socket.io/redis-adapter` desde a Fase 1, apontando para o container Redis. Na Fase 1 há apenas 1 instância da API, mas o adapter já fica preparado para scaling horizontal na Fase 2.
- Na Fase 2 (AWS): múltiplas instâncias ECS compartilham rooms e eventos via ElastiCache Redis. Sem o Redis Adapter, containers diferentes não compartilham eventos.

## Reconexão e Resiliência

- Cliente deve implementar reconexão automática com backoff exponencial (Socket.IO faz por padrão).
- **Indicador de conexão obrigatório** em todas as telas que dependem de WebSocket (KDS, garçom, cliente pedidos).
- Quando desconectado, exibir banner "Reconectando..." e fazer polling HTTP a cada 10 segundos como fallback para atualizações críticas: `GET /session/:token` (cliente), `GET /orders?status=ready` (garçom), `GET /tables` (admin).
- Polling continua indefinidamente até reconectar. Após **60 segundos** sem sucesso, indicador visual muda de "Reconectando..." para "Sem conexão — dados podem estar desatualizados".
- Ao reconectar, sincronizar estado completo (fetch via REST) para garantir que nenhum evento foi perdido.
- **Reconciliação do cliente:** ao reconectar, o cliente chama `GET /session/:token` como ponto único de reconciliação — o endpoint retorna o estado completo da sessão (pessoas, pedidos, pagamentos). Nenhum outro endpoint de reconciliação é necessário para o perfil cliente. **Eventos perdidos durante desconexão não são replay-ados** — o GET retorna o estado atual e o frontend substitui o estado local inteiro (não tenta merge). Isso garante consistência sem complexidade de event sourcing.
- **Reconciliação do KDS:** ao conectar (ou reconectar) ao Local de Preparo, o KDS faz fetch inicial de pedidos pendentes via `GET /preparation-locations/:id/orders?status=pending,preparing` antes de processar novos eventos WebSocket. Garante fila consistente mesmo após interrupções.

## Performance e Gerenciamento de Memória

### Cleanup de Rooms
- Quando uma `TableSession` é fechada, remover todos os sockets da room `session:{token}`.
- **Cleanup periódico de rooms órfãs:** job no servidor (setInterval, não Bull) a cada 5 minutos. Uma room é considerada **órfã** quando: (1) não tem sockets conectados E (2) a sessão vinculada está fechada (status `CLOSED`). Rooms de sessões **abertas** nunca são removidas pelo cleanup, mesmo sem sockets — clientes podem reconectar a qualquer momento.
- **Reconexão tardia:** se um cliente reconecta após 10+ minutos, o Socket.IO reconecta automaticamente e re-entra na room `session:{token}`. Como a room de sessão aberta nunca é removida, não há perda. O cliente chama `GET /session/:token` para reconciliação do estado.
- Logar rooms ativas e contagem de sockets por room em `level: debug`.

### Prevenção de Memory Leak
- Limitar listeners por socket: `socket.setMaxListeners(20)`. Logar `warn` se exceder.
- Remover event listeners no `disconnect` (Socket.IO faz por padrão, mas verificar listeners customizados).
- Monitorar memória do processo Node.js (RSS) via logs Winston (Fase 1) ou CloudWatch (Fase 2) — alarme se > 80% do limite do container.
- Em ambiente com 100+ sessões simultâneas (bar lotado), monitorar contagem total de sockets e rooms.

### Backpressure
- Se o servidor estiver sobrecarregado, usar `socket.volatile.emit()` para eventos não-críticos (metrics-update) — descarta se não conseguir enviar.
- Eventos criticos (order-update, payment-update) devem usar `emit()` normal com garantia de entrega.
- Rate limit de eventos do cliente para o servidor: máximo 10 eventos por segundo por socket. Desconectar sockets que excedem (possível abuso).

## Push Notifications e WebSocket

Push notifications e WebSocket **coexistem** mas **não duplicam**. WebSocket é usado para alertas in-app (quando o app está aberto/ativo). Push notifications (via Service Worker + Web Push API) são usadas quando o app está fechado ou em background.

**Deduplicação:** o servidor envia ambos (WebSocket + push), mas o **Service Worker** verifica se o app está ativo antes de exibir a push notification. Se WebSocket está conectado e o app está em foreground, a push é suprimida (o Service Worker detecta via `clients.matchAll()` se há janela ativa). Push só é exibida quando WebSocket está desconectado ou app está em background/fechado.
