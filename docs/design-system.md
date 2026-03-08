# Design System

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

## Tom por Modulo

| Modulo | Fundo | Tema | Motivo |
|---|---|---|---|
| Cliente (cardapio) | Branco (`white`) | Claro, clean | Foco nas fotos, leitura facil no celular |
| Admin (dashboard) | Cinza claro (`gray-50`) + sidebar escura (`gray-900`) | Profissional | Contraste para metricas e dados |
| KDS (cozinha/bar) | Escuro (`gray-900`) | Dark mode | Cozinha com pouca luz, alto contraste |
| Garcom | Branco (`white`) | Limpo, rapido | Mobile, legivel no sol |
| Login | Escuro (`gray-900`) | Impactante | Tela de entrada |

## Tipografia
- **Font:** Inter (via Google Fonts) com fallback `system-ui, -apple-system, sans-serif`.
- **Tamanhos:** seguir escala do Tailwind (`text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`).
- **Peso:** `font-normal` para corpo, `font-medium` para labels, `font-semibold` para titulos, `font-bold` para destaques.

## Componentes Base (referencia visual)
- **Botao primario:** bg-orange-600, text-white, rounded-lg, hover:bg-orange-700, px-4 py-2.
- **Botao secundario:** border border-gray-300, text-gray-700, rounded-lg, hover:bg-gray-50.
- **Card:** bg-white, rounded-xl, shadow-sm, border border-gray-100, p-4.
- **Input:** border border-gray-300, rounded-lg, px-3 py-2, focus:ring-2 focus:ring-orange-500.
- **Badge status:** rounded-full, px-2 py-0.5, text-xs, font-medium + cor do status.
- **Modal:** overlay bg-black/50, card centralizado bg-white rounded-xl shadow-xl max-w-md.

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
