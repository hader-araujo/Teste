# Design System

## Quatro Interfaces, Quatro Experiencias

O OChefia nao tem um unico layout. Sao **quatro interfaces completamente distintas**, cada uma projetada para um publico, contexto e objetivo diferente. Elas compartilham a mesma paleta de cores base e tipografia, mas divergem em tudo mais: densidade de informacao, tamanho de elementos, navegacao, tom visual e prioridades de UX.

### 1. Interface do Cliente (PWA — Cardapio Digital)

**Quem usa:** cliente no bar/restaurante, celular na mao.
**Contexto:** pessoa quer pedir rapido, sem fricção. Não baixou app, não fez cadastro. Escaneou o QR Code e pronto.
**Tom visual:** limpo, convidativo, fotos grandes, parece um app de delivery premium (iFood, Rappi).

| Aspecto | Diretriz |
|---|---|
| Layout | Mobile-only. Scroll vertical. Cards de produto com foto dominante |
| Navegacao | Minima — categorias no topo, carrinho fixo embaixo |
| Densidade | Baixa. Muito espaco em branco. Poucos elementos por tela |
| Interacao | Toque simples. Adicionar ao carrinho em 1 tap. Sem menus complexos |
| Foco | Fotos dos pratos, precos claros, botao de pedir sempre visivel |
| Theming | Personalizavel por restaurante (cores, logo) — ver secao Theming abaixo |

**Referencias visuais:** apps de delivery (iFood, Rappi), menus QR (ChoiceQR, MENU TIGER), cardapios digitais modernos.

### 2. Interface do Staff (Garcom, KDS, Caixa)

**Quem usa:** garcom com celular, cozinheiro olhando tela na parede, caixa no tablet.
**Contexto:** operacao em tempo real, ambiente agitado, maos ocupadas/sujas/molhadas. Cada segundo conta.
**Tom visual:** funcional, alto contraste, botoes grandes, zero decoracao desnecessaria.

| Aspecto | Diretriz |
|---|---|
| Layout | Garcom: mobile. KDS: landscape (tablet/TV). Caixa: tablet |
| Navegacao | Tabs ou grid fixo. Nada escondido em menus dropdown |
| Densidade | Alta. Muita informacao visivel sem scroll — mesas, pedidos, timers |
| Interacao | Toques rapidos, areas de toque grandes (min 48x48px). KDS: bump com um toque |
| Foco | Status em tempo real. Cores codificam urgencia (verde/amarelo/vermelho) |
| Theming | Nao personalizavel. Design system padrao sempre. KDS usa dark mode obrigatorio |

**Referencias visuais:** Toast POS, Square POS, McDonald's KDS, Lightspeed, sistemas POS profissionais.

### 3. Interface do Admin (Dashboard do Dono/Gerente)

**Quem usa:** dono do restaurante, gerente, equipe administrativa.
**Contexto:** escritorio ou celular, analisando dados, configurando cardapio, gerenciando equipe. Uso mais demorado e analitico.
**Tom visual:** profissional, dashboard SaaS moderno, sidebar com navegacao completa, cards com metricas e graficos.

| Aspecto | Diretriz |
|---|---|
| Layout | Desktop-first (responsivo para tablet/mobile). Sidebar + area de conteudo |
| Navegacao | Sidebar com menu completo agrupado por secao (pedidos, cardapio, equipe, financeiro, config) |
| Densidade | Media-alta. Graficos, tabelas, KPIs. Informacao densa mas bem hierarquizada |
| Interacao | Formularios, filtros, date pickers, drag-and-drop (reordenar cardapio) |
| Foco | Metricas de negocio, gestao de cardapio, configuracoes. Decisoes baseadas em dados |
| Theming | Nao personalizavel. Design system padrao sempre |

**Referencias visuais:** Stripe Dashboard, Shopify Admin, Linear, dashboards SaaS modernos, Tenzo, 7shifts.

### 4. Interface do Super Admin (Painel Interno OChefia)

**Quem usa:** equipe interna do OChefia (role `SUPER_ADMIN`).
**Contexto:** gestao de todos os estabelecimentos da plataforma. Cadastro, cobranca, modulos, monitoramento. Acesso cross-tenant.
**Tom visual:** semelhante ao Admin, mas com branding OChefia (nao do restaurante). Visual de backoffice SaaS interno — mais denso e utilitario que o Admin do restaurante.

| Aspecto | Diretriz |
|---|---|
| Layout | Desktop-first. Sidebar + area de conteudo (mesmo padrao do Admin) |
| Navegacao | Sidebar com branding OChefia. Menu: Dashboard, Estabelecimentos, Modulos, Monitoramento |
| Densidade | Alta. Tabelas com muitos registros, filtros, paginacao. Dados cross-tenant |
| Interacao | Formularios, filtros, toggles de modulos, registro de pagamentos, alteracao de status |
| Foco | Gestao de estabelecimentos, cobranca, inadimplencia, habilitacao de modulos |
| Theming | Nao personalizavel. Branding OChefia fixo |

**Referencias visuais:** Stripe Dashboard (gestao de clientes), Shopify Partners, paineis administrativos de plataformas SaaS (backoffice interno).

### Por que quatro interfaces separadas

- **Objetivos opostos:** o cliente quer pedir em 30 segundos; o admin quer analisar dados por 30 minutos; o cozinheiro quer ver o proximo pedido sem tocar na tela; o Super Admin quer gerenciar dezenas de estabelecimentos.
- **Dispositivos diferentes:** celular (cliente/garcom), tablet/TV (KDS/caixa), desktop (admin/super admin).
- **Niveis de complexidade:** o cliente vê 5 telas no maximo; o admin tem dezenas de telas; o Super Admin opera cross-tenant com visao da plataforma inteira.
- **Contexto de uso:** cliente esta relaxando; staff esta sob pressao; admin esta planejando; Super Admin esta administrando o negocio OChefia.
- **Branding diferente:** o Admin mostra o nome/logo do restaurante; o Super Admin mostra branding OChefia — sao dominios completamente diferentes.

Um layout unico para os quatro seria generico demais e ruim para todos. Cada interface deve ser a melhor possivel para seu publico.

---

## Paleta de Cores

| Token | Hex | Tailwind | Uso |
|---|---|---|---|
| **Primaria** | `#EA580C` | `orange-600` | Botoes de acao, destaques, CTAs, links ativos |
| **Primaria hover** | `#C2410C` | `orange-700` | Hover de botoes |
| **Primaria light** | `#FFF7ED` | `orange-50` | Backgrounds sutis, badges |
| **Neutra escura** | `#111827` | `gray-900` | Sidebar, headers, textos principais |
| **Neutra media** | `#6B7280` | `gray-500` | Textos secundarios, placeholders |
| **Neutra clara** | `#F9FAFB` | `gray-50` | Fundos de pagina (admin, garcom) |
| **Sucesso** | `#16A34A` | `green-600` | Pronto, entregue, confirmado, online |
| **Atencao** | `#CA8A04` | `yellow-600` | Preparando, alerta, atencao |
| **Erro** | `#DC2626` | `red-600` | Atrasado, erro, urgente, offline |
| **Info** | `#2563EB` | `blue-600` | Na fila, informativo, links |
| **Branco** | `#FFFFFF` | `white` | Cards, modais, fundos de input |

## Tipografia Base

- **Font:** Inter (via Google Fonts) com fallback `system-ui, -apple-system, sans-serif`.
- **Tamanhos:** seguir escala do Tailwind (`text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`).
- **Peso:** `font-normal` para corpo, `font-medium` para labels, `font-semibold` para titulos, `font-bold` para destaques.

---

## Diretriz Visual por Interface

As tres interfaces compartilham a paleta base (orange-600 como primaria, cores semanticas) e a tipografia (Inter). Mas cada uma aplica esses fundamentos de forma diferente — superficies, elevacao, densidade, componentes e hierarquia visual variam.

### 1. Cliente — Visual de App de Delivery Premium

**Inspiracao:** ChoiceQR, iFood, Rappi. Foco em fotos, simplicidade, velocidade.

**Superficies e Cores**

| Elemento | Valor | Tailwind |
|---|---|---|
| Fundo da pagina | `#FFFFFF` | `white` |
| Fundo de secao (categorias) | `#F9FAFB` | `gray-50` |
| Card de produto | `#FFFFFF` com sombra suave | `white` + `shadow-md` |
| Texto principal (nome do prato) | `#111827` | `gray-900` |
| Texto secundario (descricao) | `#6B7280` | `gray-500` |
| Preco | `#EA580C` | `orange-600` |
| Botao adicionar | `#EA580C` fundo, texto branco | `bg-orange-600 text-white` |
| Barra do carrinho (fixo embaixo) | `#EA580C` | `bg-orange-600` |
| Badge quantidade | `#FFFFFF` sobre orange | `bg-white text-orange-600` |
| Fundo do header | `#FFFFFF` com blur | `bg-white/90 backdrop-blur` |
| Divisor entre secoes | `#F3F4F6` | `gray-100` |

**Componentes**

| Componente | Especificacao |
|---|---|
| **Card de produto** | Foto 16:9 no topo (ou lado esquerdo em lista), nome em `font-semibold text-base`, descricao em `text-sm text-gray-500` truncada 2 linhas, preco em `font-bold text-orange-600`. Rounded-2xl, shadow-md. Sem borda |
| **Botao adicionar** | Circular ou pill. `bg-orange-600 text-white rounded-full`. Minimo 44x44px. Icone "+" quando simples, texto "Adicionar R$ XX" no detalhe |
| **Barra de categorias** | Scroll horizontal no topo. Chips com `rounded-full`. Ativa: `bg-orange-600 text-white`. Inativa: `bg-gray-100 text-gray-700` |
| **Carrinho flutuante** | Barra fixa no bottom. `bg-orange-600 text-white rounded-t-2xl`. Mostra total e quantidade. Tap abre o carrinho |
| **Header** | Logo do restaurante (ou nome), endereco resumido. Sticky com blur. Minimalista |
| **Tela de detalhe do prato** | Foto grande (hero, 40% da tela). Nome, descricao completa, preco. Opcoes de adicionais como checkboxes/radio. Botao "Adicionar" fixo embaixo |
| **Status do pedido** | Timeline vertical com icones. Verde = concluido, orange = atual, cinza = pendente. Animacao pulse no passo atual |

**Tipografia especifica**

| Uso | Tamanho | Peso |
|---|---|---|
| Nome do restaurante | `text-xl` | `font-bold` |
| Nome do prato (card) | `text-base` | `font-semibold` |
| Descricao (card) | `text-sm` | `font-normal` |
| Preco | `text-base` | `font-bold` |
| Categoria (chip) | `text-sm` | `font-medium` |
| Total do carrinho | `text-lg` | `font-bold` |

**Espacamento e Layout**

- Padding geral da pagina: `px-4`
- Gap entre cards: `gap-3`
- Cards em lista (1 coluna) ou grid 2 colunas em telas maiores
- Foto do produto: aspect-ratio 16:9, `rounded-xl`, `object-cover`
- Sem sidebar, sem menu hamburguer. Navegacao 100% por scroll + categorias

**Tom geral:** limpo, arejado, as fotos sao as protagonistas. Poucos elementos de UI, muito espaco em branco. O cliente nem percebe que esta usando um "sistema" — parece um cardapio bonito.

---

### 2. Staff — Visual de Sistema Operacional (POS/KDS)

**Inspiracao:** McDonald's POS & KDS (Figma), Toast POS, Square. Foco em eficiencia, velocidade, zero erro.

O Staff se subdivide em 3 contextos com variacoes:

#### 2a. KDS (Cozinha/Bar) — Dark Mode Obrigatorio

**Superficies e Cores**

| Elemento | Valor | Tailwind |
|---|---|---|
| Fundo da tela | `#111827` | `gray-900` |
| Card de pedido (normal) | `#1F2937` | `gray-800` |
| Card de pedido (atencao — >10min) | `#1F2937` com borda `#CA8A04` | `gray-800 border-yellow-600` |
| Card de pedido (atrasado — >15min) | `#1F2937` com borda `#DC2626` | `gray-800 border-red-600` |
| Card de pedido (pronto) | `#1F2937` com borda `#16A34A` | `gray-800 border-green-600` |
| Header do card (numero do pedido) | `#F9FAFB` | `gray-50` |
| Texto do item | `#E5E7EB` | `gray-200` |
| Texto de observacao | `#FBBF24` | `yellow-400` |
| Timer (normal) | `#9CA3AF` | `gray-400` |
| Timer (atencao) | `#CA8A04` | `yellow-600` |
| Timer (atrasado) | `#DC2626` | `red-600` |
| Botao "Pronto/Bump" | `#16A34A` fundo, texto branco | `bg-green-600 text-white` |
| Separador de estacao (cozinha/bar) | `#374151` | `gray-700` |

**Componentes**

| Componente | Especificacao |
|---|---|
| **Card de pedido** | Ocupa 1 coluna em grid. Header com numero do pedido + mesa + timer. Lista de itens em texto grande. Observacoes em amarelo. Borda lateral muda de cor conforme tempo. Rounded-lg |
| **Grid de pedidos** | 3-5 colunas dependendo do tamanho da tela. Scroll horizontal se necessario. Novos pedidos entram pela esquerda |
| **Timer** | Contador de minutos desde que o pedido entrou. Muda de cor automaticamente: cinza (<10min), amarelo (10-15min), vermelho (>15min) |
| **Botao Bump (pronto)** | Grande, ocupa toda a largura do card. `min-h-[56px]`. Verde. Um toque para marcar como pronto. Sem confirmacao |
| **Alerta sonoro** | Novo pedido: beep curto. Pedido atrasado: beep repetido. Configuravel |
| **Filtro por estacao** | Tabs no topo: "Todos", "Cozinha", "Bar", "Sobremesa". Cada estacao ve apenas seus itens |

**Tipografia especifica**

| Uso | Tamanho | Peso |
|---|---|---|
| Numero do pedido | `text-2xl` | `font-bold` |
| Mesa | `text-lg` | `font-semibold` |
| Nome do item | `text-lg` | `font-medium` |
| Quantidade | `text-xl` | `font-bold` |
| Observacao | `text-base` | `font-semibold` |
| Timer | `text-base` | `font-mono font-bold` |

**Espacamento:** cards com `p-4`, gap de `gap-3` entre cards. Tudo visivel sem scroll quando possivel. Fonte maior que o normal — leitura a 1-2 metros de distancia.

#### 2b. Garcom — Light Mode, Mobile-First

**Superficies e Cores**

| Elemento | Valor | Tailwind |
|---|---|---|
| Fundo da pagina | `#FFFFFF` | `white` |
| Card de mesa | `#FFFFFF` com borda | `white border border-gray-200` |
| Mesa livre | Borda `#16A34A` | `border-green-600` |
| Mesa ocupada | Borda `#2563EB` | `border-blue-600` |
| Mesa pedindo conta | Borda `#CA8A04` | `border-yellow-600` |
| Mesa com pedido atrasado | Borda `#DC2626` | `border-red-600` |
| Header | `#111827` fundo, texto branco | `bg-gray-900 text-white` |
| Botao acao principal | `#EA580C` | `bg-orange-600 text-white` |
| Badge de notificacao | `#DC2626` | `bg-red-600 text-white` |
| Tab ativa | `#EA580C` | `border-b-2 border-orange-600 text-orange-600` |

**Componentes**

| Componente | Especificacao |
|---|---|
| **Mapa de mesas** | Grid com cards representando mesas. Cada card mostra: numero, status (cor da borda), tempo de ocupacao, valor parcial. Tap abre detalhe |
| **Card de mesa** | `rounded-xl`, borda lateral grossa (4px) com cor do status. Numero da mesa grande no centro. Badge se tem chamado pendente |
| **Lista de pedidos da mesa** | Itens com checkbox para marcar entregue. Status do preparo (cor). Hora do pedido |
| **Botao novo pedido** | FAB (floating action button) fixo. `rounded-full bg-orange-600 text-white shadow-lg`. 56x56px |
| **Notificacao** | Banner no topo deslizante. "Mesa 5 pedindo conta", "Pedido #42 pronto". Tap para ir direto |
| **Bottom tabs** | 4 tabs: Mesas, Pedidos, Chamados, Conta. Icone + texto. Ativa em orange |

**Tipografia:** mesma escala do cliente, mas com enfase em numeros grandes (numero da mesa, valores).

#### 2c. Caixa — Layout de Tablet

**Superficies e Cores:** mesmas do garcom (light mode), mas layout otimizado para tablet landscape.

| Componente | Especificacao |
|---|---|
| **Layout** | Split view: lista de pedidos/mesas na esquerda (40%), detalhe do pedido na direita (60%) |
| **Resumo da conta** | Card grande com todos os itens, subtotal, taxa de servico, total. Fonte grande nos valores |
| **Botoes de pagamento** | Grid: Pix, Credito, Debito, Dinheiro. Cada um com icone + texto. Grandes (`min-h-[64px]`) |
| **Botao fechar conta** | Full-width, `bg-green-600 text-white`, `min-h-[56px]`. Confirmacao antes de fechar |

---

### 3. Admin — Visual de Dashboard SaaS Moderno

**Inspiracao:** Reztro (Figma), Stripe Dashboard, Shopify Admin. Foco em dados, gestao, configuracao.

**Superficies e Cores**

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

**Componentes**

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

**Tipografia especifica**

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

**Layout**

- Sidebar fixa na esquerda (256px). Area de conteudo com `max-w-7xl mx-auto px-6 py-8`
- Dashboard: grid de KPI cards (4 colunas), graficos (2 colunas), tabela (full-width)
- Paginas de CRUD: page header + filtros + tabela + paginacao
- Paginas de formulario: card centralizado `max-w-2xl` ou split (preview ao lado)
- Mobile: sidebar vira drawer, conteudo full-width

---

### 4. Super Admin — Visual de Backoffice Interno OChefia

**Inspiracao:** Stripe Dashboard (gestao de clientes), Shopify Partners, paineis internos de plataformas SaaS. Foco em gestao cross-tenant, cobranca e controle de modulos.

**Diferenca fundamental em relacao ao Admin:** o Admin e a interface do **restaurante** (dados de um unico estabelecimento, branding do restaurante). O Super Admin e a interface da **plataforma OChefia** (dados de todos os estabelecimentos, branding OChefia). A sidebar do Super Admin usa cor diferenciada para evitar confusao.

**Superficies e Cores**

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

**Componentes**

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

**Tipografia especifica**

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

**Layout**

- Sidebar fixa na esquerda (256px). Area de conteudo com `max-w-7xl mx-auto px-6 py-8`
- Dashboard: grid de KPI cards (4 colunas), tabela de alertas recentes (estabelecimentos inadimplentes, ultimos cadastros), ultimos acessos
- Listagem de estabelecimentos: page header + filtros + busca + tabela + paginacao
- Detalhe do estabelecimento: page header com breadcrumb + card com tabs (Dados, Cobranca, Modulos)
- Formulario de cadastro: card centralizado `max-w-2xl`
- Gestao de modulos: grid de cards por modulo (2 colunas)
- Mobile: sidebar vira drawer, conteudo full-width

---

### Resumo Visual Comparativo

| Aspecto | Cliente | Staff (KDS) | Staff (Garcom) | Admin | Super Admin |
|---|---|---|---|---|---|
| **Tema** | Light | Dark | Light | Light + sidebar dark | Light + sidebar indigo |
| **Fundo** | Branco puro | `gray-900` | Branco puro | `gray-50` | `gray-50` |
| **Densidade** | Baixa | Alta | Media | Media-alta | Alta |
| **Cantos** | Muito arredondados (`2xl`) | Moderados (`lg`) | Arredondados (`xl`) | Arredondados (`xl`) | Arredondados (`xl`) |
| **Sombras** | Medias (`shadow-md`) | Nenhuma (borda) | Leves (`shadow-sm`) | Leves (`shadow-sm`) | Leves (`shadow-sm`) |
| **Cor primaria visivel** | Muito (botoes, precos, carrinho) | Pouco (foco em semanticas) | Moderado (CTAs, tabs) | Moderado (sidebar, KPIs, CTAs) | Moderado (sidebar indigo, KPIs, toggles) |
| **Cores semanticas** | Pouco (status do pedido) | Dominante (tudo por cor) | Muito (status das mesas) | Moderado (KPIs, badges) | Muito (badges de status, inadimplencia) |
| **Font size base** | `text-base` (16px) | `text-lg` a `text-xl` (18-20px) | `text-base` (16px) | `text-sm` (14px) | `text-sm` (14px) |
| **Touch target minimo** | 44x44px | 56x56px | 48x48px | 36x36px (mouse) | 36x36px (mouse) |
| **Branding** | Restaurante (personalizavel) | OChefia padrao | OChefia padrao | Restaurante (nome/logo) | OChefia (fixo, indigo) |

## Personalizacao de Cores por Restaurante (Theming)

Cada restaurante pode personalizar as cores do **modulo cliente (cardapio digital)**. Os modulos internos (admin, KDS, garcom) mantem o design system padrao.

### Cores configuraveis (tela Settings do admin)
| Variavel | Descricao | Padrao |
|---|---|---|
| `--color-primary` | Botoes de acao, CTAs, destaques | `#EA580C` (orange-600) |
| `--color-primary-hover` | Hover de botoes | Calculado automaticamente (10% mais escuro) |
| `--color-secondary` | Headers, badges, detalhes | `#111827` (gray-900) |
| `--color-background` | Fundo da tela do cliente | `#FFFFFF` (white) |
| `--color-text` | Texto principal | Calculado automaticamente (contraste com background) |
| Logo | Imagem do restaurante | Texto do nome como fallback |

### Temas Prontos

| Tema | Primaria | Secundaria | Fundo | Tom |
|---|---|---|---|---|
| **Classico** (padrao) | `#EA580C` orange | `#111827` gray-900 | `#FFFFFF` white | Clean, universal |
| **Escuro** | `#F97316` orange-400 | `#F9FAFB` gray-50 | `#111827` gray-900 | Sofisticado, bar noturno |
| **Rustico** | `#92400E` amber-800 | `#451A03` amber-950 | `#FFFBEB` amber-50 | Churrascaria, comida caseira |
| **Moderno** | `#7C3AED` violet-600 | `#1E1B4B` indigo-950 | `#FFFFFF` white | Gastrobar, contemporaneo |
| **Tropical** | `#059669` emerald-600 | `#064E3B` emerald-900 | `#FFFFFF` white | Praia, acai, sucos |
| **Personalizado** | Color picker | Color picker | Color picker | Livre |

### Implementacao tecnica
- Cores na tabela `RestaurantSettings` (`themeName`, `primaryColor`, `secondaryColor`, `backgroundColor`).
- API retorna cores em `GET /restaurants/:slug` (publico).
- Frontend injeta como **CSS custom properties** no `:root`.
- Se nao definiu nada, usa tema "Classico".
- Preview em tempo real na tela de Settings.
- **Validacao de contraste:** avisa se nao atende WCAG AA.

## Principios de UI
- **Mobile-first:** cliente e garcom 100% mobile. Admin e KDS tablet/desktop.
- **Minimalista:** pouco texto, muita acao. Cardapio como app de delivery premium.
- **Fotos grandes:** foto do produto e o elemento principal do card.
- **Feedback visual:** toda acao com resposta imediata (toast, loading, transicao).
- **Acessibilidade:** ver secao dedicada abaixo.

## Acessibilidade (a11y)

### Requisitos Minimos (Fase 1)
- **Contraste:** WCAG AA em todas as combinacoes texto/fundo. Validar com ferramenta automatica (axe-core, Lighthouse).
- **Touch targets:** botoes e links com minimo 44x44px (recomendacao WCAG 2.5.5).
- **Labels:** todo `<input>` deve ter `<label>` associado (via `htmlFor` ou `aria-label`).
- **Focus visible:** outline visivel em todos os elementos interativos ao navegar por teclado (`:focus-visible`).
- **Navegacao por teclado:** todos os fluxos criticos (cardapio, carrinho, pagamento) devem ser completaveis sem mouse/touch.
- **Aria attributes:**
  - `aria-label` em botoes com icone sem texto.
  - `aria-live="polite"` em regioes que atualizam em tempo real (status do pedido, timer KDS).
  - `role="alert"` em mensagens de erro e toast notifications.
  - `aria-expanded` em menus dropdown e modais.
- **Semantica HTML:** usar tags semanticas (`<nav>`, `<main>`, `<header>`, `<footer>`, `<section>`, `<article>`) em vez de `<div>` generico.
- **Imagens:** `alt` descritivo em fotos de produtos. `alt=""` para imagens decorativas.

### Testes de Acessibilidade
- **Automatizado:** axe-core integrado nos testes e2e (Playwright). Rodar `@axe-core/playwright` em todas as paginas.
- **Manual:** testar fluxo completo do cliente com navegacao por teclado (Tab, Enter, Escape).
- **Screen reader:** testar pelo menos 1x antes de cada release com NVDA (Windows) ou VoiceOver (Mac).

### Prioridade por Modulo
| Modulo | Prioridade a11y | Motivo |
|---|---|---|
| Cliente (cardapio) | **Alta** | Publico diverso, possivel obrigacao legal |
| Admin | Media | Uso interno, equipe treinada |
| KDS | Baixa | Operado por equipe em ambiente controlado |
| Garcom | Media | Mobile, uso rapido, equipe treinada |
| Super Admin | Baixa | Uso exclusivo da equipe interna OChefia, poucos usuarios |
