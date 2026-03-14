# Sprint 23 — Super Admin: Módulos + Monitoramento

**Endpoints (~7):**
- GET `/superadmin/modules` — Listar módulos com valor padrão.
- PUT `/superadmin/modules/:moduleId` — Atualizar módulo.
- GET `/superadmin/establishments/:id/modules` — Módulos do estabelecimento.
- PUT `/superadmin/establishments/:id/modules/:moduleId` — Habilitar/desabilitar + valor.
- GET `/superadmin/monitoring/overview` — Métricas globais (total pedidos/mês, mesas ativas, estabelecimentos por status).
- GET `/superadmin/monitoring/establishments` — Métricas de uso por estabelecimento (pedidos/mês, mesas ativas, último acesso). **Paginação:** query `page` e `limit` (default 20, max 100). Ordenável por qualquer métrica.
- GET `/superadmin/monitoring/establishments/:id/activity` — Histórico de atividade de um estabelecimento (últimos acessos, pedidos recentes).

**Checklist:**
- [ ] Sistema de módulos: padrão + extras.
- [ ] Habilitar/desabilitar módulos por estabelecimento.
- [ ] Valor global e override por estabelecimento.
- [ ] Endpoints de monitoramento: métricas globais, métricas por estabelecimento, histórico de atividade.
- [ ] Métricas de uso por estabelecimento (pedidos/mês, mesas ativas).
- [ ] Último acesso de cada estabelecimento.
