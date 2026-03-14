# Sprint 22 — Super Admin: Estabelecimentos + Cobrança

**Endpoints (~9):**
- GET `/superadmin/establishments` — Listar todos (com filtros). **Paginação:** query `page` e `limit` (default 20, max 100).
- POST `/superadmin/establishments` — Cadastrar novo.
- GET `/superadmin/establishments/:id` — Detalhes.
- PUT `/superadmin/establishments/:id` — Atualizar.
- PATCH `/superadmin/establishments/:id/status` — Alterar status.
- GET `/superadmin/establishments/:id/billing` — Histórico de cobranças.
- PUT `/superadmin/establishments/:id/billing/plan` — Definir valor do plano.
- POST `/superadmin/establishments/:id/billing/payments` — Registrar pagamento.
- PATCH `/superadmin/establishments/:id/billing/payments/:paymentId` — Atualizar status.

**Checklist:**
- [ ] Role SUPER_ADMIN no sistema de auth.
- [ ] CRUD de estabelecimentos (nome, slug, CNPJ, responsável, email, telefone).
- [ ] Suspensão de estabelecimentos.
- [ ] Sistema de cobrança: valor do plano, registro de pagamentos, status.
- [ ] Painel `/superadmin` com listagem, filtros, indicadores de inadimplência.
- [ ] **Layout/sidebar do Super Admin** (branding OChefia, cor indigo — diferente do admin).
- [ ] Seed com usuário SUPER_ADMIN.
