# Sprint P — Protótipos HTML (antes de tudo)

Protótipos funcionais em HTML puro + CSS + JS vanilla. Sem React, sem NestJS, sem frameworks. Dados mockados hardcoded com valores realistas brasileiros (restaurante "Zé do Bar", pratos reais, preços reais, nomes reais). Interações básicas com JS vanilla (carrinho, seleção de pessoas, troca de abas, mudança de status). Não persiste dados — é apenas para validação visual e de fluxo.

**Estrutura:**
```
prototypes/
├── index.html                  <- Hub com links para todas as telas
├── style-guide.html            <- Design system: cores, tipografia, componentes base
├── css/
│   └── style.css               <- CSS compartilhado (variáveis, componentes, layout)
├── js/
│   └── app.js                  <- JS compartilhado (interações, dados mock, navegação)
├── cliente/
│   ├── whatsapp.html           <- Tela de verificação WhatsApp
│   ├── pessoas.html            <- Cadastro de pessoas na mesa
│   ├── cardapio.html           <- Cardápio com fotos, categorias, filtros
│   ├── produto.html            <- Detalhe do produto com galeria de fotos
│   ├── carrinho.html           <- Carrinho com seleção de pessoas por item
│   ├── pedidos.html            <- Meus Pedidos (agrupado, com status e reatribuição)
│   ├── conta.html              <- Conta com divisão por pessoa + taxa de serviço
│   ├── pagamento.html          <- QR Code Pix individual por pessoa
│   └── privacidade.html       <- Política de Privacidade (LGPD)
├── admin/
│   ├── login.html              <- Tela de login
│   ├── dashboard.html          <- Métricas dinâmicas por Local de Preparo, pedidos recentes, chamados, seção alertas
│   ├── mesas.html              <- Mapa de mesas com status + filtros (todas/com problema/ociosas) + delete de mesa
│   ├── cardapio-admin.html     <- CRUD categorias, tags e produtos (com upload de fotos, Ponto de Entrega ou "Garçom", flag entrega antecipada)
│   ├── locais-preparo.html     <- CRUD de Locais de Preparo + Pontos de Entrega (com flag entrega pela cozinha)
│   ├── setores.html            <- CRUD de Setores + mesas vinculadas + mapeamento de Pontos de Entrega por Local de Preparo
│   ├── desempenho.html         <- Desempenho da equipe: métricas por garçom e por Local de Preparo
│   ├── faturamento.html        <- Faturamento diário, mensal e taxas de garçom
│   ├── staff.html              <- Gestão de equipe + convites + flag temporário + senha garçom
│   ├── escala.html             <- Programação de escala (calendário por dia, próximos dias)
│   ├── equipe-do-dia.html      <- Equipe trabalhando hoje + atribuição de setores por garçom
│   └── settings.html           <- Configurações (nome/logo do estabelecimento, taxa de serviço, tema/cores com preview)
├── kds/
│   ├── login.html              <- Login do KDS (nome + PIN, dark mode)
│   ├── selecao-local.html      <- Seleção de Local de Preparo
│   └── kds.html                <- Fila de produção por Local de Preparo (dark mode, temporizadores, cores)
├── garcom/
│   ├── clock-in.html           <- Ativação de turno (senha do garçom)
│   ├── mesas.html              <- Lista de mesas dos setores atribuídos
│   ├── chamados.html           <- Chamados abertos + notificações
│   ├── mesa-abrir.html         <- Abrir mesa (quantidade de pessoas + nomes)
│   ├── mesa-detalhe.html       <- Pedidos da mesa com divisão por pessoa
│   └── comanda.html            <- Lançar pedido rápido
└── superadmin/
    ├── login.html              <- Login do Super Admin (mesmo layout, branding OChefia)
    ├── dashboard.html          <- Painel principal: KPIs (total estabelecimentos, ativos, suspensos, inadimplentes), últimos acessos, alertas
    ├── estabelecimentos.html   <- Listagem de todos os estabelecimentos com filtros (status, inadimplente) + paginação
    ├── estabelecimento-novo.html    <- Cadastro de novo estabelecimento (nome, slug, CNPJ, responsável, email, telefone)
    ├── estabelecimento-detalhe.html <- Detalhes do estabelecimento (dados, status, módulos ativos, histórico de cobrança)
    ├── (cobrança integrada como tab em estabelecimento-detalhe.html)
    ├── modulos.html            <- Gestão de módulos: listar módulos disponíveis, habilitar/desabilitar por estabelecimento, valores (global e override)
    └── monitoramento.html      <- Métricas de uso, últimos acessos, pedidos/mês por estabelecimento
```

**Checklist:**
- [x] `style-guide.html` — paleta de cores, tipografia, todos os componentes base renderizados.
- [x] Telas do **cliente** — fluxo completo: WhatsApp -> pessoas -> cardápio -> produto -> carrinho (com seleção de pessoas) -> pedidos -> conta -> pagamento.
- [x] Telas do **admin** — login -> dashboard (KPIs dinâmicos por Local de Preparo + seção alertas) -> mesas (filtros: todas/com problema/ociosas + delete de mesa) -> cardápio CRUD (com tags, Ponto de Entrega ou "Garçom", flag entrega antecipada) -> locais de preparo (CRUD + pontos de entrega com flag entrega pela cozinha) -> setores (CRUD + mesas + mapeamento de pontos de entrega) -> desempenho da equipe (métricas por garçom e por Local de Preparo) -> faturamento (diário, mensal, taxas garçom, escalações) -> staff (com temporário + senha garçom) -> escala -> equipe do dia (com atribuição de setores) -> settings (com nome/logo do estabelecimento, escalação de retirada).
- [x] Telas do **KDS** — tela única por Local de Preparo com fila, cores de status, temporizadores. Mockar pelo menos 2 locais (ex: "Cozinha Principal" e "Bar").
- [x] Telas do **garçom** — ativação de turno (clock-in com senha) -> chamados (tab principal, com banner de notificação) -> mesas agrupadas por setor -> abrir mesa (pessoas + nomes) -> detalhe da mesa (com botão "Retirar" em itens prontos) -> comanda.
- [x] Navegação funcional entre todas as telas (links, incluindo Super Admin).
- [x] Interações JS: adicionar ao carrinho, selecionar pessoas, trocar abas, mudar status no KDS, claim de retirada no garçom.
- [x] Responsivo: cliente e garçom em mobile (375px), admin e KDS em desktop/tablet (1024px+).
- [x] Tela de **Settings** com seleção de tema + color picker + preview do cardápio + parâmetros de escalação de retirada (`pickupReminderInterval`, `pickupEscalationTimeout`).
- [x] Protótipos do cliente devem demonstrar pelo menos 2 temas diferentes (Clássico + Escuro) para validar que o theming funciona.
- [x] Telas do **Super Admin** — login -> dashboard (KPIs: total estabelecimentos, ativos, suspensos, inadimplentes) -> listagem de estabelecimentos (com filtros de status e inadimplência, paginação) -> cadastro de novo estabelecimento (nome, slug, CNPJ, responsável, email, telefone) -> detalhe do estabelecimento (dados, status ativo/suspenso, módulos ativos, histórico de cobrança) -> cobrança (valor do plano base, registro de pagamentos mensais, status pago/pendente/atrasado, indicadores de inadimplência) -> módulos (listar módulos disponíveis com valor padrão, habilitar/desabilitar por estabelecimento, valor override) -> monitoramento (métricas de uso por estabelecimento, últimos acessos, pedidos/mês).
- [x] Navegação Super Admin: sidebar própria com branding OChefia (não do restaurante). Menu: Dashboard, Estabelecimentos, Módulos, Monitoramento. Cobrança é acessada dentro do detalhe do estabelecimento (não é item separado na sidebar).
- [x] Interações JS Super Admin: filtros na listagem, alterar status de estabelecimento, registrar pagamento, toggle de módulos, ordenação por métricas no monitoramento.
- [x] Responsivo Super Admin: desktop-first (mesma diretriz do admin).
- [ ] Validação visual aprovada pelo usuário antes de prosseguir para Sprint 0.
