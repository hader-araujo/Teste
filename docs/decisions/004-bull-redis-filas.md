# ADR-004: Bull + Redis para filas e jobs

**Status:** Aceito
**Data:** 2026-03-14

## Contexto

O sistema precisa de jobs assincronos: envio de OTP WhatsApp, escalacao de retirada, cleanup de sessoes, anonimizacao LGPD. Alternativas: Bull + Redis, SQS/SNS, sem fila (sincrono).

## Decisao

Bull (BullMQ) com Redis.

## Justificativa

- **Redis ja existe no stack:** usado pra cache do cardapio e Redis Adapter do Socket.IO. Sem infra extra.
- **Bull e maduro:** retry, delay, cron, rate limiting, prioridade — tudo built-in.
- **Integracao NestJS:** `@nestjs/bull` com decorators nativos.
- **Jobs identificados:** envio OTP, verificacao de timeout de aprovacao, re-notificacao de retirada, escalacao, anonimizacao LGPD, cleanup de sessoes.

## Alternativas descartadas

- **SQS/SNS:** requer AWS. Na Fase 1 o deploy e Docker local/VPS. Adiciona dependencia de cloud.
- **Sem fila (sincrono):** envio de OTP bloquearia a request. Escalacao de retirada precisa de timers. Inviavel.

## Consequencias

- Jobs definidos em modulos NestJS com `@Processor()`.
- Redis e dependencia critica (se cair, jobs param). Monitorar via health check.
- Na Fase 2 (AWS): migrar pra SQS se necessario, mas Bull com ElastiCache funciona bem.
