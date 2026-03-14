# Design — Interface do Cliente (Cardápio Digital)

Specs detalhadas da interface do cliente. Para visão geral, paleta base e princípios, ver `docs/design-system.md`.

**Inspiração:** ChoiceQR, iFood, Rappi. Foco em fotos, simplicidade, velocidade.

## Superfícies e Cores

| Elemento | Valor | Tailwind |
|---|---|---|
| Fundo da página | `#FFFFFF` | `white` |
| Fundo de seção (categorias) | `#F9FAFB` | `gray-50` |
| Card de produto | `#FFFFFF` com sombra suave | `white` + `shadow-md` |
| Texto principal (nome do prato) | `#111827` | `gray-900` |
| Texto secundário (descrição) | `#6B7280` | `gray-500` |
| Preço | `#EA580C` | `orange-600` |
| Botão adicionar | `#EA580C` fundo, texto branco | `bg-orange-600 text-white` |
| Barra do carrinho (fixo embaixo) | `#EA580C` | `bg-orange-600` |
| Badge quantidade | `#FFFFFF` sobre orange | `bg-white text-orange-600` |
| Fundo do header | `#FFFFFF` com blur | `bg-white/90 backdrop-blur` |
| Divisor entre seções | `#F3F4F6` | `gray-100` |
| Bottom nav fundo | `#FFFFFF` com borda superior | `white border-t border-gray-100` |
| Bottom nav tab ativa | `#EA580C` | `text-orange-600` |
| Bottom nav tab inativa | `#9CA3AF` | `text-gray-400` |
| Botão pessoas (header) | `#6B7280` com badge orange | `text-gray-500` + badge `bg-orange-600` |

## Componentes

| Componente | Especificação |
|---|---|
| **Card de produto** | Foto 16:9 no topo (ou lado esquerdo em lista), nome em `font-semibold text-base`, descrição em `text-sm text-gray-500` truncada 2 linhas, preço em `font-bold text-orange-600`. Rounded-2xl, shadow-md. Sem borda |
| **Botão adicionar** | Circular ou pill. `bg-orange-600 text-white rounded-full`. Mínimo 44x44px. Ícone "+" quando simples, texto "Adicionar R$ XX" no detalhe |
| **Barra de categorias** | Scroll horizontal no topo. Chips com `rounded-full`. Ativa: `bg-orange-600 text-white`. Inativa: `bg-gray-100 text-gray-700` |
| **Bottom nav** | Barra fixa no bottom com 4 tabs: Cardápio, Pedidos, Conta, O Chefia. Ícone + texto. Tab ativa: `text-orange-600`. Tab inativa: `text-gray-400`. Fundo `bg-white` com `border-t border-gray-100`. Altura `64px`. Quando há itens no carrinho, a tab "Cardápio" exibe badge de quantidade |
| **Carrinho flutuante** | Barra sobreposta acima da bottom nav, visível em todas as telas do cliente (cardápio, pedidos, conta) quando há itens no carrinho. Não aparece na tela de detalhe do produto (que tem CTA próprio fixo). `bg-orange-600 text-white rounded-t-2xl`. Mostra total e quantidade. Tap abre o carrinho |
| **Header** | Logo do restaurante (ou nome), endereço resumido. Sticky com blur. Minimalista. **Botão de pessoas** sempre visível à direita (ícone de grupo + badge com quantidade de pessoas na mesa). Tap abre modal/tela para adicionar/remover pessoas |
| **Modal "O Chefia"** | Abre ao tocar na tab "O Chefia" da bottom nav. Seleção de motivo (Chamar garçom, Pedir a conta, Outro) + campo de mensagem opcional + botão "Enviar chamado". `bg-white rounded-t-2xl` (bottom sheet). Overlay `bg-black/50` |
| **Tela de detalhe do prato** | Foto grande (hero, 40% da tela). Nome, descrição completa, preço. Opções de adicionais como checkboxes/radio. Botão "Adicionar" fixo embaixo |
| **Status do pedido** | Timeline vertical com ícones. Verde = concluído, orange = atual, cinza = pendente. Animação pulse no passo atual |

## Tipografia específica

| Uso | Tamanho | Peso |
|---|---|---|
| Nome do restaurante | `text-xl` | `font-bold` |
| Nome do prato (card) | `text-base` | `font-semibold` |
| Descrição (card) | `text-sm` | `font-normal` |
| Preço | `text-base` | `font-bold` |
| Categoria (chip) | `text-sm` | `font-medium` |
| Total do carrinho | `text-lg` | `font-bold` |

## Espaçamento e Layout

- Padding geral da página: `px-4`
- Gap entre cards: `gap-3`
- Cards em lista (1 coluna) ou grid 2 colunas em telas maiores
- Foto do produto: aspect-ratio 16:9, `rounded-xl`, `object-cover`
- Sem sidebar, sem menu hambúrguer. Navegação via bottom nav (4 tabs) + scroll + categorias no cardápio

**Tom geral:** limpo, arejado, as fotos são as protagonistas. Poucos elementos de UI, muito espaço em branco. O cliente nem percebe que está usando um "sistema" — parece um cardápio bonito.
