# Endpoints da API (RESTful)

Base URL: `/api/v1`

## Health Check
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/health` | Health check básico (API respondendo) — usado pelo nginx (Fase 1) ou ALB (Fase 2) |
| GET | `/health/ready` | Readiness check (banco + Redis conectados) — usado pelo Docker healthcheck (Fase 1) ou ECS (Fase 2) |

## Auth
| Metodo | Rota | Descricao |
|---|---|---|
| POST | `/auth/register` | Registro de restaurante + owner |
| POST | `/auth/login` | Login -> retorna JWT |
| POST | `/auth/refresh` | Refresh token |
| GET | `/auth/me` | Dados do usuário logado |

## Restaurant
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/restaurants/:slug` | Dados públicos do restaurante |
| PUT | `/restaurants/:id` | Atualizar dados (OWNER/MANAGER) |
| GET | `/restaurants/:id/settings` | Configurações |
| PUT | `/restaurants/:id/settings` | Atualizar configurações. Body inclui: `serviceChargePercent` (default 10%), `themeName`, `primaryColor`, `secondaryColor`, `backgroundColor`, `pickupReminderInterval` (default 3min), `pickupEscalationTimeout` (default 10min), `orderDelayThreshold` (default 15min — threshold para alerta de pedido atrasado), `idleTableThreshold` (default 30min — threshold para alerta de mesa ociosa) |

## Tables
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/tables` | Listar mesas do restaurante |
| POST | `/tables` | Criar mesa |
| PUT | `/tables/:id` | Atualizar mesa |
| DELETE | `/tables/:id` | Soft delete de mesa (só se não tiver sessão ativa). Histórico preservado para métricas. Permite recriar mesa com mesmo nome/número |
| POST | `/tables/:id/verify-phone` | Enviar OTP de verificação WhatsApp antes de criar sessão (1º cliente, mesa sem sessão ativa). Body: `{ phone }`. Não requer sessão ativa |
| POST | `/tables/:id/open` | Abrir sessão da mesa. Body: `{ personCount?: number, names?: string[] }`. Requer telefone verificado via `/tables/:id/verify-phone`. Cria sessão + 1º membro. Nomes são opcionais — se não informados, cria pessoas genéricas ("Pessoa 1", "Pessoa 2"...) com base em `personCount`. Pelo menos 1 pessoa é sempre criada |
| POST | `/tables/:id/close` | Fechar sessão (encerrar conta). Pré-condições: não pode ter itens com status `Na fila` ou `Preparando` (cancelar ou aguardar). Itens `Pronto` não entregues geram aviso mas não bloqueiam. Emite evento `client:session-closed` via WebSocket |
| POST | `/tables/:id/force-close` | Forçar fechamento de sessão (OWNER/MANAGER). Body: `{ confirm: true }`. Fecha mesmo com pagamentos pendentes (marca como `CANCELLED`). Registra em AuditLog. Emite `client:session-closed` via WebSocket |
| GET | `/tables/:id/session` | Sessão ativa da mesa |
| PATCH | `/tables/:id/transfer` | Transferir sessão para outra mesa (body: `{ targetTableId }`). Requer JWT de staff (WAITER ou superior). Mesa destino deve estar livre. Move toda a sessão (pessoas, pedidos, conta). Funciona entre setores. KDS atualiza número da mesa automaticamente. WebSocket notifica clientes conectados |

## Table Session (acesso público via token)

> **Fluxo do primeiro acesso:** QR Code gera URL `/{slug}/mesa/{tableId}`. Frontend verifica se mesa tem sessão ativa via `GET /tables/:id/session`. Se não tem, após verificação WhatsApp, chama `POST /tables/:id/open` que cria sessão e retorna token. A partir daí, usa endpoints `/session/:token/*`.

> **Rate limits por cliente (telefone verificado):** `POST /orders` 3/min, `POST /calls` 2/min, `POST /session/:token/people` 5/min.

| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/session/:token` | Dados da sessão (pedidos, conta) |
| POST | `/session/:token/join` | Solicitar entrada em sessão existente. Apenas para mesas com sessão ativa — nunca cria sessão. Cria solicitação pendente de aprovação. **Pré-requisito:** WhatsApp verificado via `/session/:token/phone` + `/session/:token/phone/verify` antes de chamar este endpoint. Retorna erro `SESSION_007` se telefone não verificado. Retorna erro `SESSION_008` se o telefone verificado já está vinculado a outra sessão ativa. **Aprovação:** solicitação de aprovação expira em 5 minutos. Sistema renotifica membros automaticamente a cada 60 segundos. Após expirar, status muda para `EXPIRED` e entrante deve escanear QR Code novamente |
| POST | `/session/:token/phone` | Enviar OTP via WhatsApp para o número informado |
| POST | `/session/:token/phone/verify` | Confirmar OTP e salvar número verificado na sessão |
| GET | `/session/:token/join/pending` | Listar solicitações pendentes de aprovação (visível para membros aprovados) |
| PATCH | `/session/:token/join/:requestId/approve` | Aprovar entrada de novo membro (qualquer membro aprovado pode aprovar) |
| PATCH | `/session/:token/join/:requestId/reject` | Rejeitar entrada de novo membro |
| POST | `/session/:token/join/:requestId/remind` | Reenviar notificação de aprovação para membros da mesa (cooldown 60s) |
| GET | `/session/:token/join/:requestId/status` | Verificar status da solicitação (pending/approved/rejected/expired) — usado por quem está aguardando |
| DELETE | `/session/:token/join/reset-limit` | Resetar contador de re-solicitações de um telefone (staff garçom+). Body: `{ phone }`. Para casos legítimos onde entrante atingiu o limite de 3 tentativas |
| GET | `/session/:token/people` | Listar pessoas cadastradas na sessão |
| POST | `/session/:token/people` | Adicionar pessoa na mesa (body: `{ name }`) |
| PATCH | `/session/:token/people/:personId` | Atualizar nome da pessoa (body: `{ name }`) |
| DELETE | `/session/:token/people/:personId` | Remover pessoa da mesa |
| PATCH | `/session/:token/service-charge` | Toggle taxa de serviço (**requer JWT de staff**, role WAITER ou superior). Body: `{ enabled, personId? }`. Sem `personId` = aplica para todos. Com `personId` = toggle individual por pessoa. Cliente não tem acesso a este endpoint |
| GET | `/session/:token/bill` | Conta detalhada com divisão por pessoa + taxa de serviço |
| GET | `/session/:token/activity-log` | Log de atividade de pedidos e reatribuições. Retorna lista de ações em formato legível (quem pediu, quem modificou, de/para). Visível para todos os membros da mesa |
| GET | `/session/:token/data` | LGPD: retornar todos os dados pessoais da sessão (telefone, nomes). Direito de acesso via telefone verificado |
| DELETE | `/session/:token/data` | LGPD: exclui dados pessoais da sessão (telefone, nomes). Pedidos/pagamentos são anonimizados |

## Locais de Preparo
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/preparation-locations` | Listar locais de preparo do restaurante |
| POST | `/preparation-locations` | Criar local de preparo (gera 1 Ponto de Entrega default automaticamente) |
| PUT | `/preparation-locations/:id` | Atualizar local de preparo |
| DELETE | `/preparation-locations/:id` | Remover local de preparo (somente se não tem produtos vinculados) |

## Pontos de Entrega
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/preparation-locations/:id/pickup-points` | Listar pontos de entrega do local de preparo |
| POST | `/preparation-locations/:id/pickup-points` | Criar ponto de entrega (body: `{ name, autoDelivery?: bool }`) |
| PUT | `/pickup-points/:id` | Atualizar ponto de entrega |
| DELETE | `/pickup-points/:id` | Remover ponto de entrega (somente se não é o único do local e não tem produtos vinculados) |

## Setores
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/sectors` | Listar setores do restaurante (inclui mesas vinculadas) |
| POST | `/sectors` | Criar setor (body: `{ name }`) |
| PUT | `/sectors/:id` | Atualizar setor (nome) |
| DELETE | `/sectors/:id` | Remover setor (somente se não tem mesas vinculadas) |
| PUT | `/sectors/:id/pickup-point-mappings` | Definir mapeamento obrigatório: para cada Local de Preparo, qual Ponto de Entrega (body: `{ mappings: [{ preparationLocationId, pickupPointId }] }`) |
| GET | `/sectors/:id/pickup-point-mappings` | Listar mapeamentos do setor |

## Menu
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/menu/:restaurantSlug` | Cardápio público (com cache Redis) |
| GET | `/menu/categories` | Listar categorias (admin) |
| POST | `/menu/categories` | Criar categoria |
| PUT | `/menu/categories/:id` | Atualizar categoria |
| DELETE | `/menu/categories/:id` | Remover categoria. Bloqueia se tem produtos vinculados (retorna erro `MENU_005`). Admin deve mover ou deletar os produtos antes |
| GET | `/menu/tags` | Listar tags de produto (ex: vegano, sem glúten, picante) |
| POST | `/menu/tags` | Criar tag |
| PUT | `/menu/tags/:id` | Atualizar tag |
| DELETE | `/menu/tags/:id` | Remover tag. Se tem produtos vinculados, exige confirmação (`confirm: true` no body). Remove vínculo com produtos (produtos continuam sem a tag) |
| GET | `/menu/products` | Listar produtos (admin) |
| POST | `/menu/products` | Criar produto (inclui `pickupPointId` ou `destination: 'waiter'` — **mutuamente exclusivos**, enviar exatamente um; `immediateDelivery?: bool`, e `tagIds[]`). Retorna erro `MENU_004` se ambos ou nenhum for informado |
| PUT | `/menu/products/:id` | Atualizar produto |
| PATCH | `/menu/products/:id/availability` | Toggle disponibilidade. Pedidos já existentes (`QUEUED`, `PREPARING`, `READY`) não são afetados — KDS continua exibindo e cliente continua vendo na conta. O toggle só impede novos pedidos. Se não há como preparar um item já pedido, o staff cancela manualmente |
| DELETE | `/menu/products/:id` | Soft delete de produto. Só permitido se não há itens em pedidos ativos (`QUEUED` ou `PREPARING`). Requer JWT de staff (MANAGER+) |

## Upload (Imagens)
| Metodo | Rota | Descricao |
|---|---|---|
| POST | `/upload/product-images` | Upload de imagens de produto (multipart, max 5 por request) |
| DELETE | `/upload/product-images/:imageId` | Remover imagem de produto |

## Orders
| Metodo | Rota | Descricao |
|---|---|---|
| POST | `/orders` | Criar pedido (via sessão token). Cada item inclui `personIds[]` (obrigatório, pelo menos 1) e `notes?: string` (observações do cliente, ex: "bem passado", "sem cebola" — exibidas no KDS). O pedido gera até 3 grupos de entrega: itens normais (garçom notificado quando todos ficarem prontos), itens `immediateDelivery` (notificado quando todos os imediatos ficarem prontos), itens destino "Garçom" (entrega direta). Internamente, itens são roteados para o KDS do Local de Preparo correspondente. Retorna erro se mapeamento Setor ↔ Local de Preparo estiver incompleto para algum item do pedido |
| GET | `/orders` | Listar pedidos (admin, filtros). **Paginação:** query `page` e `limit` (default 20, max 100). Retorna `{ data, total, page, totalPages }` |
| GET | `/orders/:id` | Detalhes do pedido |
| PATCH | `/orders/:id/cancel` | Cancelar pedido inteiro (somente se todos os itens estão `Na fila`). Requer JWT de staff (WAITER ou superior). Body: `{ reason?: string }`. Registra cancelamento no activity log |
| PATCH | `/orders/items/:id/status` | Atualizar status de item individual |
| PATCH | `/orders/items/:id/cancel` | Cancelar item individual. Cliente pode cancelar próprios itens se `Na fila`. Staff (WAITER ou superior) pode cancelar se `Na fila` ou `Preparando`. Body: `{ reason?: string }`. Registra no activity log. Itens cancelados são removidos do cálculo da conta |
| PATCH | `/orders/:id/delivery-groups/:group/claim` | Garçom assume retirada do grupo de entrega inteiro (body: `{ staffId, escalation?: boolean }`). `group` = `normal` ou `immediate`. Registra `claimedByStaffId` em todos os itens do grupo, emite `waiter:pickup-claimed` para remover da tela dos outros garçons. Claim normal rejeita se já houver claim ativo (retorna 409 com `ORDER_004`). Durante escalação nível 2 (quando o grupo está marcado como escalado pelo sistema), aceita override com `escalation: true` |
| PATCH | `/orders/items/:id/people` | Reatribuir pessoas a um item (body: `{ personIds[] }`). Bloqueia reatribuição se qualquer pessoa já tem Payment CONFIRMED que inclua o item |

## Payments
| Metodo | Rota | Descricao |
|---|---|---|
| POST | `/payments` | Iniciar pagamento individual por pessoa (body: `{ sessionToken, personId, method: 'PIX' \| 'CASH' \| 'CARD_DEBIT' \| 'CARD_CREDIT' }`). PIX gera QR Code automaticamente. CASH e CARD_DEBIT/CARD_CREDIT são registro manual pelo garçom/caixa após receber pagamento físico |
| GET | `/payments/:id/status` | Verificar status do pagamento (inclui método utilizado) |
| POST | `/payments/pix/webhook` | Webhook de confirmação Pix. Validação de assinatura síncrona (retorna 400 se inválida). Só enfileira no Bull após validação. Idempotency via campo `externalId` do provedor (ignora duplicatas) |
| GET | `/payments/session/:token` | Listar pagamentos da sessão (quem já pagou, quem falta, método utilizado por cada pagamento) |

## LGPD
| Metodo | Rota | Descricao |
|---|---|---|
| POST | `/lgpd/verify` | Enviar OTP de verificação para o telefone (primeiro passo para acesso a dados LGPD) |
| GET | `/lgpd/data?phone=X&otp=Y` | Retorna todos os dados pessoais vinculados ao telefone após OTP verificado. Direito de acesso LGPD |

## Call Requests
| Metodo | Rota | Descricao |
|---|---|---|
| POST | `/calls` | Criar chamado (cliente) |
| GET | `/calls` | Listar chamados abertos (garçom) |
| PATCH | `/calls/:id/resolve` | Garçom resolveu |

## Stock (Fase 2 — NÃO IMPLEMENTAR)
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/stock/ingredients` | Listar ingredientes |
| POST | `/stock/ingredients` | Criar ingrediente |
| PUT | `/stock/ingredients/:id` | Atualizar estoque |
| GET | `/stock/alerts` | Ingredientes abaixo do mínimo |

## Dashboard
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/dashboard/overview` | Métricas gerais em tempo real: tempo médio de preparo por Local de Preparo (dinâmico), tempo médio de entrega por garçom, mesas ativas |
| GET | `/dashboard/popular-items` | Itens mais vendidos |
| GET | `/dashboard/alerts` | Alertas em tempo real: pedidos atrasados (tempo na fila > threshold configurável, default 15min), chamados sem resposta, escalações ativas, mesas ociosas (sem novo pedido há mais de X minutos), setores sem garçom atribuído |

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
| GET | `/billing/daily` | Faturamento do dia (receita, pedidos, ticket médio, comparativo). Query: `date` (YYYY-MM-DD, default = hoje) |
| GET | `/billing/monthly` | Faturamento mensal (receita acumulada, gráfico por dia, comparativo). Query: `month` (YYYY-MM, default = mês atual) |
| GET | `/billing/cashier` | Fechamento de caixa (valores por forma de pagamento). Query: `date` (YYYY-MM-DD, default = hoje) |
| GET | `/billing/waiter-fees` | Taxas de garçom por período (query: `from`, `to`) — valor devido a cada garçom |

## Staff
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/staff` | Listar funcionários. **Paginação:** query `page` e `limit` (default 50, max 100) |
| POST | `/staff` | Criar funcionário (body inclui `temporary: bool`, `fixedWeekdays?: number[]`, `pin: string` senha numérica para garçom) |
| POST | `/staff/invite` | Enviar convite via WhatsApp (mesma infra do OTP). Gera link com token UUID v4, expira em 72h. Link enviado via WhatsApp pelo admin. Em dev, log no console |
| POST | `/staff/accept` | Aceitar convite e criar conta (público). Body: `{ token, name, password, pin? }`. Senha obrigatória para todos. PIN obrigatório se role WAITER |
| PUT | `/staff/:id` | Atualizar funcionário |
| DELETE | `/staff/:id` | Desativar funcionário |
| POST | `/staff/:id/reset-pin` | Reseta PIN do funcionário. Requer JWT de OWNER/MANAGER. Garçom deve definir novo PIN no próximo clock-in |

## Turno do Garçom (Clock-in/out)
| Metodo | Rota | Descricao |
|---|---|---|
| POST | `/shifts/clock-in` | Garçom inicia turno (body: `{ staffId, pin }`) — salva hora de início |
| POST | `/shifts/clock-out` | Garçom encerra turno (body: `{ staffId, pin }`) — salva hora de fim |
| GET | `/shifts` | Listar turnos por período (query: `from`, `to`, `staffId?`) |
| GET | `/shifts/active` | Garçons com turno ativo no momento |

## Escala (Programação de Equipe)
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/schedule` | Listar escala por período (query: `from`, `to`) |
| GET | `/schedule/:date` | Retorna a programação para a data: quem deveria trabalhar (baseado em escala cadastrada e dias fixos) |

## Equipe do Dia
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/day-team/:date` | Retorna a equipe real do dia: funcionários presentes com atribuições de setor. Auto-preenchido a partir da programação, com ajustes manuais |
| PUT | `/day-team/:date` | Definir equipe do dia (body: `{ staffIds[] }`) |
| PATCH | `/day-team/:date/sectors` | Sobrescreve atribuições de setor (estado completo do dia). Body: `{ assignments: [{ staffId, sectorIds[] }] }` |

## Tables — Setor
> **Nota:** Cada mesa pertence a exatamente 1 setor. O campo `sectorId` é obrigatório na criação/atualização da mesa. Ver seção Setores para CRUD de setores.

## KDS
O KDS requer autenticação de funcionário (role KITCHEN). Acessado via URL com parâmetro do Local de Preparo: `/kds?location={preparationLocationId}`. Se não informado, exibe tela de seleção. O operador pode acessar qualquer Local de Preparo do restaurante.

## Super Admin — Estabelecimentos (role: SUPER_ADMIN)
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/superadmin/establishments` | Listar todos os estabelecimentos (com filtros: status, inadimplente). **Paginação:** query `page` e `limit` (default 20, max 100) |
| POST | `/superadmin/establishments` | Cadastrar novo estabelecimento (nome, slug, CNPJ, responsável, email, telefone) |
| GET | `/superadmin/establishments/:id` | Detalhes do estabelecimento |
| PUT | `/superadmin/establishments/:id` | Atualizar dados do estabelecimento |
| PATCH | `/superadmin/establishments/:id/status` | Alterar status (ativo, suspenso) |

## Super Admin — Cobrança (role: SUPER_ADMIN)
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/superadmin/establishments/:id/billing` | Histórico de cobranças/pagamentos do estabelecimento |
| PUT | `/superadmin/establishments/:id/billing/plan` | Definir valor do plano base (body: `{ amount }`) |
| POST | `/superadmin/establishments/:id/billing/payments` | Registrar pagamento mensal (body: `{ month, year, status, amount }`) |
| PATCH | `/superadmin/establishments/:id/billing/payments/:paymentId` | Atualizar status de pagamento (pago, pendente, atrasado) |

## Super Admin — Monitoramento (role: SUPER_ADMIN)
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/superadmin/monitoring/overview` | Métricas globais da plataforma (total pedidos/mês, mesas ativas, estabelecimentos por status) |
| GET | `/superadmin/monitoring/establishments` | Métricas de uso por estabelecimento (pedidos/mês, mesas ativas, último acesso). **Paginação:** query `page` e `limit` (default 20, max 100). Ordenável por qualquer métrica |
| GET | `/superadmin/monitoring/establishments/:id/activity` | Histórico de atividade de um estabelecimento (últimos acessos, pedidos recentes) |

## Super Admin — Módulos (role: SUPER_ADMIN)
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/superadmin/modules` | Listar todos os módulos disponíveis com valor padrão |
| PUT | `/superadmin/modules/:moduleId` | Atualizar módulo (nome, descrição, valor padrão) |
| GET | `/superadmin/establishments/:id/modules` | Listar módulos do estabelecimento (habilitados/desabilitados) |
| PUT | `/superadmin/establishments/:id/modules/:moduleId` | Habilitar/desabilitar módulo + definir valor override (body: `{ enabled, customAmount? }`) |
