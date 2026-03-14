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

## Cobertura Mínima

| Tipo | Target | Critério |
|---|---|---|
| Unitário | **95%** | Linhas cobertas (Jest `--coverage`) |
| Integração | **95%** | Linhas cobertas (Jest + Supertest) |
| E2E | **100% dos fluxos** | Todos os fluxos documentados em `docs/fluxos.md` devem ter teste Playwright |
| Contrato | **100% dos endpoints** | Todo endpoint em `docs/api-endpoints.md` deve ter teste de contrato |

- `pnpm test --coverage` deve passar os thresholds acima.
- Configurar thresholds no `jest.config.ts` de cada app/package.

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
