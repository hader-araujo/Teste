# Observabilidade (Logs, Metricas e Tracing)

## Estrategia
- **Winston** como biblioteca de log em todo o backend (NestJS).
- **AWS X-Ray** para distributed tracing (APM) — diagnosticar latencia entre servicos.
- **CloudWatch Metrics** para metricas customizadas de negocio.
- Output em **JSON estruturado**.
- Em producao, logs vao para **stdout/stderr** e sao capturados automaticamente pelo **AWS CloudWatch** via ECS.
- Em desenvolvimento, logs em console formatado (colorido).

## CloudWatch (AWS)

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
// Producao: JSON para stdout (CloudWatch captura)
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

## AWS X-Ray (Distributed Tracing)

- Integrar via `aws-xray-sdk` no NestJS.
- Tracing automatico de: requests HTTP, queries Prisma/PostgreSQL, chamadas Redis, requests a servicos externos (WhatsApp API, Pix).
- Permite visualizar o caminho completo de uma request e identificar gargalos de latencia.
- Em dev, usar modo local (`AWS_XRAY_DAEMON_ADDRESS=localhost:2000`).

## Metricas Customizadas de Negocio (CloudWatch Metrics)

Metricas publicadas via `putMetricData` ou extraidas de logs via Metric Filters:

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
| **S3/CloudFront indisponivel** | Imagens exibem placeholder generico. Upload bloqueado com mensagem ao admin. |
| **WhatsApp API indisponivel** | OTP enfileirado no SQS com retry. Cliente ve "tente novamente em instantes". |
| **Pix provider indisponivel** | Webhook enfileirado no SQS com retry. Pagamento fica "pendente" ate confirmacao. |

- Implementar **circuit breaker** (ex: `opossum`) para dependencias externas (WhatsApp, Pix).
- Quando o circuit abre, retorna erro amigavel imediatamente em vez de esperar timeout.
