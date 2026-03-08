# Modulos Funcionais

## Modulo Gerencial (Dashboard/Backoffice) — Rota: `/admin`
Acesso: Dono/Gerente via computador ou tablet.

- Mapa de mesas em tempo real (livres, ocupadas, aguardando limpeza, tempo de permanencia).
- Metricas: tempo medio de atendimento dividido por categoria (**bar**, **cozinha**, **garcom**), tempo de preparo por prato.
- Cardapio: CRUD de categorias, **tags de produto** (ex: vegano, sem gluten, picante, sugestao do chef) e produtos. Habilitar/desabilitar em tempo real, precificacao dinamica (Happy Hour).
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

- **Identificacao via WhatsApp (obrigatoria):** OTP de 6 digitos via WhatsApp. Salva `phone` + `phoneVerified = true`.
- Cardapio com galeria de fotos, descricoes, filtros (vegano, sem gluten, etc).
- Upselling: sugestoes automaticas de adicionais e acompanhamentos.
- **Pessoas na mesa (REGRA CRITICA — aplicar em TODAS as telas do cliente):** cadastrar nomes (sem verificacao). Lista editavel durante toda a sessao. **OBRIGATORIO:** um botao visivel no header de TODAS as telas do cliente (cardapio, produto, carrinho, pedidos, conta, pagamento) deve abrir modal/tela para adicionar/remover pessoas a qualquer momento. Nao basta existir a tela `pessoas.html` no fluxo inicial — o acesso deve ser permanente via header.
- **Carrinho:** ao adicionar item, selecionar pelo menos 1 pessoa (obrigatorio). Valor divide igual entre selecionados.
- **Pedidos em tempo real:** cada envio = pedido separado. Status: `Na fila` -> `Preparando` -> `Pronto` -> `Entregue`. WebSocket. Pedidos mistos (produtos com destinos diferentes) geram **sub-pedidos** automaticos com sufixo (`_cozinha`, `_bar`, `_garcom`) baseado no campo **destino** de cada produto. Cada sub-pedido segue seu fluxo independente.
- **Tela "Meus Pedidos"**: lista por pedido, status individual, reatribuicao de pessoas.
- **Tela "Conta"**:
  - **Visao geral:** lista todos os itens. Nome do item exibe entre parenteses a quantidade de pessoas que dividem (ex: "Picanha na Brasa (3)"). Clicar no item abre modal para editar quem divide — selecionar/desselecionar pessoas.
  - **Por pessoa:** lista itens de cada pessoa com quantidade de pessoas que dividem entre parenteses. Itens iguais com grupos de divisao diferentes sao diferenciados por **cor** (barra lateral ou indicador colorido), para distinguir visualmente que sao pedidos separados.
  - Taxa de servico (%) configuravel.
- **Pagamento individual:** Pix com QR Code por pessoa.
- **Botao "O Chefia" (REGRA CRITICA — deve ser funcional em TODAS as telas do cliente):** presente na bottom nav de todas as telas (cardapio, pedidos, conta). Ao clicar, abre modal com selecao de motivo (ex: "Chamar garcom", "Pedir a conta", "Outro") + campo de mensagem opcional + botao "Enviar chamado". Nao e um link decorativo — deve ter interacao funcional no prototipo e no codigo.

## Modulo Garcom — Rota: `/garcom`
Acesso: Celular do garcom (PWA).

- **Ativacao de turno (clock-in):** garcom precisa informar que comecou a trabalhar no dia. Requer **senha do garcom** (definida no cadastro do funcionario). Ao ativar, salva hora de inicio. Ao encerrar, salva hora de fim. Registro de tempo de servico por dia.
- Comanda mobile: lancar pedidos rapidos.
- Lista de mesas atribuidas com status (mesas definidas na Equipe do Dia).
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
- Acesso a logs via CloudWatch.

---

## Storage de Imagens

- **S3 + CloudFront** em producao. Filesystem local apenas em desenvolvimento.
- Interface `StorageService` (`upload`, `delete`, `getUrl`). Implementacoes: Local (dev) e S3 (prod).
- `STORAGE_DRIVER=local|s3`. Resize com `sharp` (thumb 200px, media 600px, original). Max 5MB, JPEG/PNG/WebP.
