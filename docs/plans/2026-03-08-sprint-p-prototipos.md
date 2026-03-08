# Sprint P — Protótipos HTML: Plano de Implementação

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Criar protótipos funcionais em HTML+CSS+JS vanilla para validação visual e de fluxo de todas as interfaces do OChefia.

**Architecture:** Arquivos HTML estáticos com CSS compartilhado (variáveis CSS, componentes base por interface) e JS compartilhado (dados mock hardcoded, interações DOM). Sem framework, sem bundler, sem persistência. Cada arquivo HTML é autocontido com links de navegação entre telas.

**Tech Stack:** HTML5, CSS3 (custom properties, flexbox, grid), JS vanilla (ES6+), Google Fonts (Inter)

**Docs de referência:**
- `docs/design-system.md` — Paleta, tipografia, componentes por interface
- `docs/modulos.md` — Regras de negócio, fluxos, campos
- `docs/sprints.md` — Checklist da Sprint P

---

## Estrutura de Arquivos

```
prototypes/
├── index.html
├── style-guide.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── cliente/
│   ├── whatsapp.html
│   ├── pessoas.html
│   ├── cardapio.html
│   ├── produto.html
│   ├── carrinho.html
│   ├── pedidos.html
│   ├── conta.html
│   └── pagamento.html
├── admin/
│   ├── login.html
│   ├── dashboard.html
│   ├── mesas.html
│   ├── cardapio-admin.html
│   ├── faturamento.html
│   ├── staff.html
│   ├── escala.html
│   ├── equipe-do-dia.html
│   └── settings.html
├── kds/
│   ├── cozinha.html
│   └── bar.html
└── garcom/
    ├── clock-in.html
    ├── mesas.html
    ├── chamados.html
    ├── mesa-detalhe.html
    └── comanda.html
```

---

## Dados Mock (definidos em `js/app.js`)

Restaurante **"Zé do Bar"** (slug: `ze-bar`). Dados realistas brasileiros:

**Categorias:** Entradas, Pratos Principais, Hamburgueres, Bebidas, Sobremesas

**Produtos (~15):**
| Nome | Categoria | Preço | Destino | Tags |
|---|---|---|---|---|
| Bolinho de Bacalhau (6un) | Entradas | R$ 32,00 | cozinha | — |
| Torresmo Crocante | Entradas | R$ 28,00 | cozinha | — |
| Bruschetta de Tomate | Entradas | R$ 24,00 | cozinha | vegano |
| Picanha na Brasa (400g) | Pratos | R$ 89,90 | cozinha | — |
| Filé à Parmegiana | Pratos | R$ 62,00 | cozinha | — |
| Salmão Grelhado | Pratos | R$ 78,00 | cozinha | sem glúten |
| Risoto de Cogumelos | Pratos | R$ 56,00 | cozinha | vegano |
| Smash Burger Duplo | Hamburgueres | R$ 42,00 | cozinha | — |
| Burger Vegano | Hamburgueres | R$ 38,00 | cozinha | vegano |
| Chopp Pilsen 500ml | Bebidas | R$ 16,00 | bar | — |
| Caipirinha Limão | Bebidas | R$ 22,00 | bar | — |
| Suco Natural Laranja | Bebidas | R$ 12,00 | bar | vegano, sem glúten |
| Água Mineral 500ml | Bebidas | R$ 6,00 | garcom | — |
| Petit Gâteau | Sobremesas | R$ 34,00 | cozinha | — |
| Pudim de Leite | Sobremesas | R$ 18,00 | cozinha | — |

**Pessoas na mesa:** João, Maria, Pedro

**Mesas:** 15 mesas (Mesa 1 a Mesa 15) com status variados

**Staff:** Carlos (garçom), Ana (cozinha), Bruno (bar), Dono (owner — dono@ze-bar.com)

**Pedidos mock:** 3-4 pedidos em estados diferentes (Na fila, Preparando, Pronto, Entregue)

---

## Task 1: CSS Foundation — Design System (`css/style.css`)

**Files:**
- Create: `prototypes/css/style.css`

**Step 1: Criar o CSS com variáveis, reset, tipografia e componentes base**

O CSS deve conter:

1. **CSS Reset** mínimo (box-sizing, margin 0)
2. **Custom properties** — todas as cores do design system (`:root` para tema Clássico)
3. **Tema Escuro** via `[data-theme="escuro"]` no `:root`
4. **Tipografia** — Inter via Google Fonts, escala de tamanhos
5. **Componentes base compartilhados:**
   - `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger`
   - `.badge`, `.badge-success`, `.badge-warning`, `.badge-error`, `.badge-info`
   - `.card`, `.card-elevated`
   - `.input`, `.input-group`, `.input-error`
   - `.modal`, `.modal-overlay`
   - `.toast`
   - `.chip`, `.chip-active`
6. **Layout helpers:** `.container`, `.flex`, `.grid`, `.gap-*`, `.p-*`, `.m-*`
7. **Interface Cliente:** estilos mobile-first (375px), cards de produto, barra de categorias, carrinho flutuante, header com blur, bottom nav
8. **Interface Admin:** sidebar 256px dark, page header, KPI cards, tabelas com zebra/hover, formulários
9. **Interface KDS:** dark mode, grid de pedidos, cards com borda de status, timers
10. **Interface Garçom:** header dark, cards de mesa com borda de status, bottom tabs, FAB
11. **Responsivo:** media queries para mobile (375px), tablet (768px), desktop (1024px+)
12. **Utilitários de acessibilidade:** focus-visible, sr-only

**Step 2: Commit**

```bash
git add prototypes/css/style.css
git commit -m "proto: add design system CSS with all interface styles"
```

---

## Task 2: JavaScript Foundation (`js/app.js`)

**Files:**
- Create: `prototypes/js/app.js`

**Step 1: Criar o JS com dados mock e funções de interação**

O JS deve conter:

1. **Dados mock** — objeto `MOCK` com restaurant, categories, products, people, tables, staff, orders, schedule
2. **Funções de renderização** — helpers para criar HTML de componentes (cards, tabelas, badges)
3. **Estado do carrinho** — `cart[]` com add/remove/update, cálculo de total
4. **Seleção de pessoas** — toggle de pessoas por item do carrinho
5. **Navegação por abas/tabs** — função genérica para tabs
6. **Troca de status no KDS** — bump de pedidos, atualização de timer
7. **Timer** — contagem de tempo em minutos para KDS
8. **Modal** — abrir/fechar modais genéricos
9. **Toast** — mostrar notificações temporárias
10. **Theming** — função para trocar tema (Clássico/Escuro) com CSS custom properties
11. **Sidebar toggle** — abrir/fechar sidebar admin no mobile
12. **Busca/filtro** — filtrar produtos por categoria e tags
13. **Chamado "O Chefia"** — modal com motivo + mensagem
14. **Pessoas no header** — modal permanente para add/remove pessoas

**Step 2: Commit**

```bash
git add prototypes/js/app.js
git commit -m "proto: add mock data and interaction logic"
```

---

## Task 3: Style Guide + Index (`style-guide.html`, `index.html`)

**Files:**
- Create: `prototypes/style-guide.html`
- Create: `prototypes/index.html`

**Step 1: Criar style-guide.html**

Página que renderiza visualmente todos os elementos do design system:
- Paleta de cores (swatches com hex e nome)
- Tipografia (escala de tamanhos com exemplos)
- Botões (todos os variants e estados)
- Badges (todos os tipos)
- Cards (produto, KPI, mesa, pedido KDS)
- Inputs e formulários
- Modais
- Toasts
- Tabelas
- Chips de categoria
- Comparativo visual das 3 interfaces (exemplos lado a lado)

**Step 2: Criar index.html**

Hub com links organizados por seção:
- Design System (style-guide.html)
- Cliente (8 links)
- Admin (9 links)
- KDS (2 links)
- Garçom (5 links)

Estilizado como dashboard simples com cards por seção.

**Step 3: Commit**

```bash
git add prototypes/style-guide.html prototypes/index.html
git commit -m "proto: add style guide and index hub"
```

---

## Task 4: Cliente — WhatsApp + Pessoas

**Files:**
- Create: `prototypes/cliente/whatsapp.html`
- Create: `prototypes/cliente/pessoas.html`

**Step 1: whatsapp.html**

- Logo do restaurante (Zé do Bar) no topo
- Input de telefone com máscara (XX) XXXXX-XXXX
- Botão "Enviar código via WhatsApp"
- Tela de input do OTP (6 dígitos) — mostrada após "envio"
- Botão "Verificar" → navega para pessoas.html
- Mobile layout (375px), tema Clássico

**Step 2: pessoas.html**

- Header com nome do restaurante + botão pessoas (ícone grupo)
- Lista de pessoas já cadastradas (João, Maria, Pedro — mock)
- Input "Nome da pessoa" + botão "Adicionar"
- Cada pessoa com botão remover (X)
- Botão "Continuar para o cardápio" → navega para cardapio.html
- Bottom nav: Cardápio | Pedidos | Conta | O Chefia

**Step 3: Commit**

```bash
git add prototypes/cliente/whatsapp.html prototypes/cliente/pessoas.html
git commit -m "proto: add client WhatsApp verification and people screens"
```

---

## Task 5: Cliente — Cardápio + Produto

**Files:**
- Create: `prototypes/cliente/cardapio.html`
- Create: `prototypes/cliente/produto.html`

**Step 1: cardapio.html**

- Header sticky com blur: logo Zé do Bar + ícone pessoas (abre modal)
- Barra de categorias horizontal (chips scrolláveis)
- Filtros de tags (vegano, sem glúten, picante)
- Grid/lista de produtos com: foto 16:9, nome, descrição truncada 2 linhas, preço em orange, botão "+"
- Barra do carrinho flutuante no bottom (orange, mostra total e qtd)
- Modal de pessoas (acessível pelo header)
- Bottom nav: Cardápio | Pedidos | Conta | O Chefia
- Modal "O Chefia" funcional (motivo + mensagem + enviar)
- **2 temas:** Clássico (padrão) + toggle para Escuro (demonstrar theming)

**Step 2: produto.html**

- Foto hero (40% da tela) com botão voltar
- Nome, descrição completa, preço
- Tags (badges: vegano, sem glúten)
- Seleção de quantidade (+/-)
- Seleção de pessoas (checkboxes — obrigatório pelo menos 1)
- Botão fixo embaixo "Adicionar R$ XX,XX"
- Header com ícone pessoas

**Step 3: Commit**

```bash
git add prototypes/cliente/cardapio.html prototypes/cliente/produto.html
git commit -m "proto: add client menu and product detail screens"
```

---

## Task 6: Cliente — Carrinho + Pedidos

**Files:**
- Create: `prototypes/cliente/carrinho.html`
- Create: `prototypes/cliente/pedidos.html`

**Step 1: carrinho.html**

- Header "Meu Carrinho" + ícone pessoas
- Lista de itens: foto thumb, nome, preço, quantidade (+/-), pessoas atribuídas (chips com nomes)
- Editar pessoas por item (modal/inline)
- Subtotal, taxa de serviço (10%), total
- Botão "Enviar Pedido"
- Botão "Continuar comprando" (volta ao cardápio)
- Bottom nav

**Step 2: pedidos.html**

- Header "Meus Pedidos" + ícone pessoas
- Lista de pedidos agrupados por envio (Pedido #1, #2...)
- Cada pedido com: hora, status geral, lista de itens com status individual
- Status com timeline vertical: Na fila (azul) → Preparando (amarelo) → Pronto (verde) → Entregue (verde)
- Animação pulse no status atual
- Possibilidade de reatribuir pessoas (botão editar)
- Sub-pedidos com sufixo (cozinha/bar) visíveis
- Bottom nav

**Step 3: Commit**

```bash
git add prototypes/cliente/carrinho.html prototypes/cliente/pedidos.html
git commit -m "proto: add client cart and orders screens"
```

---

## Task 7: Cliente — Conta + Pagamento

**Files:**
- Create: `prototypes/cliente/conta.html`
- Create: `prototypes/cliente/pagamento.html`

**Step 1: conta.html**

- Header "Conta" + ícone pessoas
- Tabs: "Visão Geral" | "Por Pessoa"
- **Visão geral:** lista todos os itens com quantidade de pessoas entre parênteses (ex: "Picanha na Brasa (3)"). Click abre modal para editar quem divide
- **Por pessoa:** tabs ou accordion com itens de cada pessoa. Itens com divisão diferente têm barra lateral colorida para distinguir
- Subtotal, taxa de serviço (10%), total
- Valor por pessoa calculado
- Botão "Pagar" por pessoa
- Bottom nav

**Step 2: pagamento.html**

- Header "Pagamento" + ícone pessoas
- Seletor de pessoa (quem está pagando)
- Valor individual da pessoa
- QR Code Pix (imagem mock/SVG placeholder)
- Código copia-e-cola (mock)
- Botão "Copiar código"
- Status do pagamento (aguardando → confirmado)
- Botão "Voltar para a conta"
- Bottom nav

**Step 3: Commit**

```bash
git add prototypes/cliente/conta.html prototypes/cliente/pagamento.html
git commit -m "proto: add client bill and payment screens"
```

---

## Task 8: Admin — Login + Dashboard

**Files:**
- Create: `prototypes/admin/login.html`
- Create: `prototypes/admin/dashboard.html`

**Step 1: login.html**

- Centralizado na tela, card branco com sombra
- Logo OChefia
- Input email + input senha
- Botão "Entrar" (orange)
- Link "Esqueci minha senha"
- Sem sidebar (tela pré-auth)

**Step 2: dashboard.html**

- **Sidebar** dark (256px): logo OChefia, nav agrupada (Visão Geral, Mesas, Cardápio, Faturamento, Equipe, Escala, Equipe do Dia, Configurações). Avatar + role embaixo
- **Page header:** "Dashboard" + breadcrumb
- **KPI cards** (4 colunas): Receita Hoje (R$ 4.280), Pedidos (47), Ticket Médio (R$ 91,06), Mesas Ativas (8/15)
- **Fila de pedidos recentes** — tabela com últimos pedidos (hora, mesa, itens, status, valor)
- **Chamados abertos** — lista com mesa + motivo + tempo
- Responsivo: sidebar vira drawer no mobile

**Step 3: Commit**

```bash
git add prototypes/admin/login.html prototypes/admin/dashboard.html
git commit -m "proto: add admin login and dashboard screens"
```

---

## Task 9: Admin — Mesas + Cardápio CRUD

**Files:**
- Create: `prototypes/admin/mesas.html`
- Create: `prototypes/admin/cardapio-admin.html`

**Step 1: mesas.html**

- Sidebar admin + page header "Mesas"
- Grid de mesas (cards) com: número, status (livre/ocupada/conta/atrasada — cor da borda), tempo de ocupação, valor parcial, pessoas
- Legenda de cores
- Botão "+ Nova Mesa"
- Modal de edição de mesa

**Step 2: cardapio-admin.html**

- Sidebar admin + page header "Cardápio"
- Tabs: "Categorias" | "Tags" | "Produtos"
- **Categorias:** tabela com nome, qtd produtos, ordem, ações (editar/excluir)
- **Tags:** grid de chips com ações
- **Produtos:** tabela com foto thumb, nome, categoria, preço, destino (badge: cozinha/bar/garçom), tags, disponível (toggle), ações
- Modal de criação/edição de produto com: nome, descrição, categoria (select), preço, destino (radio: cozinha/bar/garçom), tags (checkboxes), upload de fotos (placeholder)
- Botão "+ Novo Produto"

**Step 3: Commit**

```bash
git add prototypes/admin/mesas.html prototypes/admin/cardapio-admin.html
git commit -m "proto: add admin tables and menu CRUD screens"
```

---

## Task 10: Admin — Faturamento + Staff

**Files:**
- Create: `prototypes/admin/faturamento.html`
- Create: `prototypes/admin/staff.html`

**Step 1: faturamento.html**

- Sidebar admin + page header "Faturamento"
- Tabs: "Diário" | "Mensal" | "Taxas de Garçom"
- **Diário:** KPI cards (receita, pedidos, ticket médio, comparativo ↑↓), lista de pedidos do dia
- **Mensal:** KPI cards + gráfico de barras (receita por dia do mês — placeholder SVG), comparativo com mês anterior
- **Taxas de Garçom:** tabela com nome do garçom, mesas atendidas, valor taxa de serviço, período (filtro dia/mês)

**Step 2: staff.html**

- Sidebar admin + page header "Equipe"
- Tabela: nome, role (badge), email, telefone, temporário? (badge), dias fixos, entrega BAR? (badge), ações
- Botão "+ Novo Funcionário"
- Modal de criação: nome, email, telefone, role (select), senha do garçom (se garçom), temporário (toggle), dias fixos (checkboxes seg-dom), flag "também entrega" (se BAR)
- Botão "Enviar Convite"

**Step 3: Commit**

```bash
git add prototypes/admin/faturamento.html prototypes/admin/staff.html
git commit -m "proto: add admin billing and staff screens"
```

---

## Task 11: Admin — Escala + Equipe do Dia

**Files:**
- Create: `prototypes/admin/escala.html`
- Create: `prototypes/admin/equipe-do-dia.html`

**Step 1: escala.html**

- Sidebar admin + page header "Escala"
- Calendário/lista dos próximos 7 dias
- Cada dia mostra: lista de funcionários escalados (auto-preenchido: permanentes + temporários com dia fixo)
- Toggle para desmarcar/marcar cada pessoa
- Botão "Adicionar temporário" por dia
- Visual tipo agenda/planner

**Step 2: equipe-do-dia.html**

- Sidebar admin + page header "Equipe do Dia" + data de hoje
- Lista de quem trabalha hoje (vindo da escala)
- Toggle para desmarcar/marcar
- Botão "Adicionar temporário"
- Seção "Distribuição de Mesas": lista de garçons ativos com mesas atribuídas (drag visual ou select)
- Indicador do modo de distribuição (Todos vs Automático — vem de Settings)

**Step 3: Commit**

```bash
git add prototypes/admin/escala.html prototypes/admin/equipe-do-dia.html
git commit -m "proto: add admin schedule and daily team screens"
```

---

## Task 12: Admin — Settings (com Theming)

**Files:**
- Create: `prototypes/admin/settings.html`

**Step 1: settings.html**

- Sidebar admin + page header "Configurações"
- Seções:
  1. **Estabelecimento:** nome, logo (upload placeholder), slug
  2. **Taxa de serviço:** input percentual (10% padrão)
  3. **Modo de distribuição de mesas:** radio (Todos / Automático) com descrição de cada
  4. **Tema do cardápio:** grid de temas prontos (Clássico, Escuro, Rústico, Moderno, Tropical, Personalizado). Card visual de cada tema com preview de cores. Seleção ativa com borda orange
  5. **Color picker** (para Personalizado): inputs de cor para primária, secundária, fundo
  6. **Preview do cardápio:** mini iframe ou div estilizada mostrando como fica o cardápio com o tema selecionado. Atualiza em tempo real ao trocar tema
- Botão "Salvar Configurações"

**Step 2: Commit**

```bash
git add prototypes/admin/settings.html
git commit -m "proto: add admin settings with theme picker and preview"
```

---

## Task 13: KDS — Cozinha + Bar

**Files:**
- Create: `prototypes/kds/cozinha.html`
- Create: `prototypes/kds/bar.html`

**Step 1: cozinha.html**

- **Dark mode obrigatório** (fundo gray-900)
- Header: "KDS — Cozinha" + indicador de conexão (bolinha verde) + filtro de estação
- Grid de 4 colunas com cards de pedido:
  - Header: número do pedido (#42) + mesa (Mesa 5) + timer (3min, 12min, 18min)
  - Lista de itens com quantidade (ex: "2x Picanha na Brasa")
  - Observações em amarelo ("Sem cebola", "Ponto mal passado")
  - Borda lateral muda de cor: verde (<10min), amarela (10-15min), vermelha (>15min)
  - Botão "Pronto" (verde, full-width, grande)
- Pedidos mock em diferentes tempos para demonstrar as 3 cores
- Layout landscape (1024px+)
- Textos grandes (legível a 1-2m de distância)

**Step 2: bar.html**

- Mesma estrutura do cozinha, mas:
  - Header: "KDS — Bar"
  - Produtos de bar (Chopp, Caipirinha, etc.)
  - Pedidos com flag "entrega" mostram botões "Pronto" + "Entregue"

**Step 3: Commit**

```bash
git add prototypes/kds/cozinha.html prototypes/kds/bar.html
git commit -m "proto: add KDS kitchen and bar screens with timers"
```

---

## Task 14: Garçom — Clock-in + Mesas + Chamados

**Files:**
- Create: `prototypes/garcom/clock-in.html`
- Create: `prototypes/garcom/mesas.html`
- Create: `prototypes/garcom/chamados.html`

**Step 1: clock-in.html**

- Header dark: "OChefia — Garçom"
- Card centralizado com: selecionar nome (select dos garçons do dia) + input senha + botão "Iniciar Turno"
- Após "login": mostra hora de início + botão "Encerrar Turno"

**Step 2: mesas.html**

- Header dark: "Minhas Mesas" + badge de notificação
- Grid de cards de mesa: número grande, borda de status (verde livre, azul ocupada, amarela conta, vermelha atrasada), tempo de ocupação, valor parcial
- Badge de chamado pendente na mesa
- FAB (botão flutuante) "+ Novo Pedido" (orange)
- Bottom tabs: Mesas | Chamados | Conta | Perfil

**Step 3: chamados.html**

- Header dark: "Chamados" + badge com contagem
- Lista de chamados abertos: mesa, motivo (badge), mensagem, tempo desde abertura
- Botões "Vi" (acknowledge) e "Resolvido" por chamado
- Chamados resolvidos ficam esmaecidos
- Bottom tabs

**Step 4: Commit**

```bash
git add prototypes/garcom/clock-in.html prototypes/garcom/mesas.html prototypes/garcom/chamados.html
git commit -m "proto: add waiter clock-in, tables, and calls screens"
```

---

## Task 15: Garçom — Mesa Detalhe + Comanda

**Files:**
- Create: `prototypes/garcom/mesa-detalhe.html`
- Create: `prototypes/garcom/comanda.html`

**Step 1: mesa-detalhe.html**

- Header dark: "Mesa 5" + botão voltar
- Info da mesa: pessoas (João, Maria, Pedro), tempo de ocupação, valor total parcial
- Lista de pedidos por pessoa: tabs com nome de cada pessoa, itens com status (badge colorido)
- Itens com checkbox "Entregue"
- Botão "Pedir Conta" (amarelo)
- Botão "Novo Pedido" (orange)

**Step 2: comanda.html**

- Header dark: "Novo Pedido — Mesa 5"
- Busca rápida de produto (input)
- Lista de produtos por categoria (accordion/tabs)
- Cada produto: nome, preço, botão "+" para adicionar
- Itens adicionados aparecem no rodapé com total
- Seleção de pessoas por item
- Botão "Enviar Pedido"

**Step 3: Commit**

```bash
git add prototypes/garcom/mesa-detalhe.html prototypes/garcom/comanda.html
git commit -m "proto: add waiter table detail and order screens"
```

---

## Task 16: Interações JS + Navegação + Polimento

**Files:**
- Modify: `prototypes/js/app.js`
- Modify: todos os HTML (links de navegação)

**Step 1: Verificar e ajustar navegação entre TODAS as telas**

- Todos os links/botões de navegação funcionam
- Bottom nav do cliente aponta para as telas corretas
- Sidebar do admin marca item ativo correto
- Bottom tabs do garçom funcionam
- Botão voltar funciona em todas as telas

**Step 2: Verificar interações JS**

- Adicionar ao carrinho funciona no cardápio
- Seleção de pessoas por item funciona no carrinho
- Troca de abas funciona (categorias, tabs de conta, tabs de faturamento)
- Mudança de status no KDS funciona (botão Pronto)
- Timers do KDS incrementam
- Modal "O Chefia" funciona em todas as telas do cliente
- Modal de pessoas funciona em todas as telas do cliente
- Theming (Clássico ↔ Escuro) funciona no cardápio
- Settings theme picker atualiza preview
- Toast notifications aparecem em ações
- Sidebar toggle funciona no mobile admin

**Step 3: Verificar responsividade**

- Cliente e garçom: 375px mobile
- Admin e KDS: 1024px+ desktop/tablet
- Sidebar admin colapsa em mobile

**Step 4: Commit**

```bash
git add -A prototypes/
git commit -m "proto: wire navigation, interactions, and responsiveness"
```

---

## Task 17: Validação final + Atualização de Docs

**Files:**
- Modify: `docs/sprints.md` — marcar checklist items como [x]

**Step 1: Revisar checklist da Sprint P em `docs/sprints.md`**

Verificar cada item:
- [x] style-guide.html
- [x] Telas do cliente (fluxo completo)
- [x] Telas do admin (todas)
- [x] Telas do KDS (cozinha e bar)
- [x] Telas do garçom (todas)
- [x] Navegação funcional
- [x] Interações JS
- [x] Responsivo
- [x] Settings com tema + color picker + preview
- [x] 2 temas demonstrados (Clássico + Escuro)

**Step 2: Atualizar docs/sprints.md com checkboxes marcados**

**Step 3: Commit**

```bash
git add docs/sprints.md
git commit -m "docs: mark Sprint P checklist as complete"
```

---

## Resumo de Commits

| # | Mensagem | Arquivos |
|---|---|---|
| 1 | `proto: add design system CSS with all interface styles` | css/style.css |
| 2 | `proto: add mock data and interaction logic` | js/app.js |
| 3 | `proto: add style guide and index hub` | style-guide.html, index.html |
| 4 | `proto: add client WhatsApp verification and people screens` | cliente/whatsapp.html, pessoas.html |
| 5 | `proto: add client menu and product detail screens` | cliente/cardapio.html, produto.html |
| 6 | `proto: add client cart and orders screens` | cliente/carrinho.html, pedidos.html |
| 7 | `proto: add client bill and payment screens` | cliente/conta.html, pagamento.html |
| 8 | `proto: add admin login and dashboard screens` | admin/login.html, dashboard.html |
| 9 | `proto: add admin tables and menu CRUD screens` | admin/mesas.html, cardapio-admin.html |
| 10 | `proto: add admin billing and staff screens` | admin/faturamento.html, staff.html |
| 11 | `proto: add admin schedule and daily team screens` | admin/escala.html, equipe-do-dia.html |
| 12 | `proto: add admin settings with theme picker and preview` | admin/settings.html |
| 13 | `proto: add KDS kitchen and bar screens with timers` | kds/cozinha.html, bar.html |
| 14 | `proto: add waiter clock-in, tables, and calls screens` | garcom/clock-in.html, mesas.html, chamados.html |
| 15 | `proto: add waiter table detail and order screens` | garcom/mesa-detalhe.html, comanda.html |
| 16 | `proto: wire navigation, interactions, and responsiveness` | todos |
| 17 | `docs: mark Sprint P checklist as complete` | docs/sprints.md |
