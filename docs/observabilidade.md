# Observabilidade (Logs)

## Estrategia
- **Winston** como biblioteca de log em todo o backend (NestJS).
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

### Alarmes recomendados
- Taxa de erros HTTP 5xx > threshold.
- Latencia P95 de endpoints criticos.
- Erros de conexao com banco/Redis.
- Container restarts.

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
