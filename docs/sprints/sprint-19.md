# Sprint 19 — Dashboard + Desempenho da Equipe

**Endpoints (~7):**
- GET `/dashboard/overview` — Métricas gerais em tempo real (dinâmico por Local de Preparo).
- GET `/dashboard/popular-items` — Itens mais vendidos.
- GET `/dashboard/alerts` — Alertas: pedidos atrasados, chamados sem resposta, escalações ativas, mesas ociosas, setores sem garçom atribuído.
- GET `/staff/:id/performance` — Métricas individuais do funcionário por período.
- GET `/staff/performance/summary` — Resumo de desempenho de todos os funcionários.
- GET `/preparation-locations/:id/performance` — Métricas do Local de Preparo por período.
- GET `/staff/pickup-escalations` — Relatório de escalações de retirada por garçom.

**Checklist:**
- [ ] Dashboard: tempo médio de preparo por Local de Preparo (**dinâmico**, baseado nos cadastrados — não fixo), tempo médio de entrega por garçom, mesas ativas. **Métricas pré-calculadas em Redis** (atualizadas por evento, não calculadas a cada request).
- [ ] **Dashboard alertas:** seção de alertas em tempo real — pedidos atrasados (tempo > threshold configurável, default 15min), chamados sem resposta, escalações ativas, mesas ociosas (sem novo pedido há mais de X minutos), setores sem garçom atribuído.
- [ ] Itens populares.
- [ ] **Tela "Desempenho da Equipe":** métricas por garçom (tempo médio de entrega Pronto→Entregue, pedidos atendidos, escalações nível 1 e 2, taxa de serviço acumulada) e por Local de Preparo (tempo médio de preparo Na fila→Pronto, pedidos produzidos, itens mais demorados). Filtro por período (dia/semana/mês). Inclui **relatório de escalações de retirada** por garçom e por período.

**Nota:** métrica de abandono de carrinho movida para Fase 2 (carrinho é localStorage na Fase 1).
