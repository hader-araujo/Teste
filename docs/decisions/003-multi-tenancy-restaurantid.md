# ADR-003: Multi-tenancy via restaurantId

**Status:** Aceito
**Data:** 2026-03-14

## Contexto

O sistema é SaaS multi-tenant — cada restaurante é um tenant isolado. Alternativas: restaurantId em todas as queries, schema por tenant, RLS puro.

## Decisão

Multi-tenancy via `restaurantId` em todas as queries, com RLS como segunda camada de proteção.

## Justificativa

- **Simplicidade:** um banco, um schema. Sem complexidade de provisionar schema/banco por tenant.
- **Escalabilidade na Fase 1:** suficiente para centenas de restaurantes no mesmo banco.
- **Middleware automático:** `restaurantId` injetado do JWT em toda query via middleware NestJS. Impossível esquecer o filtro.
- **RLS como safety net:** PostgreSQL Row Level Security como segunda camada. Se o middleware falhar, RLS bloqueia acesso cross-tenant.
- **Custo zero de infra:** não precisa de lógica de roteamento por tenant, connection pooling por schema, etc.

## Alternativas descartadas

- **Schema por tenant:** isolamento total, mas overhead operacional enorme (migrations por schema, provisioning, connection pooling).
- **RLS puro (sem filtro no ORM):** depender 100% do banco é arriscado — erros de configuração RLS são silenciosos.

## Consequências

- Toda entidade tem `restaurantId` (exceto User e entidades do Super Admin).
- Todo endpoint filtra por `restaurantId` do JWT. Nunca retornar dados de outro restaurante.
- RLS configurado no PostgreSQL como camada extra.
- Super Admin (role `SUPER_ADMIN`) acessa cross-tenant — sem `restaurantId` no JWT.
