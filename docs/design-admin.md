# Design — Interface do Admin (Dashboard do Restaurante)

Specs detalhadas da interface admin. Para visão geral, paleta base e princípios, ver `docs/design-system.md`.

**Inspiracao:** Reztro (Figma), Stripe Dashboard, Shopify Admin. Foco em dados, gestao, configuracao.

## Superficies e Cores

| Elemento | Valor | Tailwind |
|---|---|---|
| Fundo da pagina | `#F9FAFB` | `gray-50` |
| Sidebar | `#111827` | `gray-900` |
| Sidebar texto | `#9CA3AF` | `gray-400` |
| Sidebar item ativo | `#EA580C` fundo translucido + texto branco | `bg-orange-600/10 text-white` |
| Sidebar icone ativo | `#EA580C` | `text-orange-600` |
| Card/painel | `#FFFFFF` | `white` + `shadow-sm border border-gray-100` |
| KPI card destaque | `#FFFFFF` com borda-top `#EA580C` (4px) | Borda superior colorida |
| Header da pagina | `#FFFFFF` | `white` com sombra sutil |
| Texto titulo de pagina | `#111827` | `gray-900` |
| Texto secundario | `#6B7280` | `gray-500` |
| Tabela header | `#F9FAFB` | `gray-50` |
| Tabela row hover | `#FFF7ED` | `orange-50` |
| Tabela row zebra | `#FFFFFF` / `#F9FAFB` alternados | `white` / `gray-50` |
| Grafico linha principal | `#EA580C` | `orange-600` |
| Grafico linha secundaria | `#2563EB` | `blue-600` |
| Grafico barra | `#EA580C` com opacidade variavel | `orange-600` 100%-40% |
| Botao primario | `#EA580C` fundo | `bg-orange-600 text-white` |
| Botao secundario | Borda `#D1D5DB`, texto `#374151` | `border-gray-300 text-gray-700` |
| Botao destrutivo | `#DC2626` fundo | `bg-red-600 text-white` |
| Breadcrumb | `#6B7280` com `/` separador | `text-gray-500` |

## Componentes

| Componente | Especificacao |
|---|---|
| **Sidebar** | Largura 256px (colapsavel para 64px icone-only em mobile). Logo OChefia no topo. Grupos: Visao Geral, Pedidos, Cardapio, Equipe, Financeiro, Configuracoes. Icone + texto. Divider entre grupos |
| **KPI Card** | `rounded-xl shadow-sm border border-gray-100`. Borda-top de 4px colorida (orange para receita, green para positivos, red para negativos). Icone + label em cinza, valor grande em preto, sparkline ou variacao percentual embaixo |
| **Tabela** | Header cinza claro (`gray-50`), linhas alternadas. Hover em `orange-50`. Paginacao, busca e filtros acima da tabela. Acoes por linha (icones ou dropdown "...") |
| **Grafico** | Cards `rounded-xl` com titulo, periodo (date picker), e o grafico. Tooltips nos pontos. Legenda embaixo. Usar recharts ou chart.js |
| **Formulario** | Labels acima do input em `text-sm font-medium text-gray-700`. Input com `border-gray-300 rounded-lg`. Erro em `text-red-600 text-sm`. Botoes de acao alinhados a direita |
| **Page header** | Titulo em `text-2xl font-bold`, breadcrumb acima, botao de acao principal a direita (ex: "+ Novo Produto") |
| **Empty state** | Ilustracao leve (outline), texto explicativo, CTA. Centralizado no card |
| **Toast/notificacao** | Canto superior direito. `rounded-lg shadow-lg`. Cor da borda esquerda indica tipo (verde/vermelho/amarelo/azul) |
| **Modal** | Overlay `bg-black/50`. Card `bg-white rounded-xl shadow-xl max-w-lg`. Header, body, footer com botoes |

## Tipografia especifica

| Uso | Tamanho | Peso |
|---|---|---|
| Titulo da pagina | `text-2xl` | `font-bold` |
| Subtitulo/secao | `text-lg` | `font-semibold` |
| KPI valor | `text-3xl` | `font-bold` |
| KPI label | `text-sm` | `font-medium` |
| KPI variacao | `text-sm` | `font-semibold` |
| Tabela header | `text-xs` uppercase | `font-semibold tracking-wide` |
| Tabela body | `text-sm` | `font-normal` |
| Sidebar item | `text-sm` | `font-medium` |
| Breadcrumb | `text-sm` | `font-normal` |
| Input label | `text-sm` | `font-medium` |

## Layout

- Sidebar fixa na esquerda (256px). Area de conteudo com `max-w-7xl mx-auto px-6 py-8`
- Dashboard: grid de KPI cards (4 colunas), graficos (2 colunas), tabela (full-width)
- Paginas de CRUD: page header + filtros + tabela + paginacao
- Paginas de formulario: card centralizado `max-w-2xl` ou split (preview ao lado)
- Mobile: sidebar vira drawer, conteudo full-width
