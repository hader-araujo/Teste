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
**Navegacao:** bottom nav fixa com 3 tabs: **Chamados, Mesas, Turno**. Chamados e a tela principal (primeira tab). Telas de detalhe da mesa e comanda sao contextuais (acessadas a partir de uma mesa).

1. **Turno** → seleciona nome → informa senha → "Iniciar Turno" → turno ativo
2. **Chamados** (tab principal) → ve chamados abertos + itens prontos para retirada dos seus setores → "Vi" / "Resolvido" / "Retirar". Banner de notificacao no topo ao abrir com resumo dos alertas urgentes
3. **Mesas** → ve lista de mesas dos **setores atribuidos** (definidos na Equipe do Dia) com status (livre, ocupada, pedindo conta, atrasado). Mesas agrupadas por setor
4. Toca numa mesa → **Detalhe da mesa:**
   - Pessoas na mesa
   - Pedidos ativos com status de cada item
   - Itens com status "Pronto" exibem botão **"Retirar"** — ao tocar, garçom assume a entrega (claim). Item some da tela dos outros garçons do setor em tempo real. Após buscar, marca **"Entregue"**
   - Botão **"Novo Pedido"** → abre **Comanda**
   - Botão **"Fechar conta"**
5. **Comanda** (a partir do detalhe da mesa):
   - Seleciona pessoas ("Para quem?")
   - Busca produto ou navega por categorias
   - Toca "+" para adicionar itens
   - Barra fixa com contagem + total → "Enviar Pedido"
   - Apos enviar, volta para detalhe da mesa
6. Recebe **notificacoes push**: item pronto para retirada (com indicacao do **Ponto de Entrega**), chamado de mesa
7. **Turno** → "Encerrar Turno" quando termina o expediente

---

## Admin (Dono/Gerente)

**Dispositivo:** desktop/tablet.
**Navegacao:** sidebar fixa com menu agrupado por secao.

1. **Login** → email + senha
2. **Dashboard** → métricas em tempo real: tempo médio de preparo por Local de Preparo (dinâmico), tempo médio de entrega por garçom, mesas ativas, pedidos recentes + seção **Alertas** unificada (pedidos atrasados, chamados abertos, escalações ativas, mesas ociosas, mesas sem setor, setores sem garçom)
3. **Mesas** → mapa visual com status por cor → filtros (Todas, Com problema, Ociosas) → abrir/fechar/deletar sessão. Deletar = soft delete (só mesa fechada, histórico preservado)
4. **Cardapio** → CRUD de categorias, tags e produtos (com fotos, Ponto de Entrega ou "Garçom", preço)
5. **Locais de Preparo** → CRUD de locais (ex: Cozinha, Bar, Pizzaria) + Pontos de Entrega por local (com flag auto-entrega)
6. **Setores** → CRUD de setores + vincular mesas + mapeamento obrigatório de Ponto de Entrega por Local de Preparo
7. **Faturamento** → diário (receita, pedidos, ticket médio) | mensal (gráfico por dia) | caixa (por forma de pagamento) | taxas de garçom
8. **Equipe** → cadastrar funcionários (com flag temporário, dias fixos, senha garçom) → enviar convites
9. **Escala** → calendário por dia → auto-preenchido + ajustes manuais
10. **Equipe do Dia** → quem trabalha hoje + atribuição de setores por garçom
11. **Desempenho da Equipe** → métricas por garçom (tempo médio entrega, pedidos atendidos, escalações) e por Local de Preparo (tempo médio preparo, pedidos, itens mais demorados). Filtro por período
12. **Settings** → nome/logo do estabelecimento, taxa de serviço, tema/cores do cardápio com preview

---

## KDS (por Local de Preparo)

**Dispositivo:** tablet ou monitor (landscape).
**Navegação:** tela única por Local de Preparo. Sem navegação complexa — foco total na fila. Cada Local de Preparo (ex: Cozinha, Pizzaria, Bar) tem sua própria instância KDS.

1. Tela abre direto na **fila de produção** (dark mode)
2. Pedidos aparecem como cards em grid (3-5 colunas)
3. Cada card mostra: número do pedido, mesa, itens, timer, observações
4. **Cores de borda mudam com o tempo:** verde (no prazo) → amarelo (atenção >10min) → vermelho (atrasado >15min)
5. **Alerta sonoro** quando chega pedido novo ou pedido fica atrasado
6. Toca no prato → ficha técnica (ingredientes, modo de preparo, foto)
7. Toca **"Pronto"** (botão grande no card):
   - **Ponto de Entrega com `autoEntrega = false`:** card sai da fila. A notificação ao garçom depende do grupo de entrega: itens normais só notificam quando todos os normais do pedido ficarem prontos; itens `immediateDelivery` notificam quando todos os imediatos ficarem prontos. Indica o Ponto de Entrega na notificação
   - **Ponto de Entrega com `autoEntrega = true`:** operador entrega direto. KDS exibe botões "Pronto" e "Entregue"

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
