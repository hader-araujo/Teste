# Convenções de Sprints

## Balanceamento

- **Sprint grande = dividir.** Se uma sprint tem muitos itens/endpoints com responsabilidades distintas, dividir em sprints menores e renumerar as seguintes.
- **Exceção:** CRUDs coesos e interdependentes podem ficar na mesma sprint mesmo que gerem muitos endpoints (ex: mesas + setores + locais de preparo são uma unidade lógica).
- Ao dividir, **nunca usar sufixos** (3a, 3b). A sprint vira 2 sprints com números sequenciais (ex: Sprint 3 vira Sprint 3 + Sprint 4) e todas as sprints seguintes são renumeradas.

## Checklist de Validação (sprint só está pronta quando TUDO passar)

- [ ] `pnpm test` — todos os testes passando (zero falhas).
- [ ] `pnpm lint` — zero warnings/errors.
- [ ] Docs atualizados: endpoints novos em `api-endpoints.md`, eventos em `websocket-events.md`, campos em `schema.md`, fluxos em `fluxos.md`.
- [ ] Protótipos atualizados se houve mudança visual (tela nova ou alteração de fluxo).
- [ ] Commits atômicos com prefixos corretos.
- [ ] PR revisado (ou self-review com checklist acima).

## NÃO FAÇA

- Não criar sprints com sufixo (a, b, c) — renumerar as seguintes.
- Não deixar sprint desbalanceada "pra resolver depois" — corrigir no planejamento.
- Não mergear sprint com docs desatualizados ou testes falhando.
