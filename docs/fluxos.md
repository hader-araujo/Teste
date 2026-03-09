# Fluxos de Usuario — Passo a Passo

Documento de referencia com o fluxo de navegacao de cada perfil. Complementa `modulos.md` (que descreve **o que** cada modulo faz) com o **como** o usuario navega.

---

## Cliente (Cardapio Digital)

**Dispositivo:** celular (QR Code no navegador).
**Navegacao:** bottom nav com 4 tabs (Cardapio, Pedidos, Conta, O Chefia) + botao de pessoas no header de todas as telas.

### Fluxo de entrada (QR Code)

1. Escaneia QR Code da mesa → abre `/{slug}/mesa/{mesaId}`
2. Ve duas opcoes: **"Entrar na mesa"** | **"Ver cardapio"**

**Caminho A — Ver cardapio (read-only):**
- Acessa cardapio completo com precos. Sem sessao, sem identificacao, sem poder fazer pedidos.

**Caminho B — Entrar na mesa (mesa SEM sessao ativa = primeiro cliente):**
1. **WhatsApp** → informa numero → recebe OTP 6 digitos → confirma
2. Sessao criada. Cliente e o primeiro membro aprovado.
3. **Pessoas** → cadastra nomes de quem esta na mesa (editavel a qualquer momento via botao no header)
4. Segue para o fluxo normal (cardapio, pedidos, etc.)

**Caminho C — Entrar na mesa (mesa COM sessao ativa = novo entrante):**
1. **WhatsApp** → informa numero → recebe OTP 6 digitos → confirma
2. Entra em **fila de aprovacao**. Membros da mesa recebem notificacao (push + alerta na tela).
3. **Tela de espera:**
   - "Aguardando aprovacao da mesa..."
   - Botao **"Lembrar mesa"** (reenvia notificacao, cooldown 60s)
   - Botao **"Ver cardapio"** (read-only enquanto espera)
   - Botao **"Cancelar"** (desiste da fila)
4. Qualquer membro ja aprovado pode aprovar/rejeitar na tela de pessoas.
5. Apos aprovacao → entra na sessao e segue fluxo normal.

**Caminho D — QR Code lido por alguem ja aprovado:**
- Abre o sistema normalmente na ultima tela visitada.

### Fluxo normal (apos entrar na mesa)

1. **Cardapio** → navega por categorias, filtros, fotos → toca num produto
2. **Detalhe do produto** → ve fotos, descricao, preco → "Adicionar" (seleciona pessoas obrigatoriamente)
3. **Carrinho** → revisa itens com pessoas atribuidas → "Enviar Pedido"
4. **Pedidos** → acompanha status em tempo real (Na fila → Preparando → Pronto → Entregue) → pode reatribuir pessoas
5. **Conta** → 3 abas: Visao Geral (divisao por pessoa + taxa) | Por Pessoa | Historico (log de atividade) → toca numa pessoa para pagar
6. **Pagamento** → QR Code Pix individual por pessoa
7. **"O Chefia"** (bottom nav, qualquer tela) → modal com motivo (chamar garcom, pedir conta, outro) + mensagem → envia chamado

---

## Garcom

**Dispositivo:** celular (PWA).
**Navegacao:** bottom nav fixa com 3 tabs: **Mesas, Chamados, Turno**. Telas de detalhe da mesa e comanda sao contextuais (acessadas a partir de uma mesa).

1. **Turno** → seleciona nome → informa senha → "Iniciar Turno" → turno ativo
2. **Mesas** → ve lista de mesas atribuidas com status (livre, ocupada, pedindo conta, atrasado)
3. Toca numa mesa → **Detalhe da mesa:**
   - Pessoas na mesa
   - Pedidos ativos com status de cada item
   - Botao **"Novo Pedido"** → abre **Comanda**
   - Botao **"Fechar conta"**
4. **Comanda** (a partir do detalhe da mesa):
   - Seleciona pessoas ("Para quem?")
   - Busca produto ou navega por categorias
   - Toca "+" para adicionar itens
   - Barra fixa com contagem + total → "Enviar Pedido"
   - Apos enviar, volta para detalhe da mesa
5. **Chamados** (tab fixa) → ve chamados abertos de clientes → "Visto" / "Resolvido"
6. Recebe **notificacoes push**: prato pronto, chamado de mesa, bebida pronta
7. **Turno** → "Encerrar Turno" quando termina o expediente

---

## Admin (Dono/Gerente)

**Dispositivo:** desktop/tablet.
**Navegacao:** sidebar fixa com menu agrupado por secao.

1. **Login** → email + senha
2. **Dashboard** → metricas em tempo real (mesas ativas, tempo medio por categoria, fila de pedidos, chamados)
3. **Mesas** → mapa visual com status por cor → abrir/fechar sessao
4. **Cardapio** → CRUD de categorias, tags e produtos (com fotos, destino cozinha/bar/garcom, preco)
5. **Faturamento** → diario (receita, pedidos, ticket medio) | mensal (grafico por dia) | caixa (por forma de pagamento) | taxas de garcom
6. **Equipe** → cadastrar funcionarios (com flag temporario, dias fixos, flag entrega BAR, senha garcom) → enviar convites
7. **Escala** → calendario por dia → auto-preenchido + ajustes manuais
8. **Equipe do Dia** → quem trabalha hoje + distribuicao de mesas por garcom
9. **Settings** → nome/logo do estabelecimento, taxa de servico, tema/cores do cardapio com preview, modo de distribuicao de mesas

---

## KDS (Cozinha / Bar)

**Dispositivo:** tablet ou monitor (landscape).
**Navegacao:** tela unica com filtro por estacao. Sem navegacao complexa — foco total na fila.

1. Tela abre direto na **fila de producao** (dark mode)
2. Pedidos aparecem como cards em grid (3-5 colunas)
3. Cada card mostra: numero do pedido, mesa, itens, timer, observacoes
4. **Cores de borda mudam com o tempo:** verde (no prazo) → amarelo (atencao >10min) → vermelho (atrasado >15min)
5. **Alerta sonoro** quando chega pedido novo ou pedido fica atrasado
6. Toca no prato → ficha tecnica (ingredientes, modo de preparo, foto)
7. Toca **"Pronto"** (botao grande no card):
   - **Cozinha:** notifica garcom para retirada
   - **Bar (sem flag entrega):** notifica garcom para retirada
   - **Bar (com flag entrega):** barman tem botoes "Pronto" e "Entregue" no proprio KDS

---

## Super Admin (Equipe OChefia)

**Dispositivo:** desktop.
**Navegacao:** sidebar com branding OChefia (indigo). Menu: Dashboard, Estabelecimentos, Modulos, Monitoramento.

1. **Login** → email + senha (mesma mecanica do admin, role SUPER_ADMIN)
2. **Dashboard** → KPIs: total de estabelecimentos, ativos, suspensos, inadimplentes. Alertas recentes, ultimos acessos
3. **Estabelecimentos** → listagem com filtros (status, inadimplente) + busca + paginacao
4. Toca num estabelecimento → **Detalhe:**
   - Dados gerais (nome, slug, CNPJ, responsavel, email, telefone) → editavel
   - Alterar status (ativo/suspenso)
   - **Cobranca:** valor do plano base, historico de pagamentos mensais, registrar pagamento, status (pago/pendente/atrasado)
   - **Modulos:** toggle de modulos extras, valor global e override
5. **"+ Novo Estabelecimento"** → formulario de cadastro (nome, slug, CNPJ, responsavel, email, telefone)
6. **Modulos** → listar modulos disponiveis com valor padrao → editar valor e descricao
7. **Monitoramento** → metricas de uso por estabelecimento, ultimo acesso
