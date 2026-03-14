# ADR-002: Socket.IO para real-time

**Status:** Aceito
**Data:** 2026-03-14

## Contexto

O sistema precisa de comunicação real-time entre servidor e clientes (KDS, garçom, cliente, admin). Alternativas: Socket.IO, WebSocket nativo (ws), gRPC streams.

## Decisão

Socket.IO.

## Justificativa

- **Fallback automático:** se WebSocket falhar, faz polling HTTP transparentemente. Importante para redes instáveis de restaurante.
- **Rooms nativas:** perfeito pra separar eventos por restaurante, setor, sessão. Sem precisar implementar lógica de roteamento manual.
- **Redis Adapter:** `@socket.io/redis-adapter` permite scaling horizontal (múltiplas instâncias compartilham rooms via Redis). Redis já está no stack.
- **Reconexão automática:** backoff exponencial built-in. Essencial para KDS e garçom que não podem perder eventos.
- **Ecossistema maduro:** biblioteca estável, documentação completa, integração fácil com NestJS.

## Alternativas descartadas

- **WebSocket nativo (ws):** mais leve, mas sem rooms, sem fallback, sem reconnect. Tudo teria que ser implementado manualmente.
- **gRPC streams:** overhead de protobuf, complexidade de setup, não roda nativamente no browser.

## Consequências

- Rooms seguem convenção: `restaurant:{id}`, `restaurant:{id}:kds:{locationId}`, `session:{token}`, etc.
- Deduplicação de eventos necessária (garçom em múltiplos setores = múltiplas rooms).
- Redis Adapter configurado desde a Fase 1 (preparação para scaling na Fase 2).
