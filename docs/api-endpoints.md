# Endpoints da API (RESTful)

Base URL: `/api/v1`

## Health Check
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/health` | Health check basico (API respondendo) — usado pelo nginx (Fase 1) ou ALB (Fase 2) |
| GET | `/health/ready` | Readiness check (banco + Redis conectados) — usado pelo Docker healthcheck (Fase 1) ou ECS (Fase 2) |

## Auth
| Metodo | Rota | Descricao |
|---|---|---|
| POST | `/auth/register` | Registro de restaurante + owner |
| POST | `/auth/login` | Login -> retorna JWT |
| POST | `/auth/refresh` | Refresh token |
| GET | `/auth/me` | Dados do usuario logado |

## Restaurant
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/restaurants/:slug` | Dados publicos do restaurante |
| PUT | `/restaurants/:id` | Atualizar dados (OWNER/MANAGER) |
| GET | `/restaurants/:id/settings` | Configuracoes |
| PUT | `/restaurants/:id/settings` | Atualizar configuracoes |

## Tables
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/tables` | Listar mesas do restaurante |
| POST | `/tables` | Criar mesa |
| PUT | `/tables/:id` | Atualizar mesa |
| DELETE | `/tables/:id` | Soft delete de mesa (só se não tiver sessão ativa). Histórico preservado para métricas. Permite recriar mesa com mesmo nome/número |
| POST | `/tables/:id/open` | Abrir sessao da mesa |
| POST | `/tables/:id/close` | Fechar sessao (encerrar conta) |
| GET | `/tables/:id/session` | Sessao ativa da mesa |

## Table Session (acesso publico via token)
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/session/:token` | Dados da sessao (pedidos, conta) |
| POST | `/session/:token/join` | Solicitar entrada na sessao. Se mesa sem sessao, cria sessao (primeiro cliente). Se mesa com sessao ativa, cria solicitacao pendente de aprovacao. Requer WhatsApp verificado |
| POST | `/session/:token/phone` | Enviar OTP via WhatsApp para o numero informado |
| POST | `/session/:token/phone/verify` | Confirmar OTP e salvar numero verificado na sessao |
| GET | `/session/:token/join/pending` | Listar solicitacoes pendentes de aprovacao (visivel para membros aprovados) |
| PATCH | `/session/:token/join/:requestId/approve` | Aprovar entrada de novo membro (qualquer membro aprovado pode aprovar) |
| PATCH | `/session/:token/join/:requestId/reject` | Rejeitar entrada de novo membro |
| POST | `/session/:token/join/:requestId/remind` | Reenviar notificacao de aprovacao para membros da mesa (cooldown 60s) |
| GET | `/session/:token/join/:requestId/status` | Verificar status da solicitacao (pending/approved/rejected) — usado por quem esta aguardando |
| GET | `/session/:token/people` | Listar pessoas cadastradas na sessao |
| POST | `/session/:token/people` | Adicionar pessoa na mesa (body: `{ name }`) |
| DELETE | `/session/:token/people/:personId` | Remover pessoa da mesa |
| PATCH | `/session/:token/service-charge` | Toggle taxa de serviço (garçom only). Body: `{ enabled, personId? }`. Sem `personId` = aplica para todos. Com `personId` = toggle individual por pessoa |
| GET | `/session/:token/bill` | Conta detalhada com divisao por pessoa + taxa de servico |
| GET | `/session/:token/activity-log` | Log de atividade de pedidos e reatribuicoes. Retorna lista de acoes em formato legivel (quem pediu, quem modificou, de/para). Visivel para todos os membros da mesa |
| DELETE | `/session/:token/data` | LGPD: exclui dados pessoais da sessao (telefone, nomes). Pedidos/pagamentos sao anonimizados |

## Locais de Preparo
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/preparation-locations` | Listar locais de preparo do restaurante |
| POST | `/preparation-locations` | Criar local de preparo (gera 1 Ponto de Entrega default automaticamente) |
| PUT | `/preparation-locations/:id` | Atualizar local de preparo |
| DELETE | `/preparation-locations/:id` | Remover local de preparo (somente se nao tem produtos vinculados) |

## Pontos de Entrega
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/preparation-locations/:id/pickup-points` | Listar pontos de entrega do local de preparo |
| POST | `/preparation-locations/:id/pickup-points` | Criar ponto de entrega (body: `{ name, autoDelivery?: bool }`) |
| PUT | `/pickup-points/:id` | Atualizar ponto de entrega |
| DELETE | `/pickup-points/:id` | Remover ponto de entrega (somente se nao e o unico do local e nao tem produtos vinculados) |

## Setores
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/sectors` | Listar setores do restaurante (inclui mesas vinculadas) |
| POST | `/sectors` | Criar setor (body: `{ name }`) |
| PUT | `/sectors/:id` | Atualizar setor (nome) |
| DELETE | `/sectors/:id` | Remover setor (somente se nao tem mesas vinculadas) |
| PUT | `/sectors/:id/pickup-point-mappings` | Definir mapeamento obrigatorio: para cada Local de Preparo, qual Ponto de Entrega (body: `{ mappings: [{ preparationLocationId, pickupPointId }] }`) |
| GET | `/sectors/:id/pickup-point-mappings` | Listar mapeamentos do setor |

## Menu
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/menu/:restaurantSlug` | Cardapio publico (com cache Redis) |
| GET | `/menu/categories` | Listar categorias (admin) |
| POST | `/menu/categories` | Criar categoria |
| PUT | `/menu/categories/:id` | Atualizar categoria |
| DELETE | `/menu/categories/:id` | Remover categoria |
| GET | `/menu/tags` | Listar tags de produto (ex: vegano, sem gluten, picante) |
| POST | `/menu/tags` | Criar tag |
| PUT | `/menu/tags/:id` | Atualizar tag |
| DELETE | `/menu/tags/:id` | Remover tag |
| GET | `/menu/products` | Listar produtos (admin) |
| POST | `/menu/products` | Criar produto (inclui `pickupPointId` ou `destination: 'waiter'`, `immediateDelivery?: bool`, e `tagIds[]`) |
| PUT | `/menu/products/:id` | Atualizar produto |
| PATCH | `/menu/products/:id/availability` | Toggle disponibilidade |

## Upload (Imagens)
| Metodo | Rota | Descricao |
|---|---|---|
| POST | `/upload/product-images` | Upload de imagens de produto (multipart, max 5 por request) |
| DELETE | `/upload/product-images/:imageId` | Remover imagem de produto |

## Orders
| Metodo | Rota | Descricao |
|---|---|---|
| POST | `/orders` | Criar pedido (via sessao token). Cada item inclui `personIds[]` (obrigatorio, pelo menos 1). O pedido gera até 3 grupos de entrega: itens normais (garçom notificado quando todos ficarem prontos), itens `immediateDelivery` (notificado quando todos os imediatos ficarem prontos), itens destino "Garçom" (entrega direta). Internamente, itens são roteados para o KDS do Local de Preparo correspondente |
| GET | `/orders` | Listar pedidos (admin, filtros). **Paginacao:** query `page` e `limit` (default 20, max 100). Retorna `{ data, total, page, totalPages }` |
| GET | `/orders/:id` | Detalhes do pedido |
| PATCH | `/orders/:id/status` | Atualizar status (KDS/garcom) |
| PATCH | `/orders/items/:id/status` | Atualizar status de item individual |
| PATCH | `/orders/items/:id/claim` | Garçom assume retirada do item pronto (body: `{ staffId }`). Registra `claimedByStaffId`, emite `waiter:pickup-claimed` para remover da tela dos outros garçons |
| PATCH | `/orders/items/:id/people` | Reatribuir pessoas a um item (body: `{ personIds[] }`) |

## Payments
| Metodo | Rota | Descricao |
|---|---|---|
| POST | `/payments` | Iniciar pagamento individual por pessoa (body: `{ sessionToken, personId }`) |
| GET | `/payments/:id/status` | Verificar status |
| POST | `/payments/pix/webhook` | Webhook de confirmacao Pix |
| GET | `/payments/session/:token` | Listar pagamentos da sessao (quem ja pagou, quem falta) |

## Call Requests
| Metodo | Rota | Descricao |
|---|---|---|
| POST | `/calls` | Criar chamado (cliente) |
| GET | `/calls` | Listar chamados abertos (garcom) |
| PATCH | `/calls/:id/resolve` | Garcom resolveu |

## Stock (Fase 2 — NAO IMPLEMENTAR)
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/stock/ingredients` | Listar ingredientes |
| POST | `/stock/ingredients` | Criar ingrediente |
| PUT | `/stock/ingredients/:id` | Atualizar estoque |
| GET | `/stock/alerts` | Ingredientes abaixo do minimo |

## Dashboard
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/dashboard/overview` | Métricas gerais em tempo real: tempo médio de preparo por Local de Preparo (dinâmico), tempo médio de entrega por garçom, mesas ativas |
| GET | `/dashboard/popular-items` | Itens mais vendidos |
| GET | `/dashboard/alerts` | Alertas em tempo real: pedidos atrasados, chamados sem resposta, escalações ativas, mesas ociosas (sem novo pedido há mais de X minutos), mesas sem setor, setores sem garçom atribuído |

## Desempenho da Equipe
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/staff/:id/performance` | Métricas individuais do funcionário por período (query: `from`, `to`). Garçom: tempo médio de entrega, pedidos atendidos, escalações. Cozinha: tempo médio de preparo, pedidos produzidos |
| GET | `/staff/performance/summary` | Resumo de desempenho de todos os funcionários no período (query: `from`, `to`). Ranking por métricas |
| GET | `/preparation-locations/:id/performance` | Métricas do Local de Preparo por período (query: `from`, `to`). Tempo médio de preparo, pedidos, itens mais demorados |
| GET | `/staff/pickup-escalations` | Relatório de escalações de retirada por garçom (query: `from`, `to`, `staffId?`). Retorna contagem de escalações nível 1 e nível 2 por garçom no período |

## Faturamento
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/billing/daily` | Faturamento do dia (receita, pedidos, ticket medio, comparativo) |
| GET | `/billing/monthly` | Faturamento mensal (receita acumulada, grafico por dia, comparativo) |
| GET | `/billing/cashier` | Fechamento de caixa (valores por forma de pagamento) |
| GET | `/billing/waiter-fees` | Taxas de garcom por periodo (query: `from`, `to`) — valor devido a cada garcom |

## Staff
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/staff` | Listar funcionarios. **Paginacao:** query `page` e `limit` (default 50, max 100) |
| POST | `/staff` | Criar funcionario (body inclui `temporary: bool`, `fixedWeekdays?: number[]`, `pin: string` senha numerica para garcom) |
| POST | `/staff/invite` | Enviar convite (log no console em dev) |
| POST | `/staff/accept` | Aceitar convite e criar conta (publico) |
| PUT | `/staff/:id` | Atualizar funcionario |
| DELETE | `/staff/:id` | Desativar funcionario |

## Turno do Garcom (Clock-in/out)
| Metodo | Rota | Descricao |
|---|---|---|
| POST | `/shifts/clock-in` | Garcom inicia turno (body: `{ staffId, pin }`) — salva hora de inicio |
| POST | `/shifts/clock-out` | Garcom encerra turno (body: `{ staffId, pin }`) — salva hora de fim |
| GET | `/shifts` | Listar turnos por periodo (query: `from`, `to`, `staffId?`) |
| GET | `/shifts/active` | Garcons com turno ativo no momento |

## Escala (Programacao de Equipe)
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/schedule` | Listar escala por periodo (query: `from`, `to`) |
| GET | `/schedule/day/:date` | Equipe do dia (auto-preenchido + ajustes manuais) |
| PUT | `/schedule/day/:date` | Definir equipe do dia (body: `{ staffIds[] }`) |
| PATCH | `/schedule/day/:date/sectors` | Atribuir setores aos garcons do dia (body: `{ assignments: [{ staffId, sectorIds[] }] }`) |

## Tables — Setor
> **Nota:** Cada mesa pertence a exatamente 1 setor. O campo `sectorId` e obrigatorio na criacao/atualizacao da mesa. Ver secao Setores para CRUD de setores.

## Super Admin — Estabelecimentos (role: SUPER_ADMIN)
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/superadmin/establishments` | Listar todos os estabelecimentos (com filtros: status, inadimplente). **Paginacao:** query `page` e `limit` (default 20, max 100) |
| POST | `/superadmin/establishments` | Cadastrar novo estabelecimento (nome, slug, CNPJ, responsavel, email, telefone) |
| GET | `/superadmin/establishments/:id` | Detalhes do estabelecimento |
| PUT | `/superadmin/establishments/:id` | Atualizar dados do estabelecimento |
| PATCH | `/superadmin/establishments/:id/status` | Alterar status (ativo, suspenso) |

## Super Admin — Cobranca (role: SUPER_ADMIN)
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/superadmin/establishments/:id/billing` | Historico de cobrancas/pagamentos do estabelecimento |
| PUT | `/superadmin/establishments/:id/billing/plan` | Definir valor do plano base (body: `{ amount }`) |
| POST | `/superadmin/establishments/:id/billing/payments` | Registrar pagamento mensal (body: `{ month, year, status, amount }`) |
| PATCH | `/superadmin/establishments/:id/billing/payments/:paymentId` | Atualizar status de pagamento (pago, pendente, atrasado) |

## Super Admin — Monitoramento (role: SUPER_ADMIN)
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/superadmin/monitoring/overview` | Metricas globais da plataforma (total pedidos/mes, mesas ativas, estabelecimentos por status) |
| GET | `/superadmin/monitoring/establishments` | Metricas de uso por estabelecimento (pedidos/mes, mesas ativas, ultimo acesso). **Paginacao:** query `page` e `limit` (default 20, max 100). Ordenavel por qualquer metrica |
| GET | `/superadmin/monitoring/establishments/:id/activity` | Historico de atividade de um estabelecimento (ultimos acessos, pedidos recentes) |

## Super Admin — Modulos (role: SUPER_ADMIN)
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/superadmin/modules` | Listar todos os modulos disponiveis com valor padrao |
| PUT | `/superadmin/modules/:moduleId` | Atualizar modulo (nome, descricao, valor padrao) |
| GET | `/superadmin/establishments/:id/modules` | Listar modulos do estabelecimento (habilitados/desabilitados) |
| PUT | `/superadmin/establishments/:id/modules/:moduleId` | Habilitar/desabilitar modulo + definir valor override (body: `{ enabled, customAmount? }`) |
