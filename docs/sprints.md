# Roadmap de Sprints

Índice do roadmap. **Não ler os arquivos individuais automaticamente** — consultar apenas a sprint relevante para a tarefa atual.

Detalhes de cada sprint em `docs/sprints/sprint-XX.md`.

## Visão Geral

| Sprint | Nome | Foco |
|---|---|---|
| P | Protótipos HTML | Validação visual com HTML+CSS+JS vanilla |
| 0 | Scaffolding + Monorepo + Docker | Infra de dev: Turborepo, pnpm, Docker, CI/CD, ADRs |
| 1 | Auth + Restaurant + Seed | JWT, roles (incl. SUPER_ADMIN), CRUD restaurante, Winston, RLS |
| 2 | Tables + Setores + Locais de Preparo | Backend: mesas, setores, locais de preparo, pontos de entrega |
| 3 | Component Library + Layout Admin | Frontend: componentes base, sidebar admin, Sentry, CRUD mesas/setores/locais |
| 4 | Menu CRUD + Upload de Imagens | Backend+frontend: cardápio, categorias, tags, upload com sharp |
| 5 | Sessão de Mesa + WhatsApp OTP + Pessoas | Backend: sessão via token, OTP, CRUD pessoas, unicidade telefone |
| 6 | Aprovação de Entrantes + Cache Cardápio | Backend: aprovação de novos membros, timeout, cache Redis cardápio |
| 7 | Frontend Cliente: WhatsApp + Cardápio + Pessoas | Frontend: fluxo QR Code, read-only, WhatsApp, pessoas, aprovação |
| 8 | Pedidos Backend + Grupos de Entrega | Backend: pedidos, grupos de entrega, cancelamento, fila |
| 9 | Frontend Carrinho + Pedidos + Conta | Frontend: carrinho, meus pedidos, conta com 3 abas, reatribuição |
| 10 | Pagamento Pix | Backend+frontend: Pix, webhook, circuit breaker |
| 11 | WebSocket Gateway + Infraestrutura Real-Time | Socket.IO, Redis Adapter, rooms, eventos, indicador de conexão |
| 12 | KDS Backend + WebSocket Avançado | Roteamento KDS, deduplicação, backpressure, cleanup rooms |
| 13 | KDS Frontend | Dark mode, temporizadores, cores de status, ficha técnica |
| 14 | Staff + Escala + Equipe do Dia | CRUD funcionários, escala, atribuição de setores |
| 15 | Garçom: Clock-in + Chamados + Mesas | Turno, chamados, lista de mesas, botão "O Chefia" |
| 16 | Garçom: Claim + Taxa de Serviço + Comanda | Claim de grupo, toggle taxa, transferência de mesa, comanda rápida |
| 17 | Push Notifications + Escalação de Retirada | Service Worker, push, escalação nível 1 e 2 |
| 18 | Faturamento | Diário, mensal, caixa, taxas de garçom |
| 19 | Dashboard + Desempenho da Equipe | Métricas Redis, alertas, desempenho por garçom/local |
| 20 | Settings + Theming + Dashboard Avançado | Temas, color picker, mapa de mesas, gráficos |
| 21 | Super Admin: Estabelecimentos + Cobrança | CRUD estabelecimentos, plano, pagamentos, layout/sidebar Super Admin |
| 22 | Super Admin: Módulos + Monitoramento | Módulos extras, métricas globais, atividade |
| 23 | Testes E2E + Acessibilidade | Playwright, axe-core, revisão a11y |
| 24 | Performance + Resiliência | Queries, cache, circuit breaker, graceful shutdown |
| 25 | Segurança Avançada + LGPD | Endpoints LGPD, rotação secrets, revisão segurança |
| 26 | Fase 2: Migração AWS | **NÃO IMPLEMENTAR** — referência arquitetural |
| 27+ | Fase 2: Plataforma + Estoque | **NÃO IMPLEMENTAR** — módulos extras pagos |

## Estado Atual

**Sprint P** — Protótipos concluídos. Pendente: validação visual pelo usuário.

## Como Usar

- Para implementar uma sprint, leia `docs/sprints/sprint-XX.md` correspondente.
- Cada arquivo contém: endpoints (se houver), checklist completo, e referências cruzadas para outros docs.
- Sprints 26+ são apenas referência futura — não implementar até aviso explícito.
