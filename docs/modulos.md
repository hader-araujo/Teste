# Modulos Funcionais

## Modulo Gerencial (Dashboard/Backoffice) — Rota: `/admin`
Acesso: Dono/Gerente via computador ou tablet.

- Mapa de mesas em tempo real (livres, ocupadas, aguardando limpeza, tempo de permanencia).
- Metricas: tempo medio de atendimento dividido por categoria (**bar**, **cozinha**, **garcom**), tempo de preparo por prato.
- Cardapio: CRUD de categorias, **tags de produto** (ex: vegano, sem gluten, picante, sugestao do chef) e produtos. Habilitar/desabilitar em tempo real. Precificacao dinamica/Happy Hour e referencia futura (sem endpoint/sprint definido na Fase 1).
- **Cadastro de produto — destino apos pedido:** campo obrigatorio indicando para onde o pedido vai: **cozinha**, **bar** ou **garcom** (entrega direta, sem preparo). Substitui a logica anterior de "bebida pronta" — agora qualquer produto pode ter qualquer destino.
- Upload de imagens: multiplas fotos por produto (galeria). Primeira foto = capa. Upload com preview, reordenacao e remocao.
- Gestao de funcionarios: cadastro de garcons, cozinheiros, gerentes com permissoes por role.
- **Funcionarios temporarios:** cadastro com flag `temporario`. Opcao de definir dias fixos da semana (ex: seg, qua, sex) ou deixar em branco para uso avulso.
- **Tela de Escala (programacao):** calendario/lista por dia mostrando quem vai trabalhar nos proximos dias. Funcionarios permanentes + temporarios com dia pre-definido entram automaticamente. Permite desmarcar qualquer um para o dia e adicionar temporarios avulsos.
- **Tela Equipe do Dia:** lista todos que vao trabalhar hoje (auto-preenchido pela escala). Toggle para desmarcar/marcar. Adicionar temporarios avulsos. Distribuir mesas entre garcons ativos do dia.
- **Configuracoes do estabelecimento** (em Settings): nome do estabelecimento e logo. O nome/logo substitui "OChefia" no header do cardapio do cliente, mas mantem "OChefia" em tamanho pequeno (branding). Se nao configurado, mostra apenas "OChefia".
- **Configuracao de distribuicao de mesas/gorjeta** (em Settings):
  1. **Todos:** pedidos chegam para todos os garcons, taxa de servico dividida igualmente.
  2. **Automatico:** sistema divide mesas igualmente entre garcons do dia (ex: 15 mesas / 3 garcons = 5 cada).
- **Estoque:** movido para Fase 2. Nao implementar ate aviso explicito.

## Modulo Faturamento — Rota: `/admin/faturamento`
Acesso: Dono/Gerente. Tela separada do dashboard, dedicada a financeiro.

- **Faturamento diario:** receita do dia, quantidade de pedidos, ticket medio, comparativo com dia anterior.
- **Faturamento mensal:** receita acumulada do mes, grafico por dia, comparativo com mes anterior.
- **Fechamento de caixa:** resumo de valores recebidos (Pix, dinheiro, cartao). (NFC-e/SAT em fase futura).
- **Taxas de garcom:** valores a pagar para cada garcom no periodo. Calculado automaticamente com base na taxa de servico das mesas atendidas. Nao e salario — e apenas a parte da taxa de servico devida a cada garcom. Filtro por dia e por mes.

---

## Modulo KDS (Kitchen Display System) — Rota: `/kds`
Acesso: Cozinha e Bar via tablet ou monitor.

- Roteamento automatico baseado no campo **destino** do produto: `cozinha` -> KDS cozinha; `bar` -> KDS bar; `garcom` -> direto para garcom (nao passa pelo KDS).
- Fila de producao com temporizadores e cores (Verde: no prazo, Amarelo: atencao, Vermelho: atrasado).
- Alertas visuais e sonoros para pedido novo ou urgente.
- Clique no prato para ficha tecnica (ingredientes, modo de preparo, foto).
- Botao "Pronto":
  - **Cozinha:** notifica garcom para retirada.
  - **Bar (sem flag de entrega):** notifica garcom para retirada.
  - **Bar (com flag de entrega):** pedido continua com o barman, que tem os status `Pronto` e `Entregue` no proprio KDS.

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
- **Pedidos em tempo real:** cada envio = pedido separado. Status: `Na fila` -> `Preparando` -> `Pronto` -> `Entregue`. WebSocket. Pedidos mistos (produtos com destinos diferentes) geram **sub-pedidos** automaticos com sufixo (`_cozinha`, `_bar`, `_garcom`) baseado no campo **destino** de cada produto. Cada sub-pedido segue seu fluxo independente.
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
  - Taxa de servico (%) configuravel.
- **Pagamento individual:** Pix com QR Code por pessoa.

### Botao "O Chefia"
- **(REGRA CRITICA — deve ser funcional em TODAS as telas do cliente):** presente na bottom nav de todas as telas (cardapio, pedidos, conta). Ao clicar, abre modal com selecao de motivo (ex: "Chamar garcom", "Pedir a conta", "Outro") + campo de mensagem opcional + botao "Enviar chamado". Nao e um link decorativo — deve ter interacao funcional no prototipo e no codigo.

## Modulo Garcom — Rota: `/garcom`
Acesso: Celular do garcom (PWA).

### Navegacao
- **Bottom nav fixa com 3 tabs:** Mesas, Chamados, Turno.
- "Detalhe da mesa" e "Comanda" sao telas contextuais acessadas a partir de uma mesa especifica — **nao** aparecem na bottom nav.

### Funcionalidades
- **Ativacao de turno (clock-in):** garcom precisa informar que comecou a trabalhar no dia. Requer **senha do garcom** (definida no cadastro do funcionario). Ao ativar, salva hora de inicio. Ao encerrar, salva hora de fim. Registro de tempo de servico por dia.
- **Lista de mesas atribuidas** com status (mesas definidas na Equipe do Dia). Tap na mesa abre o detalhe.
- **Detalhe da mesa:** pessoas na mesa, pedidos ativos com status de cada item, botao "Novo Pedido" (abre comanda), botao "Fechar conta".
- **Comanda:** lancar pedidos rapidos para a mesa selecionada. Busca de produtos, selecao de pessoas, lista por categoria com botao "+", barra de resumo com "Enviar Pedido".
- **Chamados:** lista de chamados abertos de clientes (independente de mesa).
- Notificacoes push: prato pronto, chamado de mesa, bebida pronta (para retirada no bar ou cozinha).
- Historico de pedidos com divisao por pessoa.
- Toggle taxa de servico por sessao.
- **Funcionario BAR com flag "tambem entrega":** recebe notificacao de seus proprios pedidos prontos e faz a entrega diretamente, sem passar por outro garcom.

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
