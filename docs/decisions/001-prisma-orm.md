# ADR-001: Prisma como ORM

**Status:** Aceito
**Data:** 2026-03-14

## Contexto

Precisamos de um ORM para interagir com PostgreSQL no backend NestJS. Alternativas avaliadas: Prisma, TypeORM, Drizzle.

## Decisao

Prisma.

## Justificativa

- **Type-safe:** schema gera tipos TypeScript automaticamente. Erros de query pegos em compile time.
- **Migrations:** `prisma migrate dev` gera migrations a partir do schema — fluxo simples e previsivel.
- **DX com TypeScript:** autocomplete, validacao de campos, relacoes tipadas. Melhor DX entre as opcoes.
- **Ecossistema NestJS:** integracao madura via `@prisma/client`. Mais adotado que Drizzle no contexto NestJS.
- **Protecao contra SQL injection:** queries parametrizadas por padrao. Template literals para raw queries.

## Alternativas descartadas

- **TypeORM:** decorators pesados, tipagem menos confiavel, historico de bugs em migrations.
- **Drizzle:** mais leve e performatico, mas ecossistema menor e menos maduro com NestJS.

## Consequencias

- Schema centralizado em `apps/api/prisma/schema.prisma`.
- Raw queries obrigam uso de `Prisma.sql` (template literals) — nunca concatenar strings.
- `prisma migrate dev` apenas em ambiente local.
