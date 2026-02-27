# OChefia — Documento Técnico e Estratégico Completo

---

## 1. Visão Geral do Produto

O **OChefia** é um SaaS (Software as a Service) em nuvem para gestão completa de bares e restaurantes no Brasil. O sistema oferece cardápio digital via QR Code, autoatendimento do cliente, KDS (Kitchen Display System), gestão de salão e um dashboard gerencial — tudo em tempo real e sem necessidade de hardware especializado.

O nome tem forte apelo comercial e cria conexão direta com a cultura de bares e restaurantes no Brasil. O domínio já está garantido.

---

## 2. Estratégia de Produto em Duas Fases

### Fase 1 — MVP (Produto Mínimo Viável)

O cliente chega no estabelecimento, lê o QR Code da mesa com o celular e abre uma página web (PWA) diretamente no navegador. Sem download, sem cadastro, sem fricção. Ele faz o pedido, acompanha a conta, divide, paga e vai embora.

O foco é vender a solução para os estabelecimentos. O cliente final (consumidor) é um usuário anônimo e temporário.

### Fase 2 — Plataforma / App OChefia

Quando a marca já estiver reconhecida no mercado, o OChefia se torna uma **plataforma**. O consumidor final baixa o app OChefia (iOS/Android) nas lojas e ganha acesso a um ecossistema completo:

- Ver todos os bares e restaurantes parceiros.
- Verificar lotação em tempo real.
- Reservar mesa antecipadamente.
- Fazer um pré-pedido antes de chegar (o prato já começa a ser preparado).
- Histórico de pedidos, favoritos e programa de fidelidade.

Quando esse cliente chega no estabelecimento e lê o QR Code, o sistema reconhece quem ele é, vincula a sessão da mesa ao perfil dele e personaliza a experiência. Se alguém sem o app ler o QR Code, continua funcionando como visitante anônimo — exatamente como na Fase 1.

---

## 3. Módulos Funcionais

### 3.1. Módulo Gerencial (Dashboard e Backoffice)

O "cérebro" da operação. Controle total e dados em tempo real para o dono/gerente.

- **Visão Geral em Tempo Real:** Mapa de mesas (livres, ocupadas, aguardando limpeza, tempo de permanência).
- **Métricas Operacionais:** Tempo médio de atendimento, tempo de preparo por prato, ticket médio por mesa.
- **Gestão Financeira e Fiscal:** Fechamento de caixa, relatórios de lucro e emissão de notas fiscais (NFC-e/SAT).
- **Controle de Estoque Inteligente:** Baixa automática de ingredientes a cada prato vendido e alertas de estoque mínimo.
- **Gestão de Cardápio:** Habilitar/desabilitar itens em tempo real (evita que o cliente peça algo que acabou) e precificação dinâmica (ex: Happy Hour automático).

### 3.2. Módulo Operacional — KDS (Kitchen Display System)

Elimina o papel e os gritos no salão. Roda em tablet ou monitor na cozinha e no bar.

- **Roteamento de Pedidos:** Bebidas vão automaticamente para a tela do bar; pratos vão para a tela da cozinha.
- **Fila e Temporizadores:** Fila de produção com cores (Verde: no prazo, Amarelo: atenção, Vermelho: atrasado).
- **Alertas Visuais/Sonoros:** Notificação quando entra um pedido novo ou quando o cliente pede urgência.
- **Integração de Receitas:** O cozinheiro pode clicar no prato e ver a ficha técnica e a foto do empratamento padrão.

### 3.3. Módulo Cliente (Cardápio Digital e Autoatendimento)

Interface impecável, rápida, acessada via navegador (QR Code). Sem download de app.

- **Cardápio Vendedor:** Fotos em alta qualidade, descrição de ingredientes, filtros (vegano, sem glúten, etc).
- **Upselling Automatizado:** Sugestões inteligentes (ex: "Que tal adicionar bacon por R$ 4,00?" / "Combina com um Chopp Artesanal").
- **Gestão da Conta:** O cliente acompanha a conta em tempo real.
- **Racha de Conta Dinâmico:** Divide por pessoa, por itens consumidos, ou permite que cada um pague o que pediu.
- **Pagamento Integrado:** Pix (com baixa automática) ou Apple/Google Pay direto da mesa.
- **Botão "O Chefia":** Chamado interativo para o garçom com motivo especificado (ex: "Limpar mesa", "Pedir gelo", "Dúvida no cardápio").

### 3.4. Módulo Salão (Aplicativo do Garçom)

Mesmo com autoatendimento, garçons continuam necessários para entregas, atendimento presencial e clientes que não querem usar o celular.

- **Comanda Mobile:** Versão simplificada no celular do garçom para lançar pedidos rápidos.
- **Notificações Smart:** Alertas como "Fritas da Mesa 12 prontas na cozinha" ou "Mesa 04 pediu a conta".

### 3.5. Módulo Plataforma — Explorar (Fase 2)

Disponível apenas no app OChefia (iOS/Android).

- **Listagem de Estabelecimentos:** Todos os bares/restaurantes parceiros com fotos, cardápio, avaliações e horário de funcionamento.
- **Mapa e Filtros:** Localização por mapa, tipo de culinária, faixa de preço, aberto agora.
- **Lotação em Tempo Real:** Indicador de quantas mesas estão disponíveis naquele momento.
- **Reserva de Mesa:** Agendar horário e número de pessoas.
- **Pré-Pedido:** Escolher pratos antes de chegar para agilizar o atendimento.
- **Perfil do Consumidor:** Histórico de pedidos, favoritos, programa de fidelidade.

---

## 4. Arquitetura Técnica — Stack Tecnológica

### 4.1. Backend (API e Regras de Negócio)

- **Linguagem/Framework:** TypeScript com Node.js usando **NestJS**.
  - Tipagem forte com TypeScript (evita bugs em tempo de compilação).
  - Suporte nativo a injeção de dependência, módulos e decorators.
  - Excelente para sistemas SaaS e APIs corporativas.
  - Arquitetura muito similar à Clean Architecture do .NET.
- **Comunicação em Tempo Real:** WebSockets via **Socket.IO** integrado ao NestJS.
  - Não-negociável para o OChefia. É o que faz o pedido "piscar" na tela da cozinha instantaneamente, o chamado do garçom chegar no celular dele e a conta do cliente atualizar sem recarregar a página.
- **Arquitetura:** Clean Architecture com APIs RESTful + WebSocket para eventos em tempo real.
- **Validação e Documentação:** class-validator + Swagger/OpenAPI gerado automaticamente pelo NestJS.

### 4.2. Frontend — Estrutura de Projetos

O frontend é dividido em **dois projetos separados**, mas compartilhando código via uma biblioteca comum (monorepo).

#### Projeto 1: Web App (PWA) — `apps/web`

Construído com **Next.js** + **React** + **TypeScript** + **Tailwind CSS**.

Este é o projeto principal e cobre a maioria dos módulos. Funciona 100% no navegador e é acessível via URL. Cada módulo é uma rota com layout próprio:

| Rota | Quem usa | Acesso |
|---|---|---|
| `/cardapio/{restaurante}/mesa/{id}` | Cliente | QR Code da mesa |
| `/kds` | Cozinha / Bar | Tablet/monitor no estabelecimento |
| `/garcom` | Garçom | Celular do garçom (salvo como PWA) |
| `/admin` | Dono / Gerente | Computador ou tablet |

**PWA (Progressive Web App):** O projeto web é configurado como PWA. Isso significa que o garçom pode "instalar" salvando na tela inicial do celular — abre em tela cheia, com ícone, sem barra do navegador, parecendo um app nativo. O KDS no tablet da cozinha funciona da mesma forma.

**Sessão do Cliente por Mesa (MVP):** O QR Code da mesa aponta para uma URL única (ex: `ochefia.com/ze-bar/mesa/12`). O sistema cria uma sessão vinculada àquela mesa ativa. Se o cliente fechar o navegador e abrir de novo, a sessão da mesa continua aberta com todos os pedidos — ela só é encerrada quando a conta é fechada. Isso é feito com um token na URL + cookie de sessão, sem necessidade de login.

#### Projeto 2: App Nativo (iOS/Android) — `apps/mobile`

Construído com **Capacitor (Ionic)** empacotando o mesmo código React.

Este projeto é para a **Fase 2**, quando o OChefia se torna uma plataforma. O Capacitor pega o código React e empacota dentro de um container nativo, permitindo publicação na App Store e Google Play.

O app nativo inclui tudo que o PWA já faz, mais:

- Tela "Explorar" com listagem de estabelecimentos parceiros.
- Cadastro e login do consumidor final (perfil, histórico, favoritos).
- Reserva de mesa e pré-pedido.
- Notificações push nativas.
- Acesso a recursos do dispositivo (câmera, localização, Bluetooth para impressoras de comanda).

**Fluxo com o app instalado:** O cliente abre o app → vê os restaurantes próximos → escolhe um → reserva mesa → chega no local → lê o QR Code → o sistema vincula a sessão da mesa ao perfil dele automaticamente → experiência personalizada.

#### Biblioteca Compartilhada — `packages/shared`

Para evitar duplicação de código entre o projeto web e o mobile:

- Hooks compartilhados (useCart, useSocket, useSession).
- Tipos TypeScript (interfaces de pedido, mesa, produto, etc).
- Lógica de negócio do cliente (cálculo de conta, racha, validações).
- Serviços de API (chamadas HTTP e WebSocket).

#### Estrutura do Monorepo

```
ochefia/
├── apps/
│   ├── web/          → Next.js (PWA) — Cliente, KDS, Garçom, Admin
│   ├── mobile/       → Capacitor + React — App iOS/Android (Fase 2)
│   └── api/          → NestJS — Backend
├── packages/
│   └── shared/       → Tipos, hooks, lógica compartilhada
├── package.json
└── turbo.json        → Turborepo para gerenciar o monorepo
```

### 4.3. Banco de Dados

- **Banco Relacional Principal:** PostgreSQL.
  - Padrão ouro open-source para transações financeiras, controle de estoque e integridade de dados.
  - **Row-Level Security (RLS)** para isolamento multi-tenant: garante que um restaurante jamais acesse dados de outro.
  - ORM: **Prisma** (integração excelente com TypeScript e NestJS).
- **Banco em Memória / Cache:** Redis.
  - Cardápio em cache (lido milhares de vezes por noite, alterado raramente).
  - Gerenciamento de sessões de mesa.
  - Tokens de autenticação.
  - Pub/Sub para eventos em tempo real entre instâncias do servidor.

### 4.4. Infraestrutura e Segurança

- **Hospedagem:** AWS, Azure ou Google Cloud.
- **Deploy:** Docker + Kubernetes (ou serviços gerenciados como AWS ECS / Azure Container Apps). Permite escalar partes do sistema independentemente — se na sexta à noite o módulo de pedidos explodir de acessos, escala-se apenas ele.
- **CI/CD:** GitHub Actions para build, testes e deploy automáticos.
- **Segurança:**
  - Autenticação via **JWT** (JSON Web Tokens).
  - **WAF** (Web Application Firewall) contra ataques de injeção e DDoS.
  - Criptografia de dados sensíveis no banco (conformidade com **LGPD**).
  - Tráfego estritamente via **HTTPS/TLS 1.3**.
  - Backups automatizados diários.
- **Monitoramento:** Logs centralizados e alertas de performance/erros.

---

## 5. Resumo das Decisões Técnicas

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Backend | Node.js + NestJS + TypeScript | Tipagem forte, arquitetura limpa, ecossistema unificado JS/TS |
| Real-time | Socket.IO | Pedidos instantâneos no KDS, chamados do garçom, conta ao vivo |
| Frontend Web | Next.js + React + Tailwind CSS | PWA, SSR, performance, responsividade |
| App Mobile | Capacitor (React) | Reaproveita código React, acesso nativo, publicação nas lojas |
| Banco Principal | PostgreSQL + Prisma | Integridade, RLS multi-tenant, tipagem com Prisma |
| Cache | Redis | Performance de leitura, sessões, pub/sub |
| Monorepo | Turborepo | Compartilhamento de código entre web, mobile e API |
| Infra | Docker + Kubernetes | Escalabilidade independente por módulo |
| Segurança | JWT + WAF + TLS 1.3 | LGPD, proteção de dados, autenticação robusta |

---

## 6. Roadmap Sugerido

### Sprint 1-3 — Fundação
- Setup do monorepo (Turborepo).
- Backend NestJS com autenticação, CRUD de restaurante, mesas e cardápio.
- Banco PostgreSQL com Prisma e RLS.
- WebSocket básico funcionando.

### Sprint 4-6 — MVP Core
- Cardápio digital via QR Code (módulo cliente).
- Sistema de pedidos com fluxo completo (cliente → cozinha).
- KDS básico com fila e temporizadores.
- Sessão por mesa (sem login do cliente).

### Sprint 7-9 — MVP Completo
- Módulo do garçom (comanda mobile + notificações).
- Dashboard gerencial básico (mapa de mesas, métricas).
- Pagamento integrado (Pix).
- Racha de conta.

### Sprint 10+ — Fase 2 (Plataforma)
- App nativo com Capacitor (iOS/Android).
- Cadastro de consumidor final.
- Tela "Explorar" com estabelecimentos parceiros.
- Reserva de mesa e pré-pedido.
- Programa de fidelidade.
