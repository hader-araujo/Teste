# Design System

## Quatro Interfaces, Quatro Experiências

O OChefia não tem um único layout. São **quatro interfaces completamente distintas**, cada uma projetada para um público, contexto e objetivo diferente. Elas compartilham a mesma paleta de cores base e tipografia, mas divergem em tudo mais: densidade de informação, tamanho de elementos, navegação, tom visual e prioridades de UX.

### 1. Interface do Cliente (PWA — Cardápio Digital)

**Quem usa:** cliente no bar/restaurante, celular na mão.
**Contexto:** pessoa quer pedir rápido, sem fricção. Não baixou app, não fez cadastro. Escaneou o QR Code e pronto.
**Tom visual:** limpo, convidativo, fotos grandes, parece um app de delivery premium (iFood, Rappi).

| Aspecto | Diretriz |
|---|---|
| Layout | Mobile-only. Scroll vertical. Cards de produto com foto dominante |
| Navegação | Bottom nav fixa com 4 tabs (Cardápio, Pedidos, Conta, O Chefia) + categorias no topo (na tela de cardápio) + botão de pessoas no header |
| Densidade | Baixa. Muito espaço em branco. Poucos elementos por tela |
| Interação | Toque simples. Adicionar ao carrinho em 1 tap. Sem menus complexos |
| Foco | Fotos dos pratos, preços claros, botão de pedir sempre visível |
| Theming | Personalizável por restaurante (cores, logo) — ver seção Theming abaixo |

**Referências visuais:** apps de delivery (iFood, Rappi), menus QR (ChoiceQR, MENU TIGER), cardápios digitais modernos.

### 2. Interface do Staff (Garçom, KDS, Caixa)

**Quem usa:** garçom com celular, cozinheiro olhando tela na parede, caixa no tablet.
**Contexto:** operação em tempo real, ambiente agitado, mãos ocupadas/sujas/molhadas. Cada segundo conta.
**Tom visual:** funcional, alto contraste, botões grandes, zero decoração desnecessária.

| Aspecto | Diretriz |
|---|---|
| Layout | Garçom: mobile. KDS: landscape (tablet/TV). Caixa: tablet |
| Navegação | Tabs ou grid fixo. Nada escondido em menus dropdown |
| Densidade | Alta. Muita informação visível sem scroll — mesas, pedidos, timers |
| Interação | Toques rápidos, áreas de toque grandes (min 48x48px). KDS: bump com um toque |
| Foco | Status em tempo real. Cores codificam urgência (verde/amarelo/vermelho) |
| Theming | Não personalizável. Design system padrão sempre. KDS usa dark mode obrigatório |

**Referências visuais:** Toast POS, Square POS, McDonald's KDS, Lightspeed, sistemas POS profissionais.

### 3. Interface do Admin (Dashboard do Dono/Gerente)

**Quem usa:** dono do restaurante, gerente, equipe administrativa.
**Contexto:** escritório ou celular, analisando dados, configurando cardápio, gerenciando equipe. Uso mais demorado e analítico.
**Tom visual:** profissional, dashboard SaaS moderno, sidebar com navegação completa, cards com métricas e gráficos.

| Aspecto | Diretriz |
|---|---|
| Layout | Desktop-first (responsivo para tablet/mobile). Sidebar + área de conteúdo |
| Navegação | Sidebar com menu completo agrupado por seção (pedidos, cardápio, operação [locais de preparo, setores, mesas], equipe, financeiro, config) |
| Densidade | Média-alta. Gráficos, tabelas, KPIs. Informação densa mas bem hierarquizada |
| Interação | Formulários, filtros, date pickers, drag-and-drop (reordenar cardápio) |
| Foco | Métricas de negócio, gestão de cardápio, configurações. Decisões baseadas em dados |
| Theming | Não personalizável. Design system padrão sempre |

**Referências visuais:** Stripe Dashboard, Shopify Admin, Linear, dashboards SaaS modernos, Tenzo, 7shifts.

### 4. Interface do Super Admin (Painel Interno OChefia)

**Quem usa:** equipe interna do OChefia (role `SUPER_ADMIN`).
**Contexto:** gestão de todos os estabelecimentos da plataforma. Cadastro, cobrança, módulos, monitoramento. Acesso cross-tenant.
**Tom visual:** semelhante ao Admin, mas com branding OChefia (não do restaurante). Visual de backoffice SaaS interno — mais denso e utilitário que o Admin do restaurante.

| Aspecto | Diretriz |
|---|---|
| Layout | Desktop-first. Sidebar + área de conteúdo (mesmo padrão do Admin) |
| Navegação | Sidebar com branding OChefia. Menu: Dashboard, Estabelecimentos, Módulos, Monitoramento |
| Densidade | Alta. Tabelas com muitos registros, filtros, paginação. Dados cross-tenant |
| Interação | Formulários, filtros, toggles de módulos, registro de pagamentos, alteração de status |
| Foco | Gestão de estabelecimentos, cobrança, inadimplência, habilitação de módulos |
| Theming | Não personalizável. Branding OChefia fixo |

**Referências visuais:** Stripe Dashboard (gestão de clientes), Shopify Partners, painéis administrativos de plataformas SaaS (backoffice interno).

### Por que quatro interfaces separadas

- **Objetivos opostos:** o cliente quer pedir em 30 segundos; o admin quer analisar dados por 30 minutos; o cozinheiro quer ver o próximo pedido sem tocar na tela; o Super Admin quer gerenciar dezenas de estabelecimentos.
- **Dispositivos diferentes:** celular (cliente/garçom), tablet/TV (KDS/caixa), desktop (admin/super admin).
- **Níveis de complexidade:** o cliente vê 5 telas no máximo; o admin tem dezenas de telas; o Super Admin opera cross-tenant com visão da plataforma inteira.
- **Contexto de uso:** cliente está relaxando; staff está sob pressão; admin está planejando; Super Admin está administrando o negócio OChefia.
- **Branding diferente:** o Admin mostra o nome/logo do restaurante; o Super Admin mostra branding OChefia — são domínios completamente diferentes.

Um layout único para os quatro seria genérico demais e ruim para todos. Cada interface deve ser a melhor possível para seu público.

---

## Paleta de Cores

| Token | Hex | Tailwind | Uso |
|---|---|---|---|
| **Primária** | `#EA580C` | `orange-600` | Botões de ação, destaques, CTAs, links ativos |
| **Primária hover** | `#C2410C` | `orange-700` | Hover de botões |
| **Primária light** | `#FFF7ED` | `orange-50` | Backgrounds sutis, badges |
| **Neutra escura** | `#111827` | `gray-900` | Sidebar, headers, textos principais |
| **Neutra média** | `#6B7280` | `gray-500` | Textos secundários, placeholders |
| **Neutra clara** | `#F9FAFB` | `gray-50` | Fundos de página (admin, garçom) |
| **Sucesso** | `#16A34A` | `green-600` | Pronto, entregue, confirmado, online |
| **Atenção** | `#CA8A04` | `yellow-600` | Preparando, alerta, atenção |
| **Erro** | `#DC2626` | `red-600` | Atrasado, erro, urgente, offline |
| **Info** | `#2563EB` | `blue-600` | Na fila, informativo, links |
| **Branco** | `#FFFFFF` | `white` | Cards, modais, fundos de input |

## Tipografia Base

- **Font:** Inter (via Google Fonts) com fallback `system-ui, -apple-system, sans-serif`.
- **Tamanhos:** seguir escala do Tailwind (`text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`).
- **Peso:** `font-normal` para corpo, `font-medium` para labels, `font-semibold` para títulos, `font-bold` para destaques.

---

## Resumo Visual Comparativo

| Aspecto | Cliente | Staff (KDS) | Staff (Garçom) | Admin | Super Admin |
|---|---|---|---|---|---|
| **Tema** | Light | Dark | Light | Light + sidebar dark | Light + sidebar indigo |
| **Fundo** | Branco puro | `gray-900` | Branco puro | `gray-50` | `gray-50` |
| **Densidade** | Baixa | Alta | Média | Média-alta | Alta |
| **Cantos** | Muito arredondados (`2xl`) | Moderados (`lg`) | Arredondados (`xl`) | Arredondados (`xl`) | Arredondados (`xl`) |
| **Sombras** | Médias (`shadow-md`) | Nenhuma (borda) | Leves (`shadow-sm`) | Leves (`shadow-sm`) | Leves (`shadow-sm`) |
| **Cor primária visível** | Muito (botões, preços, carrinho) | Pouco (foco em semânticas) | Moderado (CTAs, tabs) | Moderado (sidebar, KPIs, CTAs) | Moderado (sidebar indigo, KPIs, toggles) |
| **Cores semânticas** | Pouco (status do pedido) | Dominante (tudo por cor) | Muito (status das mesas) | Moderado (KPIs, badges) | Muito (badges de status, inadimplência) |
| **Font size base** | `text-base` (16px) | `text-lg` a `text-xl` (18-20px) | `text-base` (16px) | `text-sm` (14px) | `text-sm` (14px) |
| **Touch target mínimo** | 44x44px | 56x56px | 48x48px | 36x36px (mouse) | 36x36px (mouse) |
| **Branding** | Restaurante (personalizável) | OChefia padrão | OChefia padrão | Restaurante (nome/logo) | OChefia (fixo, indigo) |

## Personalização de Cores por Restaurante (Theming)

Cada restaurante pode personalizar as cores do **módulo cliente (cardápio digital)**. Os módulos internos (admin, KDS, garçom) mantêm o design system padrão.

### Cores configuráveis (tela Settings do admin)
| Variável | Descrição | Padrão |
|---|---|---|
| `--color-primary` | Botões de ação, CTAs, destaques | `#EA580C` (orange-600) |
| `--color-primary-hover` | Hover de botões | Calculado automaticamente (10% mais escuro) |
| `--color-secondary` | Headers, badges, detalhes | `#111827` (gray-900) |
| `--color-background` | Fundo da tela do cliente | `#FFFFFF` (white) |
| `--color-text` | Texto principal | Calculado automaticamente (contraste com background) |
| Logo | Imagem do restaurante | Texto do nome como fallback |

### Temas Prontos

| Tema | Primária | Secundária | Fundo | Tom |
|---|---|---|---|---|
| **Clássico** (padrão) | `#EA580C` orange | `#111827` gray-900 | `#FFFFFF` white | Clean, universal |
| **Escuro** | `#F97316` orange-400 | `#F9FAFB` gray-50 | `#111827` gray-900 | Sofisticado, bar noturno |
| **Rústico** | `#92400E` amber-800 | `#451A03` amber-950 | `#FFFBEB` amber-50 | Churrascaria, comida caseira |
| **Moderno** | `#7C3AED` violet-600 | `#1E1B4B` indigo-950 | `#FFFFFF` white | Gastrobar, contemporâneo |
| **Tropical** | `#059669` emerald-600 | `#064E3B` emerald-900 | `#FFFFFF` white | Praia, açaí, sucos |
| **Personalizado** | Color picker | Color picker | Color picker | Livre |

### Implementação técnica
- Cores na tabela `RestaurantSettings` (`themeName`, `primaryColor`, `secondaryColor`, `backgroundColor`).
- API retorna cores em `GET /restaurants/:slug` (público).
- Frontend injeta como **CSS custom properties** no `:root`.
- Se não definiu nada, usa tema "Clássico".
- Preview em tempo real na tela de Settings.
- **Validação de contraste:** avisa se não atende WCAG AA.

## Princípios de UI
- **Mobile-first:** cliente e garçom 100% mobile. Admin e KDS tablet/desktop.
- **Minimalista:** pouco texto, muita ação. Cardápio como app de delivery premium.
- **Fotos grandes:** foto do produto é o elemento principal do card.
- **Feedback visual:** toda ação com resposta imediata (toast, loading, transição).
- **Acessibilidade:** ver seção dedicada abaixo.

## Acessibilidade (a11y)

### Requisitos Mínimos (Fase 1)
- **Contraste:** WCAG AA em todas as combinações texto/fundo. Validar com ferramenta automática (axe-core, Lighthouse).
- **Touch targets:** mínimo 44x44px para interfaces touch (Cliente, Garçom, KDS) conforme WCAG 2.5.5. Interfaces desktop (Admin, Super Admin) usam mínimo 36x36px (operadas por mouse).
- **Labels:** todo `<input>` deve ter `<label>` associado (via `htmlFor` ou `aria-label`).
- **Focus visible:** outline visível em todos os elementos interativos ao navegar por teclado (`:focus-visible`).
- **Navegação por teclado:** todos os fluxos críticos (cardápio, carrinho, pagamento) devem ser completáveis sem mouse/touch.
- **Aria attributes:**
  - `aria-label` em botões com ícone sem texto.
  - `aria-live="polite"` em regiões que atualizam em tempo real (status do pedido, timer KDS).
  - `role="alert"` em mensagens de erro e toast notifications.
  - `aria-expanded` em menus dropdown e modais.
- **Semântica HTML:** usar tags semânticas (`<nav>`, `<main>`, `<header>`, `<footer>`, `<section>`, `<article>`) em vez de `<div>` genérico.
- **Imagens:** `alt` descritivo em fotos de produtos. `alt=""` para imagens decorativas.

### Testes de Acessibilidade
- **Automatizado:** axe-core integrado nos testes e2e (Playwright). Rodar `@axe-core/playwright` em todas as páginas.
- **Manual:** testar fluxo completo do cliente com navegação por teclado (Tab, Enter, Escape).
- **Screen reader:** testar pelo menos 1x antes de cada release com NVDA (Windows) ou VoiceOver (Mac).

### Prioridade por Módulo
| Módulo | Prioridade a11y | Motivo |
|---|---|---|
| Cliente (cardápio) | **Alta** | Público diverso, possível obrigação legal |
| Admin | Média | Uso interno, equipe treinada |
| KDS | Baixa | Operado por equipe em ambiente controlado |
| Garçom | Média | Mobile, uso rápido, equipe treinada |
| Super Admin | Baixa | Uso exclusivo da equipe interna OChefia, poucos usuários |

---

**Specs detalhadas por interface (ler sob demanda):**
- `docs/design-cliente.md` — superfícies, cores, componentes, tipografia do cliente
- `docs/design-staff.md` — KDS (dark mode), garçom, caixa (referência futura)
- `docs/design-admin.md` — dashboard admin do restaurante
- `docs/design-superadmin.md` — backoffice interno OChefia
