# GEMINI.md — OChefia

SaaS de gestão para bares/restaurantes no Brasil. Monorepo TypeScript: NestJS + Prisma + PostgreSQL (backend), Next.js 14 App Router + Tailwind (frontend), Socket.IO (real-time), Redis (cache), Turborepo + pnpm.

---

## REGRAS OBRIGATÓRIAS (FUNDAMENTAIS)

1.  **TDD inviolável.** RED → GREEN → REFACTOR. Teste primeiro, código depois. Sem exceções. Consulte sempre `.claude/rules/testing.md`.
2.  **Consultar `docs/` antes de implementar. Atualizar `docs/` depois.** Identificar docs relevantes → ler com `read_file` → implementar → atualizar docs afetados. Se a implementação mudou um endpoint, atualizar `api-endpoints.md`. Se adicionou evento WebSocket, atualizar `websocket-events.md`. Se mudou campo no schema, atualizar `schema.md`. Se mudou fluxo de navegação, atualizar `fluxos.md`. Nenhum PR deve ser mergeado com docs desatualizados.
3.  **Planejamento Mandatório (Strategy phase).** Para features novas ou refatorações grandes, utilize obrigatoriamente `enter_plan_mode` para apresentar o plano (arquivos a criar/modificar, ordem, testes a escrever) e aguarde aprovação. O plano antecede o TDD.
4.  **Nunca tomar decisões de negócio ou design sozinho — REGRA INVIOLÁVEL.** Ao encontrar ambiguidade, furo lógico, ou necessidade de definir regra/comportamento/limite/valor — SEMPRE pergunte antes de decidir. Isso vale para TODAS as fases do projeto:
    *   **Documentação:** definição de regras, fluxos, limites, comportamentos, valores default, interações entre features.
    *   **Desenvolvimento:** escolhas de implementação que afetam lógica de negócio, UX, ou comportamento do sistema.
    *   **Qualquer fase:** se não está explicitamente definido nos docs, não assuma — pergunte.
    Liste as opções com prós/contras e aguarde escolha explícita. Nunca invente números, comportamentos ou regras por conta própria.
5.  **Estratégia de Anonimização (LGPD):** Nunca armazene dados pessoais (nomes, telefones) em campos de texto de logs ou descrições. Use sempre IDs e resolva nomes via JOIN. Logs de auditoria são imutáveis; a anonimização ocorre apenas na entidade raiz (`Person`). Ver `docs/seguranca.md`.

---

## Orientações para Gemini CLI

*   **Regras Específicas:** Antes de iniciar qualquer tarefa de codificação ou arquitetura, leia os arquivos relevantes em `.claude/rules/`.
    *   `.claude/rules/coding.md` — convenções gerais TypeScript, naming, exports
    *   `.claude/rules/testing.md` — TDD, tipos de teste, pré-commit
    *   `.claude/rules/backend.md` — NestJS, Prisma, shared
    *   `.claude/rules/frontend.md` — Next.js, Tailwind, idioma pt-BR
    *   `.claude/rules/git.md` — commits, prefixos, mensagens em português
*   **Contexto de Execução:** Sempre que for rodar comandos de build ou teste, lembre-se de carregar o ambiente Node 20: `source ~/.nvm/nvm.sh && nvm use 20`.

---

## Visão Geral

**OChefia** é um SaaS para gestão de bares e restaurantes no Brasil. Cardápio digital via QR Code, autoatendimento, KDS, módulo garçom e dashboard gerencial — tudo em tempo real, sem hardware especializado.

**Fase 1 (MVP):** QR Code → PWA → pedido → conta → pagamento. Sem download, sem cadastro. Sessão vinculada a mesa.

---

## Estado Atual do Repositório

**Sprint P — Protótipos HTML.** O repositório contém apenas `CLAUDE.md`, `docs/` e `prototypes/`. A estrutura de código (apps/, packages/, docker) ainda não foi criada — será criada na Sprint 0. Ver `docs/sprints.md`.

---

## Quick Start (Após Sprint 0)

```bash
source ~/.nvm/nvm.sh && nvm use 20
pnpm install
docker compose up -d postgres redis
pnpm --filter @ochefia/shared build
pnpm --filter @ochefia/api dev     # Backend porta 3001
pnpm --filter @ochefia/web dev     # Frontend porta 3000
pnpm test                          # Tudo via Turborepo
```

---

## Decisões Arquiteturais

*   **Multi-tenancy** via `restaurantId` em todas as queries.
*   **Sessão do cliente** vinculada a mesa via `sessionToken`, sem cadastro. Verificação via OTP WhatsApp.
*   **Socket.IO rooms** por `restaurantId` para real-time (KDS, garçom, dashboard).
*   **QR Code** gera URL permanente `/{slug}/mesa/{tableId}`. Sessão criada no primeiro acesso.
*   **Pagamento** Pix (simulado na Fase 1) + dinheiro + cartão (registro manual).
