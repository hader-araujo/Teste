# Observabilidade (Logs)

## Estrategia
- **Winston** como biblioteca de log em todo o backend (NestJS).
- Output em **JSON estruturado**.
- Sem dependencia de servicos externos (ELK, Grafana). Funciona 100% offline.
- Rotacao de arquivos com `winston-daily-rotate-file` (30 dias, max 500MB).

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

## Onde os logs ficam
- **Deploy local:** `/var/log/ochefia/` dentro do container `api`, com volume Docker mapeado.
- **Deploy cloud:** Stdout/stderr capturados pelo CloudWatch (AWS).

## Futuro (nao implementar agora)
- Alertas automaticos (muitos erros em X minutos -> notificacao).
- Painel de super admin para visualizar logs remotamente.
