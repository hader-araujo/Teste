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

## Modulo KDS (Kitchen Display System) — Rota: `/kds`
Acesso: Cozinha e Bar via tablet ou monitor.

- Roteamento automatico: bebidas -> bar; pratos -> cozinha.
- Fila de producao com temporizadores e cores (Verde: no prazo, Amarelo: atencao, Vermelho: atrasado).
- Alertas visuais e sonoros para pedido novo ou urgente.
- Clique no prato para ficha tecnica (ingredientes, modo de preparo, foto).
- Botao "Pronto" notifica garcom para retirada.

## Modulo Cliente (Cardapio Digital) — Rota: `/[slug]/mesa/[mesaId]`
Acesso: Cliente via QR Code no navegador.

- **Identificacao via WhatsApp (obrigatoria):** OTP de 6 digitos via WhatsApp. Salva `phone` + `phoneVerified = true`.
- Cardapio com galeria de fotos, descricoes, filtros (vegano, sem gluten, etc).
- Upselling: sugestoes automaticas de adicionais e acompanhamentos.
- **Pessoas na mesa:** cadastrar nomes (sem verificacao). Lista editavel durante a sessao.
- **Carrinho:** ao adicionar item, selecionar pelo menos 1 pessoa (obrigatorio). Valor divide igual entre selecionados.
- **Pedidos em tempo real:** cada envio = pedido separado. Status: `Na fila` -> `Preparando` -> `Pronto` -> `Entregue`. WebSocket.
- **Tela "Meus Pedidos"**: lista por pedido, status individual, reatribuicao de pessoas.
- **Tela "Conta"**: divisao por pessoa + taxa de servico (%) configuravel. Visao geral + por pessoa.
- **Pagamento individual:** Pix com QR Code por pessoa.
- **Botao "O Chefia":** chamado ao garcom com motivo.

## Modulo Garcom — Rota: `/garcom`
Acesso: Celular do garcom (PWA).

- Comanda mobile: lancar pedidos rapidos.
- Lista de mesas atribuidas com status.
- Notificacoes push: prato pronto, chamado de mesa.
- Historico de pedidos com divisao por pessoa.
- Toggle taxa de servico por sessao.

## Modulo Explorar (Fase 2 — NAO IMPLEMENTAR) — Rota: `/explorar`
**Referencia arquitetural apenas.**
- Listagem de estabelecimentos, mapa, filtros, lotacao, reserva, pre-pedido, fidelidade.
