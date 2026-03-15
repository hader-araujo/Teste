# Fluxos de Usuário — Passo a Passo

Documento de referência com o fluxo de navegação de cada perfil. Complementa `modulos.md` (que descreve **o que** cada módulo faz) com o **como** o usuário navega.

---

## Cliente (Cardápio Digital)

**Dispositivo:** celular (QR Code no navegador).
**Navegação:** bottom nav com 4 tabs (Cardápio, Pedidos, Conta, O Chefia) + botão de pessoas no header de todas as telas.

### Fluxo de entrada (QR Code)

1. Escaneia QR Code da mesa → abre `/{slug}/mesa/{mesaId}`
2. Vê duas opções: **"Entrar na mesa"** | **"Ver cardápio"**

**Caminho A — Ver cardápio (read-only):**
- Acessa cardápio completo com preços. Sem sessão, sem identificação, sem poder fazer pedidos.

**Caminho B — Entrar na mesa (mesa SEM sessão ativa = primeiro cliente):**
1. **WhatsApp** → informa número (texto de consentimento + link Política de Privacidade visíveis — ver `docs/privacidade.md`) → `POST /tables/:id/verify-phone` → recebe OTP 6 dígitos → confirma
2. `POST /tables/:id/open` → cria sessão + registra cliente como 1º membro aprovado automaticamente
3. **Pessoas** → cadastra nomes de quem está na mesa (editável a qualquer momento via botão no header)
4. Segue para o fluxo normal (cardápio, pedidos, etc.)

**Caminho C — Entrar na mesa (mesa COM sessão ativa = novo entrante):**
1. **WhatsApp** → informa número → recebe OTP 6 dígitos → confirma
2. Entra em **fila de aprovação**. Membros da mesa recebem notificação (push + alerta na tela).
3. **Tela de espera:**
   - "Aguardando aprovação da mesa..."
   - Botão **"Lembrar mesa"** (reenvia notificação, cooldown 60s)
   - Botão **"Ver cardápio"** (read-only enquanto espera)
   - Botão **"Cancelar"** (desiste da fila)
4. Qualquer membro já aprovado pode aprovar/rejeitar na tela de pessoas.
5. Após aprovação → entra na sessão e segue fluxo normal.

**Caminho D — QR Code lido por alguém já aprovado:**
- Abre o sistema normalmente na última tela visitada.

### Fluxo normal (após entrar na mesa)

1. **Cardápio** → navega por categorias, filtros, fotos → toca num produto
2. **Detalhe do produto** → vê fotos, descrição, preço → "Adicionar" (seleciona pessoas obrigatoriamente)
3. **Carrinho** → revisa itens com pessoas atribuídas → "Enviar Pedido"
4. **Pedidos** → acompanha status em tempo real (Na fila → Preparando → Pronto → Entregue) → pode reatribuir pessoas
5. **Conta** → 3 abas: Visão Geral (divisão por pessoa + taxa) | Por Pessoa | Histórico (log de atividade) → toca numa pessoa para pagar
6. **Pagamento** → QR Code Pix individual por pessoa
   - Se a pessoa possui itens com status diferente de `ORDER_DELIVERED` ou `ORDER_CANCELLED`, exibe aviso: **"Você tem itens que ainda não foram entregues. Deseja pagar mesmo assim?"** — confirmação obrigatória antes de prosseguir
7. **Sair da mesa** → pessoa pode encerrar sua participação pagando sua parte (ou R$ 0,00). Após sair, desaparece das atribuições de novos itens e da divisão de conta. Se a mesma pessoa retornar via QR Code, cria nova participação; exibição usa sufixo ordinal: "Maria ①", "Maria ②"
8. **"O Chefia"** (bottom nav, qualquer tela) → modal com motivo (chamar garçom, pedir conta, outro) + mensagem → envia chamado

---

## Garçom

**Dispositivo:** celular (PWA).
**Navegação:** bottom nav fixa com 3 tabs: **Chamados, Mesas, Turno**. Chamados é a tela principal (primeira tab). Telas de detalhe da mesa e comanda são contextuais (acessadas a partir de uma mesa).

1. **Turno** → seleciona nome → informa PIN (4 dígitos) → "Iniciar Turno" → turno ativo
2. **Chamados** (tab principal) → vê chamados abertos + grupos prontos para retirada dos seus setores → "Resolvido" / "Retirar Grupo". Banner de notificação no topo ao abrir com resumo dos alertas urgentes
3. **Mesas** → vê lista de mesas dos **setores atribuídos** (definidos na Equipe do Dia) com status (livre, ocupada, pedindo conta, atrasado). Mesas agrupadas por setor
4. Toca numa mesa **livre** → **Abrir mesa:**
   - Quantas pessoas na mesa
   - Nomes das pessoas (campo para cada, pode pular)
   - Botão "Abrir Mesa" → cria sessão → vai para detalhe da mesa
5. Toca numa mesa **ocupada** → **Detalhe da mesa:**
   - Pessoas na mesa
   - Pedidos ativos com status de cada item
   - Grupos com todos os itens "Pronto" exibem botão **"Retirar Grupo"** — ao tocar, garçom assume o grupo de entrega inteiro (claim via `PATCH /orders/:id/delivery-groups/:group/claim`). Grupo some da tela dos outros garçons do setor em tempo real. Após buscar todos os itens nos Pontos de Entrega, marca **"Entregue"**
   - Seção **"Pendentes"**: lista de entrantes aguardando aprovação. Para cada entrante, garçom pode **Aprovar** ou **Rejeitar**. Ao aprovar, registra `approvedByStaffId` no membro
   - Botão **"Novo Pedido"** → abre **Comanda**
   - Botão **"Fechar conta"**
5. **Comanda** (a partir do detalhe da mesa):
   - Seleciona pessoas ("Para quem?")
   - Busca produto ou navega por categorias
   - Toca "+" para adicionar itens
   - Barra fixa com contagem + total → "Enviar Pedido"
   - Após enviar, volta para detalhe da mesa
6. **Pagamento (garçom):**
   - Garçom pode confirmar pagamento de qualquer método (PIX, CASH, CARD) diretamente pelo detalhe da mesa ou comanda
   - Para PIX: confirma após comprovante do cliente ou webhook automático
   - Para CASH/CARD: registra manualmente indicando o valor recebido
   - Pode **cancelar PIX pendente** de qualquer pessoa da mesa (ex: cliente desistiu ou erro na geração)
7. Recebe **notificações push**: item pronto para retirada (com indicação do **Ponto de Entrega**), chamado de mesa
8. **Turno** → "Encerrar Turno" quando termina o expediente

---

## Admin (Dono/Gerente)

**Dispositivo:** desktop/tablet.
**Navegação:** sidebar fixa com menu agrupado por seção.

1. **Login** → email + senha

**Visão Geral:**

2. **Dashboard** → métricas em tempo real: tempo médio de preparo por Local de Preparo (dinâmico), tempo médio de entrega por garçom, mesas ativas, pedidos recentes + seção **Alertas** unificada (pedidos atrasados, chamados abertos, escalações ativas, mesas ociosas, setores sem garçom)

**Cardápio:**

3. **Cardápio** → CRUD de categorias, tags e produtos (com fotos, Ponto de Entrega ou "Garçom", preço)

**Operação:**

4. **Mesas** → mapa visual com status por cor → filtros (Todas, Com problema, Ociosas) → abrir/fechar/deletar sessão. Deletar = soft delete (só mesa fechada, histórico preservado)
5. **Locais de Preparo** → CRUD de locais (ex: Cozinha, Bar, Pizzaria) + Pontos de Entrega por local (com flag entrega pela cozinha)
6. **Setores** → CRUD de setores + vincular mesas + mapeamento obrigatório de Ponto de Entrega por Local de Preparo

**Equipe:**

7. **Funcionários** → cadastrar funcionários (com flag temporário, dias fixos, PIN garçom/cozinha) → enviar convites
8. **Escala** → calendário por dia → auto-preenchido + ajustes manuais
9. **Equipe do Dia** → quem trabalha hoje + atribuição de setores por garçom
10. **Desempenho** → métricas por garçom (tempo médio entrega, pedidos atendidos, escalações) e por Local de Preparo (tempo médio preparo, pedidos, itens mais demorados). Filtro por período

**Financeiro:**

11. **Faturamento** → diário (receita, pedidos, ticket médio) | mensal (gráfico por dia) | caixa (por forma de pagamento) | taxas de garçom

**Configurações:**

12. **Settings** → nome/logo do estabelecimento, taxa de serviço, tema/cores do cardápio com preview

---

## KDS (por Local de Preparo)

**Dispositivo:** tablet ou monitor (landscape).
**Navegação:** tela única por Local de Preparo. Sem navegação complexa — foco total na fila. Cada Local de Preparo (ex: Cozinha, Pizzaria, Bar) tem sua própria instância KDS.

1. **Login** → seleciona nome → informa PIN (4 dígitos) → seleciona Local de Preparo → **fila de produção** (dark mode)
2. Pedidos aparecem como cards em grid (3-5 colunas)
3. Cada card mostra: número do pedido, mesa, itens, timer, observações
4. **Cores de borda mudam com o tempo:** verde (no prazo) → amarelo (atenção >10min) → vermelho (atrasado >15min)
5. **Alerta sonoro** quando chega pedido novo ou pedido fica atrasado
6. Toca no prato → foto ampliada do prato
7. Toca **"Pronto"** (botão grande no card):
   - **Ponto de Entrega com `kitchenDelivery = false`:** card sai da fila. A notificação ao garçom depende do grupo de entrega: itens normais só notificam quando todos os normais do pedido ficarem prontos; itens `earlyDelivery` notificam quando todos os antecipados ficarem prontos. Indica o Ponto de Entrega na notificação
   - **Ponto de Entrega com `kitchenDelivery = true`:** operador entrega direto. KDS exibe botões "Pronto" e "Entregue"

---

## Super Admin (Equipe OChefia)

**Dispositivo:** desktop.
**Navegação:** sidebar com branding OChefia (indigo). Menu: Dashboard, Estabelecimentos, Módulos, Monitoramento.

1. **Login** → email + senha (mesma mecânica do admin, role SUPER_ADMIN)
2. **Dashboard** → KPIs: total de estabelecimentos, ativos, suspensos, inadimplentes. Alertas recentes, últimos acessos
3. **Estabelecimentos** → listagem com filtros (status, inadimplente) + busca + paginação
4. Toca num estabelecimento → **Detalhe:**
   - Dados gerais (nome, slug, CNPJ, responsável, email, telefone) → editável
   - Alterar status (ativo/suspenso)
   - **Cobrança:** valor do plano base, histórico de pagamentos mensais, registrar pagamento, status (pago/pendente/atrasado)
   - **Módulos:** toggle de módulos extras, valor global e override
5. **"+ Novo Estabelecimento"** → formulário de cadastro (nome, slug, CNPJ, responsável, email, telefone)
6. **Módulos** → listar módulos disponíveis com valor padrão → editar valor e descrição
7. **Monitoramento** → métricas de uso por estabelecimento, último acesso
