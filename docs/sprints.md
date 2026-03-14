# Roadmap de Sprints

Índice do roadmap. **Não ler os arquivos individuais automaticamente** — consultar apenas a sprint relevante para a tarefa atual.

Detalhes de cada sprint em `docs/sprints/sprint-XX.md`.

## Visão Geral

| Sprint | Nome | Foco |
|---|---|---|
| P | Protótipos HTML | Validação visual com HTML+CSS+JS vanilla |
| 0 | Scaffolding + Monorepo + Docker | Infra de dev: Turborepo, pnpm, Docker |
| 1 | Segurança Base + CI/CD + Docs | Helmet, CSP, CORS, rate limiting, sanitização, CI/CD, ADRs |
| 2 | Auth + Restaurant + Seed | JWT, roles (incl. SUPER_ADMIN), CRUD restaurante, Winston, RLS |
| 3 | Tables + Setores + Locais de Preparo | Backend: mesas, setores, locais de preparo, pontos de entrega |
| 4 | Component Library + Layout Admin | Frontend: componentes base, sidebar admin, Sentry, CRUD mesas/setores/locais |
| 5 | Menu CRUD + Upload de Imagens | Backend+frontend: cardápio, categorias, tags, upload com sharp |
| 6 | Sessão de Mesa + WhatsApp OTP + Pessoas | Backend: sessão via token, OTP, CRUD pessoas, unicidade telefone |
| 7 | Aprovação de Entrantes + Cache Cardápio | Backend: aprovação de novos membros, timeout, cache Redis cardápio |
| 8 | Frontend Cliente: WhatsApp + Cardápio + Pessoas | Frontend: fluxo QR Code, read-only, WhatsApp, pessoas, aprovação |
| 9 | Pedidos Backend + Grupos de Entrega | Backend: pedidos, grupos de entrega, cancelamento, fila |
| 10 | Frontend Carrinho + Pedidos + Conta | Frontend: carrinho, meus pedidos, conta com 3 abas, reatribuição |
| 11 | Pagamento (Pix + Dinheiro + Cartão) | Backend+frontend: Pix, CASH/CARD com confirmação staff, webhook, circuit breaker |
| 12 | WebSocket Gateway + Infraestrutura Real-Time | Socket.IO, Redis Adapter, rooms, eventos, indicador de conexão |
| 13 | KDS Backend + WebSocket Avançado | Roteamento KDS, deduplicação, backpressure, cleanup rooms |
| 14 | KDS Frontend | Dark mode, temporizadores, cores de status, foto do prato |
| 15 | Staff + Escala + Equipe do Dia | CRUD funcionários, escala, atribuição de setores |
| 16 | Garçom: Clock-in + Chamados + Mesas | Turno, chamados, lista de mesas, botão "O Chefia" |
| 17 | Garçom: Claim + Taxa de Serviço + Comanda | Claim de grupo, toggle taxa, transferência de mesa, comanda rápida |
| 18 | Push Notifications + Escalação de Retirada | Service Worker, push, escalação nível 1 e 2 |
| 19 | Faturamento | Diário, mensal, caixa, taxas de garçom |
| 20 | Dashboard + Desempenho da Equipe | Métricas Redis, alertas, desempenho por garçom/local |
| 21 | Settings + Theming + Dashboard Avançado | Temas, color picker, mapa de mesas, gráficos |
| 22 | Super Admin: Estabelecimentos + Cobrança | CRUD estabelecimentos, plano, pagamentos, layout/sidebar Super Admin |
| 23 | Super Admin: Módulos + Monitoramento | Módulos extras, métricas globais, atividade |
| 24 | Testes E2E + Acessibilidade | Playwright, axe-core, revisão a11y |
| 25 | Performance + Resiliência | Queries, cache, circuit breaker, graceful shutdown |
| 26 | Segurança Avançada + LGPD | Endpoints LGPD, rotação secrets, revisão segurança |
| 27 | Fase 2: Migração AWS | **NÃO IMPLEMENTAR** — referência arquitetural |
| 28+ | Fase 2: Plataforma + Estoque | **NÃO IMPLEMENTAR** — módulos extras pagos |

## Estado Atual

**Sprint P** — Protótipos concluídos. Pendente: validação visual pelo usuário.

## Como Usar

- Para implementar uma sprint, leia `docs/sprints/sprint-XX.md` correspondente.
- Cada arquivo contém: endpoints (se houver), checklist completo, e referências cruzadas para outros docs.
- Sprints 27+ são apenas referência futura — não implementar até aviso explícito.

## Docs por Sprint

Quais docs ler **antes** de implementar cada sprint. Docs marcados com * são opcionais (referência).

| Sprint | Docs obrigatórios | Docs opcionais |
|---|---|---|
| P | design-cliente.md, design-staff.md, design-admin.md, design-superadmin.md, design-system.md, fluxos.md | — |
| 0 | schema.md | deploy.md* |
| 1 | seguranca.md | observabilidade.md* |
| 2 | seguranca.md (auth), schema.md (User/Restaurant), api-endpoints.md (Auth/Restaurant) | observabilidade.md* |
| 3 | schema.md (Table/Sector/PrepLocation), api-endpoints.md (Tables/Sectors/Locations), modulos.md (Estrutura Operacional) | — |
| 4 | design-system.md, design-admin.md | — |
| 5 | api-endpoints.md (Menu/Upload), modulos.md (Cardápio), design-admin.md | seguranca.md (upload)* |
| 6 | api-endpoints.md (Session), seguranca.md (OTP/sessão), modulos.md (Entrada na Mesa), privacidade.md | schema.md* |
| 7 | modulos.md (Aprovação), api-endpoints.md (join/approve) | seguranca.md*, websocket-events.md* (referência — WebSocket implementado na Sprint 12) |
| 8 | design-cliente.md, fluxos.md (Cliente), privacidade.md | — |
| 9 | modulos.md (Grupos de Entrega, Máquina de Estados), api-endpoints.md (Orders) | websocket-events.md* |
| 10 | design-cliente.md (Conta/Carrinho/Pedidos), fluxos.md (Cliente) | — |
| 11 | api-endpoints.md (Payments), seguranca.md (Pix/webhook), modulos.md (Conta e Pagamento) | — |
| 12 | websocket-events.md (tudo), seguranca.md (CSRF) | — |
| 13 | websocket-events.md (KDS), modulos.md (KDS) | — |
| 14 | design-staff.md (KDS), fluxos.md (KDS) | — |
| 15 | api-endpoints.md (Staff/Schedule/DayTeam), modulos.md (Equipe), design-admin.md | — |
| 16 | fluxos.md (Garçom), design-staff.md (Garçom), api-endpoints.md (Shifts/Calls) | seguranca.md (PIN)* |
| 17 | modulos.md (Claim, Taxa, Transferência, Comanda), api-endpoints.md (delivery-groups/claim) | websocket-events.md* |
| 18 | websocket-events.md (push), modulos.md (Escalação) | — |
| 19 | modulos.md (Faturamento), api-endpoints.md (Billing), glossario.md (Ticket Médio) | — |
| 20 | api-endpoints.md (Dashboard/Performance), modulos.md (Dashboard) | — |
| 21 | design-system.md, design-admin.md (Settings) | — |
| 22 | api-endpoints.md (Super Admin Establishments/Billing), design-superadmin.md, fluxos.md (Super Admin) | — |
| 23 | api-endpoints.md (Super Admin Modules/Monitoring), modulos.md (Sistema de Módulos) | — |
| 24 | todos os design-*.md, fluxos.md | — |
| 25 | deploy.md, observabilidade.md | — |
| 26 | seguranca.md (tudo), privacidade.md | — |
