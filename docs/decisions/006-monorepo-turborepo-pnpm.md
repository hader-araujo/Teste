# ADR-006: Monorepo com Turborepo + pnpm

**Status:** Aceito
**Data:** 2026-03-14

## Contexto

O projeto tem backend (NestJS), frontend (Next.js) e um pacote compartilhado (tipos, constantes, utils). Alternativas: monorepo Turborepo + pnpm, Nx, repos separados.

## Decisao

Monorepo com Turborepo e pnpm workspaces.

## Justificativa

- **Shared package:** `@ochefia/shared` compartilha tipos TypeScript, constantes e utils entre api e web. Monorepo facilita isso com symlinks do workspace.
- **Builds incrementais:** Turborepo cacheia builds — so rebuilda o que mudou. Rapido em dev e CI.
- **pnpm:** mais rapido e eficiente que npm (hard links, dedup). Workspaces nativos sem lerna.
- **Um PR = tudo junto:** mudanca no schema que afeta api e web vai no mesmo PR. Sem sincronizar versoes entre repos.
- **Simplicidade:** Turborepo e mais leve que Nx (menos opiniao, menos config).

## Alternativas descartadas

- **Nx:** mais poderoso mas mais complexo. Over-engineering pra um time pequeno.
- **Repos separados:** shared package viraria pacote npm publicado. Overhead de versionamento, publicacao, sincronizacao.

## Consequencias

- Estrutura: `apps/api`, `apps/web`, `packages/shared`.
- `packages/shared` deve ser buildado antes de api/web (`pnpm --filter @ochefia/shared build`).
- `turbo.json` define pipeline de build/test/lint.
- `pnpm-workspace.yaml` define os workspaces.
