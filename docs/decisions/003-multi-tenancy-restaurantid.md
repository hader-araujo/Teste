# ADR-003: Multi-tenancy via restaurantId

**Status:** Aceito
**Data:** 2026-03-14

## Contexto

O sistema e SaaS multi-tenant — cada restaurante e um tenant isolado. Alternativas: restaurantId em todas as queries, schema por tenant, RLS puro.

## Decisao

Multi-tenancy via `restaurantId` em todas as queries, com RLS como segunda camada de protecao.

## Justificativa

- **Simplicidade:** um banco, um schema. Sem complexidade de provisionar schema/banco por tenant.
- **Escalabilidade na Fase 1:** suficiente pra centenas de restaurantes no mesmo banco.
- **Middleware automatico:** `restaurantId` injetado do JWT em toda query via middleware NestJS. Impossivel esquecer o filtro.
- **RLS como safety net:** PostgreSQL Row Level Security como segunda camada. Se o middleware falhar, RLS bloqueia acesso cross-tenant.
- **Custo zero de infra:** nao precisa de logica de roteamento por tenant, connection pooling por schema, etc.

## Alternativas descartadas

- **Schema por tenant:** isolamento total, mas overhead operacional enorme (migrations por schema, provisioning, connection pooling).
- **RLS puro (sem filtro no ORM):** depender 100% do banco e arriscado — erros de configuracao RLS sao silenciosos.

## Consequencias

- Toda entidade tem `restaurantId` (exceto User e entidades do Super Admin).
- Todo endpoint filtra por `restaurantId` do JWT. Nunca retornar dados de outro restaurante.
- RLS configurado no PostgreSQL como camada extra.
- Super Admin (role `SUPER_ADMIN`) acessa cross-tenant — sem `restaurantId` no JWT.
