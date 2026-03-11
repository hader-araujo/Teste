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
| Navegacao | Bottom nav fixa com 4 tabs (Cardapio, Pedidos, Conta, O Chefia) + categorias no topo (na tela de cardapio) + botao de pessoas no header |
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

## Resumo Visual Comparativo

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

---

**Specs detalhadas por interface (ler sob demanda):**
- `docs/design-cliente.md` — superficies, cores, componentes, tipografia do cliente
- `docs/design-staff.md` — KDS (dark mode), garçom, caixa (referência futura)
- `docs/design-admin.md` — dashboard admin do restaurante
- `docs/design-superadmin.md` — backoffice interno OChefia
