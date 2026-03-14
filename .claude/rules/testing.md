# TDD — Regra Inviolável

Ciclo **sempre**: RED (teste falhando) → GREEN (código mínimo) → REFACTOR.

- **Proibido** criar/modificar código de produção sem teste escrito ANTES.
- **Proibido** commitar sem testes passando.
- Bug encontrado? Teste que reproduz primeiro, depois corrigir.
- Testes não são opcionais, não são "para depois". São a **primeira coisa**.

## Tipos de Teste

| Tipo | Ferramenta | Local |
|---|---|---|
| Unitário | Jest | `apps/api/src/**/*.spec.ts`, `packages/shared/src/**/*.spec.ts` |
| Integração | Jest + Supertest | `apps/api/test/**/*.e2e-spec.ts` |
| E2E | Playwright | `apps/web/e2e/**/*.spec.ts` |
| Contrato | Jest | `apps/api/test/contracts/**/*.spec.ts` |

## Antes de cada commit

1. `pnpm test` — todos os testes devem passar.
2. `pnpm lint` — zero warnings/errors.
3. Commits atômicos: 1 feature ou 1 fix por commit.
4. Se tem mudanças de 2 tarefas, separar em commits distintos.

## NÃO FAÇA

- Não escrever código de produção antes do teste — o teste vem PRIMEIRO.
- Não mockar o banco de dados em testes de integração — usar banco real (container de teste).
- Não pular o REFACTOR — após o GREEN, sempre revisar antes de seguir.
- Não commitar com testes falhando ou lint com erros.
