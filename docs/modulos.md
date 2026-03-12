# Modulos Funcionais

## Estrutura Operacional do Restaurante

Antes de descrever os modulos, e importante entender as entidades que organizam a operacao fisica do restaurante:

### Local de Preparo
Onde os itens sao produzidos. Cada restaurante cadastra seus proprios locais de preparo com nomes livres (ex: "Cozinha Principal", "Pizzaria", "Bar", "Cozinha Fria", "Churrasqueira"). **Cada Local de Preparo corresponde a uma tela KDS independente.**

### Ponto de Entrega
Onde o garcom retira o item pronto. Cada Local de Preparo tem **1 ou mais Pontos de Entrega** (criado automaticamente com 1 default ao cadastrar o Local de Preparo). Exemplos: "Pass principal", "Balcão do bar", "Service bar", "Janela da pizzaria".

- **Flag `autoEntrega`** (boolean, default `false`): se `true`, o operador do Local de Preparo entrega o item diretamente na mesa — garcom **nao** e notificado para retirada. Se `false`, garcom e notificado para buscar no Ponto de Entrega.

### Setor
Agrupamento fisico de mesas (ex: "Salão Principal", "Terraço", "VIP", "Área Externa"). **Toda mesa pertence a exatamente 1 setor.** Ao criar o restaurante, um setor default e criado automaticamente.

- **Garcons sao atribuidos a setores** (nao a mesas individuais). Um garcom pode atender mais de 1 setor.
- **Taxa de servico e dividida igualmente entre garcons do mesmo setor.** Se um garcom precisa ficar exclusivo em uma mesa, essa mesa deve estar em um setor proprio.
- **Mapeamento obrigatorio Setor ↔ Local de Preparo:** para cada setor, deve haver um vinculo com cada Local de Preparo, indicando **qual Ponto de Entrega** os garcons daquele setor usam para retirada. Isso permite que garcons de setores diferentes retirem em pontos diferentes do mesmo Local de Preparo.

### Cadastro de Produto — Destino e Entrega Imediata
No cadastro de produto, o campo "Destino" e obrigatorio e mostra:
- **Todos os Pontos de Entrega cadastrados** (agrupados por Local de Preparo) — o pedido vai para o KDS do Local de Preparo vinculado.
- **Opção fixa "Garçom"** — entrega direta pelo garcom, sem preparo, nao passa por KDS nenhum.

Alem do destino, o produto possui a **flag `immediateDelivery`** (boolean, default `false`):
- **`false` (padrão):** item normal. O garçom só é notificado quando **todos** os itens normais do mesmo pedido ficarem prontos, mesmo que venham de Locais de Preparo diferentes. Exemplo: Picanha (Cozinha) + Pizza (Pizzaria) — garçom espera ambos ficarem prontos e leva tudo junto.
- **`true` (entrega imediata):** item que pode ser entregue antes dos demais (ex: drinks, sobremesas geladas). O garçom é notificado assim que **todos os itens com `immediateDelivery = true` do mesmo pedido** ficarem prontos, sem esperar pelos itens normais.

### Grupos de Entrega (por pedido)
Cada pedido gera até **3 grupos de entrega** independentes:

| Grupo | Itens | Quando notifica garçom |
|---|---|---|
| **Normal** | Produtos com `immediateDelivery = false` | Quando **todos** ficarem prontos |
| **Entrega imediata** | Produtos com `immediateDelivery = true` | Quando **todos os imediatos** ficarem prontos |
| **Garçom direto** | Produtos com destino "Garçom" | Imediatamente (não passa por KDS) |

- Pedidos diferentes (feitos em momentos diferentes) são **independentes** — não esperam entre si.
- O agrupamento é por **pedido**, não por mesa.

---

## Modulo Gerencial (Dashboard/Backoffice) — Rota: `/admin`
Acesso: Dono/Gerente via computador ou tablet.

- **Mapa de mesas em tempo real** (livres, ocupadas, aguardando limpeza, tempo de permanência). Filtros: "Todas", "Com problema", "Ociosas". Indicadores visuais de alerta: pedido atrasado, chamado sem resposta, tempo sem novo pedido. Botão deletar mesa (soft delete — só se não tiver sessão ativa; histórico preservado para métricas; permite recriar mesa com mesmo nome/número).
- **Metricas no dashboard**: tempo médio de preparo por **Local de Preparo** (dinâmico, baseado nos cadastrados), tempo médio de entrega por garçom (entre "Pronto" e "Entregue"), mesas ativas, alertas em tempo real (pedidos atrasados, chamados sem resposta, escalações ativas, mesas ociosas, mesas sem setor, setores sem garçom atribuído).
- **Tela "Desempenho da Equipe"** (rota `/admin/desempenho`): métricas individuais por funcionário.
  - **Por garçom:** tempo médio de entrega (Pronto → Entregue), quantidade de pedidos atendidos, escalações (nível 1 e 2), taxa de serviço acumulada. Filtro por período (dia/semana/mês).
  - **Por Local de Preparo:** tempo médio de preparo (Na fila → Pronto), quantidade de pedidos, itens mais demorados. Filtro por período.
- Cardapio: CRUD de categorias, **tags de produto** (ex: vegano, sem gluten, picante, sugestao do chef) e produtos. Habilitar/desabilitar em tempo real. Precificacao dinamica/Happy Hour e referencia futura (sem endpoint/sprint definido na Fase 1).
- **Cadastro de produto — destino apos pedido:** campo obrigatorio indicando o **Ponto de Entrega** (que pertence a um Local de Preparo) ou **"Garçom"** (entrega direta, sem preparo). Flag **`immediateDelivery`** (default `false`) para itens que podem ser entregues antes dos demais (ex: drinks). Ver secao "Estrutura Operacional" acima.
- Upload de imagens: multiplas fotos por produto (galeria). Primeira foto = capa. Upload com preview, reordenacao e remocao.
- **CRUD de Locais de Preparo:** nome do local. Ao criar, 1 Ponto de Entrega default e gerado automaticamente.
- **CRUD de Pontos de Entrega:** nome do ponto, Local de Preparo vinculado, flag `autoEntrega` (default `false`).
- **CRUD de Setores:** nome do setor, mesas vinculadas. Mapeamento obrigatorio de Ponto de Entrega por Local de Preparo.
- Gestao de funcionarios: cadastro de garcons, cozinheiros, gerentes com permissoes por role.
- **Funcionarios temporarios:** cadastro com flag `temporario`. Opcao de definir dias fixos da semana (ex: seg, qua, sex) ou deixar em branco para uso avulso.
- **Tela de Escala (programacao):** calendario/lista por dia mostrando quem vai trabalhar nos proximos dias. Funcionarios permanentes + temporarios com dia pre-definido entram automaticamente. Permite desmarcar qualquer um para o dia e adicionar temporarios avulsos.
- **Tela Equipe do Dia:** lista todos que vao trabalhar hoje (auto-preenchido pela escala). Toggle para desmarcar/marcar. Adicionar temporarios avulsos. **Atribuir garcons a setores** (um garcom pode ter mais de 1 setor).
- **Configuracoes do estabelecimento** (em Settings): nome do estabelecimento e logo. O nome/logo substitui "OChefia" no header do cardapio do cliente, mas mantem "OChefia" em tamanho pequeno (branding). Se nao configurado, mostra apenas "OChefia". Inclui parametros de escalação de retirada (`pickupReminderInterval`, `pickupEscalationTimeout`) — ver seção "Escalação de Retirada" no Módulo KDS.
- **Estoque:** movido para Fase 2. Nao implementar ate aviso explicito.

## Modulo Faturamento — Rota: `/admin/faturamento`
Acesso: Dono/Gerente. Tela separada do dashboard, dedicada a financeiro.

- **Faturamento diario:** receita do dia, quantidade de pedidos, ticket medio, comparativo com dia anterior.
- **Faturamento mensal:** receita acumulada do mes, grafico por dia, comparativo com mes anterior.
- **Fechamento de caixa:** resumo de valores recebidos (Pix, dinheiro, cartao). (NFC-e/SAT em fase futura).
- **Taxas de garçom:** valores a pagar para cada garçom no período. Calculado automaticamente com base na taxa de serviço das mesas dos setores atendidos (dividida igualmente entre garçons do mesmo setor). Não é salário — é apenas a parte da taxa de serviço devida a cada garçom. Filtro por dia e por mês.

---

## Modulo KDS (Kitchen Display System) — Rota: `/kds`
Acesso: Equipe de producao via tablet ou monitor. **Cada Local de Preparo tem sua propria tela KDS.**

- Roteamento automatico baseado no **Ponto de Entrega** do produto: o pedido vai para o KDS do **Local de Preparo** vinculado ao Ponto de Entrega. Produtos com destino "Garçom" nao passam pelo KDS.
- Fila de producao com temporizadores e cores (Verde: no prazo, Amarelo: atencao, Vermelho: atrasado).
- Alertas visuais e sonoros para pedido novo ou urgente.
- Clique no prato para ficha tecnica (ingredientes, modo de preparo, foto).
- Botao "Pronto":
  - **Ponto de Entrega com `autoEntrega = false`:** card sai da fila do KDS (trabalho da cozinha encerrado). A notificação ao garçom depende do **grupo de entrega** do item: itens normais só notificam quando todos os normais do mesmo pedido ficarem prontos; itens com `immediateDelivery` notificam quando todos os imediatos do pedido ficarem prontos. Ver "Grupos de Entrega" na seção Estrutura Operacional.
  - **Ponto de Entrega com `autoEntrega = true`:** operador do Local de Preparo entrega diretamente. KDS exibe botões "Pronto" e "Entregue" no próprio card.
- **Após marcar "Pronto", o item sai da fila do KDS.** O monitoramento de retirada é responsabilidade do sistema de escalação (ver abaixo) e do admin — não da cozinha.

### Notificação e Claim de Retirada

O garçom é notificado quando **todos os itens de um grupo de entrega** ficam prontos (não item a item). A notificação lista todos os **Pontos de Entrega** onde o garçom deve buscar. Exemplo:

> "Pedido #42 pronto — Pass da Cozinha + Janela da Pizzaria — Mesa 5"

O claim (assumir entrega) é por **grupo de entrega**, não por item individual. Isso garante que um garçom leva tudo junto e evita que outro pegue metade do pedido.

**Fluxo completo:**
1. Sistema detecta que todos os itens do grupo (Normal ou Imediato) estão "Pronto".
2. **Notificação para todos os garçons do setor** com lista de Pontos de Entrega a visitar.
3. **Primeiro garçom que toca "Retirar"** assume o grupo inteiro (claim). O sistema registra `claimedByStaffId` em todos os itens do grupo.
4. **Grupo some da tela dos outros garçons em tempo real** (via WebSocket `waiter:pickup-claimed`).
5. Garçom vai a cada Ponto de Entrega, pega os itens, entrega na mesa → marca **"Entregue"**.
6. Se o garçom que assumiu não marcar "Entregue", o sistema de escalação continua funcionando normalmente — mas agora com garçom responsável identificado.
7. Na escalação nível 2 (admin + todos), o grupo reaparece para todos os garçons (override do claim original).

### Escalação de Retirada (item pronto sem entrega)

Quando um item é marcado como "Pronto" e o garçom não marca "Entregue", o sistema escala automaticamente:

1. **Re-notificação ao garçom do setor** — a cada X minutos (configurável em Settings), o sistema reenvia push notification + alerta in-app para o(s) garçom(ns) do setor da mesa. Mensagem: "Item aguardando retirada há X min — [Ponto de Entrega]".
2. **Escalação para admin + todos os garçons** — após Y minutos sem entrega (configurável em Settings), o sistema:
   - Notifica o admin/gerente via push + alerta no dashboard (card destacado com cor vermelha).
   - Notifica **todos os garçons ativos** (não só os do setor), para que qualquer um possa entregar.
   - Mensagem: "URGENTE: item aguardando retirada há Y min — Mesa X — [Ponto de Entrega]".
3. **Registro para auditoria** — cada ocorrência de escalação é registrada com: garçom responsável (do setor), item, mesa, tempo de espera, se foi escalado para nível 1 (re-notificação) ou nível 2 (admin + todos). O admin pode consultar relatório de escalações por garçom e por período na tela de Desempenho da Equipe.

**Parâmetros configuráveis (tela Settings do admin):**
| Parâmetro | Descrição | Default |
|---|---|---|
| `pickupReminderInterval` | Intervalo de re-notificação ao garçom do setor (minutos) | 3 |
| `pickupEscalationTimeout` | Tempo para escalar ao admin + todos os garçons (minutos) | 10 |

**Nota:** esses parâmetros se aplicam apenas a Pontos de Entrega com `autoEntrega = false`. Pontos com `autoEntrega = true` não passam por escalação — o operador do KDS é responsável pela entrega.

## Modulo Cliente (Cardapio Digital) — Rota: `/[slug]/mesa/[mesaId]`
Acesso: Cliente via QR Code no navegador.

### QR Code e Entrada na Mesa
- Cada mesa fisica tem um **QR Code fixo** impresso e colado. O QR Code gera URL permanente `/{slug}/mesa/{mesaId}`.
- Ao escanear o QR Code, o cliente ve duas opcoes: **"Entrar na mesa"** ou **"Ver cardapio"**.
- **Ver cardapio (modo read-only):** acessa o cardapio completo com precos, sem criar sessao, sem identificacao. Nao pode fazer pedidos. Util para ver precos antes de sentar ou enquanto aguarda aprovacao.

### Abertura de Sessao (primeiro cliente)
- Se a mesa nao tem sessao ativa, o primeiro cliente a escolher "Entrar na mesa" inicia o fluxo de abertura:
  1. Informa numero de WhatsApp → recebe OTP 6 digitos → confirma.
  2. Sessao criada com token criptograficamente seguro. Cliente se torna o primeiro membro aprovado.
  3. Cadastra nomes de quem esta na mesa (incluindo o proprio).

### Aprovacao de Novos Entrantes (REGRA CRITICA)
- Se a mesa **ja tem sessao ativa** e alguem escaneia o QR Code e escolhe "Entrar na mesa":
  1. O novo entrante informa numero de WhatsApp → recebe OTP → confirma (mesma verificacao do primeiro).
  2. Apos verificacao, entra em **fila de aprovacao**. Nao tem acesso a nada da mesa ate ser aprovado.
  3. **Qualquer pessoa ja aprovada na mesa** pode aprovar ou rejeitar o novo entrante.
  4. Os membros da mesa recebem **notificacao (push + alerta na tela)** de que alguem quer entrar.
- **Tela de espera (enquanto aguarda aprovacao):**
  - Mensagem "Aguardando aprovacao da mesa..."
  - Botao **"Lembrar mesa"** — reenvia notificacao (cooldown de 60 segundos).
  - Botao **"Ver cardapio"** — abre modo read-only enquanto espera.
  - Botao **"Cancelar"** — desiste e sai da fila de aprovacao.
- **Se o QR Code for lido por alguem ja aprovado na sessao**, apenas abre o sistema normalmente.
- **Na tela de pessoas**, exibir entrantes pendentes com opcao de aprovar/rejeitar.

### Identificacao via WhatsApp
- **Obrigatoria para entrar na mesa.** OTP de 6 digitos via WhatsApp. Salva `phone` + `phoneVerified = true`.

### Cardapio e Pedidos
- Cardapio com galeria de fotos, descricoes, filtros (vegano, sem gluten, etc).
- Upselling: sugestoes automaticas de adicionais e acompanhamentos (referencia futura — sem endpoint/sprint definido na Fase 1).
- **Pessoas na mesa (REGRA CRITICA — aplicar em TODAS as telas do cliente):** cadastrar nomes (sem verificacao). Lista editavel durante toda a sessao. **OBRIGATORIO:** um botao visivel no header de TODAS as telas do cliente (cardapio, produto, carrinho, pedidos, conta, pagamento) deve abrir modal/tela para adicionar/remover pessoas a qualquer momento. Nao basta existir a tela `pessoas.html` no fluxo inicial — o acesso deve ser permanente via header.
- **Carrinho:** ao adicionar item, selecionar pelo menos 1 pessoa (obrigatorio). Valor divide igual entre selecionados.
- **Pedidos em tempo real:** cada envio = pedido separado. Status: `Na fila` -> `Preparando` -> `Pronto` -> `Entregue`. WebSocket. Cada pedido gera até 3 **grupos de entrega**: itens normais (garçom notificado quando todos ficarem prontos), itens com `immediateDelivery` (notificado quando todos os imediatos ficarem prontos), e itens destino "Garçom" (entrega direta). Internamente, itens são roteados para o KDS do Local de Preparo correspondente. Ver "Grupos de Entrega" na seção Estrutura Operacional.
- **Tela "Meus Pedidos"**: lista por pedido, status individual, reatribuicao de pessoas.

### Conta e Pagamento
- **Tela "Conta"** com 3 abas: **Visao Geral**, **Por Pessoa**, **Historico**.
  - **Visao geral:** lista todos os itens. Nome do item exibe entre parenteses a quantidade de pessoas que dividem (ex: "Picanha na Brasa (3)"). Clicar no item abre modal para editar quem divide — selecionar/desselecionar pessoas.
  - **Por pessoa:** lista itens de cada pessoa com quantidade de pessoas que dividem entre parenteses. Itens iguais com grupos de divisao diferentes sao diferenciados por **cor** (barra lateral ou indicador colorido), para distinguir visualmente que sao pedidos separados.
  - **Historico (log de atividade):** registro legivel de todas as acoes de pedido e reatribuicao. Visivel para todos na mesa. Formato simples para leigos:
    ```
    Picanha - José realizou o pedido
    Para: José e Antônio

    Picanha - Marta modificou
    De: José e Antônio
    Para: Marta e José

    Frango à Passarinho - José realizou o pedido
    Para: Pedro e Carlos
    ```
  - Taxa de serviço (%) configurável. Pode ser desabilitada por pessoa pelo garçom — na aba "Por Pessoa" da conta, pessoas com taxa desabilitada aparecem com indicação visual (ex: "sem taxa de serviço"). O valor da taxa é calculado individualmente por pessoa.
- **Pagamento individual:** Pix com QR Code por pessoa.

### Botao "O Chefia"
- **(REGRA CRITICA — deve ser funcional em TODAS as telas do cliente):** presente na bottom nav de todas as telas (cardapio, pedidos, conta). Ao clicar, abre modal com selecao de motivo (ex: "Chamar garcom", "Pedir a conta", "Outro") + campo de mensagem opcional + botao "Enviar chamado". Nao e um link decorativo — deve ter interacao funcional no prototipo e no codigo.

## Modulo Garcom — Rota: `/garcom`
Acesso: Celular do garcom (PWA).

### Navegacao
- **Bottom nav fixa com 3 tabs:** Chamados (principal), Mesas, Turno.
- "Detalhe da mesa" e "Comanda" sao telas contextuais acessadas a partir de uma mesa especifica — **nao** aparecem na bottom nav.

### Funcionalidades
- **Ativacao de turno (clock-in):** garcom precisa informar que comecou a trabalhar no dia. Requer **senha do garcom** (definida no cadastro do funcionario). Ao ativar, salva hora de inicio. Ao encerrar, salva hora de fim. Registro de tempo de servico por dia.
- **Lista de mesas dos setores atribuidos** com status (setores definidos na Equipe do Dia). Tap na mesa livre abre tela de abertura; tap na mesa ocupada abre o detalhe.
- **Abrir mesa:** tela para o garçom abrir sessão em mesa livre. Quantidade de pessoas + nomes (opcional, pode pular). Cria sessão e vai para detalhe da mesa. Alternativa ao fluxo via QR Code do cliente.
- **Detalhe da mesa:** pessoas na mesa, pedidos ativos com status de cada item, botao "Novo Pedido" (abre comanda), botao "Fechar conta".
- **Comanda:** lancar pedidos rapidos para a mesa selecionada. Busca de produtos, selecao de pessoas, lista por categoria com botao "+", barra de resumo com "Enviar Pedido".
- **Chamados:** lista de chamados abertos de clientes das mesas dos seus setores.
- Notificacoes push: item pronto para retirada (com indicação do Ponto de Entrega), chamado de mesa, re-lembretes de retirada pendente, e escalação urgente (quando qualquer garçom pode entregar).
- Histórico de pedidos com divisão por pessoa.
- **Toggle taxa de serviço por pessoa ou por mesa toda.** Na tela de detalhe da mesa, toggle geral (atalho para todos) + toggle individual por pessoa. Se o garçom desliga o geral, todos desligam. Se religa, todos religam. Se mexe num individual, o geral indica estado parcial. A taxa de serviço só é calculada sobre os itens das pessoas com flag ativo.

## Modulo Explorar (Fase 2 — NAO IMPLEMENTAR) — Rota: `/explorar`
**Referencia arquitetural apenas.**
- Listagem de estabelecimentos, mapa, filtros, lotacao, reserva, pre-pedido, fidelidade.

---

## Sistema de Modulos

O OChefia funciona com **sistema modular**. A Fase 1 completa e o **modulo padrao**, incluso no plano base de todo estabelecimento. Novas funcionalidades sao **modulos extras** vendidos separadamente.

| Modulo | Tipo | Conteudo |
|---|---|---|
| **Padrao** | Incluso | Cardapio digital, pedidos, KDS, garcom, mesas, faturamento, dashboard |
| **Estoque** | Extra (Fase 2) | Controle de estoque, ingredientes, baixa automatica, alertas de minimo |
| **Explorar** | Extra (Fase 2) | App consumidor, listagem, reserva, pre-pedido, fidelidade |
| **NFC-e/SAT** | Extra (Fase 2) | Emissao fiscal integrada |

- Modulos extras so ficam disponiveis quando **habilitados pelo Super Admin** do OChefia para o estabelecimento.
- Cada modulo tem valor proprio, configuravel globalmente e por estabelecimento.
- O estabelecimento nao ve/acessa funcionalidades de modulos nao habilitados.

---

## Modulo Super Admin OChefia — Rota: `/superadmin`
Acesso: Equipe interna OChefia (role `SUPER_ADMIN`). **Nao acessivel por estabelecimentos.**

### Gestao de Estabelecimentos
- **Listagem** de todos os estabelecimentos com status: ativo, suspenso, inadimplente.
- **Cadastro** de novo estabelecimento: nome, slug, CNPJ, responsavel, email, telefone.
- **Editar/suspender** estabelecimento.

### Cobranca e Pagamentos
- **Valor do plano base** por estabelecimento (campo editavel).
- **Registro de pagamento mensal**: marcar como pago, pendente ou atrasado.
- **Historico de pagamentos** por estabelecimento.
- **Indicadores visuais**: destaque para inadimplentes e atrasados.

### Gestao de Modulos
- **Habilitar/desabilitar** modulos extras por estabelecimento.
- **Definir valor** de cada modulo (global e override por estabelecimento).
- **Visualizar** quais modulos cada estabelecimento possui.

### Monitoramento
- Metricas de uso por estabelecimento (pedidos/mes, mesas ativas).
- Ultimo acesso.
- Acesso a logs via `docker compose logs` (Fase 1) ou CloudWatch (Fase 2).

---

## Storage de Imagens

- **Fase 1:** Filesystem local com volume Docker mapeado. nginx serve os arquivos estaticos.
- **Fase 2 (AWS):** S3 + CloudFront (upload -> S3, entrega via CDN).
- Interface `StorageService` (`upload`, `delete`, `getUrl`). Implementacoes: Local (Fase 1) e S3 (Fase 2).
- `STORAGE_DRIVER=local|s3`. Resize com `sharp` (thumb 200px, media 600px, original). Max 5MB, JPEG/PNG/WebP.
