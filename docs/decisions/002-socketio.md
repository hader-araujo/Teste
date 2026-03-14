# ADR-002: Socket.IO para real-time

**Status:** Aceito
**Data:** 2026-03-14

## Contexto

O sistema precisa de comunicacao real-time entre servidor e clientes (KDS, garcom, cliente, admin). Alternativas: Socket.IO, WebSocket nativo (ws), gRPC streams.

## Decisao

Socket.IO.

## Justificativa

- **Fallback automatico:** se WebSocket falhar, faz polling HTTP transparentemente. Importante pra redes instáveis de restaurante.
- **Rooms nativas:** perfeito pra separar eventos por restaurante, setor, sessao. Sem precisar implementar logica de roteamento manual.
- **Redis Adapter:** `@socket.io/redis-adapter` permite scaling horizontal (multiplas instancias compartilham rooms via Redis). Redis ja esta no stack.
- **Reconexao automatica:** backoff exponencial built-in. Essencial pra KDS e garcom que nao podem perder eventos.
- **Ecossistema maduro:** biblioteca estavel, documentacao completa, integracao facil com NestJS.

## Alternativas descartadas

- **WebSocket nativo (ws):** mais leve, mas sem rooms, sem fallback, sem reconnect. Tudo teria que ser implementado manualmente.
- **gRPC streams:** overhead de protobuf, complexidade de setup, nao roda nativamente no browser.

## Consequencias

- Rooms seguem convencao: `restaurant:{id}`, `restaurant:{id}:kds:{locationId}`, `session:{token}`, etc.
- Deduplicacao de eventos necessaria (garcom em multiplos setores = multiplas rooms).
- Redis Adapter configurado desde a Fase 1 (preparacao pra scaling na Fase 2).
