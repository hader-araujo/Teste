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
| 5 | Menu CRUD Backend | Backend: cardápio, categorias, tags, produtos (sem upload) |
| 6 | Upload de Imagens + Frontend Cardápio Admin | StorageService, Sharp resize, validação MIME, frontend admin cardápio |
| 7 | Sessão de Mesa + WhatsApp OTP + Pessoas | Backend: sessão via token, OTP, CRUD pessoas, unicidade telefone |
| 8 | Aprovação de Entrantes + Cache Cardápio | Backend: aprovação de novos membros, timeout, cache Redis cardápio |
| 9 | Frontend Cliente: WhatsApp + Cardápio + Pessoas | Frontend: fluxo QR Code, read-only, WhatsApp, pessoas, aprovação |
| 10 | Pedidos Backend + Grupos de Entrega | Backend: pedidos, grupos de entrega, cancelamento, fila |
| 11 | Frontend Carrinho + Pedidos + Conta | Frontend: carrinho, meus pedidos, conta com 3 abas, reatribuição |
| 12 | Pagamento (Pix + Dinheiro + Cartão) | Backend+frontend: Pix, CASH/CARD com confirmação staff, webhook, circuit breaker |
| 13 | WebSocket Gateway + Infraestrutura Real-Time | Socket.IO, Redis Adapter, rooms, rate limit, indicador de conexão |
| 14 | WebSocket Eventos + Push Notifications Base | Todos os eventos client/server/KDS/garçom/admin, migração polling→WS |
| 15 | KDS Backend + WebSocket Avançado | Roteamento KDS, deduplicação, backpressure, cleanup rooms |
| 16 | KDS Frontend | Dark mode, temporizadores, cores de status, foto do prato |
| 17 | Staff + Escala + Equipe do Dia | CRUD funcionários, escala, atribuição de setores |
| 18 | Garçom: Clock-in + Chamados + Mesas | Turno, chamados, lista de mesas, botão "O Chefia" |
| 19 | Garçom: Claim + Taxa de Serviço + Comanda | Claim de grupo, toggle taxa, transferência de mesa, comanda rápida |
| 20 | Push Notifications + Escalação de Retirada | Service Worker, push, escalação nível 1 e 2 |
| 21 | Faturamento | Diário, mensal, caixa, taxas de garçom |
| 22 | Dashboard + Desempenho da Equipe | Métricas Redis, alertas, desempenho por garçom/local |
| 23 | Settings + Theming + Dashboard Avançado | Temas, color picker, mapa de mesas, gráficos |
| 24 | Super Admin: Estabelecimentos + Cobrança | CRUD estabelecimentos, plano, pagamentos, layout/sidebar Super Admin |
| 25 | Super Admin: Módulos + Monitoramento | Módulos extras, métricas globais, atividade |
| 26 | Testes E2E + Acessibilidade | Playwright, axe-core, revisão a11y |
| 27 | Performance + Resiliência | Queries, cache, circuit breaker, graceful shutdown |
| 28 | Segurança Avançada + LGPD | Endpoints LGPD, rotação secrets, revisão segurança |
| 29 | Fase 2: Migração AWS | **NÃO IMPLEMENTAR** — referência arquitetural |
| 30+ | Fase 2: Plataforma + Estoque | **NÃO IMPLEMENTAR** — módulos extras pagos |

## Estado Atual

**Sprint P** — Protótipos concluídos. Pendente: validação visual pelo usuário.

## Como Usar

- Para implementar uma sprint, leia `docs/sprints/sprint-XX.md` correspondente.
- Cada arquivo contém: endpoints (se houver), checklist completo, e referências cruzadas para outros docs.
- Sprints 29+ são apenas referência futura — não implementar até aviso explícito.

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
| 5 | api-endpoints.md (Menu), modulos.md (Cardápio) | — |
| 6 | api-endpoints.md (Upload), modulos.md (Upload de imagens, Storage), design-admin.md | seguranca.md (upload)* |
| 7 | api-endpoints.md (Session), seguranca.md (OTP/sessão), modulos.md (Entrada na Mesa), privacidade.md | schema.md* |
| 8 | modulos.md (Aprovação), api-endpoints.md (join/approve) | seguranca.md*, websocket-events.md* (referência — WebSocket implementado na Sprint 13) |
| 9 | design-cliente.md, fluxos.md (Cliente), privacidade.md | — |
| 10 | modulos.md (Grupos de Entrega, Máquina de Estados), api-endpoints.md (Orders) | websocket-events.md* |
| 11 | design-cliente.md (Conta/Carrinho/Pedidos), fluxos.md (Cliente) | — |
| 12 | api-endpoints.md (Payments), seguranca.md (Pix/webhook), modulos.md (Conta e Pagamento) | — |
| 13 | websocket-events.md (infraestrutura), seguranca.md (CSRF, WebSocket auth) | — |
| 14 | websocket-events.md (todos os eventos), modulos.md | — |
| 15 | websocket-events.md (KDS), modulos.md (KDS) | — |
| 16 | design-staff.md (KDS), fluxos.md (KDS) | — |
| 17 | api-endpoints.md (Staff/Schedule/DayTeam), modulos.md (Equipe), design-admin.md | — |
| 18 | fluxos.md (Garçom), design-staff.md (Garçom), api-endpoints.md (Shifts/Calls) | seguranca.md (PIN)* |
| 19 | modulos.md (Claim, Taxa, Transferência, Comanda), api-endpoints.md (delivery-groups/claim) | websocket-events.md* |
| 20 | websocket-events.md (push), modulos.md (Escalação) | — |
| 21 | modulos.md (Faturamento), api-endpoints.md (Billing), glossario.md (Ticket Médio) | — |
| 22 | api-endpoints.md (Dashboard/Performance), modulos.md (Dashboard) | — |
| 23 | design-system.md, design-admin.md (Settings) | — |
| 24 | api-endpoints.md (Super Admin Establishments/Billing), design-superadmin.md, fluxos.md (Super Admin) | — |
| 25 | api-endpoints.md (Super Admin Modules/Monitoring), modulos.md (Sistema de Módulos) | — |
| 26 | todos os design-*.md, fluxos.md | — |
| 27 | deploy.md, observabilidade.md | — |
| 28 | seguranca.md (tudo), privacidade.md, api-endpoints.md (LGPD) | — |
