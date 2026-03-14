# Design — Interface do Super Admin (Backoffice OChefia)

Specs detalhadas da interface Super Admin. Para visão geral, paleta base e princípios, ver `docs/design-system.md`.

**Inspiração:** Stripe Dashboard (gestão de clientes), Shopify Partners, painéis internos de plataformas SaaS. Foco em gestão cross-tenant, cobrança e controle de módulos.

**Diferença fundamental em relação ao Admin:** o Admin é a interface do **restaurante** (dados de um único estabelecimento, branding do restaurante). O Super Admin é a interface da **plataforma OChefia** (dados de todos os estabelecimentos, branding OChefia). A sidebar do Super Admin usa cor diferenciada para evitar confusão.

## Superfícies e Cores

| Elemento | Valor | Tailwind |
|---|---|---|
| Fundo da página | `#F9FAFB` | `gray-50` |
| Sidebar | `#1E1B4B` | `indigo-950` |
| Sidebar texto | `#A5B4FC` | `indigo-300` |
| Sidebar item ativo | `#6366F1` fundo translúcido + texto branco | `bg-indigo-500/20 text-white` |
| Sidebar ícone ativo | `#818CF8` | `text-indigo-400` |
| Sidebar logo | Logo OChefia (não do restaurante) | — |
| Card/painel | `#FFFFFF` | `white` + `shadow-sm border border-gray-100` |
| KPI card destaque | `#FFFFFF` com borda-top `#6366F1` (4px) | Borda superior indigo |
| KPI card alerta (inadimplentes) | `#FFFFFF` com borda-top `#DC2626` (4px) | Borda superior red |
| Header da página | `#FFFFFF` | `white` com sombra sutil |
| Texto título de página | `#111827` | `gray-900` |
| Texto secundário | `#6B7280` | `gray-500` |
| Tabela header | `#F9FAFB` | `gray-50` |
| Tabela row hover | `#EEF2FF` | `indigo-50` |
| Tabela row zebra | `#FFFFFF` / `#F9FAFB` alternados | `white` / `gray-50` |
| Badge ativo | `#16A34A` fundo | `bg-green-600 text-white` |
| Badge suspenso | `#DC2626` fundo | `bg-red-600 text-white` |
| Badge inadimplente | `#CA8A04` fundo | `bg-yellow-600 text-white` |
| Badge pago | `#16A34A` fundo | `bg-green-600 text-white` |
| Badge pendente | `#CA8A04` fundo | `bg-yellow-600 text-white` |
| Badge atrasado | `#DC2626` fundo | `bg-red-600 text-white` |
| Botão primário | `#6366F1` fundo | `bg-indigo-500 text-white` |
| Botão primário hover | `#4F46E5` fundo | `bg-indigo-600 text-white` |
| Botão secundário | Borda `#D1D5DB`, texto `#374151` | `border-gray-300 text-gray-700` |
| Botão destrutivo | `#DC2626` fundo | `bg-red-600 text-white` |
| Toggle módulo ativo | `#6366F1` | `bg-indigo-500` |
| Toggle módulo inativo | `#D1D5DB` | `bg-gray-300` |

## Componentes

| Componente | Especificação |
|---|---|
| **Sidebar** | Largura 256px (colapsável para 64px em mobile). Logo OChefia no topo (não do restaurante). Cor `indigo-950` para diferenciar visualmente do Admin (que usa `gray-900`). Grupos: Dashboard, Estabelecimentos, Módulos, Monitoramento. Ícone + texto. Divider entre grupos |
| **KPI Card** | Mesmo padrão do Admin, mas borda-top em `indigo-500` (padrão) ou `red-600` (alertas). KPIs típicos: total de estabelecimentos, ativos, suspensos, inadimplentes, receita da plataforma |
| **Tabela de estabelecimentos** | Colunas: nome, slug, CNPJ, status (badge colorido), plano, último acesso, ações. Filtros: status (ativo/suspenso), inadimplente (sim/não). Paginação. Busca por nome/slug. Hover em `indigo-50` |
| **Detalhe do estabelecimento** | Layout em tabs ou seções: Dados gerais, Cobrança, Módulos. Dados gerais: formulário editável (nome, slug, CNPJ, responsável, email, telefone) + botão alterar status. Seção de cobrança inline |
| **Card de cobrança** | Valor do plano base (editável). Tabela de pagamentos mensais: mês/ano, valor, status (badge), ações. Botão "+ Registrar Pagamento". Indicador visual para meses atrasados |
| **Gestão de módulos** | Lista de módulos disponíveis com toggle (ativo/inativo) por estabelecimento. Valor padrão global + campo de override por estabelecimento. Card por módulo com: nome, descrição, valor, toggle |
| **Formulário de cadastro** | Card `max-w-2xl` centralizado. Campos: nome, slug (auto-gerado a partir do nome, editável), CNPJ (com máscara), responsável, email, telefone (com máscara). Validação inline. Botões alinhados à direita |
| **Page header** | Mesmo padrão do Admin: título `text-2xl font-bold`, breadcrumb acima, botão de ação à direita (ex: "+ Novo Estabelecimento") |
| **Status badges** | `rounded-full px-3 py-1 text-xs font-semibold`. Ativo: `bg-green-100 text-green-800`. Suspenso: `bg-red-100 text-red-800`. Inadimplente: `bg-yellow-100 text-yellow-800` |
| **Modal de confirmação** | Para ações críticas (suspender estabelecimento, alterar status de pagamento). Overlay `bg-black/50`. Card com aviso claro e botões Cancelar/Confirmar |

## Tipografia específica

| Uso | Tamanho | Peso |
|---|---|---|
| Título da página | `text-2xl` | `font-bold` |
| Subtítulo/seção | `text-lg` | `font-semibold` |
| KPI valor | `text-3xl` | `font-bold` |
| KPI label | `text-sm` | `font-medium` |
| Nome do estabelecimento (tabela) | `text-sm` | `font-semibold` |
| CNPJ/slug (tabela) | `text-sm` | `font-normal font-mono` |
| Tabela header | `text-xs` uppercase | `font-semibold tracking-wide` |
| Tabela body | `text-sm` | `font-normal` |
| Sidebar item | `text-sm` | `font-medium` |
| Badge de status | `text-xs` | `font-semibold` |
| Valor do plano | `text-lg` | `font-bold` |
| Input label | `text-sm` | `font-medium` |

## Layout

- Sidebar fixa na esquerda (256px). Area de conteudo com `max-w-7xl mx-auto px-6 py-8`
- Dashboard: grid de KPI cards (4 colunas), tabela de alertas recentes (estabelecimentos inadimplentes, últimos cadastros), últimos acessos
- Listagem de estabelecimentos: page header + filtros + busca + tabela + paginação
- Detalhe do estabelecimento: page header com breadcrumb + card com tabs (Dados, Cobrança, Módulos)
- Formulário de cadastro: card centralizado `max-w-2xl`
- Gestão de módulos: grid de cards por módulo (2 colunas)
- Mobile: sidebar vira drawer, conteudo full-width
