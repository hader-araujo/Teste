# Observabilidade (Logs, Metricas e Tracing)

## Estrategia

### Fase 1 (Docker Only)
- **Winston** como biblioteca de log em todo o backend (NestJS). Roda dentro do container `ochefia-api` — **nao e um container separado**.
- Output em **JSON estruturado** para stdout/stderr.
- Visualizavel via `docker compose logs -f api`.
- Em desenvolvimento, logs em console formatado (colorido).
- Sem CloudWatch, sem X-Ray. Metricas de negocio calculadas no Redis e exibidas no dashboard do admin/super admin.

### Fase 2 (AWS — NAO IMPLEMENTAR ATE AVISO EXPLICITO)
- **AWS X-Ray** para distributed tracing (APM) — diagnosticar latencia entre servicos.
- **CloudWatch Metrics** para metricas customizadas de negocio.
- Logs capturados automaticamente pelo **AWS CloudWatch** via ECS.

## CloudWatch (Fase 2 — AWS)

**NAO IMPLEMENTAR ATE MIGRACAO PARA AWS.**

| Recurso | Uso |
|---|---|
| **Log Groups** | Um por servico (`/ochefia/api`, `/ochefia/web`) |
| **Log Streams** | Um por container/task |
| **Metric Filters** | Extrair metricas de logs (ex: contar erros por modulo) |
| **Alarms** | Alertas quando metricas excedem limites (ex: >10 erros/min) |
| **Insights** | Queries interativas nos logs (busca por correlationId, modulo, etc) |

### Retencao
- Producao: **90 dias** de retencao nos logs.
- Staging: **30 dias**.

### Alarmes recomendados (infra)
- Taxa de erros HTTP 5xx > 5/min por 3 minutos consecutivos.
- Latencia P95 > 2s em endpoints criticos (`/orders`, `/payments`, `/menu`).
- Erros de conexao com banco/Redis.
- Container restarts > 2 em 10 minutos.
- CPU > 80% por 5 minutos (trigger de auto-scaling).
- DLQ com mensagens (filas falhando).

### Alarmes recomendados (negocio)
- Restaurante ativo sem pedidos ha mais de 2 horas durante horario de funcionamento.
- Webhook Pix sem confirmacao em mais de 10 minutos (possivel falha na integracao).
- Sessao de mesa aberta ha mais de 6 horas (possivel esquecimento).
- Falhas consecutivas de envio OTP (possivel problema com WhatsApp API).

## Correlation ID
- Toda request HTTP recebe um **correlationId** unico (UUID v4) via middleware.
- Propagado para todos os services, repositorios e eventos WebSocket.
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

## Niveis
- `error` — Falhas que impedem a operacao.
- `warn` — Situacoes inesperadas mas recuperaveis.
- `info` — Eventos de negocio relevantes (pedido criado, pagamento confirmado, sessao aberta).
- `debug` — Detalhes tecnicos (queries, payloads). Desabilitado em producao.

## Configuracao Winston

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

**NAO IMPLEMENTAR ATE MIGRACAO PARA AWS.**

- Integrar via `aws-xray-sdk` no NestJS.
- Tracing automatico de: requests HTTP, queries Prisma/PostgreSQL, chamadas Redis, requests a servicos externos (WhatsApp API, Pix).
- Permite visualizar o caminho completo de uma request e identificar gargalos de latencia.
- Em dev, usar modo local (`AWS_XRAY_DAEMON_ADDRESS=localhost:2000`).

## Metricas Customizadas de Negocio

Na Fase 1, essas metricas sao calculadas no Redis e exibidas no dashboard admin/super admin. Na Fase 2 (AWS), publicadas via CloudWatch `putMetricData` ou extraidas de logs via Metric Filters.

| Metrica | Dimensao | Uso |
|---|---|---|
| `OrdersCreated` | Por restaurante | Volume de pedidos por periodo |
| `PaymentsConfirmed` | Por restaurante | Taxa de conversao de pagamento |
| `AveragePreparationTime` | Por restaurante + destino | Tempo medio cozinha/bar |
| `ActiveSessions` | Por restaurante | Mesas ocupadas em tempo real |
| `OTPSendFailures` | Global | Saude da integracao WhatsApp |
| `PixWebhookFailures` | Global | Saude da integracao Pix |
| `CartAbandonment` | Por restaurante | Carrinhos criados vs pedidos confirmados |

Essas metricas alimentam o dashboard do Super Admin e geram alarmes automaticos.

## Modo Degradado (Resiliencia)

| Dependencia | Fallback |
|---|---|
| **Redis indisponivel** | Cardapio servido direto do banco (mais lento). Metricas calculadas on-demand. Log `warn`. |
| **Filesystem de imagens indisponivel** | Imagens exibem placeholder generico. Upload bloqueado com mensagem ao admin. |
| **WhatsApp API indisponivel** | OTP enfileirado no Bull (Redis) com retry. Cliente ve "tente novamente em instantes". |
| **Pix provider indisponivel** | Webhook enfileirado no Bull (Redis) com retry. Pagamento fica "pendente" ate confirmacao. |

- Implementar **circuit breaker** (ex: `opossum`) para dependencias externas (WhatsApp, Pix).
- Quando o circuit abre, retorna erro amigavel imediatamente em vez de esperar timeout.

## Tracing End-to-End (Fluxo Completo)

Definir trace completo para fluxos criticos (via `correlationId` nos logs):

| Fluxo | Trace |
|---|---|
| **Pedido** | Cliente -> API (POST /orders) -> Bull (se async) -> KDS (WebSocket) -> status update -> Cliente (WebSocket) |
| **Pagamento Pix** | Cliente -> API (POST /payments) -> Provedor Pix -> Webhook -> Bull (ochefia-pix-process) -> Worker -> API (update status) -> Cliente (WebSocket) |
| **OTP WhatsApp** | Cliente -> API (POST /session/:token/phone) -> Bull (ochefia-otp-send) -> Worker -> WhatsApp API -> Cliente (verifica OTP) |
| **Upload Imagem** | Admin -> API (POST /upload) -> Filesystem -> Bull (ochefia-image-resize) -> Worker (Sharp) -> Filesystem (thumbs) |

- Propagar `correlationId` nos dados do job Bull.
- Na Fase 2 (AWS), X-Ray segments cobrem: HTTP request, SQS publish/consume, chamadas externas.

## Error Codes Padronizados

Erros retornados pela API devem incluir codigo estruturado para facilitar debugging e suporte:

| Prefixo | Modulo | Exemplo |
|---|---|---|
| `AUTH_` | Autenticacao | `AUTH_001: Credenciais invalidas`, `AUTH_002: Token expirado`, `AUTH_003: Refresh token invalido` |
| `SESSION_` | Sessao | `SESSION_001: Token de sessao invalido`, `SESSION_002: Sessao ja fechada`, `SESSION_003: OTP expirado`, `SESSION_004: Aprovacao pendente`, `SESSION_005: Solicitacao ja processada`, `SESSION_006: Cooldown de lembrete ativo` |
| `ORDER_` | Pedidos | `ORDER_001: Item indisponivel`, `ORDER_002: Sessao sem pessoas cadastradas`, `ORDER_003: Pessoa invalida` |
| `PAY_` | Pagamentos | `PAY_001: Sessao sem pedidos`, `PAY_002: Pessoa ja pagou`, `PAY_003: Webhook timeout`, `PAY_004: Assinatura invalida` |
| `MENU_` | Cardapio | `MENU_001: Categoria nao encontrada`, `MENU_002: Produto sem destino`, `MENU_003: Imagem invalida` |
| `STAFF_` | Funcionarios | `STAFF_001: PIN incorreto`, `STAFF_002: Lockout ativo`, `STAFF_003: Convite expirado` |
| `KDS_` | KDS | `KDS_001: Transicao de status invalida`, `KDS_002: Pedido nao encontrado` |

Formato da resposta de erro:
```json
{
  "statusCode": 400,
  "errorCode": "ORDER_001",
  "message": "Item 'Picanha na Brasa' esta indisponivel no momento",
  "correlationId": "a1b2c3d4-e5f6-..."
}
```

## Client-Side Error Tracking

- Integrar **Sentry** (ou similar) no frontend Next.js para captura automatica de erros.
- Configurar `Sentry.init()` com `dsn`, `environment` e `release`.
- Propagar `correlationId` como tag no Sentry para vincular erros frontend com logs backend.
- Capturar: erros JS nao tratados, erros de rede (fetch/WebSocket), erros de renderizacao React.
- Source maps enviados ao Sentry no build (nao expor ao publico).
- **Service Worker errors:** capturar falhas de cache e push notification separadamente.
- Dashboard Sentry com alertas para picos de erros por release.

## Dashboards de Negocio

Na Fase 1, essas metricas sao exibidas no dashboard admin e super admin do proprio sistema. Na Fase 2 (AWS), criar dashboards adicionais no CloudWatch ou Grafana.

### Dashboard Operacional
- Pedidos por hora (grafico de linha)
- Tempo medio de preparo por destino (cozinha/bar)
- Sessoes ativas por restaurante
- Taxa de erro por endpoint (top 5)
- Latencia P50/P95/P99

### Dashboard de Negocio
- Receita diaria acumulada
- Taxa de conversao: sessoes abertas vs pedidos feitos
- Cart abandonment rate
- Pagamentos confirmados vs pendentes
- OTP success rate
- Restaurantes mais ativos (top 10)

### Dashboard de Saude
- Circuit breaker status (open/closed/half-open) por dependencia
- Bull queue depth por fila (Fase 1) / SQS queue depth (Fase 2)
- Bull failed jobs count (deve ser 0) / DLQ message count (Fase 2)
- Redis memory usage e hit rate
- PostgreSQL connections e CPU
