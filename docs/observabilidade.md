# Observabilidade (Logs, Métricas e Tracing)

## Estratégia

### Fase 1 (Docker Only)
- **Winston** como biblioteca de log em todo o backend (NestJS). Roda dentro do container `ochefia-api` — **não é um container separado**.
- Output em **JSON estruturado** para stdout/stderr.
- Visualizável via `docker compose logs -f api`.
- Em desenvolvimento, logs em console formatado (colorido).
- Sem CloudWatch, sem X-Ray. Métricas de negócio calculadas no Redis e exibidas no dashboard do admin/super admin.

### Fase 2 (AWS — NÃO IMPLEMENTAR ATÉ AVISO EXPLÍCITO)
- **AWS X-Ray** para distributed tracing (APM) — diagnosticar latência entre serviços.
- **CloudWatch Metrics** para métricas customizadas de negócio.
- Logs capturados automaticamente pelo **AWS CloudWatch** via ECS.

## CloudWatch (Fase 2 — AWS)

**NÃO IMPLEMENTAR ATÉ MIGRAÇÃO PARA AWS.**

| Recurso | Uso |
|---|---|
| **Log Groups** | Um por serviço (`/ochefia/api`, `/ochefia/web`) |
| **Log Streams** | Um por container/task |
| **Metric Filters** | Extrair métricas de logs (ex: contar erros por módulo) |
| **Alarms** | Alertas quando métricas excedem limites (ex: >10 erros/min) |
| **Insights** | Queries interativas nos logs (busca por correlationId, módulo, etc) |

### Retenção
- Produção: **90 dias** de retenção nos logs.
- Staging: **30 dias**.

### Alarmes recomendados (infra)
- Taxa de erros HTTP 5xx > 5/min por 3 minutos consecutivos.
- Latência P95 > 2s em endpoints críticos (`/orders`, `/payments`, `/menu`).
- Erros de conexão com banco/Redis.
- Container restarts > 2 em 10 minutos.
- CPU > 80% por 5 minutos (trigger de auto-scaling).
- DLQ com mensagens (filas falhando).

### Alarmes recomendados (negócio)
- Restaurante ativo sem pedidos há mais de 2 horas durante horário de funcionamento.
- Webhook Pix sem confirmação em mais de 10 minutos (possível falha na integração).
- Sessão de mesa aberta há mais de 6 horas (possível esquecimento).
- Falhas consecutivas de envio OTP (possível problema com WhatsApp API).

## Correlation ID
- Toda request HTTP recebe um **correlationId** único (UUID v4) via middleware.
- Propagado para todos os services, repositórios e eventos WebSocket.
- Logs incluem: `timestamp`, `level`, `correlationId`, `module`, `message`, `meta`.

## Formato do Log
```json
{
  "timestamp": "2026-03-06T14:30:00.000Z",
  "level": "error",
  "correlationId": "a1b2c3d4-e5f6-...",
  "module": "orders",
  "message": "Falha ao criar pedido",
  "meta": { "sessionToken": "abc123", "error": "Product not found" }
}
```

## Níveis
- `error` — Falhas que impedem a operação.
- `warn` — Situações inesperadas mas recuperáveis.
- `info` — Eventos de negócio relevantes (pedido criado, pagamento confirmado, sessão aberta).
- `debug` — Detalhes técnicos (queries, payloads). Desabilitado em produção.

## Configuração Winston

```typescript
// Producao (Fase 1): JSON para stdout (docker compose logs captura)
// Producao (Fase 2): JSON para stdout (CloudWatch captura via ECS)
const prodTransport = new winston.transports.Console({
  format: winston.format.json(),
});

// Desenvolvimento: console colorido
const devTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple(),
  ),
});
```

## AWS X-Ray (Distributed Tracing — Fase 2)

**NÃO IMPLEMENTAR ATÉ MIGRAÇÃO PARA AWS.**

- Integrar via `aws-xray-sdk` no NestJS.
- Tracing automático de: requests HTTP, queries Prisma/PostgreSQL, chamadas Redis, requests a serviços externos (WhatsApp API, Pix).
- Permite visualizar o caminho completo de uma request e identificar gargalos de latência.
- Em dev, usar modo local (`AWS_XRAY_DAEMON_ADDRESS=localhost:2000`).

## Métricas Customizadas de Negócio

Na Fase 1, essas métricas são calculadas no Redis e exibidas no dashboard admin/super admin. As métricas são **atualizadas por evento** (event-driven) no Redis — não calculadas a cada request. "Dinâmico" (quando usado no contexto de Locais de Preparo) refere-se ao fato de que os Locais de Preparo são cadastráveis pelo restaurante (não fixos como "Cozinha/Bar"). Na Fase 2 (AWS), publicadas via CloudWatch `putMetricData` ou extraídas de logs via Metric Filters.

| Métrica | Dimensão | Uso |
|---|---|---|
| `OrdersCreated` | Por restaurante | Volume de pedidos por período |
| `PaymentsConfirmed` | Por restaurante | Taxa de conversão de pagamento |
| `AveragePreparationTime` | Por restaurante + Local de Preparo | Tempo médio por Local de Preparo |
| `ActiveSessions` | Por restaurante | Mesas ocupadas em tempo real |
| `OTPSendFailures` | Global | Saúde da integração WhatsApp |
| `PixWebhookFailures` | Global | Saúde da integração Pix |
| `CartAbandonment` | Por restaurante | **Fase 2 apenas.** Na Fase 1, o carrinho é armazenado em localStorage apenas — sem persistência no backend, impossível rastrear abandono. Será implementada na Fase 2, quando houver persistência de carrinho no servidor |

Essas métricas alimentam o dashboard do Super Admin e geram alarmes automáticos.

## Modo Degradado (Resiliência)

| Dependência | Fallback |
|---|---|
| **Redis indisponível** | Cardápio servido direto do banco (mais lento). Métricas calculadas on-demand. Log `warn`. |
| **Filesystem de imagens indisponível** | Imagens exibem placeholder genérico. Upload bloqueado com mensagem ao admin. |
| **WhatsApp API indisponível** | OTP enfileirado no Bull (Redis) com retry. Cliente vê "tente novamente em instantes". |
| **Pix provider indisponível** | Webhook enfileirado no Bull (Redis) com retry. Pagamento fica "pendente" até confirmação. |

- Implementar **circuit breaker** (ex: `opossum`) para dependências externas (WhatsApp, Pix).
- Quando o circuit abre, retorna erro amigável imediatamente em vez de esperar timeout.

## Tracing End-to-End (Fluxo Completo)

Definir trace completo para fluxos críticos (via `correlationId` nos logs):

| Fluxo | Trace |
|---|---|
| **Pedido** | Cliente -> API (POST /orders) -> Bull (se async) -> KDS (WebSocket) -> status update -> Cliente (WebSocket) |
| **Pagamento Pix** | Cliente -> API (POST /payments) -> Provedor Pix -> Webhook -> Bull (ochefia-pix-process) -> Worker -> API (update status) -> Cliente (WebSocket) |
| **OTP WhatsApp** | Cliente -> API (POST /session/:token/phone) -> Bull (ochefia-otp-send) -> Worker -> WhatsApp API -> Cliente (verifica OTP) |
| **Upload Imagem** | Admin -> API (POST /upload) -> Filesystem -> Bull (ochefia-image-resize) -> Worker (Sharp) -> Filesystem (thumbs) |

- Propagar `correlationId` nos dados do job Bull.
- Na Fase 2 (AWS), X-Ray segments cobrem: HTTP request, SQS publish/consume, chamadas externas.

## Error Codes Padronizados

Erros retornados pela API devem incluir código estruturado para facilitar debugging e suporte:

| Prefixo | Módulo | Exemplo |
|---|---|---|
| `AUTH_` | Autenticação | `AUTH_001: Credenciais inválidas`, `AUTH_002: Token expirado`, `AUTH_003: Refresh token inválido` |
| `SESSION_` | Sessão | `SESSION_001: Token de sessão inválido`, `SESSION_002: Sessão já fechada`, `SESSION_003: OTP expirado`, `SESSION_004: Aprovação pendente`, `SESSION_005: Solicitação já processada`, `SESSION_006: Cooldown de lembrete ativo`, `SESSION_007: WhatsApp não verificado (chamar /phone e /phone/verify antes de /join)`, `SESSION_008: Telefone já vinculado a outra sessão ativa`, `SESSION_010: OTP inválido`, `SESSION_011: Mapeamento de setor incompleto (mesa não pode ser aberta)`, `SESSION_012: Serviço de WhatsApp indisponível (HTTP 503, tentativa não conta no rate limit)`, `SESSION_014: Limite de re-solicitações atingido (3 por telefone por TableSession)`, `SESSION_015: Pessoa não encontrada na sessão`, `SESSION_016: Pessoa tem pagamento confirmado ou pendente (não pode ser removida)`, `SESSION_017: Pessoa tem itens em fila ou preparo (não pode ser removida)`, `SESSION_018: Limite de pessoas por mesa atingido (maxPeoplePerSession)`, `SESSION_019: Mesa sem atendimento — setor sem garçom com turno ativo` |
| `ORDER_` | Pedidos | `ORDER_001: Item indisponível`, `ORDER_002: Sessão sem pessoas cadastradas`, `ORDER_003: Pessoa inválida`, `ORDER_004: Grupo de entrega já claimado por outro garçom`, `ORDER_005: Mapeamento de setor incompleto para Local de Preparo do produto`, `ORDER_006: Reatribuição bloqueada — item já pago por alguma pessoa` |
| `PAY_` | Pagamentos | `PAY_001: Sessão sem pedidos`, `PAY_002: Pessoa já pagou`, `PAY_003: Webhook timeout`, `PAY_004: Assinatura inválida`, `PAY_005: Pagamento não está pendente (não pode ser cancelado)`, `PAY_006: Pagamento não está PAYMENT_PENDING_REFUND (não pode ser confirmado como devolvido)`, `PAY_007: Pessoa já tem pagamento pendente (cancelar antes de iniciar outro)` |
| `MENU_` | Cardápio | `MENU_001: Categoria não encontrada`, `MENU_002: Produto sem destino`, `MENU_003: Imagem inválida`, `MENU_004: Destino ambíguo (pickupPointId e destination são mutuamente exclusivos)`, `MENU_005: Categoria tem produtos vinculados (não pode ser excluída)` |
| `STAFF_` | Funcionários | `STAFF_001: PIN incorreto`, `STAFF_002: Lockout ativo`, `STAFF_003: Convite expirado` |
| `SECTOR_` | Setores | `SECTOR_001: Setor não encontrado`, `SECTOR_002: Setor tem mesas vinculadas (não pode ser removido)`, `SECTOR_003: Mapeamento incompleto — faltam Locais de Preparo` |
| `KDS_` | KDS | `KDS_001: Transição de status inválida`, `KDS_002: Pedido não encontrado` |

Formato da resposta de erro:
```json
{
  "statusCode": 400,
  "errorCode": "ORDER_001",
  "message": "Item 'Picanha na Brasa' está indisponível no momento",
  "correlationId": "a1b2c3d4-e5f6-..."
}
```

## Client-Side Error Tracking

- Integrar **Sentry** (ou similar) no frontend Next.js para captura automática de erros.
- Configurar `Sentry.init()` com `dsn`, `environment` e `release`.
- Propagar `correlationId` como tag no Sentry para vincular erros frontend com logs backend.
- Capturar: erros JS não tratados, erros de rede (fetch/WebSocket), erros de renderização React.
- Source maps enviados ao Sentry no build (não expor ao público).
- **Service Worker errors:** capturar falhas de cache e push notification separadamente.
- Dashboard Sentry com alertas para picos de erros por release.

## Dashboards de Negócio

Na Fase 1, essas métricas são exibidas no dashboard admin e super admin do próprio sistema. Na Fase 2 (AWS), criar dashboards adicionais no CloudWatch ou Grafana.

### Dashboard Operacional
- Pedidos por hora (gráfico de linha)
- Tempo médio de preparo por Local de Preparo
- Sessões ativas por restaurante
- Taxa de erro por endpoint (top 5)
- Latência P50/P95/P99

### Dashboard de Negócio
- Receita diária acumulada
- Taxa de conversão: sessões abertas vs pedidos feitos
- Cart abandonment rate (Fase 2 — requer persistência de carrinho no backend)
- Pagamentos confirmados vs pendentes
- OTP success rate
- Restaurantes mais ativos (top 10)

### Dashboard de Saúde
- Circuit breaker status (open/closed/half-open) por dependência
- Bull queue depth por fila (Fase 1) / SQS queue depth (Fase 2)
- Bull failed jobs count (deve ser 0) / DLQ message count (Fase 2)
- Redis memory usage e hit rate
- PostgreSQL connections e CPU
