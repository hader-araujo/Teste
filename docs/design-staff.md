# Design — Interface do Staff (KDS + Garçom + Caixa)

Specs detalhadas da interface staff. Para visão geral, paleta base e princípios, ver `docs/design-system.md`.

**Inspiracao:** McDonald's POS & KDS (Figma), Toast POS, Square. Foco em eficiencia, velocidade, zero erro.

O Staff se subdivide em 3 contextos com variacoes:

---

## KDS (por Local de Preparo) — Dark Mode Obrigatório

### Autenticação e Acesso

O KDS requer autenticação de funcionário (role KITCHEN). Ao acessar, o funcionário faz login e seleciona o Local de Preparo. O operador pode acessar qualquer Local de Preparo do restaurante.

**Tela de login do KDS:** layout minimalista em dark mode (`bg-gray-900`): logotipo "OChefia KDS" centralizado, seleção de nome (lista de funcionários com role KITCHEN do restaurante) e campo de PIN (4 dígitos numéricos). Botão "Entrar" (`bg-green-600`). Rate limiting: 5 tentativas por 15min + lockout de 15min (mesmo padrão do garçom). Após autenticação bem-sucedida, redireciona para a tela de seleção de Local de Preparo.

**Fetch inicial ao conectar:** após selecionar o Local de Preparo e estabelecer conexão WebSocket, o KDS realiza `GET /preparation-locations/:id/orders?status=pending,preparing` para carregar a fila atual antes de receber novos eventos via socket. Garante que pedidos criados durante uma desconexão não sejam perdidos.

### Tela de Seleção de Local de Preparo

Após o login, o funcionário é direcionado à tela de seleção de Local de Preparo. Tela simples com fundo `gray-900` exibindo os Locais de Preparo disponíveis como cards/botões grandes (estilo similar aos cards de pedido, com `rounded-xl`, fundo `gray-800`, texto `gray-50`, `min-h-[80px]`). Cada card exibe o nome do local (ex: "Cozinha Principal", "Bar", "Pizzaria"). O operador toca em um card para entrar na visualização KDS daquele local. Cada instância do KDS exibe apenas um Local de Preparo — não há abas ou botões para alternar entre locais dentro da tela do KDS. Para trocar de local, o operador deve voltar à tela de seleção.

### Superfícies e Cores

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
| Separador de seção (entre pedidos) | `#374151` | `gray-700` |

### Componentes

| Componente | Especificacao |
|---|---|
| **Card de pedido** | Ocupa 1 coluna em grid. Header com numero do pedido + mesa + timer. Lista de itens em texto grande. Observacoes em amarelo. Borda lateral muda de cor conforme tempo. Rounded-lg |
| **Grid de pedidos** | 3-5 colunas dependendo do tamanho da tela. Scroll horizontal se necessario. Novos pedidos entram pela esquerda |
| **Timer** | Contador de minutos desde que o pedido entrou. Muda de cor automaticamente: cinza (<10min), amarelo (10-15min), vermelho (>15min) |
| **Botao Bump (pronto)** | Grande, ocupa toda a largura do card. `min-h-[56px]`. Verde. Um toque para marcar como pronto. Sem confirmacao |
| **Alerta sonoro** | Novo pedido: beep curto. Pedido atrasado: beep repetido. Configuravel |
| **Identificação do Local** | Header exibe o nome do Local de Preparo (ex: "Cozinha Principal", "Bar", "Pizzaria"). Cada instância do KDS exibe apenas um Local de Preparo — não há abas ou botões para alternar entre locais |

### Tipografia especifica

| Uso | Tamanho | Peso |
|---|---|---|
| Numero do pedido | `text-2xl` | `font-bold` |
| Mesa | `text-lg` | `font-semibold` |
| Nome do item | `text-lg` | `font-medium` |
| Quantidade | `text-xl` | `font-bold` |
| Observacao | `text-base` | `font-semibold` |
| Timer | `text-base` | `font-mono font-bold` |

**Espacamento:** cards com `p-4`, gap de `gap-3` entre cards. Tudo visivel sem scroll quando possivel. Fonte maior que o normal — leitura a 1-2 metros de distancia.

---

## Garcom — Light Mode, Mobile-First

### Superficies e Cores

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

### Componentes

| Componente | Especificacao |
|---|---|
| **Mapa de mesas** | Grid com cards representando mesas, agrupadas por setor. Cada card mostra: numero, status (cor da borda), tempo de ocupacao, valor parcial. Tap abre detalhe |
| **Card de mesa** | `rounded-xl`, borda lateral grossa (4px) com cor do status. Numero da mesa grande no centro. Badge se tem chamado pendente |
| **Lista de pedidos da mesa** | Pedidos agrupados por grupo de entrega (Normal, Imediato, Garçom direto). Itens com status do preparo (cor). Grupos com todos os itens "Pronto" exibem botão **"Retirar Grupo"** (claim). Após claim, botão "Marcar Entregue" no grupo. Hora do pedido |
| **Botao novo pedido** | FAB (floating action button) fixo. `rounded-full bg-orange-600 text-white shadow-lg`. 56x56px |
| **Notificacao** | Banner no topo deslizante. "Mesa 5 pedindo conta", "Pedido #42 pronto". Tap para ir direto |
| **Bottom tabs** | 3 tabs: Chamados (principal), Mesas, Turno. Icone + texto. Ativa em orange. "Detalhe da mesa" e "Comanda" sao telas contextuais acessadas via tap na mesa, nao aparecem na bottom nav |

**Tipografia:** mesma escala do cliente, mas com enfase em numeros grandes (numero da mesa, valores).

### Push Notification Deep Links

| Evento | Destino |
|---|---|
| Item pronto para retirada | `/garcom/chamados` |
| Chamado de cliente ("O Chefia") | `/garcom/chamados` |
| Escalação de retirada (nível 1 e 2) | `/garcom/chamados` |
| Transferência de mesa | `/garcom/mesas` |

Ao tocar na notificação, o app abre diretamente na tela correspondente. Se o garçom não estiver autenticado ou com turno ativo, redireciona para o login antes de abrir o deep link.

---

## Fase 2 — NÃO IMPLEMENTAR

### Caixa — Layout de Tablet (Referência Futura)

> **⚠ FASE 2 — NÃO IMPLEMENTAR ATÉ AVISO EXPLÍCITO.** Esta seção é apenas referência arquitetural. Na Fase 1, o fechamento de conta é feito pelo garçom (via detalhe da mesa) ou pelo cliente (via pagamento individual).

**Superficies e Cores:** mesmas do garcom (light mode), mas layout otimizado para tablet landscape.

| Componente | Especificacao |
|---|---|
| **Layout** | Split view: lista de pedidos/mesas na esquerda (40%), detalhe do pedido na direita (60%) |
| **Resumo da conta** | Card grande com todos os itens, subtotal, taxa de servico, total. Fonte grande nos valores |
| **Botoes de pagamento** | Grid: Pix, Credito, Debito, Dinheiro. Cada um com icone + texto. Grandes (`min-h-[64px]`) |
| **Botao fechar conta** | Full-width, `bg-green-600 text-white`, `min-h-[56px]`. Confirmacao antes de fechar |
