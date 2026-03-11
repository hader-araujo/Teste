# Design — Interface do Super Admin (Backoffice OChefia)

Specs detalhadas da interface Super Admin. Para visão geral, paleta base e princípios, ver `docs/design-system.md`.

**Inspiracao:** Stripe Dashboard (gestao de clientes), Shopify Partners, paineis internos de plataformas SaaS. Foco em gestao cross-tenant, cobranca e controle de modulos.

**Diferenca fundamental em relacao ao Admin:** o Admin e a interface do **restaurante** (dados de um unico estabelecimento, branding do restaurante). O Super Admin e a interface da **plataforma OChefia** (dados de todos os estabelecimentos, branding OChefia). A sidebar do Super Admin usa cor diferenciada para evitar confusao.

## Superficies e Cores

| Elemento | Valor | Tailwind |
|---|---|---|
| Fundo da pagina | `#F9FAFB` | `gray-50` |
| Sidebar | `#1E1B4B` | `indigo-950` |
| Sidebar texto | `#A5B4FC` | `indigo-300` |
| Sidebar item ativo | `#6366F1` fundo translucido + texto branco | `bg-indigo-500/20 text-white` |
| Sidebar icone ativo | `#818CF8` | `text-indigo-400` |
| Sidebar logo | Logo OChefia (nao do restaurante) | — |
| Card/painel | `#FFFFFF` | `white` + `shadow-sm border border-gray-100` |
| KPI card destaque | `#FFFFFF` com borda-top `#6366F1` (4px) | Borda superior indigo |
| KPI card alerta (inadimplentes) | `#FFFFFF` com borda-top `#DC2626` (4px) | Borda superior red |
| Header da pagina | `#FFFFFF` | `white` com sombra sutil |
| Texto titulo de pagina | `#111827` | `gray-900` |
| Texto secundario | `#6B7280` | `gray-500` |
| Tabela header | `#F9FAFB` | `gray-50` |
| Tabela row hover | `#EEF2FF` | `indigo-50` |
| Tabela row zebra | `#FFFFFF` / `#F9FAFB` alternados | `white` / `gray-50` |
| Badge ativo | `#16A34A` fundo | `bg-green-600 text-white` |
| Badge suspenso | `#DC2626` fundo | `bg-red-600 text-white` |
| Badge inadimplente | `#CA8A04` fundo | `bg-yellow-600 text-white` |
| Badge pago | `#16A34A` fundo | `bg-green-600 text-white` |
| Badge pendente | `#CA8A04` fundo | `bg-yellow-600 text-white` |
| Badge atrasado | `#DC2626` fundo | `bg-red-600 text-white` |
| Botao primario | `#6366F1` fundo | `bg-indigo-500 text-white` |
| Botao primario hover | `#4F46E5` fundo | `bg-indigo-600 text-white` |
| Botao secundario | Borda `#D1D5DB`, texto `#374151` | `border-gray-300 text-gray-700` |
| Botao destrutivo | `#DC2626` fundo | `bg-red-600 text-white` |
| Toggle modulo ativo | `#6366F1` | `bg-indigo-500` |
| Toggle modulo inativo | `#D1D5DB` | `bg-gray-300` |

## Componentes

| Componente | Especificacao |
|---|---|
| **Sidebar** | Largura 256px (colapsavel para 64px em mobile). Logo OChefia no topo (nao do restaurante). Cor `indigo-950` para diferenciar visualmente do Admin (que usa `gray-900`). Grupos: Dashboard, Estabelecimentos, Modulos, Monitoramento. Icone + texto. Divider entre grupos |
| **KPI Card** | Mesmo padrao do Admin, mas borda-top em `indigo-500` (padrao) ou `red-600` (alertas). KPIs tipicos: total de estabelecimentos, ativos, suspensos, inadimplentes, receita da plataforma |
| **Tabela de estabelecimentos** | Colunas: nome, slug, CNPJ, status (badge colorido), plano, ultimo acesso, acoes. Filtros: status (ativo/suspenso), inadimplente (sim/nao). Paginacao. Busca por nome/slug. Hover em `indigo-50` |
| **Detalhe do estabelecimento** | Layout em tabs ou secoes: Dados gerais, Cobranca, Modulos. Dados gerais: formulario editavel (nome, slug, CNPJ, responsavel, email, telefone) + botao alterar status. Secao de cobranca inline |
| **Card de cobranca** | Valor do plano base (editavel). Tabela de pagamentos mensais: mes/ano, valor, status (badge), acoes. Botao "+ Registrar Pagamento". Indicador visual para meses atrasados |
| **Gestao de modulos** | Lista de modulos disponiveis com toggle (ativo/inativo) por estabelecimento. Valor padrao global + campo de override por estabelecimento. Card por modulo com: nome, descricao, valor, toggle |
| **Formulario de cadastro** | Card `max-w-2xl` centralizado. Campos: nome, slug (auto-gerado a partir do nome, editavel), CNPJ (com mascara), responsavel, email, telefone (com mascara). Validacao inline. Botoes alinhados a direita |
| **Page header** | Mesmo padrao do Admin: titulo `text-2xl font-bold`, breadcrumb acima, botao de acao a direita (ex: "+ Novo Estabelecimento") |
| **Status badges** | `rounded-full px-3 py-1 text-xs font-semibold`. Ativo: `bg-green-100 text-green-800`. Suspenso: `bg-red-100 text-red-800`. Inadimplente: `bg-yellow-100 text-yellow-800` |
| **Modal de confirmacao** | Para acoes criticas (suspender estabelecimento, alterar status de pagamento). Overlay `bg-black/50`. Card com aviso claro e botoes Cancelar/Confirmar |

## Tipografia especifica

| Uso | Tamanho | Peso |
|---|---|---|
| Titulo da pagina | `text-2xl` | `font-bold` |
| Subtitulo/secao | `text-lg` | `font-semibold` |
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
- Dashboard: grid de KPI cards (4 colunas), tabela de alertas recentes (estabelecimentos inadimplentes, ultimos cadastros), ultimos acessos
- Listagem de estabelecimentos: page header + filtros + busca + tabela + paginacao
- Detalhe do estabelecimento: page header com breadcrumb + card com tabs (Dados, Cobranca, Modulos)
- Formulario de cadastro: card centralizado `max-w-2xl`
- Gestao de modulos: grid de cards por modulo (2 colunas)
- Mobile: sidebar vira drawer, conteudo full-width
