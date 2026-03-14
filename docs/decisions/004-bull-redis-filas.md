# ADR-004: Bull + Redis para filas e jobs

**Status:** Aceito
**Data:** 2026-03-14

## Contexto

O sistema precisa de jobs assíncronos: envio de OTP WhatsApp, escalação de retirada, cleanup de sessões, anonimização LGPD. Alternativas: Bull + Redis, SQS/SNS, sem fila (síncrono).

## Decisão

Bull (BullMQ) com Redis.

## Justificativa

- **Redis já existe no stack:** usado para cache do cardápio e Redis Adapter do Socket.IO. Sem infra extra.
- **Bull é maduro:** retry, delay, cron, rate limiting, prioridade — tudo built-in.
- **Integração NestJS:** `@nestjs/bull` com decorators nativos.
- **Jobs identificados:** envio OTP, verificação de timeout de aprovação, re-notificação de retirada, escalação, anonimização LGPD, cleanup de sessões.

## Alternativas descartadas

- **SQS/SNS:** requer AWS. Na Fase 1 o deploy é Docker local/VPS. Adiciona dependência de cloud.
- **Sem fila (síncrono):** envio de OTP bloquearia a request. Escalação de retirada precisa de timers. Inviável.

## Consequências

- Jobs definidos em módulos NestJS com `@Processor()`.
- Redis é dependência crítica (se cair, jobs param). Monitorar via health check.
- Na Fase 2 (AWS): migrar pra SQS se necessário, mas Bull com ElastiCache funciona bem.
