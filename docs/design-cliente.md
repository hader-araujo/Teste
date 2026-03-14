# Design — Interface do Cliente (Cardápio Digital)

Specs detalhadas da interface do cliente. Para visão geral, paleta base e princípios, ver `docs/design-system.md`.

**Inspiracao:** ChoiceQR, iFood, Rappi. Foco em fotos, simplicidade, velocidade.

## Superficies e Cores

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
| Bottom nav fundo | `#FFFFFF` com borda superior | `white border-t border-gray-100` |
| Bottom nav tab ativa | `#EA580C` | `text-orange-600` |
| Bottom nav tab inativa | `#9CA3AF` | `text-gray-400` |
| Botao pessoas (header) | `#6B7280` com badge orange | `text-gray-500` + badge `bg-orange-600` |

## Componentes

| Componente | Especificacao |
|---|---|
| **Card de produto** | Foto 16:9 no topo (ou lado esquerdo em lista), nome em `font-semibold text-base`, descricao em `text-sm text-gray-500` truncada 2 linhas, preco em `font-bold text-orange-600`. Rounded-2xl, shadow-md. Sem borda |
| **Botao adicionar** | Circular ou pill. `bg-orange-600 text-white rounded-full`. Minimo 44x44px. Icone "+" quando simples, texto "Adicionar R$ XX" no detalhe |
| **Barra de categorias** | Scroll horizontal no topo. Chips com `rounded-full`. Ativa: `bg-orange-600 text-white`. Inativa: `bg-gray-100 text-gray-700` |
| **Bottom nav** | Barra fixa no bottom com 4 tabs: Cardapio, Pedidos, Conta, O Chefia. Icone + texto. Tab ativa: `text-orange-600`. Tab inativa: `text-gray-400`. Fundo `bg-white` com `border-t border-gray-100`. Altura `64px`. Quando ha itens no carrinho, a tab "Cardapio" exibe badge de quantidade |
| **Carrinho flutuante** | Barra sobreposta acima da bottom nav, visivel em todas as telas do cliente (cardapio, pedidos, conta) quando ha itens no carrinho. Nao aparece na tela de detalhe do produto (que tem CTA proprio fixo). `bg-orange-600 text-white rounded-t-2xl`. Mostra total e quantidade. Tap abre o carrinho |
| **Header** | Logo do restaurante (ou nome), endereco resumido. Sticky com blur. Minimalista. **Botao de pessoas** sempre visivel a direita (icone de grupo + badge com quantidade de pessoas na mesa). Tap abre modal/tela para adicionar/remover pessoas |
| **Modal "O Chefia"** | Abre ao tocar na tab "O Chefia" da bottom nav. Selecao de motivo (Chamar garcom, Pedir a conta, Outro) + campo de mensagem opcional + botao "Enviar chamado". `bg-white rounded-t-2xl` (bottom sheet). Overlay `bg-black/50` |
| **Tela de detalhe do prato** | Foto grande (hero, 40% da tela). Nome, descricao completa, preco. Opcoes de adicionais como checkboxes/radio. Botao "Adicionar" fixo embaixo |
| **Status do pedido** | Timeline vertical com icones. Verde = concluido, orange = atual, cinza = pendente. Animacao pulse no passo atual |

## Tipografia especifica

| Uso | Tamanho | Peso |
|---|---|---|
| Nome do restaurante | `text-xl` | `font-bold` |
| Nome do prato (card) | `text-base` | `font-semibold` |
| Descricao (card) | `text-sm` | `font-normal` |
| Preco | `text-base` | `font-bold` |
| Categoria (chip) | `text-sm` | `font-medium` |
| Total do carrinho | `text-lg` | `font-bold` |

## Espacamento e Layout

- Padding geral da pagina: `px-4`
- Gap entre cards: `gap-3`
- Cards em lista (1 coluna) ou grid 2 colunas em telas maiores
- Foto do produto: aspect-ratio 16:9, `rounded-xl`, `object-cover`
- Sem sidebar, sem menu hamburguer. Navegacao via bottom nav (4 tabs) + scroll + categorias no cardapio

**Tom geral:** limpo, arejado, as fotos sao as protagonistas. Poucos elementos de UI, muito espaco em branco. O cliente nem percebe que esta usando um "sistema" — parece um cardapio bonito.
