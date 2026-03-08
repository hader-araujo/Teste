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
