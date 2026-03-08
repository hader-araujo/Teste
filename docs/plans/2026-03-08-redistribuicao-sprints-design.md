# Design: Redistribuicao de Sprints

**Data:** 2026-03-08
**Status:** Aprovado

## Problema

As sprints originais tinham 3 problemas criticos:

1. **Desequilibrio de carga** — Sprint 3-4 (27 endpoints), Sprint 7-8 (23 endpoints + 5 modulos) vs Sprint 0 (so pastas), Sprint 10 (4 itens de UI).
2. **Dependencias fora de ordem** — Biblioteca de componentes (Sprint 9) e layout admin (Sprint 10) criados DEPOIS de 4 sprints de frontend. Pagamento (Sprint 11) separado do fluxo de pedidos (Sprint 3-4).
3. **Sprints agrupadas ("1-2", "3-4")** — A IA trata como bloco unico, sem checkpoint de revisao entre elas.

## Decisao

Redistribuir de 13 sprints (varias agrupadas) para 16 sprints individuais, cada uma com escopo claro e checkpoint de revisao.

### Principios aplicados

- Cada sprint independente, sem agrupamento
- ~6-12 endpoints por sprint (maximo)
- Dependencias na ordem certa (componentes antes de frontend)
- Cada sprint entrega algo testavel
- Testes e2e como sprint dedicada no final

### Mudancas-chave

| Mudanca | Motivo |
|---|---|
| Componentes base movidos para Sprint 2 | Evitar retrabalho em 4+ sprints de frontend |
| Pagamento movido de Sprint 11 para Sprint 5 | Fluxo natural: pedido -> pagamento |
| Sprint 7-8 dividida em 3 (8, 9, 10) | Era a sprint mais sobrecarregada |
| Super Admin dividido em 2 (13, 14) | 13 endpoints + 3 subsistemas e demais para 1 sprint |
| Sprint E2E dedicada (15) | Antes estava enfiada na Sprint 7-8 |
| Sprint 0 absorveu infra do antigo Sprint 1 | Sprint 0 original era so mkdir |

### Contagem final por sprint

| Sprint | Endpoints | Tipo |
|---|---|---|
| 0 | 0 | Infra |
| 1 | ~8 | Backend |
| 2 | ~7 | Backend + Frontend base |
| 3 | ~12 | Backend |
| 4 | ~9 | Backend + Frontend |
| 5 | ~10 | Backend + Frontend |
| 6 | 0 | Infra WebSocket |
| 7 | 0 | Frontend KDS |
| 8 | ~9 | Backend + Frontend |
| 9 | ~8 | Backend + Frontend |
| 10 | 0 | Infra Push |
| 11 | ~6 | Backend + Frontend |
| 12 | 0 | Frontend Settings |
| 13 | ~9 | Backend + Frontend |
| 14 | ~4 | Backend + Frontend |
| 15 | 0 | Testes |
