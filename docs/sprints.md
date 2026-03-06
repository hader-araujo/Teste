# Roadmap de Sprints

## Sprint P — Prototipos HTML (antes de tudo)
Prototipos funcionais em HTML puro + CSS + JS vanilla. Sem React, sem NestJS, sem frameworks. Dados mockados hardcoded com valores realistas brasileiros (restaurante "Ze do Bar", pratos reais, precos reais, nomes reais). Interacoes basicas com JS vanilla (carrinho, selecao de pessoas, troca de abas, mudanca de status). Nao persiste dados — e apenas para validacao visual e de fluxo.

**Estrutura:**
```
prototypes/
├── index.html                  <- Hub com links para todas as telas
├── style-guide.html            <- Design system: cores, tipografia, componentes base
├── css/
│   └── style.css               <- CSS compartilhado (variaveis, componentes, layout)
├── js/
│   └── app.js                  <- JS compartilhado (interacoes, dados mock, navegacao)
├── cliente/
│   ├── whatsapp.html           <- Tela de verificacao WhatsApp
│   ├── pessoas.html            <- Cadastro de pessoas na mesa
│   ├── cardapio.html           <- Cardapio com fotos, categorias, filtros
│   ├── produto.html            <- Detalhe do produto com galeria de fotos
│   ├── carrinho.html           <- Carrinho com selecao de pessoas por item
│   ├── pedidos.html            <- Meus Pedidos (agrupado, com status e reatribuicao)
│   ├── conta.html              <- Conta com divisao por pessoa + taxa de servico
│   └── pagamento.html          <- QR Code Pix individual por pessoa
├── admin/
│   ├── login.html              <- Tela de login
│   ├── dashboard.html          <- Metricas, fila de pedidos, chamados
│   ├── mesas.html              <- Mapa de mesas com status
│   ├── cardapio-admin.html     <- CRUD categorias e produtos (com upload de fotos, flag bebida pronta/preparada)
│   ├── estoque.html            <- Ingredientes e alertas
│   ├── staff.html              <- Gestao de equipe + convites + flag temporario + flag entrega (BAR)
│   ├── escala.html             <- Programacao de escala (calendario por dia, proximos dias)
│   ├── equipe-do-dia.html      <- Equipe trabalhando hoje + distribuicao de mesas por garcom
│   └── settings.html           <- Configuracoes (taxa de servico, dados do restaurante, tema/cores com preview, modo de distribuicao de mesas)
├── kds/
│   ├── cozinha.html            <- Fila de producao (dark mode, temporizadores, cores)
│   └── bar.html                <- Fila de producao do bar
└── garcom/
    ├── mesas.html              <- Lista de mesas atribuidas
    ├── chamados.html           <- Chamados abertos + notificacoes
    ├── mesa-detalhe.html       <- Pedidos da mesa com divisao por pessoa
    └── comanda.html            <- Lancar pedido rapido
```

**Checklist:**
- [ ] `style-guide.html` — paleta de cores, tipografia, todos os componentes base renderizados.
- [ ] Telas do **cliente** — fluxo completo: WhatsApp -> pessoas -> cardapio -> produto -> carrinho (com selecao de pessoas) -> pedidos -> conta -> pagamento.
- [ ] Telas do **admin** — login -> dashboard -> mesas -> cardapio CRUD (com flag bebida pronta) -> estoque -> staff (com temporario + flag entrega BAR) -> escala -> equipe do dia (com distribuicao de mesas) -> settings (com modo de distribuicao).
- [ ] Telas do **KDS** — cozinha e bar com fila, cores de status, temporizadores.
- [ ] Telas do **garcom** — mesas -> chamados -> detalhe da mesa -> comanda.
- [ ] Navegacao funcional entre todas as telas (links).
- [ ] Interacoes JS: adicionar ao carrinho, selecionar pessoas, trocar abas, mudar status no KDS.
- [ ] Responsivo: cliente e garcom em mobile (375px), admin e KDS em desktop/tablet (1024px+).
- [ ] Tela de **Settings** com selecao de tema + color picker + preview do cardapio.
- [ ] Prototipos do cliente devem demonstrar pelo menos 2 temas diferentes (Classico + Escuro) para validar que o theming funciona.
- [ ] Validacao visual aprovada pelo usuario antes de prosseguir para Sprint 0.

---

## Sprint 0 — Scaffolding e Documentacao Estrutural
- [ ] Criar toda a estrutura de pastas do monorepo com `README.md` em cada pasta relevante.

## Sprint 1-2 — Fundacao
- [ ] Setup monorepo Turborepo + pnpm.
- [ ] NestJS com estrutura de modulos, Prisma, PostgreSQL.
- [ ] Docker Compose rodando local.
- [ ] Modulo auth completo (register, login, JWT, roles).
- [ ] CRUD de restaurante e mesas.
- [ ] Seed com dados de teste.

## Sprint 3-4 — Cardapio e Pedidos
- [ ] CRUD de categorias, produtos, adicionais.
- [ ] Cache do cardapio no Redis.
- [ ] Endpoint publico do cardapio por slug.
- [ ] Frontend: tela do cardapio digital (Next.js).
- [ ] Carrinho e criacao de pedido.
- [ ] Sessao de mesa (token na URL + cookie).
- [ ] Coleta e verificacao de WhatsApp via OTP (tela obrigatoria ao abrir a sessao).

## Sprint 5-6 — KDS e Tempo Real
- [ ] WebSocket gateway (Socket.IO).
- [ ] Roteamento de pedidos: comida -> cozinha, bebida preparada -> bar, bebida pronta -> garcom direto.
- [ ] Sub-pedidos automaticos para pedidos mistos (sufixo `_cozinha`, `_bar`, `_garcom`).
- [ ] Frontend: tela KDS com fila, cores e temporizadores.
- [ ] Fluxo BAR com flag "tambem entrega": barman com entrega mantem status Pronto -> Entregue no KDS. Sem entrega, notifica garcom.
- [ ] Fluxo completo: cliente pede -> roteamento -> KDS/garcom recebe -> prepara -> marca pronto -> entrega.

## Sprint 7-8 — Garcom, Chamados, Staff, Escala e Estoque
- [ ] Modulo garcom (comanda mobile).
- [ ] Botao "O Chefia" (chamados com tipo).
- [ ] Notificacoes para o garcom (pedido pronto, chamado de mesa, bebida pronta para retirada).
- [ ] Frontend: tela do garcom (PWA).
- [ ] CRUD de ingredientes e alertas de estoque.
- [ ] Gestao de equipe com convites + flag temporario + dias fixos + flag entrega (BAR).
- [ ] Tela de Escala: programacao de equipe por dia, auto-preenchimento, ajustes manuais.
- [ ] Tela Equipe do Dia: equipe ativa + distribuicao de mesas por garcom.
- [ ] Configuracao de modo de distribuicao de mesas (todos vs. automatico) em Settings.
- [ ] Testes e2e (Supertest + Playwright).

## Sprint 9 — UI/UX e Componentes Base
- [ ] Biblioteca de componentes base (Button, Input, Badge, Modal, Toggle, Skeleton, Spinner).
- [ ] Toast notifications (sonner).
- [ ] Skeleton loading em todas as telas.
- [ ] Refactor KDS e admin para usar componentes base.

## Sprint 10 — Layout e Navegacao
- [ ] AdminSidebar fixa com navegacao, avatar e role.
- [ ] Layout admin com sidebar + mobile top bar.
- [ ] Redesign da pagina de login.
- [ ] KDS layout com indicador de conexao WebSocket.

## Sprint 11 — QR Code Pix, Relatorios, Notificacoes Push
- [ ] QR Code Pix com baixa automatica.
- [ ] Relatorios de faturamento e itens populares.
- [ ] Notificacoes push para o garcom.
- [ ] Racha de conta no frontend.

## Sprint 12+ — Dashboard Avancado e Otimizacoes
- [ ] Dashboard gerencial avancado (mapa de mesas visual, graficos).
- [ ] Controle de estoque com baixa automatica por pedido.
- [ ] Alertas de estoque minimo em tempo real.

## Sprint 13+ — Fase 2 (Plataforma) — NAO IMPLEMENTAR ATE AVISO EXPLICITO
**Apenas referencia arquitetural. Nao iniciar ate o usuario pedir.**
- [ ] App nativo com Capacitor (iOS/Android).
- [ ] Cadastro/login do consumidor final.
- [ ] Tela "Explorar" com estabelecimentos.
- [ ] Lotacao em tempo real, reserva de mesa, pre-pedido.
- [ ] Programa de fidelidade.
- [ ] Emissao de NFC-e/SAT (integracao com Focus NFe ou similar).
