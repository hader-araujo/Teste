# Super Admin — Protótipos HTML (Sprint P)

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Criar as 8 telas do Super Admin como protótipos HTML estáticos, completando o Sprint P.

**Architecture:** Mesmo padrão dos protótipos existentes — HTML puro + CSS compartilhado (`style.css`) + JS vanilla (`app.js`). Layout reutiliza a estrutura admin-layout/sidebar existente, mas com classes próprias (`.superadmin-sidebar`, `.btn-indigo`) e cores indigo em vez de orange. Dados mock hardcoded no `app.js`.

**Tech Stack:** HTML, CSS (custom properties), JavaScript vanilla, dados mock hardcoded

---

### Task 1: Atualizar docs/sprints.md — adicionar monitoramento.html

**Files:**
- Modify: `docs/sprints.md` (seção Sprint P)

**Step 1: Adicionar monitoramento.html na estrutura e checklist**

Na seção de estrutura do Sprint P, adicionar dentro de `superadmin/`:
```
    └── monitoramento.html          <- Métricas de uso, últimos acessos, pedidos/mês por estabelecimento
```

Na checklist do Sprint P, atualizar o item de telas do Super Admin para incluir monitoramento:
```
- [ ] Telas do **Super Admin** — login -> dashboard (KPIs: total estabelecimentos, ativos, suspensos, inadimplentes) -> listagem de estabelecimentos (com filtros de status e inadimplência, paginação) -> cadastro de novo estabelecimento (nome, slug, CNPJ, responsável, email, telefone) -> detalhe do estabelecimento (dados, status ativo/suspenso, módulos ativos, histórico de cobrança) -> cobrança (valor do plano base, registro de pagamentos mensais, status pago/pendente/atrasado, indicadores de inadimplência) -> módulos (listar módulos disponíveis com valor padrão, habilitar/desabilitar por estabelecimento, valor override) -> monitoramento (métricas de uso por estabelecimento, últimos acessos, pedidos/mês).
```

Adicionar item de interações JS Super Admin para incluir monitoramento:
```
- [ ] Interações JS Super Admin: filtros na listagem, alterar status de estabelecimento, registrar pagamento, toggle de módulos, ordenação por métricas no monitoramento.
```

**Step 2: Commit**

```bash
git add docs/sprints.md
git commit -m "docs: adicionar monitoramento.html ao Sprint P do Super Admin"
```

---

### Task 2: Adicionar dados mock do Super Admin ao app.js

**Files:**
- Modify: `prototypes/js/app.js` (adicionar ao objeto `MOCK`)

**Step 1: Adicionar mock data após a propriedade `themes` do MOCK**

Adicionar as seguintes propriedades ao objeto `MOCK` (antes do `};` que fecha o objeto, após `themes`):

```javascript
  // ---- Super Admin ----
  superadmin: {
    user: { name: 'Admin OChefia', email: 'admin@ochefia.com.br', role: 'SUPER_ADMIN' },

    kpis: {
      totalEstablishments: 24,
      active: 18,
      suspended: 3,
      defaulting: 3
    },

    modules: [
      { id: 1, name: 'Padrão', description: 'Cardápio digital, pedidos, KDS, garçom, mesas, faturamento, dashboard', defaultAmount: 0, type: 'included' },
      { id: 2, name: 'Estoque', description: 'Controle de estoque, ingredientes, baixa automática, alertas de mínimo', defaultAmount: 89.90, type: 'extra' },
      { id: 3, name: 'Explorar', description: 'App consumidor, listagem, reserva, pré-pedido, fidelidade', defaultAmount: 149.90, type: 'extra' },
      { id: 4, name: 'NFC-e/SAT', description: 'Emissão fiscal integrada (NFC-e e SAT)', defaultAmount: 79.90, type: 'extra' }
    ],

    establishments: [
      {
        id: 1, name: 'Zé do Bar', slug: 'ze-bar', cnpj: '12.345.678/0001-90',
        responsible: 'José da Silva', email: 'jose@zebar.com.br', phone: '(11) 99999-0001',
        status: 'active', planAmount: 299.90, city: 'São Paulo — SP',
        lastAccess: '2026-03-09 14:32', ordersMonth: 982, activeTables: 8,
        modules: [1], createdAt: '2025-08-15'
      },
      {
        id: 2, name: 'Cantina da Nonna', slug: 'cantina-nonna', cnpj: '23.456.789/0001-01',
        responsible: 'Maria Rossi', email: 'maria@cantinanonna.com.br', phone: '(11) 98888-0002',
        status: 'active', planAmount: 299.90, city: 'São Paulo — SP',
        lastAccess: '2026-03-09 12:15', ordersMonth: 1245, activeTables: 12,
        modules: [1, 2], createdAt: '2025-09-02'
      },
      {
        id: 3, name: 'Boteco do Chico', slug: 'boteco-chico', cnpj: '34.567.890/0001-12',
        responsible: 'Francisco Almeida', email: 'chico@botecochico.com.br', phone: '(21) 97777-0003',
        status: 'active', planAmount: 299.90, city: 'Rio de Janeiro — RJ',
        lastAccess: '2026-03-08 22:45', ordersMonth: 756, activeTables: 6,
        modules: [1], createdAt: '2025-10-10'
      },
      {
        id: 4, name: 'Sushi Kento', slug: 'sushi-kento', cnpj: '45.678.901/0001-23',
        responsible: 'Kento Yamada', email: 'kento@sushikento.com.br', phone: '(11) 96666-0004',
        status: 'suspended', planAmount: 399.90, city: 'São Paulo — SP',
        lastAccess: '2026-02-20 18:00', ordersMonth: 0, activeTables: 0,
        modules: [1, 2, 4], createdAt: '2025-07-22'
      },
      {
        id: 5, name: 'Churrascaria Fogo Vivo', slug: 'fogo-vivo', cnpj: '56.789.012/0001-34',
        responsible: 'Roberto Santos', email: 'roberto@fogovivo.com.br', phone: '(31) 95555-0005',
        status: 'active', planAmount: 299.90, city: 'Belo Horizonte — MG',
        lastAccess: '2026-03-09 11:00', ordersMonth: 2100, activeTables: 20,
        modules: [1, 2], createdAt: '2025-06-01'
      },
      {
        id: 6, name: 'Pizzaria Bella Massa', slug: 'bella-massa', cnpj: '67.890.123/0001-45',
        responsible: 'Antônio Ferreira', email: 'antonio@bellamassa.com.br', phone: '(41) 94444-0006',
        status: 'active', planAmount: 299.90, city: 'Curitiba — PR',
        lastAccess: '2026-03-09 13:20', ordersMonth: 890, activeTables: 10,
        modules: [1], createdAt: '2025-11-15'
      },
      {
        id: 7, name: 'Açaí da Praia', slug: 'acai-praia', cnpj: '78.901.234/0001-56',
        responsible: 'Camila Souza', email: 'camila@acaipraia.com.br', phone: '(71) 93333-0007',
        status: 'active', planAmount: 199.90, city: 'Salvador — BA',
        lastAccess: '2026-03-09 10:45', ordersMonth: 1580, activeTables: 5,
        modules: [1], createdAt: '2025-12-01'
      },
      {
        id: 8, name: 'Gastrobar 404', slug: 'gastrobar-404', cnpj: '89.012.345/0001-67',
        responsible: 'Lucas Mendes', email: 'lucas@gastrobar404.com.br', phone: '(11) 92222-0008',
        status: 'suspended', planAmount: 399.90, city: 'São Paulo — SP',
        lastAccess: '2026-01-15 20:30', ordersMonth: 0, activeTables: 0,
        modules: [1, 3], createdAt: '2025-08-20'
      },
      {
        id: 9, name: 'Espetaria Brasa & Cia', slug: 'brasa-cia', cnpj: '90.123.456/0001-78',
        responsible: 'Paulo Oliveira', email: 'paulo@brasacia.com.br', phone: '(62) 91111-0009',
        status: 'active', planAmount: 299.90, city: 'Goiânia — GO',
        lastAccess: '2026-03-07 19:00', ordersMonth: 420, activeTables: 7,
        modules: [1], createdAt: '2026-01-10'
      },
      {
        id: 10, name: 'Café & Brunch Studio', slug: 'cafe-brunch', cnpj: '01.234.567/0001-89',
        responsible: 'Ana Clara Lima', email: 'ana@cafebrunch.com.br', phone: '(51) 90000-0010',
        status: 'suspended', planAmount: 199.90, city: 'Porto Alegre — RS',
        lastAccess: '2026-02-28 09:15', ordersMonth: 0, activeTables: 0,
        modules: [1], createdAt: '2026-02-01'
      }
    ],

    payments: [
      { id: 1, establishmentId: 1, month: 3, year: 2026, amount: 299.90, status: 'pending' },
      { id: 2, establishmentId: 1, month: 2, year: 2026, amount: 299.90, status: 'paid' },
      { id: 3, establishmentId: 1, month: 1, year: 2026, amount: 299.90, status: 'paid' },
      { id: 4, establishmentId: 2, month: 3, year: 2026, amount: 389.80, status: 'paid' },
      { id: 5, establishmentId: 2, month: 2, year: 2026, amount: 389.80, status: 'paid' },
      { id: 6, establishmentId: 2, month: 1, year: 2026, amount: 299.90, status: 'paid' },
      { id: 7, establishmentId: 3, month: 3, year: 2026, amount: 299.90, status: 'overdue' },
      { id: 8, establishmentId: 3, month: 2, year: 2026, amount: 299.90, status: 'paid' },
      { id: 9, establishmentId: 4, month: 3, year: 2026, amount: 469.70, status: 'overdue' },
      { id: 10, establishmentId: 4, month: 2, year: 2026, amount: 469.70, status: 'overdue' },
      { id: 11, establishmentId: 5, month: 3, year: 2026, amount: 389.80, status: 'paid' },
      { id: 12, establishmentId: 5, month: 2, year: 2026, amount: 389.80, status: 'paid' },
      { id: 13, establishmentId: 6, month: 3, year: 2026, amount: 299.90, status: 'pending' },
      { id: 14, establishmentId: 7, month: 3, year: 2026, amount: 199.90, status: 'paid' },
      { id: 15, establishmentId: 8, month: 3, year: 2026, amount: 549.80, status: 'overdue' },
      { id: 16, establishmentId: 8, month: 2, year: 2026, amount: 549.80, status: 'overdue' },
      { id: 17, establishmentId: 9, month: 3, year: 2026, amount: 299.90, status: 'pending' },
      { id: 18, establishmentId: 10, month: 3, year: 2026, amount: 199.90, status: 'overdue' }
    ],

    recentAlerts: [
      { type: 'overdue', message: 'Sushi Kento — 2 meses em atraso', time: '2h atrás' },
      { type: 'overdue', message: 'Gastrobar 404 — 2 meses em atraso', time: '2h atrás' },
      { type: 'overdue', message: 'Boteco do Chico — pagamento de março atrasado', time: '5h atrás' },
      { type: 'overdue', message: 'Café & Brunch Studio — pagamento de março atrasado', time: '1 dia' },
      { type: 'new', message: 'Espetaria Brasa & Cia — cadastrado', time: '2 meses' }
    ]
  }
```

**Step 2: Adicionar funções helper do Super Admin no final do app.js (antes da inicialização)**

```javascript
// ============================================
// 15. Super Admin — Helpers
// ============================================

function getEstablishmentStatusLabel(status) {
  const labels = { 'active': 'Ativo', 'suspended': 'Suspenso' };
  return labels[status] || status;
}

function getEstablishmentStatusBadge(status) {
  const classes = { 'active': 'badge-success', 'suspended': 'badge-error' };
  return classes[status] || 'badge-gray';
}

function getPaymentStatusLabel(status) {
  const labels = { 'paid': 'Pago', 'pending': 'Pendente', 'overdue': 'Atrasado' };
  return labels[status] || status;
}

function getPaymentStatusBadge(status) {
  const classes = { 'paid': 'badge-success', 'pending': 'badge-warning', 'overdue': 'badge-error' };
  return classes[status] || 'badge-gray';
}

function isDefaulting(establishmentId) {
  return MOCK.superadmin.payments.some(p => p.establishmentId === establishmentId && p.status === 'overdue');
}

function formatCNPJ(value) {
  const digits = value.replace(/\D/g, '').slice(0, 14);
  return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
    .replace(/^(\d{2})(\d{3})(\d{3})(\d{4})/, '$1.$2.$3/$4')
    .replace(/^(\d{2})(\d{3})(\d{3})/, '$1.$2.$3')
    .replace(/^(\d{2})(\d{3})/, '$1.$2')
    .replace(/^(\d{2})/, '$1');
}

function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits.length ? '(' + digits : '';
  if (digits.length <= 7) return '(' + digits.slice(0, 2) + ') ' + digits.slice(2);
  return '(' + digits.slice(0, 2) + ') ' + digits.slice(2, 7) + '-' + digits.slice(7);
}

function slugify(text) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function getMonthLabel(month) {
  const labels = ['', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return labels[month] || '';
}
```

**Step 3: Commit**

```bash
git add prototypes/js/app.js
git commit -m "proto: adicionar dados mock e helpers do Super Admin"
```

---

### Task 3: Adicionar CSS do Super Admin ao style.css

**Files:**
- Modify: `prototypes/css/style.css` (adicionar seção no final, antes dos media queries)

**Step 1: Adicionar seção Super Admin**

Inserir antes da seção de media queries (que começa com `@media`). Procurar a última seção antes dos `@media` queries e adicionar:

```css
/* ============================================
   Super Admin — Estilos específicos
   ============================================ */

/* Sidebar indigo */
.superadmin-sidebar {
  width: var(--sidebar-width);
  background-color: #1E1B4B;
  color: #A5B4FC;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 200;
  overflow-y: auto;
  transition: transform var(--transition-slow);
}

.superadmin-sidebar .sidebar-logo {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 1px solid rgba(165, 180, 252, 0.15);
}

.superadmin-sidebar .logo-icon {
  width: 36px;
  height: 36px;
  background-color: #6366F1;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 0.875rem;
}

.superadmin-sidebar .logo-text {
  font-size: 1.125rem;
  font-weight: 700;
  color: white;
}

.superadmin-sidebar .sidebar-nav {
  flex: 1;
  padding: 1rem 0;
}

.superadmin-sidebar .sidebar-group {
  margin-bottom: 0.5rem;
}

.superadmin-sidebar .sidebar-group-label {
  padding: 0.5rem 1.5rem;
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(165, 180, 252, 0.5);
}

.superadmin-sidebar .sidebar-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #A5B4FC;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.superadmin-sidebar .sidebar-item:hover {
  color: white;
  background-color: rgba(99, 102, 241, 0.1);
}

.superadmin-sidebar .sidebar-item.active {
  color: white;
  background-color: rgba(99, 102, 241, 0.2);
}

.superadmin-sidebar .sidebar-item.active svg {
  color: #818CF8;
}

.superadmin-sidebar .sidebar-item svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.superadmin-sidebar .sidebar-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(165, 180, 252, 0.15);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.superadmin-sidebar .sidebar-avatar {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background-color: #4338CA;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
}

.superadmin-sidebar .sidebar-user-info .sidebar-user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
}

.superadmin-sidebar .sidebar-user-info .sidebar-user-role {
  font-size: 0.75rem;
  color: #A5B4FC;
}

/* Botões indigo */
.btn-indigo {
  background-color: #6366F1;
  color: white;
}
.btn-indigo:hover {
  background-color: #4F46E5;
}

/* KPI card com borda indigo */
.kpi-indigo {
  border-top: 4px solid #6366F1;
}

/* Tabela hover indigo */
.table-indigo tbody tr:hover {
  background-color: #EEF2FF;
}

/* Toggle indigo */
.toggle-indigo.active {
  background-color: #6366F1;
}

/* Badge indigo */
.badge-indigo {
  background-color: #EEF2FF;
  color: #4F46E5;
}

/* Input focus indigo */
.input-indigo:focus {
  border-color: #6366F1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

/* Login card Super Admin */
.login-card-superadmin .btn-indigo:focus-visible {
  outline: 2px solid #6366F1;
  outline-offset: 2px;
}

/* Responsive sidebar Super Admin */
@media (max-width: 1023px) {
  .superadmin-sidebar {
    transform: translateX(-100%);
  }
  .superadmin-sidebar.open {
    transform: translateX(0);
  }
}
```

**Step 2: Commit**

```bash
git add prototypes/css/style.css
git commit -m "proto: adicionar estilos CSS do Super Admin (sidebar indigo, botões, badges)"
```

---

### Task 4: Criar superadmin/login.html

**Files:**
- Create: `prototypes/superadmin/login.html`

**Step 1: Criar diretório e arquivo**

```bash
mkdir -p prototypes/superadmin
```

**Step 2: Criar login.html**

Mesmo layout do `admin/login.html`, mas com:
- Título: "OChefia — Super Admin"
- Subtítulo: "Painel Interno"
- Logo com fundo indigo (`#6366F1`) em vez de orange
- Botão "Entrar" com classe `btn-indigo` em vez de `btn-primary`
- Link "Esqueci minha senha" com cor indigo
- `form onsubmit` redireciona para `dashboard.html`

**Step 3: Commit**

```bash
git add prototypes/superadmin/login.html
git commit -m "proto: criar tela de login do Super Admin"
```

---

### Task 5: Criar superadmin/dashboard.html

**Files:**
- Create: `prototypes/superadmin/dashboard.html`

**Step 1: Criar dashboard.html**

Layout com `.admin-layout`:
- Sidebar: `.superadmin-sidebar` com menu (Dashboard ativo, Estabelecimentos, Módulos, Monitoramento)
- Ícones SVG inline para cada item (mesma abordagem do admin)
- Footer: avatar "A", nome "Admin OChefia", role "Super Admin"
- Content: `.admin-content`

Conteúdo:
- Page header: breadcrumb "Super Admin", título "Dashboard"
- 4 KPI cards em `.kpi-grid`:
  1. Total Estabelecimentos: **24** (borda indigo, `.kpi-indigo`)
  2. Ativos: **18** (borda green, `.kpi-success`)
  3. Suspensos: **3** (borda red, `.kpi-error` — classe CSS existente, reutilizar `.kpi-warning` trocando semântica ou usar inline `border-top-color`)
  4. Inadimplentes: **3** (borda red, `.kpi-error`)
- Card "Alertas Recentes": lista de alertas do `MOCK.superadmin.recentAlerts`, cada um com ícone de alerta, mensagem e tempo. Borda lateral vermelha para `overdue`, azul para `new`
- Card "Últimos Acessos": tabela simples com 5 estabelecimentos mais recentes, colunas: Nome, Cidade, Último Acesso, Pedidos/Mês

**Step 2: Commit**

```bash
git add prototypes/superadmin/dashboard.html
git commit -m "proto: criar dashboard do Super Admin com KPIs e alertas"
```

---

### Task 6: Criar superadmin/estabelecimentos.html

**Files:**
- Create: `prototypes/superadmin/estabelecimentos.html`

**Step 1: Criar estabelecimentos.html**

Layout sidebar + content (mesmo padrão, item "Estabelecimentos" ativo).

Conteúdo:
- Page header: breadcrumb "Super Admin", título "Estabelecimentos", botão "+ Novo Estabelecimento" (`.btn-indigo`, link para `estabelecimento-novo.html`)
- Barra de filtros:
  - Input de busca (placeholder "Buscar por nome ou slug...")
  - Select de status: Todos, Ativos, Suspensos
  - Select de inadimplência: Todos, Inadimplentes, Em dia
- Tabela com classe `.table-indigo`:
  - Colunas: Nome, Slug, CNPJ, Cidade, Status, Plano, Ações
  - Dados do `MOCK.superadmin.establishments`
  - Nome clicável (link para `estabelecimento-detalhe.html?id=X`)
  - CNPJ em `font-mono`
  - Status: badge colorido (`.badge-success` ativo, `.badge-error` suspenso)
  - Indicador de inadimplência: badge `.badge-warning` "Inadimplente" quando aplicável
  - Plano: `R$ XXX,XX`
  - Ações: botão "Ver" (link para detalhe)
- Paginação: "Mostrando 1-10 de 10 estabelecimentos" + botões Anterior/Próximo (mock, sem trocar página)

**Interações JS:**
- Filtro de busca filtra tabela por nome ou slug (keyup)
- Select de status filtra tabela
- Select de inadimplência filtra tabela (usa `isDefaulting()`)
- Renderização dinâmica da tabela via JS

**Step 2: Commit**

```bash
git add prototypes/superadmin/estabelecimentos.html
git commit -m "proto: criar listagem de estabelecimentos com filtros e paginação"
```

---

### Task 7: Criar superadmin/estabelecimento-novo.html

**Files:**
- Create: `prototypes/superadmin/estabelecimento-novo.html`

**Step 1: Criar estabelecimento-novo.html**

Layout sidebar + content (item "Estabelecimentos" ativo).

Conteúdo:
- Page header: breadcrumb "Super Admin > Estabelecimentos", título "Novo Estabelecimento"
- Card centralizado (`max-width: 640px; margin: 0 auto`):
  - Formulário com campos:
    1. Nome do estabelecimento (input text, required)
    2. Slug (input text, auto-preenchido a partir do nome via `slugify()`, editável)
    3. CNPJ (input text, máscara via `formatCNPJ()` no `oninput`)
    4. Responsável (input text, required)
    5. E-mail (input email, required)
    6. Telefone (input text, máscara via `formatPhone()` no `oninput`)
  - Botões: "Cancelar" (`.btn-secondary`, volta para listagem) | "Cadastrar" (`.btn-indigo`)

**Interações JS:**
- `oninput` no campo Nome preenche Slug automaticamente
- `oninput` no campo CNPJ aplica máscara
- `oninput` no campo Telefone aplica máscara
- Submit mostra toast "Estabelecimento cadastrado com sucesso!" e redireciona para listagem

**Step 2: Commit**

```bash
git add prototypes/superadmin/estabelecimento-novo.html
git commit -m "proto: criar formulário de cadastro de estabelecimento"
```

---

### Task 8: Criar superadmin/estabelecimento-detalhe.html

**Files:**
- Create: `prototypes/superadmin/estabelecimento-detalhe.html`

**Step 1: Criar estabelecimento-detalhe.html**

Layout sidebar + content (item "Estabelecimentos" ativo).

Conteúdo:
- Page header: breadcrumb "Super Admin > Estabelecimentos > Zé do Bar", título "Zé do Bar" + badge de status
- Botão "Alterar Status" (`.btn-danger` se ativo -> suspender, `.btn-success` se suspenso -> ativar) — abre modal de confirmação

Tabs (3 abas, reutilizar o sistema de tabs existente `data-tabs`):

**Aba 1 — Dados Gerais:**
- Formulário editável com os dados do estabelecimento (nome, slug, CNPJ, responsável, email, telefone, cidade)
- Botão "Salvar Alterações" (`.btn-indigo`)

**Aba 2 — Cobrança:**
- Card com "Valor do Plano Base": `R$ 299,90` (editável, input com botão Salvar ao lado)
- Tabela de pagamentos mensais (filtrada pelo estabelecimento hardcoded id=1):
  - Colunas: Mês/Ano, Valor, Status (badge), Ações
  - Ações: botão para alterar status (dropdown ou botões inline)
- Botão "+ Registrar Pagamento" (abre modal com select mês, input valor, select status)

**Aba 3 — Módulos:**
- Lista de módulos do `MOCK.superadmin.modules`:
  - Cada módulo em card: nome, descrição, toggle ativo/inativo (`.toggle-indigo`), campo de valor override
  - Módulo "Padrão" sempre ativo, toggle desabilitado
  - Módulos extras com toggle funcional

**Interações JS:**
- Tabs funcionais (aba ativa muda conteúdo)
- Modal de confirmação para alterar status do estabelecimento
- Modal para registrar pagamento
- Toggle de módulos funcional (visual)
- Toast de feedback em todas as ações

**Step 2: Commit**

```bash
git add prototypes/superadmin/estabelecimento-detalhe.html
git commit -m "proto: criar detalhe do estabelecimento com tabs (dados, cobrança, módulos)"
```

---

### Task 9: Criar superadmin/cobranca.html

**Files:**
- Create: `prototypes/superadmin/cobranca.html`

**Step 1: Criar cobranca.html**

Layout sidebar + content (item "Estabelecimentos" ativo — cobrança é sub-contexto de estabelecimentos).

Conteúdo:
- Page header: breadcrumb "Super Admin > Estabelecimentos", título "Gestão de Cobrança"
- Card de resumo (KPIs em linha):
  - Total faturado este mês: `R$ X.XXX,XX`
  - Pagos: N
  - Pendentes: N
  - Atrasados: N
- Tabela completa de pagamentos (todos os estabelecimentos):
  - Colunas: Estabelecimento, Mês/Ano, Valor, Status (badge), Ações
  - Dados do `MOCK.superadmin.payments` com join no `establishments` para nome
  - Filtros: select de status (Todos, Pagos, Pendentes, Atrasados)
  - Ordenação por mês/ano descendente

**Interações JS:**
- Filtro de status funcional
- Botão de alterar status com toast
- Renderização dinâmica

**Step 2: Commit**

```bash
git add prototypes/superadmin/cobranca.html
git commit -m "proto: criar tela de gestão de cobrança do Super Admin"
```

---

### Task 10: Criar superadmin/modulos.html

**Files:**
- Create: `prototypes/superadmin/modulos.html`

**Step 1: Criar modulos.html**

Layout sidebar + content (item "Módulos" ativo).

Conteúdo:
- Page header: breadcrumb "Super Admin", título "Módulos"
- Grid de cards (2 colunas em desktop) para cada módulo:
  - Nome do módulo (título)
  - Descrição
  - Tipo: badge "Incluso" (`.badge-indigo`) ou "Extra" (`.badge-warning`)
  - Valor padrão: `R$ XX,XX` (editável para extras, "Incluso no plano" para Padrão)
  - Botão "Editar" (`.btn-secondary btn-sm`) — abre modal com nome, descrição e valor editáveis

- Seção abaixo: "Módulos por Estabelecimento"
  - Tabela: Estabelecimento, Padrão (sempre ✓), Estoque, Explorar, NFC-e/SAT
  - Cada célula de módulo extra tem toggle (`.toggle-indigo`)
  - Baseado nos dados de `establishments[].modules`

**Interações JS:**
- Modal de edição de módulo
- Toggle de módulos por estabelecimento (visual)
- Toast de feedback

**Step 2: Commit**

```bash
git add prototypes/superadmin/modulos.html
git commit -m "proto: criar tela de gestão de módulos do Super Admin"
```

---

### Task 11: Criar superadmin/monitoramento.html

**Files:**
- Create: `prototypes/superadmin/monitoramento.html`

**Step 1: Criar monitoramento.html**

Layout sidebar + content (item "Monitoramento" ativo).

Conteúdo:
- Page header: breadcrumb "Super Admin", título "Monitoramento"
- Tabela principal "Métricas por Estabelecimento":
  - Colunas: Estabelecimento, Cidade, Status, Pedidos/Mês, Mesas Ativas, Último Acesso
  - Dados do `MOCK.superadmin.establishments`
  - Ordenável por Pedidos/Mês (indicador de coluna clicável, seta)
  - Pedidos/Mês com barra de progresso relativa (maior valor = 100%)
  - Último acesso: relativo ("Hoje 14:32", "Ontem 22:45", "07/03 19:00", etc.)
  - Estabelecimentos suspensos em cinza (sem métricas ativas)

- Card "Resumo da Plataforma" acima da tabela:
  - Total de pedidos este mês (soma de ordersMonth): **7.973**
  - Mesas ativas totais: **68**
  - Média de pedidos por estabelecimento ativo: **443**

**Interações JS:**
- Ordenação da tabela por coluna Pedidos/Mês (toggle asc/desc)
- Renderização dinâmica

**Step 2: Commit**

```bash
git add prototypes/superadmin/monitoramento.html
git commit -m "proto: criar tela de monitoramento do Super Admin"
```

---

### Task 12: Atualizar index.html — adicionar card Super Admin

**Files:**
- Modify: `prototypes/index.html`

**Step 1: Adicionar card do Super Admin no hub**

Após o card do Garçom, adicionar um novo card com fundo `#1E1B4B` (indigo-950):

```html
<!-- Super Admin -->
<div class="hub-card">
  <div class="hub-card-header" style="background: #1E1B4B;">
    Super Admin <span class="hub-count">8</span>
  </div>
  <div class="hub-card-body">
    <ul>
      <li><a href="superadmin/login.html">Login</a></li>
      <li><a href="superadmin/dashboard.html">Dashboard</a></li>
      <li><a href="superadmin/estabelecimentos.html">Estabelecimentos</a></li>
      <li><a href="superadmin/estabelecimento-novo.html">Novo Estabelecimento</a></li>
      <li><a href="superadmin/estabelecimento-detalhe.html">Detalhe do Estabelecimento</a></li>
      <li><a href="superadmin/cobranca.html">Cobrança</a></li>
      <li><a href="superadmin/modulos.html">Módulos</a></li>
      <li><a href="superadmin/monitoramento.html">Monitoramento</a></li>
    </ul>
  </div>
</div>
```

**Step 2: Commit**

```bash
git add prototypes/index.html
git commit -m "proto: adicionar card do Super Admin ao hub de protótipos"
```

---

### Task 13: Teste manual e ajustes finais

**Step 1: Abrir index.html no browser e verificar**

- Todas as 8 telas carregam sem erro no console
- Sidebar funciona em todas as telas (menu, hover, active)
- Sidebar fecha em mobile (drawer)
- Navegação entre telas funciona (links)
- Filtros na listagem de estabelecimentos funcionam
- Máscaras de CNPJ e telefone funcionam
- Slug auto-gerado funciona
- Toggle de módulos funciona
- Modal de confirmação funciona
- Tabs no detalhe do estabelecimento funcionam
- Toasts aparecem nas ações
- Cores indigo consistentes em todas as telas

**Step 2: Corrigir eventuais problemas encontrados**

**Step 3: Commit final**

```bash
git add -A prototypes/superadmin/ prototypes/css/style.css prototypes/js/app.js prototypes/index.html
git commit -m "proto: ajustes finais nos protótipos do Super Admin"
```
