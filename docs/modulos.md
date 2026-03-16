# Módulos Funcionais

## Estrutura Operacional do Restaurante

Antes de descrever os módulos, é importante entender as entidades que organizam a operação física do restaurante:

### Local de Preparo
Onde os itens são produzidos. Cada restaurante cadastra seus próprios locais de preparo com nomes livres (ex: "Cozinha Principal", "Pizzaria", "Bar", "Cozinha Fria", "Churrasqueira"). **Cada Local de Preparo corresponde a uma tela KDS independente.**

### Ponto de Entrega
Onde o garçom retira o item pronto. Cada Local de Preparo tem **1 ou mais Pontos de Entrega** (criado automaticamente com 1 default ao cadastrar o Local de Preparo). Exemplos: "Pass principal", "Balcão do bar", "Service bar", "Janela da pizzaria".

- **Flag `kitchenDelivery`** (boolean, default `false`): se `true`, o operador do Local de Preparo entrega o item diretamente na mesa — garçom **não** é notificado para retirada desse item. Se `false`, garçom é notificado para buscar no Ponto de Entrega.
- O Ponto de Entrega default criado automaticamente recebe o nome **"Padrão"**. Pode ser renomeado. Pode ser deletado somente se existir outro ponto no mesmo Local de Preparo.

### Setor
Agrupamento físico de mesas (ex: "Salão Principal", "Terraço", "VIP", "Área Externa"). **Toda mesa pertence a exatamente 1 setor.** Ao criar o restaurante, um setor default é criado automaticamente.

- **Limite de pessoas por mesa:** máximo configurável por restaurante (`maxPeoplePerSession`, default **100**). Tentativa de adicionar além do limite retorna erro `SESSION_018`. O limite existe para proteger a UI (selects de pessoas, divisão de conta) e o rate limit agregado por mesa.
- **Garçons são atribuídos a setores** (não a mesas individuais). Um garçom pode atender mais de 1 setor.
- **Taxa de serviço é dividida igualmente entre garçons do mesmo setor.** Se um garçom precisa ficar exclusivo em uma mesa, essa mesa deve estar em um setor próprio.
- **Mapeamento obrigatório Setor ↔ Local de Preparo:** para cada setor, deve haver um vínculo com cada Local de Preparo, indicando **qual Ponto de Entrega** os garçons daquele setor usam para retirada. Isso permite que garçons de setores diferentes retirem em pontos diferentes do mesmo Local de Preparo.
- **Validação de mapeamento completo:**
  - `POST /tables/:id/open` **bloqueia abertura de sessão** se o setor da mesa não tem mapeamento para todos os Locais de Preparo ativos. Retorna erro `SESSION_011`.
  - **Alerta urgente** via WebSocket para admin (`admin:mapping-incomplete`) e garçons do setor (`waiter:mapping-incomplete`): "Mesa X não pode ser aberta — Setor Y sem mapeamento para Local de Preparo Z".
  - Ao criar novo Local de Preparo, **alerta no dashboard** para admin: "Novo Local de Preparo criado — configure mapeamento nos setores existentes". Todos os setores ficam com mapeamento pendente até configurar.
  - `POST /orders` mantém validação defensiva como safety net (erro `ORDER_005` se mapeamento faltar por qualquer motivo).

### Cadastro de Produto — Destino e Entrega Antecipada
No cadastro de produto, o campo "Destino" é obrigatório e mostra:
- **Todos os Pontos de Entrega cadastrados** (agrupados por Local de Preparo) — o pedido vai para o KDS do Local de Preparo vinculado.
- **Opção fixa "Garçom"** — entrega direta pelo garçom, sem preparo, não passa por KDS nenhum. **Nota:** produtos com destino "Garçom" não utilizam a flag `earlyDelivery` (que só se aplica a itens com destino KDS). Itens "Garçom" são sempre entrega direta — a flag é ignorada se o destino for "Garçom". Na UI de cadastro, o campo `earlyDelivery` fica desabilitado quando destino "Garçom" está selecionado.

Além do destino, o produto possui a **flag `earlyDelivery`** (boolean, default `false`):
- **`false` (padrão):** item normal. O garçom só é notificado quando **todos** os itens normais do mesmo pedido ficarem prontos, mesmo que venham de Locais de Preparo diferentes. Exemplo: Picanha (Cozinha) + Pizza (Pizzaria) — garçom espera ambos ficarem prontos e leva tudo junto.
- **`true` (entrega antecipada):** item que pode ser entregue antes dos demais (ex: drinks preparados no bar, sobremesas geladas). O garçom é notificado assim que **todos os itens com `earlyDelivery = true` do mesmo pedido** ficarem prontos, sem esperar pelos itens normais.

### Grupos de Entrega (por pedido)
Cada pedido gera até **3 grupos de entrega** independentes:

| Grupo | Itens | Quando notifica garçom |
|---|---|---|
| **Normal** (`NORMAL`) | Produtos com `earlyDelivery = false` | Quando **todos os não-cancelados** ficarem prontos |
| **Entrega antecipada** (`EARLY_DELIVERY`) | Produtos com `earlyDelivery = true` | Quando **todos os antecipados não-cancelados** ficarem prontos |
| **Garçom direto** (`WAITER_DIRECT`) | Produtos com destino "Garçom" | Imediatamente (não passa por KDS) |

- Pedidos diferentes (feitos em momentos diferentes) são **independentes** — não esperam entre si.
- O agrupamento é por **pedido**, não por mesa.
- **Itens cancelados em grupo:** itens cancelados são excluídos da verificação "todos prontos". Se um grupo Normal tem 3 itens e 1 é cancelado, o garçom é notificado quando os 2 restantes ficarem prontos. Se todos os itens de um grupo são cancelados, o grupo não gera notificação.
- **Notificações por grupo:** cada grupo gera notificação independente para o garçom. Se um pedido tem grupo Normal e Entrega antecipada, o garçom recebe **2 notificações separadas** em momentos diferentes (antecipada primeiro, normal depois). Cada notificação lista os Pontos de Entrega relevantes àquele grupo.
- **Interação entre `earlyDelivery` e `kitchenDelivery`:** a notificação ao garçom em cada grupo exclui itens cujo Ponto de Entrega tem `kitchenDelivery = true` (esses são entregues pelo operador do KDS). Se **todos** os itens de um grupo têm `kitchenDelivery = true`, o garçom **não recebe notificação** para esse grupo — nada pra buscar.
- **UX do cliente:** na tela "Meus Pedidos", itens são exibidos agrupados por grupo de entrega com label visual: "Entrega antecipada" (badge verde) ou "Entrega com pedido completo" (sem badge). O cliente vê claramente que drinks serão entregues antes da picanha. Na aba "Conta", os itens aparecem por pessoa (independente do grupo).

### Os 3 conceitos de entrega — referência rápida

O sistema possui **3 conceitos ortogonais** que respondem perguntas diferentes sobre a entrega de cada item:

| Conceito | Campo | Onde | Pergunta que responde |
|---|---|---|---|
| **Destino** | `destination` (PICKUP_POINT / WAITER) | Product | **Onde é preparado?** KDS ou entrega direta pelo garçom |
| **Entrega antecipada** | `earlyDelivery` (boolean) | Product | **Quando entrega?** Junto com o pedido completo ou separado antes |
| **Entrega pela cozinha** | `kitchenDelivery` (boolean) | PickupPoint | **Quem leva na mesa?** Garçom busca ou operador do KDS entrega direto |

**Combinações válidas e comportamento:**

| Destino | earlyDelivery | kitchenDelivery | Grupo | Quem entrega | Exemplo |
|---|---|---|---|---|---|
| PICKUP_POINT | `false` | `false` | NORMAL | Garçom busca | Picanha (cozinha → pass principal) |
| PICKUP_POINT | `false` | `true` | NORMAL | Operador KDS | Prato executivo (cozinha → direto na mesa) |
| PICKUP_POINT | `true` | `false` | EARLY_DELIVERY | Garçom busca | Caipirinha (bar → balcão do bar) |
| PICKUP_POINT | `true` | `true` | EARLY_DELIVERY | Operador KDS | Suco natural (bar → barman leva direto) |
| WAITER | _(ignorada)_ | _(não se aplica)_ | WAITER_DIRECT | Garçom direto | Cerveja long neck, água, sachê |

**Exemplo completo — pedido com 5 itens:**

```
Pedido #42 — Mesa 5:
┌──────────────────────────────────────────────────────────────────┐
│ GRUPO NORMAL (garçom espera todos ficarem prontos)               │
│  • Picanha        → Cozinha → Pass principal (garçom busca)      │
│  • Pizza Margherita → Pizzaria → Janela (garçom busca)           │
├──────────────────────────────────────────────────────────────────┤
│ GRUPO EARLY_DELIVERY (garçom notificado quando ambos prontos)    │
│  • Caipirinha     → Bar → Balcão (garçom busca)                  │
│  • Suco Natural   → Bar → Service bar (operador leva direto)     │
│    ↳ kitchenDelivery=true: barman leva, garçom NÃO busca este   │
│    ↳ Garçom é notificado SÓ pela Caipirinha (Balcão do bar)     │
├──────────────────────────────────────────────────────────────────┤
│ GRUPO WAITER_DIRECT (garçom pega e leva na hora)                 │
│  • Água mineral   → Sem KDS, garçom entrega direto               │
└──────────────────────────────────────────────────────────────────┘
```

**Regras de notificação do garçom (`waiter:order-ready`):**
1. Sistema verifica se todos os itens não-cancelados do grupo estão "Pronto".
2. Filtra itens cujo Ponto de Entrega tem `kitchenDelivery = true` (operador já entrega).
3. Se restam itens para o garçom buscar → emite `waiter:order-ready` com a lista de Pontos de Entrega (apenas os sem `kitchenDelivery`).
4. Se **não restam itens** para o garçom buscar (todos são `kitchenDelivery`) → **não emite** `waiter:order-ready` para esse grupo.

### Máquina de Estados do Pedido

Cada item de pedido segue uma máquina de estados **sem transição reversa** (não volta status):

```
Na fila → Preparando → Pronto → Entregue
   ↓          ↓
Cancelado  Cancelado
```

**Transições permitidas:**
| De | Para | Quem executa |
|---|---|---|
| Na fila | Preparando | Operador do KDS |
| Preparando | Pronto | Operador do KDS (botão "PRONTO") |
| Pronto | Entregue | Garçom (após retirar e entregar na mesa) |
| Na fila | Cancelado | Cliente (próprios itens) ou Staff (garçom+) |
| Preparando | Cancelado | Apenas Staff (garçom+) |

**Restrições:**
- Itens com status **Pronto** ou **Entregue** podem ser cancelados **apenas por OWNER/MANAGER** (motivo obrigatório, registrado em AuditLog). Se o item tinha claim ativo de garçom, o claim é liberado automaticamente.
- **Não existe transição reversa** — um item nunca volta para um status anterior (exceto cancelamento por OWNER/MANAGER).
- **Itens com destino "Garçom"** (entrega direta, sem preparo): seguem fluxo simplificado `Na fila → Entregue`, pulando os estados `Preparando` e `Pronto`. **Sem claim:** a notificação `waiter:new-order` é informativa — o primeiro garçom que atende marca como Entregue. Se dois forem, o segundo vê o status atualizado via WebSocket. Itens "Garçom direto" são ações rápidas (sachê, bebida pronta), risco de duplicação é baixo.

### Observações por Item (notes)

Cada item de pedido pode conter o campo **`notes?: string`** — observações de texto livre do cliente (ex: "bem passado", "sem cebola", "alergia a amendoim"). As observações são exibidas no **KDS em destaque amarelo** para garantir visibilidade da equipe de produção.

### Regras de Cancelamento

- **Cliente:** pode cancelar apenas seus próprios itens (itens vinculados a suas pessoas), e somente se o status for **Na fila**.
- **Staff (garçom+):** pode cancelar qualquer item do pedido se o status for **Na fila** ou **Preparando**.
- **OWNER/MANAGER:** pode cancelar qualquer item **em qualquer status** (incluindo Pronto e Entregue). Motivo obrigatório. Registrado em AuditLog. Se havia claim de garçom, é liberado automaticamente. Item cancelado sai da conta.
- Todo cancelamento é registrado no **histórico/activity-log da sessão**, incluindo: quem cancelou, quando, e motivo (obrigatório se cancelado por staff).
- **Item cancelado sai do cálculo da conta** — não é cobrado.
- **Devolução por cancelamento de item já pago:** quando OWNER/MANAGER cancela um item com status Entregue e esse item já está coberto por um Payment PAYMENT_CONFIRMED, o sistema gera um **registro de devolução pendente** (`PAYMENT_PENDING_REFUND`) vinculado à(s) pessoa(s) que pagaram. O restaurante devolve o dinheiro por fora (pix, dinheiro, cartão) e o staff confirma no sistema via `PATCH /payments/:id/refund` com método e responsável. Não existe "crédito interno" — é sempre devolução real.
  - **Cálculo proporcional para itens compartilhados:** `refundAmount = itemPrice / numberOfPersons`. O sistema gera `PAYMENT_PENDING_REFUND` para **cada pessoa que já pagou**, independente da ordem de pagamento. Se um item de R$60 estava atribuído a 3 pessoas (A, B, C) e apenas A já pagou, o sistema cria `PAYMENT_PENDING_REFUND` de R$20 apenas para o Payment de A. Pessoas B e C simplesmente deixam de ser cobradas (o item sai da conta). Se A e B já pagaram, ambos recebem `PAYMENT_PENDING_REFUND` de R$20 cada. Se alguém pagar **durante** o processo de cancelamento (entre o cancelamento do item e a criação dos refunds), o pagamento é processado normalmente e o refund é criado para essa pessoa também — a operação é atômica (transação).
  - **Status da devolução:** `PAYMENT_PENDING_REFUND` → `PAYMENT_REFUNDED`.
  - **Confirmação:** staff informa método (`PIX`, `CASH`, `CARD_DEBIT`, `CARD_CREDIT`), valor, e o sistema registra `refundedByStaffId` + `refundedAt` + `refundMethod`.
  - **Visibilidade:** devoluções aparecem no activity log da sessão ("Picanha cancelada — devolução de R$30,00 via Pix confirmada por João às 14:32"), na aba "Histórico" da conta, e no AuditLog.
  - **Devolução pendente ao fechar sessão:** se a sessão fecha com devolução `PAYMENT_PENDING_REFUND`, alerta no dashboard do admin ("Sessão da Mesa 5 fechada com devolução pendente de R$30,00 para Maria"). Permanece como pendente até o staff confirmar.
  - **Relatório:** devoluções ficam visíveis no faturamento diário (campo "devoluções do dia") e no histórico de pagamentos da sessão.

### Transferência de Mesa

Permite mover uma sessão inteira de uma mesa para outra:

- **Apenas staff (garçom+)** pode executar a transferência.
- Move a **sessão inteira** (pessoas, pedidos, conta, activity-log) para a mesa de destino.
- A **mesa de destino deve estar livre** (sem sessão ativa).
- Funciona **entre setores diferentes** — não há restrição de setor.
- **Claims ativos** de garçons do setor de origem são **liberados automaticamente** na transferência.
- **Escalações ativas** são redirecionadas para o setor de destino, mantendo o tempo acumulado. Se há itens prontos aguardando retirada, garçons do setor B recebem `waiter:order-ready` imediatamente com a urgência proporcional ao tempo já esperado. Jobs Bull de escalação (pickup-escalation, claim-timeout) são atualizados para apontar para o novo setor.
- **Notificações de transferência via WebSocket:**
  - `waiter:table-transferred` para garçons do **setor de destino**: inclui lista de pedidos pendentes/prontos para retirada.
  - `waiter:table-transferred` para garçons do **setor de origem**: para remover a mesa da visualização.
- O **KDS atualiza o número da mesa automaticamente** nos cards em produção (via WebSocket).
- O **token da sessão não muda** — apenas o `tableId` é atualizado. Clientes conectados recebem notificação via WebSocket e continuam operando normalmente.

---

## Módulo Gerencial (Dashboard/Backoffice) — Rota: `/admin`
Acesso: Dono/Gerente via computador ou tablet.

- **Mapa de mesas em tempo real** (livres, ocupadas, tempo de permanência). Filtros: "Todas", "Com problema", "Ociosas". Indicadores visuais de alerta: pedido atrasado, chamado sem resposta, tempo sem novo pedido. Botão deletar mesa (soft delete — só se não tiver sessão ativa; histórico preservado para métricas; permite recriar mesa com mesmo nome/número).
- **Métricas no dashboard**: tempo médio de preparo por **Local de Preparo** (dinâmico, baseado nos cadastrados), tempo médio de entrega por garçom (entre "Pronto" e "Entregue"), mesas ativas, alertas em tempo real (pedidos atrasados com tempo na fila acima do `orderDelayThreshold` — default 15min, chamados sem resposta, escalações ativas, mesas ociosas, setores sem garçom atribuído, garçons offline).
- **Garçom offline:** garçom com turno ativo mas desconectado do WebSocket há mais de `waiterOfflineAlertTimeout` minutos (default 5, configurável em RestaurantSettings) gera alerta no dashboard: "Garçom X offline há Y min — setor Z". Indicador visual de online/offline na lista de garçons ativos. **Sem auto-clock-out** — garçom pode estar carregando celular ou em área sem sinal. Escalação de retirada (níveis 1 e 2) já cobre o operacional. Admin decide se intervém.
- **`orderDelayThreshold`** (configurável em Settings, default 15min): tempo máximo que um pedido pode ficar na fila (status "Na fila") sem mudar de status antes de gerar alerta de "pedido atrasado" no dashboard. Diferente de `pickupEscalationTimeout`, que se aplica após o item ser marcado como "Pronto".
- **Mesa ociosa:** sessão ativa **com pedidos** mas sem pedido **novo** (`POST /orders`) há mais de `idleTableThreshold` minutos (default 30min). Chamados (`POST /calls`) e outras interações não resetam o contador — apenas novos pedidos. Gera alerta no dashboard para admin. **Nota:** usa o mesmo threshold que o auto-close de sessão vazia (`idleTableThreshold`), mas são populações diferentes — sessões vazias são fechadas automaticamente, sessões com pedidos só geram alerta (nunca auto-close, risco de dinheiro envolvido).
- **Sessão longa:** sessão aberta há mais de `longSessionThreshold` horas (default **6h**, configurável em RestaurantSettings) gera alerta no dashboard: "Mesa X aberta há Y horas". **Não fecha automaticamente** — apenas alerta. O admin decide se intervém. Útil para detectar mesas esquecidas ou sessões que cruzaram turnos.
- **Tela "Desempenho da Equipe"** (rota `/admin/desempenho`): métricas individuais por funcionário.
  - **Por garçom:** tempo médio de entrega (Pronto → Entregue), quantidade de pedidos atendidos, escalações (nível 1 e 2), taxa de serviço acumulada. Filtro por período (dia/semana/mês).
  - **Por Local de Preparo:** tempo médio de preparo (Na fila → Pronto), quantidade de pedidos, itens mais demorados. Filtro por período.
- Cardápio: CRUD de categorias, **tags de produto** (ex: vegano, sem glúten, picante, sugestão do chef) e produtos. Habilitar/desabilitar em tempo real (tanto por produto individual quanto por categoria inteira). **Desabilitar categoria:** todos os produtos da categoria ficam indisponíveis. **Reabilitar categoria:** todos os produtos voltam (incluindo os que estavam desabilitados individualmente — reset completo). **Desabilitar produto não afeta pedidos existentes** (QUEUED/PREPARING/READY) — esses pedidos seguem normalmente; se não for possível preparar, o staff cancela manualmente. Precificação dinâmica/Happy Hour é referência futura (sem endpoint/sprint definido na Fase 1).
- **Cadastro de produto — destino após pedido:** campo obrigatório indicando o **Ponto de Entrega** (que pertence a um Local de Preparo) ou **"Garçom"** (entrega direta, sem preparo). Flag **`earlyDelivery`** (default `false`) para itens que podem ser entregues antes dos demais (ex: drinks). Ver seção "Estrutura Operacional" acima.
- Upload de imagens: múltiplas fotos por produto (galeria). Primeira foto = capa. Upload com preview, reordenação e remoção.
- **CRUD de Locais de Preparo:** nome do local. Ao criar, 1 Ponto de Entrega default é gerado automaticamente. **Ao soft-deletar:** mapeamentos (`SectorPickupPointMapping`) que apontam para o Local de Preparo são removidos em cascata. Todos os setores ficam com mapeamento incompleto → alerta `admin:mapping-incomplete` no dashboard para cada setor afetado.
- **CRUD de Pontos de Entrega:** nome do ponto, Local de Preparo vinculado, flag `kitchenDelivery` (default `false`).
- **CRUD de Setores:** nome do setor, mesas vinculadas. Mapeamento obrigatório de Ponto de Entrega por Local de Preparo.
- Gestão de funcionários: cadastro de garçons, cozinheiros, gerentes com permissões por role.
- **Funcionários temporários:** cadastro com flag `temporario`. Opção de definir dias fixos da semana (ex: seg, qua, sex) ou deixar em branco para uso avulso.
- **Tela de Escala (programação):** calendário/lista por dia mostrando quem vai trabalhar nos próximos dias. Funcionários permanentes + temporários com dia pré-definido entram automaticamente. Permite desmarcar qualquer um para o dia e adicionar temporários avulsos.
- **Tela Equipe do Dia:** lista todos que vão trabalhar hoje (auto-preenchido pela escala). Toggle para desmarcar/marcar. Adicionar temporários avulsos. **Atribuir garçons a setores** (um garçom pode ter mais de 1 setor).
- **Configurações do estabelecimento** (em Settings): nome do estabelecimento e logo. O nome/logo substitui "OChefia" no header do cardápio do cliente, mas mantém "OChefia" em tamanho pequeno (branding). Se não configurado, mostra apenas "OChefia". Inclui parâmetros de escalação de retirada (`pickupReminderInterval`, `pickupEscalationTimeout`) — ver seção "Escalação de Retirada" no Módulo KDS.
- **Estoque:** movido para Fase 2. Não implementar até aviso explícito.

## Módulo Faturamento — Rota: `/admin/faturamento`
Acesso: Dono/Gerente. Tela separada do dashboard, dedicada a financeiro.

- **Faturamento diário:** receita do dia, quantidade de pedidos, ticket médio por mesa (receita / sessões fechadas), ticket médio por pessoa (receita / pessoas que pagaram), comparativo com dia anterior.
- **Faturamento mensal:** receita acumulada do mês, gráfico por dia, comparativo com mês anterior.
- **Fechamento de caixa:** resumo de valores recebidos (Pix, dinheiro, cartão). (NFC-e/SAT em fase futura).
- **Taxas de garçom:** valores a pagar para cada garçom no período. Calculado automaticamente com base na taxa de serviço das mesas dos setores atendidos (dividida igualmente entre garçons do mesmo setor). Não é salário — é apenas a parte da taxa de serviço devida a cada garçom. Filtro por dia e por mês. **Cálculo forward-only por pagamento:** a taxa é calculada **no momento do pagamento de cada pessoa**, não no fechamento da sessão. O(s) garçom(ns) atribuído(s) ao setor da mesa **naquele instante** recebe(m) a taxa daquela pessoa. Se garçom muda no meio da sessão, cada pagamento vai para quem estava no setor naquele momento. Não é retroativo — se um garçom entra no meio do turno, só recebe taxa dos pagamentos feitos a partir daquele momento.

---

## Módulo KDS (Kitchen Display System) — Rota: `/kds`
Acesso: Equipe de produção via tablet ou monitor. **Cada Local de Preparo tem sua própria tela KDS.**

- Roteamento automático baseado no **Ponto de Entrega** do produto: o pedido vai para o KDS do **Local de Preparo** vinculado ao Ponto de Entrega. Produtos com destino "Garçom" não passam pelo KDS.
- Fila de produção com temporizadores e cores (Verde: no prazo, Amarelo: atenção, Vermelho: atrasado).
- Alertas visuais e sonoros para pedido novo ou urgente.
- Clique no prato para ver foto ampliada.
- **Observações do item** (`notes`) exibidas em **destaque amarelo** no card do KDS para garantir visibilidade (ex: "bem passado", "alergia a amendoim").
- Botão "Pronto":
  - **Ponto de Entrega com `kitchenDelivery = false`:** card sai da fila do KDS (trabalho da cozinha encerrado). A notificação ao garçom depende do **grupo de entrega** do item: itens normais só notificam quando todos os normais do mesmo pedido ficarem prontos; itens com `earlyDelivery` notificam quando todos os imediatos do pedido ficarem prontos. Ver "Grupos de Entrega" na seção Estrutura Operacional.
  - **Ponto de Entrega com `kitchenDelivery = true`:** operador do Local de Preparo entrega diretamente. KDS exibe botões "Pronto" e "Entregue" no próprio card.
- **Após marcar "Pronto":**
  - **`kitchenDelivery = false`:** card sai da fila do KDS. O monitoramento de retirada é responsabilidade do sistema de escalação (ver abaixo) e do admin — não da cozinha.
  - **`kitchenDelivery = true`:** card permanece na tela do KDS com botão "ENTREGUE" visível. O timer **não reseta** — continua acumulando desde que o pedido entrou na fila. As cores de borda continuam mudando normalmente (verde → amarelo → vermelho), pressionando o operador a entregar rápido. Ao marcar "ENTREGUE", o card sai da fila. **Sem escalação formal** — itens kitchenDelivery não passam pelo sistema de escalação de retirada (o operador é responsável). O admin vê itens READY há muito tempo no dashboard (alerta genérico de pedido atrasado).

### Notificação e Claim de Retirada

O garçom é notificado quando **todos os itens de um grupo de entrega** ficam prontos (não item a item). A notificação lista todos os **Pontos de Entrega** onde o garçom deve buscar. Exemplo:

> "Pedido #42 pronto — Pass da Cozinha + Janela da Pizzaria — Mesa 5"

O claim (assumir entrega) é por **grupo de entrega**, não por item individual. Isso garante que um garçom leva tudo junto e evita que outro pegue metade do pedido.

**Fluxo completo:**
1. Sistema detecta que todos os itens do grupo (Normal ou Entrega Antecipada) estão "Pronto".
2. **Notificação para todos os garçons do setor** com lista de Pontos de Entrega a visitar (excluindo itens `kitchenDelivery` — ver "Os 3 conceitos de entrega" acima).
3. **Primeiro garçom que toca "Retirar"** assume o grupo inteiro (claim). O sistema registra `claimedByStaffId` em todos os itens do grupo. **Concorrência:** `SELECT ... FOR UPDATE` (pessimistic locking) garante que apenas 1 garçom consegue o claim.
4. **Grupo some da tela dos outros garçons em tempo real** (via WebSocket `waiter:pickup-claimed`).
5. Garçom vai a cada Ponto de Entrega, pega os itens, entrega na mesa → marca **"Entregue"**.
6. Se o garçom que assumiu não marcar "Entregue", o sistema de escalação continua funcionando normalmente — mas agora com garçom responsável identificado.
7. **Escalação nível 2 — concorrência:** o grupo reaparece para todos os garçons. O `claimedByStaffId` original é **mantido** para auditoria, mas qualquer garçom pode fazer novo claim (sobrescreve o anterior). **Mesmo comportamento de concorrência do claim normal:** first-write-wins com `SELECT ... FOR UPDATE`. Segundo garçom que tentar recebe 409 (`ORDER_004`). Ao fazer novo claim, grupo some da tela dos outros em tempo real (`waiter:pickup-claimed`). Não existe endpoint de "unclaim" — a escalação nível 2 funciona como override implícito.
8. **Claim timeout:** se o garçom que assumiu o claim **não marcar "Entregue" em `claimTimeout` minutos** (default 5, configurável em RestaurantSettings), o claim é liberado automaticamente — o grupo volta a aparecer para todos os garçons do setor como se nenhum claim tivesse sido feito. O `claimedByStaffId` original é registrado em log para auditoria. **Mecanismo:** Bull delayed job — ao fazer claim, agenda job com delay de `claimTimeout` minutos. Ao marcar "Entregue", cancela o job. Mesmo padrão da expiração de PIX (Sprint 12 — Pagamento).
   - **Notificação antes do timeout:** aos **4 minutos** (1 minuto antes do timeout), o garçom que fez o claim recebe push notification + alerta in-app: "Grupo do Pedido #42 será liberado em 1 minuto — marque como Entregue".
   - **Notificação no momento do timeout:** quando o claim expira, o garçom original recebe: "Claim do Pedido #42 expirado — grupo liberado para outros garçons". Simultaneamente, evento `waiter:order-ready` é re-emitido para todos os garçons do setor (mesmo evento da notificação original), permitindo novo claim.
   - **Auditoria:** o evento de timeout registra `claimTimeoutAt`, `originalStaffId`, `orderId`, `deliveryGroup` no log. Se outro garçom fizer novo claim, o `claimedByStaffId` é sobrescrito mas o original fica no log.

### Escalação de Retirada (item pronto sem entrega)

Quando um item é marcado como "Pronto" e o garçom não marca "Entregue", o sistema escala automaticamente:

1. **Re-notificação ao garçom do setor (nível 1)** — a cada `pickupReminderInterval` minutos (configurável em Settings), o sistema reenvia push notification + alerta in-app para o(s) garçom(ns) do setor da mesa. **Repete a cada intervalo** até que o item seja entregue ou escale para nível 2. Mensagem: "Item aguardando retirada há X min — [Ponto de Entrega]".
2. **Escalação para admin + todos os garçons (nível 2)** — após `pickupEscalationTimeout` minutos sem entrega (configurável em Settings). **Nível 1 para** — a partir daqui, o garçom do setor só recebe notificações como parte do grupo "todos os garçons", sem renotificação separada. O sistema:
   - Notifica o admin/gerente via push + alerta no dashboard (card destacado com cor vermelha).
   - Notifica **todos os garçons ativos** (não só os do setor), para que qualquer um possa entregar.
   - Mensagem: "URGENTE: item aguardando retirada há Y min — Mesa X — [Ponto de Entrega]".
3. **Registro para auditoria** — cada ocorrência de escalação é registrada com: garçom responsável (do setor), item, mesa, tempo de espera, se foi escalado para nível 1 (re-notificação) ou nível 2 (admin + todos). O admin pode consultar relatório de escalações por garçom e por período na tela de Desempenho da Equipe.

**Parâmetros configuráveis (tela Settings do admin):**
| Parâmetro | Descrição | Default |
|---|---|---|
| `pickupReminderInterval` | Intervalo de re-notificação ao garçom do setor (minutos) | 3 |
| `pickupEscalationTimeout` | Tempo para escalar ao admin + todos os garçons (minutos) | 10 |

**Nota:** esses parâmetros se aplicam apenas a Pontos de Entrega com `kitchenDelivery = false`. Pontos com `kitchenDelivery = true` não passam por escalação — o operador do KDS é responsável pela entrega. O timer acumulado no card do KDS (com cores verde/amarelo/vermelho) funciona como pressão visual. O admin monitora via alerta genérico de pedido atrasado no dashboard.

**Autenticação do KDS:** o KDS requer autenticação de funcionário com role `KITCHEN` (mesmo padrão de auth dos demais staff — JWT). Após login, o funcionário seleciona o Local de Preparo. O operador pode acessar qualquer Local de Preparo do restaurante. Ações no KDS (marcar "Pronto", "Entregue") são registradas com `userId`, `source: 'kds'` e `preparationLocationId` no log.

## Módulo Cliente (Cardápio Digital) — Rota: `/[slug]/mesa/[mesaId]`
Acesso: Cliente via QR Code no navegador.

### QR Code e Entrada na Mesa
- Cada mesa física tem um **QR Code fixo** impresso e colado. O QR Code gera URL permanente `/{slug}/mesa/{mesaId}`.
- Ao escanear o QR Code, o cliente vê duas opções: **"Entrar na mesa"** ou **"Ver cardápio"**.
- **Ver cardápio (modo read-only):** acessa o cardápio completo com preços, sem criar sessão, sem identificação. Não pode fazer pedidos. Útil para ver preços antes de sentar ou enquanto aguarda aprovação. O botão "Adicionar" nos produtos exibe toast "Entre na mesa para fazer pedidos". Carrinho indisponível. Ao completar o fluxo de verificação WhatsApp e aprovação, o modo interativo é ativado automaticamente.

### Proteção contra Abertura sem Atendimento
- **Bloqueio:** `POST /tables/:id/open` (abertura pelo cliente) verifica se o setor da mesa tem pelo menos 1 garçom com turno ativo (clock-in feito). Se não tem, retorna erro `SESSION_019: Mesa sem atendimento no momento` + mensagem amigável: "Esta mesa ainda não tem atendimento. Aguarde ou procure um funcionário."
- **OTP não é "gasto" pelo bloqueio:** se o cliente já verificou o telefone via `POST /tables/:id/verify-phone` e o `open` falha com SESSION_019, a verificação do telefone permanece válida em Redis (TTL de 5min). O cliente pode retentar `POST /tables/:id/open` sem refazer OTP enquanto a verificação não expirar. Frontend exibe botão "Tentar novamente" na tela de erro.
- **Alerta ao admin:** simultaneamente, o sistema emite `admin:no-waiter-alert` para o admin/gerente com severidade alta: "Cliente tentou abrir mesa X — setor Y sem garçom ativo." Badge vermelho no dashboard, som de alerta.
- **Abertura pelo staff:** `POST /tables/:id/open-staff` (garçom abrindo a mesa) **não** é bloqueado por essa regra — o garçom já está presente fisicamente.

### Notificação de Mesa Aberta
- **Com garçom ativo no setor:** ao abrir sessão pelo cliente, o sistema emite `waiter:session-opened` para os garçons do setor. Garçom vai até a mesa para dar boas-vindas e explicar o sistema. Se a mesa estiver fisicamente vazia → sessão fantasma → garçom fecha via `POST /tables/:id/close` (sessão vazia fecha sem restrições).
- **Atenuantes contra sessão fantasma:**
  - **Auto-close de sessão vazia:** sessão sem nenhum pedido há mais de `idleTableThreshold` minutos (default 30min) é fechada automaticamente pelo sistema. Job Bull periódico verifica sessões vazias e fecha via `POST /tables/:id/close`. Garçom já foi notificado via `waiter:session-opened`, admin já viu alerta de mesa ociosa — se ninguém agiu, o sistema limpa. **Sessões com pedidos nunca são fechadas automaticamente** — só humano fecha (risco de dinheiro envolvido).
  - Mesa ociosa com pedidos: sessão ativa sem pedido **novo** há mais de `idleTableThreshold` minutos gera alerta no dashboard do admin (mas não fecha).
  - Pedido sem retirada: se alguém fizer pedido remoto, comida fica pronta e ninguém retira → escalação notifica garçons → garçom percebe mesa vazia → fecha sessão.
- **Fase futura (se necessário):** código diário de 4 dígitos exibido na mesa, GPS opcional.

### Abertura de Sessão (primeiro cliente)
- Se a mesa não tem sessão ativa, o primeiro cliente a escolher "Entrar na mesa" inicia o fluxo de abertura:
  1. Informa número de WhatsApp → `POST /tables/:id/verify-phone` (endpoint público, não requer sessão) → recebe OTP 6 dígitos → confirma. **Estado de verificação armazenado em Redis:** chave `verified:{tableId}:{phone}` com TTL de 5 minutos. O endpoint `open` consulta essa chave para confirmar que o telefone foi verificado.
  2. Após verificação, o sistema chama `POST /tables/:id/open` que cria a sessão, registra o primeiro membro aprovado e retorna o `sessionToken` criptograficamente seguro.
  3. Cadastra nomes de quem está na mesa (incluindo o próprio).
- **Nota:** o endpoint `POST /session/:token/join` **nunca cria sessão**. Ele é utilizado exclusivamente por clientes subsequentes que entram em uma sessão já existente. `POST /tables/:id/open` só pode ser chamado pelo primeiro cliente (mesa sem sessão ativa).

### Aprovação de Novos Entrantes (REGRA CRÍTICA)
- Se a mesa **já tem sessão ativa** e alguém escaneia o QR Code e escolhe "Entrar na mesa":
  1. O entrante detecta a sessão ativa → **informa seu nome** → informa número de WhatsApp → `POST /session/:token/phone` (verifica telefone no contexto da sessão existente) → recebe OTP → confirma.
  2. Após verificação, chama `POST /session/:token/join` com o nome informado (que **nunca cria sessão**, apenas solicita entrada) → entra em **fila de aprovação**. Não tem acesso a nada da mesa até ser aprovado.
  3. **Qualquer pessoa já aprovada na mesa** pode aprovar ou rejeitar o novo entrante.
  4. **Ao aprovar:** o sistema cria uma Person com o nome do `JoinRequest.name` (o nome que o entrante digitou). Membros da mesa podem editar o nome depois via `PATCH /session/:token/people/:personId`.
  4. Os membros da mesa recebem **notificação (push + alerta na tela)** de que alguém quer entrar.
  5. Ao aprovar ou rejeitar, servidor emite evento WebSocket (`session:join-approved` ou `session:join-rejected`) — **a notificação some da tela de todos os membros** automaticamente. Primeira ação válida prevalece; se outro membro tentar agir depois, recebe erro `SESSION_005` (safety net para cliques simultâneos).
- **Tela de espera (enquanto aguarda aprovação):**
  - Mensagem "Aguardando aprovação da mesa..."
  - Botão **"Lembrar mesa"** — reenvia notificação manualmente (cooldown de 60 segundos).
  - Botão **"Ver cardápio"** — abre modo read-only enquanto espera.
  - Botão **"Cancelar"** — desiste e sai da fila de aprovação.
- **Timeout de aprovação:** a solicitação de aprovação expira automaticamente após **5 minutos** sem resposta. Durante a espera, o sistema reenvia notificação automaticamente a cada **60 segundos** para os membros da mesa (sem precisar apertar botão). O botão **"Lembrar mesa"** é mantido para renotificação manual com cooldown de 60 segundos. Após expirar, o status muda para `JOIN_EXPIRED` e o entrante vê a mensagem: "Tempo esgotado. Escaneie o QR Code novamente." Um job Bull verifica solicitações pendentes expiradas.
- **Re-solicitação após rejeição ou expiração:** entrante pode re-solicitar via `POST /session/:token/join` sem refazer OTP (telefone já verificado). Máximo **3 solicitações** por telefone por TableSession. Após 3 tentativas, erro `SESSION_014: Limite de solicitações atingido`. Staff (garçom+) pode resetar o contador via `DELETE /session/:token/join/reset-limit` (body: `{ phone }`) para casos legítimos.
- **Se o QR Code for lido por alguém já aprovado na sessão**, apenas abre o sistema normalmente.
- **Na tela de pessoas**, exibir entrantes pendentes com opção de aprovar/rejeitar.

### Identificação via WhatsApp
- **Obrigatória para entrar na mesa.** OTP de 6 dígitos via WhatsApp. Salva `phone` + `phoneVerified = true`. **Armazenamento do OTP:** Redis com TTL de 5 minutos. Chave: `otp:{phone}` → `{ code, attempts, createdAt }`. Sem tabela no banco — OTP é efêmero, se Redis reiniciar o cliente solicita novo OTP.
- **Unicidade de telefone:** um telefone verificado só pode estar vinculado a **uma sessão ativa por restaurante**. Se o cliente tenta entrar numa segunda mesa no mesmo restaurante e já está em outra sessão ativa, retorna erro `SESSION_008`: "Telefone já vinculado a outra sessão ativa neste restaurante." Pode estar em restaurantes diferentes simultaneamente.

### Pessoa Sai e Volta (Participações Múltiplas)
- Pessoa paga sua parte (ou R$0 se não consumiu) → status "quitada" → some das atribuições de novos pedidos a partir daquele momento.
- **Se volta via QR Code:** telefone já foi verificado anteriormente (sem fila de aprovação). O sistema cria uma **nova Person** (nova participação/Participation) na mesma sessão — não reutiliza a participação anterior. O campo `consentGivenAt` da nova Person é **copiado da Person anterior** (mesmo telefone, mesma sessão) — registra o momento real em que o consentimento LGPD foi dado, não o momento do retorno.
- Pagamentos e itens vinculados à participação anterior são **preservados intactos**. Devoluções pendentes da participação anterior permanecem pendentes — não são transferidas para a nova participação.
- **Exibição de nome por participação:**
  - 1 participação no total: exibe `"Maria"` (sem número).
  - 2 ou mais participações do mesmo telefone: exibe `"Maria ①"`, `"Maria ②"` em **todos os lugares** onde o nome aparece (conta, pedidos, comanda, KDS, histórico).
- **Aba "Por Pessoa" da Conta:** participações separadas em blocos distintos. Cada bloco exibe o nome com sufixo ordinal (se houver múltiplas).

### Cardápio e Pedidos
- Cardápio com galeria de fotos, descrições, filtros (vegano, sem glúten, etc).
- Upselling: sugestões automáticas de adicionais e acompanhamentos (referência futura — sem endpoint/sprint definido na Fase 1).
- **Pessoas na mesa (REGRA CRÍTICA — aplicar em TODAS as telas do cliente):** cadastrar nomes (sem verificação). Lista editável durante toda a sessão. **OBRIGATÓRIO:** um botão visível no header de TODAS as telas do cliente (cardápio, produto, carrinho, pedidos, conta, pagamento) deve abrir modal/tela para adicionar/remover pessoas a qualquer momento. Não basta existir a tela `pessoas.html` no fluxo inicial — o acesso deve ser permanente via header.
- **Carrinho:** ao adicionar item, selecionar pelo menos 1 pessoa (obrigatório). Valor divide igual entre selecionados. Cada item pode conter **observações** (`notes?: string`) — campo de texto livre para instruções especiais (ex: "bem passado", "sem cebola", "alergia a amendoim").
- **Pedidos em tempo real:** cada envio = pedido separado. Status segue a **Máquina de Estados do Pedido** (ver seção Estrutura Operacional): `Na fila` → `Preparando` → `Pronto` → `Entregue` (com possibilidade de `Cancelado`). WebSocket. Cada pedido gera até 3 **grupos de entrega**: itens normais (garçom notificado quando todos ficarem prontos), itens com `earlyDelivery` (notificado quando todos os imediatos ficarem prontos), e itens destino "Garçom" (entrega direta). Internamente, itens são roteados para o KDS do Local de Preparo correspondente. Ver "Grupos de Entrega" na seção Estrutura Operacional.
- **Tela "Meus Pedidos"**: lista por pedido, status individual, reatribuição de pessoas. A reatribuição de pessoas é feita exclusivamente pelo cliente (membro aprovado da mesa) via `PATCH /orders/items/:id/people`. O garçom não reatribui — se necessário, lança novo pedido via comanda. **Reatribuição bloqueada** se qualquer pessoa tem Payment com status `PAYMENT_PENDING`, `PAYMENT_CONFIRMED`, `PAYMENT_PENDING_REFUND` ou `PAYMENT_REFUNDED` que inclua o item — erro `ORDER_006`. Apenas `PAYMENT_CANCELLED` e `PAYMENT_EXPIRED` **não bloqueiam** (tentativa abandonada, ninguém pagou). Na prática, itens com Payment PAYMENT_REFUNDED já foram cancelados e saíram da conta — reatribuição não se aplica.
  - **Indicação visual de bloqueio:** itens com reatribuição bloqueada exibem ícone de cadeado + tooltip "Item já pago — não pode ser reatribuído". O cliente vê o bloqueio **antes** de tentar, sem precisar receber erro.
  - **Fluxo alternativo:** se o cliente precisa corrigir uma atribuição bloqueada, deve chamar o garçom via "O Chefia" (motivo: "Outro"). O garçom pode solicitar ao OWNER/MANAGER o cancelamento do item já entregue (gera crédito) e relançar o pedido com a atribuição correta via comanda.
  - **Reatribuição parcial:** o bloqueio se aplica ao **item inteiro**, não por pessoa. Se qualquer fatia do item foi paga, nenhuma reatribuição é permitida no item. Isso simplifica a lógica e evita inconsistências no cálculo da conta.

### Conta e Pagamento
- **Tela "Conta"** com 3 abas: **Visão Geral**, **Por Pessoa**, **Histórico**.
  - **Visão geral:** lista todos os itens. Nome do item exibe entre parênteses a quantidade de pessoas que dividem (ex: "Picanha na Brasa (3)"). Clicar no item abre modal para editar quem divide — selecionar/desselecionar pessoas.
  - **Por pessoa:** lista itens de cada pessoa com quantidade de pessoas que dividem entre parênteses. Itens iguais com grupos de divisão diferentes são diferenciados por **cor** (barra lateral ou indicador colorido), para distinguir visualmente que são pedidos separados.
  - **Histórico (log de atividade):** registro legível de todas as ações de pedido, reatribuição e cancelamento. Visível para todos na mesa. Formato simples para leigos:
    ```
    Picanha - José realizou o pedido
    Para: José e Antônio

    Picanha - Marta modificou
    De: José e Antônio
    Para: Marta e José

    Frango à Passarinho - José realizou o pedido
    Para: Pedro e Carlos

    Caipirinha - Carlos cancelou
    Motivo: cliente cancelou (Na fila)
    ```
  - Taxa de serviço (`serviceChargePercent`) configurável, **default 10%** (padrão brasileiro). Pode ser desabilitada por pessoa pelo garçom — na aba "Por Pessoa" da conta, pessoas com taxa desabilitada aparecem com indicação visual (ex: "sem taxa de serviço"). O valor da taxa é calculado individualmente por pessoa.
  - **Taxa de serviço e kitchenDelivery:** itens de Pontos de Entrega com `kitchenDelivery = true` (entrega direta pelo operador do KDS) **também geram taxa de serviço** para o garçom do setor. O garçom atendeu a mesa como um todo — a taxa não depende de quem entregou cada item individual.
  - **Cálculo da taxa em itens divididos:** a taxa incide sobre a **fatia de cada pessoa**, não sobre o item inteiro. Divide primeiro, taxa depois: `fatia = valor / N`, depois `fatia + (fatia × taxa%)`. Matematicamente equivale a `(valor × taxa%) / N`, mas a ordem conceitual é "divide primeiro, taxa depois" — isso permite que cada pessoa tenha taxa habilitada/desabilitada individualmente. Se Pessoa A (sem taxa) e Pessoa B (com taxa) dividem um item de R$100: Pessoa A paga R$50,00 (sem taxa), Pessoa B paga R$50,00 + R$5,00 (10% de taxa) = R$55,00. Cada fatia é independente.
  - **Toggle geral após toggle individual:** se o garçom desabilita a taxa para Pessoa A individualmente, e depois reabilita o toggle geral, Pessoa A **volta a ter taxa ativa** (toggle geral sobrescreve todos). Se desabilitar o geral, todos desligam. O estado "parcial" (checkbox indeterminado) só existe enquanto há divergência entre pessoas — qualquer ação no toggle geral resolve a divergência.
  - **Arredondamento de divisão igualitária:** ao dividir um valor entre N pessoas, as N-1 primeiras recebem `floor(valor / N)` e a última recebe `total - soma_das_anteriores` (absorve o centavo residual). A última pessoa da lista ordenada paga o arredondamento.
- **Pagamento individual por pessoa.** Cada pessoa paga o total da sua parte com **um único método** (limitação intencional da Fase 1). Não há pagamento parcial — se quiser trocar de método, cancela o PAYMENT_PENDING e inicia outro. Cobre 95%+ dos casos reais em bares/restaurantes brasileiros. Tipos de pagamento aceitos:
  - **`PIX`** — gera QR Code para pagamento. Confirmação via webhook (simulado na Fase 1).
  - **`CASH`** (dinheiro) — registro manual pelo staff após receber o pagamento físico.
  - **`CARD_DEBIT`** (cartão de débito) — registro manual pelo staff após receber o pagamento físico.
  - **`CARD_CREDIT`** (cartão de crédito) — registro manual pelo staff após receber o pagamento físico.
- **Todo pagamento nasce com status PAYMENT_PENDING** — a confirmação é sempre um segundo passo independente.
- **PIX via webhook:** confirmação automática (sem `staffId`). PIX sem ação após 30 minutos expira e volta ao estado "não pago". Garçom pode cancelar um PIX pendente.
- **PIX/CASH/CARD via garçom:** confirmação manual com `confirmedByStaffId` + timestamp (rastro de auditoria). Tanto o cliente quanto o garçom podem iniciar o pagamento — o garçom pode agir por mesas "analógicas" (abertas por ele, sem app do cliente).
- **CASH e CARD:** registrados exclusivamente pelo staff (garçom+) após receber o pagamento físico.

### Aviso ao Pagar com Itens Não Entregues
- **Por pessoa** (não por mesa): quando uma pessoa (ou o garçom por ela) inicia o pagamento, se essa pessoa tem itens com status diferente de DELIVERED ou CANCELLED, o sistema exibe um aviso de confirmação antes de prosseguir. O pagamento não é bloqueado — apenas requer confirmação explícita.

### Fechamento de Sessão (pré-condições)
- **Fechamento normal** (`POST /tables/:id/close`, roles: WAITER+): não pode haver itens com status Na fila ou Preparando — cancelar ou aguardar. Itens Pronto não entregues geram aviso mas não bloqueiam. Todos os pagamentos devem estar quitados.
- **Fechamento forçado** (`POST /tables/:id/force-close`, roles: OWNER/MANAGER): fecha mesmo com pagamentos pendentes — marca como PAYMENT_CANCELLED. Registra em AuditLog com motivo. Usado para calote ou situações excepcionais.
- **Workflow de calote:** garçom identifica que cliente saiu sem pagar → garçom não tem permissão de force-close → chama gerente/dono → gerente faz force-close com `{ confirm: true }` → sistema cancela pagamentos pendentes, registra em AuditLog, emite `client:session-closed`. Reflete a operação real de restaurantes.

### Botão "O Chefia"
- **(REGRA CRÍTICA — deve ser funcional em TODAS as telas do cliente):** 4ª tab da bottom nav (Cardápio, Pedidos, Conta, **O Chefia**). Ao clicar, **abre modal (bottom sheet)** sem navegar — mantém o contexto da tela atual. Modal com seleção de motivo (ex: "Chamar garçom", "Pedir a conta", "Outro") + campo de mensagem opcional + botão "Enviar chamado". Não é um link decorativo — deve ter interação funcional no protótipo e no código.

## Módulo Garçom — Rota: `/garcom`
Acesso: Celular do garçom (PWA).

### Navegação
- **Bottom nav fixa com 3 tabs:** Chamados (principal), Mesas, Turno.
- "Detalhe da mesa" e "Comanda" são telas contextuais acessadas a partir de uma mesa específica — **não** aparecem na bottom nav.

### Funcionalidades
- **Ativação de turno (clock-in):** garçom precisa informar que começou a trabalhar no dia. Requer **PIN numérico de 4 dígitos** (definido no cadastro do funcionário). Ao ativar, salva hora de início. Ao encerrar, salva hora de fim. Registro de tempo de serviço por dia. OWNER/MANAGER pode resetar o PIN de qualquer funcionário.
- **Lista de mesas dos setores atribuídos** com status (setores definidos na Equipe do Dia). Tap na mesa livre abre tela de abertura; tap na mesa ocupada abre o detalhe.
- **Abrir mesa:** tela para o garçom abrir sessão em mesa livre. Quantidade de pessoas + nomes (opcional, pode pular). Cria sessão e vai para detalhe da mesa. Alternativa ao fluxo via QR Code do cliente.
- **Detalhe da mesa:** pessoas na mesa, pedidos ativos com status de cada item, botão "Novo Pedido" (abre comanda), botão "Fechar conta". Se houver `JoinRequest` com status JOIN_PENDING, a seção **"Pendentes"** aparece no topo da tela — o garçom aprova ou rejeita, registrando `approvedByStaffId` (ou `rejectedByStaffId`) + timestamp. Não há notificação push pro garçom — a seção só aparece quando ele abre a tela da mesa. Funciona para mesas analógicas e mistas.
- **Comanda:** lançar pedidos rápidos para a mesa selecionada. Busca de produtos, seleção de pessoas, lista por categoria com botão "+", barra de resumo com "Enviar Pedido". **Pedidos via comanda seguem o mesmo fluxo de pedidos do cliente** — o cliente pode reatribuir pessoas depois (mesmas regras de bloqueio por pagamento aplicam). A comanda não gera pedido "especial" — é um `POST /orders` com `source: 'staff'`.
- **Chamados:** lista de chamados abertos de clientes das mesas dos seus setores.
- Notificações push: item pronto para retirada (com indicação do Ponto de Entrega), chamado de mesa, re-lembretes de retirada pendente, e escalação urgente (quando qualquer garçom pode entregar).
- Histórico de pedidos com divisão por pessoa.
- **Toggle taxa de serviço por pessoa ou por mesa toda.** Na tela de detalhe da mesa, toggle geral (atalho para todos) + toggle individual por pessoa. Se o garçom desliga o geral, todos desligam. Se religa, todos religam. Se mexe num individual, o geral indica **estado parcial** (checkbox indeterminado: traço "—" em vez de check, cor neutra). A taxa de serviço só é calculada sobre os itens das pessoas com flag ativo.
- **Transferência de mesa:** garçom pode transferir sessão ativa para outra mesa livre. Ver seção "Transferência de Mesa" na Estrutura Operacional.

## Módulo Explorar (Fase 2 — NÃO IMPLEMENTAR) — Rota: `/explorar`
**Referência arquitetural apenas.**
- Listagem de estabelecimentos, mapa, filtros, lotação, reserva, pré-pedido, fidelidade.

---

## Sistema de Módulos

O OChefia funciona com **sistema modular**. A Fase 1 completa é o **módulo padrão**, incluído no plano base de todo estabelecimento. Novas funcionalidades são **módulos extras** vendidos separadamente.

| Módulo | Tipo | Conteúdo |
|---|---|---|
| **Padrão** | Incluído | Cardápio digital, pedidos, KDS, garçom, mesas, faturamento, dashboard |
| **Estoque** | Extra (Fase 2) | Controle de estoque, ingredientes, baixa automática, alertas de mínimo |
| **Explorar** | Extra (Fase 2) | App consumidor, listagem, reserva, pré-pedido, fidelidade |
| **NFC-e/SAT** | Extra (Fase 2) | Emissão fiscal integrada |

- Módulos extras só ficam disponíveis quando **habilitados pelo Super Admin** do OChefia para o estabelecimento.
- Cada módulo tem valor próprio, configurável globalmente e por estabelecimento.
- O estabelecimento não vê/acessa funcionalidades de módulos não habilitados.

---

## Módulo Super Admin OChefia — Rota: `/superadmin`
Acesso: Equipe interna OChefia (role `SUPER_ADMIN`). **Não acessível por estabelecimentos.**

### Gestão de Estabelecimentos
- **Listagem** de todos os estabelecimentos com status: ativo, suspenso, inadimplente.
- **Cadastro** de novo estabelecimento: nome, slug, CNPJ, responsável, email, telefone.
- **Editar/suspender** estabelecimento. **Suspensão gradual:**
  - **Bloqueado:** criação de novas sessões (`POST /tables/:id/open` e `open-staff`), novos pedidos (`POST /orders`).
  - **Permitido:** processar pagamentos de sessões ativas (cliente já consumiu, precisa pagar), clock-in de garçom (precisa de staff para encerrar sessões), acesso ao dashboard admin (precisa monitorar), fechamento de sessões (normal e force-close).
  - **QR Code:** cliente que escaneia QR de restaurante suspenso vê mensagem "Estabelecimento temporariamente indisponível". Cardápio read-only também bloqueado.
  - Sessões e pedidos já ativos continuam até conclusão normal.

### Cobrança e Pagamentos
- **Valor do plano base** por estabelecimento (campo editável).
- **Registro de pagamento mensal**: marcar como pago, pendente ou atrasado.
- **Histórico de pagamentos** por estabelecimento.
- **Indicadores visuais**: destaque para inadimplentes e atrasados.

### Gestão de Módulos
- **Habilitar/desabilitar** módulos extras por estabelecimento.
- **Definir valor** de cada módulo (global e override por estabelecimento).
- **Visualizar** quais módulos cada estabelecimento possui.

### Monitoramento
- Métricas de uso por estabelecimento (pedidos/mês, mesas ativas).
- Último acesso.
- Acesso a logs via `docker compose logs` (Fase 1) ou CloudWatch (Fase 2).

---

## Storage de Imagens

- **Fase 1:** Filesystem local com volume Docker mapeado. nginx serve os arquivos estáticos.
- **Fase 2 (AWS):** S3 + CloudFront (upload -> S3, entrega via CDN).
- Interface `StorageService` (`upload`, `delete`, `getUrl`). Implementações: Local (Fase 1) e S3 (Fase 2).
- `STORAGE_DRIVER=local|s3`. Resize com `sharp` (thumb 200px, media 600px, original). Max 5MB, JPEG/PNG/WebP.
