# Modulos Funcionais

## Modulo Gerencial (Dashboard/Backoffice) — Rota: `/admin`
Acesso: Dono/Gerente via computador ou tablet.

- Mapa de mesas em tempo real (livres, ocupadas, aguardando limpeza, tempo de permanencia).
- Metricas: tempo medio de atendimento, tempo de preparo por prato, ticket medio por mesa.
- Financeiro: fechamento de caixa, relatorios de faturamento. (NFC-e/SAT em fase futura).
- Estoque: baixa automatica de ingredientes por prato vendido, alertas de estoque minimo.
- Cardapio: CRUD de categorias e produtos, habilitar/desabilitar em tempo real, precificacao dinamica (Happy Hour).
- Upload de imagens: multiplas fotos por produto (galeria). Primeira foto = capa. Upload com preview, reordenacao e remocao.
- Gestao de funcionarios: cadastro de garcons, cozinheiros, gerentes com permissoes por role.
- **Funcionarios temporarios:** cadastro com flag `temporario`. Opcao de definir dias fixos da semana (ex: seg, qua, sex) ou deixar em branco para uso avulso.
- **Tela de Escala (programacao):** calendario/lista por dia mostrando quem vai trabalhar nos proximos dias. Funcionarios permanentes + temporarios com dia pre-definido entram automaticamente. Permite desmarcar qualquer um para o dia e adicionar temporarios avulsos.
- **Tela Equipe do Dia:** lista todos que vao trabalhar hoje (auto-preenchido pela escala). Toggle para desmarcar/marcar. Adicionar temporarios avulsos. Distribuir mesas entre garcons ativos do dia.
- **Configuracao de distribuicao de mesas/gorjeta** (em Settings):
  1. **Todos:** pedidos chegam para todos os garcons, taxa de servico dividida igualmente.
  2. **Automatico:** sistema divide mesas igualmente entre garcons do dia (ex: 15 mesas / 3 garcons = 5 cada).
- **Cadastro de produto — tipo de bebida:** se a categoria for bebida, campo "Bebida pronta" (toggle). Se marcado, pedido vai direto para o garcom. Se nao, vai para o KDS Bar.

## Modulo KDS (Kitchen Display System) — Rota: `/kds`
Acesso: Cozinha e Bar via tablet ou monitor.

- Roteamento automatico: comida -> cozinha; bebida preparada -> bar; bebida pronta -> direto para garcom (nao passa pelo KDS).
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
- **Pessoas na mesa:** cadastrar nomes (sem verificacao). Lista editavel durante toda a sessao — botao acessivel em todas as telas do cliente (header ou menu) para adicionar/remover pessoas a qualquer momento.
- **Carrinho:** ao adicionar item, selecionar pelo menos 1 pessoa (obrigatorio). Valor divide igual entre selecionados.
- **Pedidos em tempo real:** cada envio = pedido separado. Status: `Na fila` -> `Preparando` -> `Pronto` -> `Entregue`. WebSocket. Pedidos mistos (comida + bebida pronta + bebida preparada) geram **sub-pedidos** automaticos com sufixo (`_cozinha`, `_bar`, `_garcom`). Cada sub-pedido segue seu fluxo independente.
- **Tela "Meus Pedidos"**: lista por pedido, status individual, reatribuicao de pessoas.
- **Tela "Conta"**:
  - **Visao geral:** lista todos os itens. Nome do item exibe entre parenteses a quantidade de pessoas que dividem (ex: "Picanha na Brasa (3)"). Clicar no item abre modal para editar quem divide — selecionar/desselecionar pessoas.
  - **Por pessoa:** lista itens de cada pessoa com quantidade de pessoas que dividem entre parenteses. Itens iguais com grupos de divisao diferentes sao diferenciados por **cor** (barra lateral ou indicador colorido), para distinguir visualmente que sao pedidos separados.
  - Taxa de servico (%) configuravel.
- **Pagamento individual:** Pix com QR Code por pessoa.
- **Botao "O Chefia":** chamado ao garcom com motivo.

## Modulo Garcom — Rota: `/garcom`
Acesso: Celular do garcom (PWA).

- Comanda mobile: lancar pedidos rapidos.
- Lista de mesas atribuidas com status (mesas definidas na Equipe do Dia).
- Notificacoes push: prato pronto, chamado de mesa, bebida pronta (para retirada no bar ou cozinha).
- Historico de pedidos com divisao por pessoa.
- Toggle taxa de servico por sessao.
- **Funcionario BAR com flag "tambem entrega":** recebe notificacao de seus proprios pedidos prontos e faz a entrega diretamente, sem passar por outro garcom.

## Modulo Explorar (Fase 2 — NAO IMPLEMENTAR) — Rota: `/explorar`
**Referencia arquitetural apenas.**
- Listagem de estabelecimentos, mapa, filtros, lotacao, reserva, pre-pedido, fidelidade.
