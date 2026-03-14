# Design — Interface do Admin (Dashboard do Restaurante)

Specs detalhadas da interface admin. Para visão geral, paleta base e princípios, ver `docs/design-system.md`.

**Inspiração:** Reztro (Figma), Stripe Dashboard, Shopify Admin. Foco em dados, gestão, configuração.

## Superfícies e Cores

| Elemento | Valor | Tailwind |
|---|---|---|
| Fundo da página | `#F9FAFB` | `gray-50` |
| Sidebar | `#111827` | `gray-900` |
| Sidebar texto | `#9CA3AF` | `gray-400` |
| Sidebar item ativo | `#EA580C` fundo translúcido + texto branco | `bg-orange-600/10 text-white` |
| Sidebar ícone ativo | `#EA580C` | `text-orange-600` |
| Card/painel | `#FFFFFF` | `white` + `shadow-sm border border-gray-100` |
| KPI card destaque | `#FFFFFF` com borda-top `#EA580C` (4px) | Borda superior colorida |
| Header da página | `#FFFFFF` | `white` com sombra sutil |
| Texto título de página | `#111827` | `gray-900` |
| Texto secundário | `#6B7280` | `gray-500` |
| Tabela header | `#F9FAFB` | `gray-50` |
| Tabela row hover | `#FFF7ED` | `orange-50` |
| Tabela row zebra | `#FFFFFF` / `#F9FAFB` alternados | `white` / `gray-50` |
| Gráfico linha principal | `#EA580C` | `orange-600` |
| Gráfico linha secundária | `#2563EB` | `blue-600` |
| Gráfico barra | `#EA580C` com opacidade variável | `orange-600` 100%-40% |
| Botão primário | `#EA580C` fundo | `bg-orange-600 text-white` |
| Botão secundário | Borda `#D1D5DB`, texto `#374151` | `border-gray-300 text-gray-700` |
| Botão destrutivo | `#DC2626` fundo | `bg-red-600 text-white` |
| Breadcrumb | `#6B7280` com `/` separador | `text-gray-500` |

## Componentes

| Componente | Especificação |
|---|---|
| **Sidebar** | Largura 256px (colapsável para 64px ícone-only em mobile). Logo do restaurante no topo (ou nome, se sem logo). Grupos: Visão Geral (Dashboard), Cardápio, Operação (Mesas, Locais de Preparo, Setores), Equipe (Funcionários, Escala, Equipe do Dia, Desempenho), Financeiro (Faturamento), Configurações. Ícone + texto. Divider entre grupos |
| **KPI Card** | `rounded-xl shadow-sm border border-gray-100`. Borda-top de 4px colorida (orange para receita, green para positivos, red para negativos). Ícone + label em cinza, valor grande em preto, sparkline ou variação percentual embaixo |
| **Tabela** | Header cinza claro (`gray-50`), linhas alternadas. Hover em `orange-50`. Paginação, busca e filtros acima da tabela. Ações por linha (ícones ou dropdown "...") |
| **Gráfico** | Cards `rounded-xl` com título, período (date picker), e o gráfico. Tooltips nos pontos. Legenda embaixo. Usar recharts ou chart.js |
| **Formulário** | Labels acima do input em `text-sm font-medium text-gray-700`. Input com `border-gray-300 rounded-lg`. Erro em `text-red-600 text-sm`. Botões de ação alinhados à direita |
| **Page header** | Título em `text-2xl font-bold`, breadcrumb acima, botão de ação principal à direita (ex: "+ Novo Produto") |
| **Empty state** | Ilustração leve (outline), texto explicativo, CTA. Centralizado no card |
| **Toast/notificação** | Canto superior direito. `rounded-lg shadow-lg`. Cor da borda esquerda indica tipo (verde/vermelho/amarelo/azul) |
| **Modal** | Overlay `bg-black/50`. Card `bg-white rounded-xl shadow-xl max-w-lg`. Header, body, footer com botoes |

## Tipografia específica

| Uso | Tamanho | Peso |
|---|---|---|
| Título da página | `text-2xl` | `font-bold` |
| Subtítulo/seção | `text-lg` | `font-semibold` |
| KPI valor | `text-3xl` | `font-bold` |
| KPI label | `text-sm` | `font-medium` |
| KPI variação | `text-sm` | `font-semibold` |
| Tabela header | `text-xs` uppercase | `font-semibold tracking-wide` |
| Tabela body | `text-sm` | `font-normal` |
| Sidebar item | `text-sm` | `font-medium` |
| Breadcrumb | `text-sm` | `font-normal` |
| Input label | `text-sm` | `font-medium` |

## Layout

- Sidebar fixa na esquerda (256px). Area de conteudo com `max-w-7xl mx-auto px-6 py-8`
- Dashboard: grid de KPI cards (4 colunas), gráficos (2 colunas), tabela (full-width)
- Páginas de CRUD: page header + filtros + tabela + paginação
- Páginas de formulário: card centralizado `max-w-2xl` ou split (preview ao lado)
- Mobile: sidebar vira drawer, conteudo full-width
