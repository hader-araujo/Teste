# Eventos WebSocket (Socket.IO)

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

## Rooms WebSocket

| Room | Formato | Quem entra |
|---|---|---|
| Restaurante geral | `restaurant:{id}` | Todos do restaurante |
| KDS geral | `restaurant:{id}:kds` | Cozinha e bar |
| KDS cozinha | `restaurant:{id}:kds:kitchen` | Role KITCHEN |
| KDS bar | `restaurant:{id}:kds:bar` | Role BAR |
| Garcom | `restaurant:{id}:waiter` | Role WAITER |
| Admin | `restaurant:{id}:admin` | OWNER/MANAGER |
| Sessao cliente | `session:{token}` | Cliente da mesa |

## Scaling com Multiplos Containers

- **Obrigatorio:** usar `@socket.io/redis-adapter` para sincronizar rooms e eventos entre multiplas instancias ECS.
- Sem o Redis Adapter, containers diferentes nao compartilham eventos — um pedido criado no container A nao chega ao KDS no container B.
- Configurar o adapter apontando para o mesmo ElastiCache Redis usado pelo cache.

## Reconexao e Resiliencia

- Cliente deve implementar reconexao automatica com backoff exponencial (Socket.IO faz por padrao).
- **Indicador de conexao obrigatorio** em todas as telas que dependem de WebSocket (KDS, garcom, cliente pedidos).
- Quando desconectado, exibir banner "Reconectando..." e fazer polling HTTP como fallback para atualizacoes criticas (status de pedido, pronto para retirada).
- Ao reconectar, sincronizar estado completo (fetch via REST) para garantir que nenhum evento foi perdido.

## Performance e Gerenciamento de Memoria

### Cleanup de Rooms
- Quando uma `TableSession` e fechada, remover todos os sockets da room `session:{token}`.
- Implementar cleanup periodico (a cada 5 minutos) para rooms orfas (sem sockets conectados).
- Logar rooms ativas e contagem de sockets por room em `level: debug`.

### Prevencao de Memory Leak
- Limitar listeners por socket: `socket.setMaxListeners(20)`. Logar `warn` se exceder.
- Remover event listeners no `disconnect` (Socket.IO faz por padrao, mas verificar listeners customizados).
- Monitorar memoria do processo Node.js (RSS) via CloudWatch — alarme se > 80% do limite do container.
- Em ambiente com 100+ sessoes simultaneas (bar lotado), monitorar contagem total de sockets e rooms.

### Backpressure
- Se o servidor estiver sobrecarregado, usar `socket.volatile.emit()` para eventos nao-criticos (metrics-update) — descarta se nao conseguir enviar.
- Eventos criticos (order-update, payment-update) devem usar `emit()` normal com garantia de entrega.
- Rate limit de eventos do cliente para o servidor: maximo 10 eventos por segundo por socket. Desconectar sockets que excedem (possivel abuso).
