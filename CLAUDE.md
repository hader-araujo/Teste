# CLAUDE.md — OChefia

Guia de referencia para o agente de desenvolvimento. Consulte sempre antes de implementar qualquer coisa.

---

## REGRA OBRIGATORIA: TDD (Test-Driven Development)

**ESTA REGRA E INVIOLAVEL. QUALQUER IA OU DESENVOLVEDOR QUE LER ESTE ARQUIVO DEVE SEGUIR.**

### NUNCA escrever codigo de producao sem ter o teste escrito ANTES.

O ciclo de desenvolvimento e **sempre**:

1. **RED** — Escrever o teste primeiro. O teste DEVE falhar (porque o codigo ainda nao existe).
2. **GREEN** — Escrever o codigo minimo necessario para o teste passar.
3. **REFACTOR** — Refatorar o codigo mantendo os testes passando.

### Regras:
- **Proibido** criar/modificar qualquer arquivo de producao (`.service.ts`, `.controller.ts`, `.tsx`, etc.) sem que exista um teste correspondente **escrito antes**.
- **Proibido** commitar codigo sem os testes passando.
- Se um bug for encontrado, primeiro escrever um teste que reproduz o bug, depois corrigir.
- Ao adicionar funcionalidade a codigo existente, primeiro escrever o teste da nova funcionalidade, ver falhar, depois implementar.
- Testes nao sao opcionais, nao sao "para depois", nao sao "se der tempo". Sao a **primeira coisa** a ser feita.

### Checklist antes de qualquer implementacao:
- [ ] Teste unitario escrito e falhando?
- [ ] Teste de integracao escrito e falhando (se envolve endpoint ou fluxo)?
- [ ] Teste E2E escrito e falhando (se envolve tela nova ou fluxo de usuario)?
- [ ] So entao: implementar o codigo.
- [ ] Todos os testes passando apos implementacao?
- [ ] Refatorar se necessario, testes continuam passando?

---

## Visao Geral

**OChefia** e um SaaS para gestao de bares e restaurantes no Brasil. Cardapio digital via QR Code, autoatendimento, KDS (Kitchen Display System), modulo garcom e dashboard gerencial — tudo em tempo real, sem hardware especializado.

**Fase 1 (MVP):** Cliente le QR Code -> abre PWA no navegador -> faz pedido -> acompanha conta -> paga -> vai embora. Sem download, sem cadastro. Sessao vinculada a mesa (nao ao celular). Fechar e reabrir o navegador mantem os pedidos. Sessao encerra ao fechar a conta. Publico-alvo: vender para donos de bares/restaurantes.

**Fase 2 (Plataforma) — NAO IMPLEMENTAR ATE AVISO EXPLICITO DO USUARIO:** App nativo iOS/Android com cadastro de consumidor, historico, tela "Explorar", reserva de mesa, pre-pedido e fidelidade. Ao ler QR Code logado no app, sessao da mesa se vincula ao perfil do cliente. Sem o app, funciona como visitante anonimo (Fase 1). **A Fase 2 existe apenas como referencia arquitetural para decisoes de design. Nenhum codigo, nenhum teste, nenhuma tela da Fase 2 deve ser criada ate que o usuario solicite explicitamente.**

---

## Estrutura do Monorepo

```
ochefia/
├── apps/
│   ├── api/          -> NestJS Backend (porta 3001)
│   ├── web/          -> Next.js PWA (porta 3000)
│   └── mobile/       -> Capacitor + React (Fase 2)
├── packages/
│   └── shared/       -> @ochefia/shared — tipos, constantes, utils
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml
```

---

## Docker — Containers

Um container por servico. Todos orquestrados via `docker-compose.yml`.

| Container | Imagem Base | Porta | Descricao |
|---|---|---|---|
| `ochefia-api` | `node:20-alpine` | 3001 | Backend NestJS |
| `ochefia-web` | `node:20-alpine` | 3000 | Frontend Next.js (PWA) |
| `ochefia-postgres` | `postgres:16-alpine` | 5433 | Banco principal |
| `ochefia-redis` | `redis:7-alpine` | 6380 | Cache e sessoes |

- O pacote `shared` nao tem container proprio — e dependencia de build-time, compilada antes de `api` e `web`.
- Em producao local (on-premise), os 4 containers rodam na mesma maquina.
- Em producao cloud (AWS), `postgres` e `redis` sao substituidos por servicos gerenciados (RDS, ElastiCache).
- Fase 2: o app mobile (Capacitor) e compilado para `.apk`/`.ipa` e distribuido via app stores — nao precisa de container. Ele aponta para a API (local via WiFi ou cloud via internet).

---

## Stack Tecnologica

| Camada | Tecnologia |
|---|---|
| Linguagem | TypeScript em todo o projeto |
| Backend | Node.js + NestJS |
| Real-time | Socket.IO via `@nestjs/websockets` |
| Frontend Web | Next.js 14+ (App Router) + React 18+ + Tailwind CSS |
| App Mobile | Capacitor + React (Fase 2) |
| ORM | Prisma |
| Banco Principal | PostgreSQL com Row-Level Security (multi-tenant) |
| Cache / Sessoes | Redis |
| Monorepo | Turborepo |
| Package Manager | pnpm |
| Testes | Jest (unitario + contrato) + Supertest (integracao API) + Playwright (E2E UI) — **TDD obrigatorio** |
| CI/CD | GitHub Actions |
| Infra | Docker + Docker Compose (dev e prod local) / Kubernetes ou AWS ECS (prod cloud) |
| Containers | `api` (NestJS), `web` (Next.js), `postgres` (PostgreSQL), `redis` (Redis) — 1 container por servico |
| Logs | Winston com output JSON estruturado + Correlation ID por request |
| Storage de Arquivos | Filesystem local (deploy local) / AWS S3 + CloudFront CDN (deploy cloud) |
| Autenticacao | JWT (access 15min + refresh 7 dias em httpOnly cookie) |
| Documentacao API | Swagger/OpenAPI auto-gerado pelo NestJS |

---

## Modulos Funcionais

### Modulo Gerencial (Dashboard/Backoffice) — Rota: `/admin`
Acesso: Dono/Gerente via computador ou tablet.

- Mapa de mesas em tempo real (livres, ocupadas, aguardando limpeza, tempo de permanencia).
- Metricas: tempo medio de atendimento, tempo de preparo por prato, ticket medio por mesa.
- Financeiro: fechamento de caixa, relatorios de faturamento. (Emissao de NFC-e/SAT fica para fase futura ou integracao com servico terceiro como Focus NFe).
- Estoque: baixa automatica de ingredientes por prato vendido, alertas de estoque minimo.
- Cardapio: CRUD de categorias e produtos, habilitar/desabilitar itens em tempo real, precificacao dinamica (Happy Hour automatico).
- Upload de imagens: cada produto aceita **multiplas fotos** (galeria). A primeira foto e a principal (capa). Upload com preview, reordenacao e remocao. Armazenamento: filesystem local (deploy on-premise) ou S3 (deploy cloud).
- Gestao de funcionarios: cadastro de garcons, cozinheiros, gerentes com permissoes por role.

### Modulo KDS (Kitchen Display System) — Rota: `/kds`
Acesso: Cozinha e Bar via tablet ou monitor.

- Roteamento automatico: bebidas -> tela do bar; pratos -> tela da cozinha.
- Fila de producao com temporizadores e cores (Verde: no prazo, Amarelo: atencao, Vermelho: atrasado).
- Alertas visuais e sonoros para pedido novo ou pedido urgente.
- Clique no prato para ver ficha tecnica (ingredientes, modo de preparo, foto do empratamento).
- Botao "Pronto" que notifica o garcom para retirada.

### Modulo Cliente (Cardapio Digital) — Rota: `/[slug]/mesa/[mesaId]`
Acesso: Cliente via QR Code no navegador.

- **Identificacao via WhatsApp (obrigatoria):** Ao abrir a sessao pela primeira vez, o cliente informa o numero de WhatsApp. O sistema envia um OTP de 6 digitos via WhatsApp. Apos confirmar, o numero fica salvo na sessao (`phone` + `phoneVerified = true`). Objetivo: ter o contato do cliente registrado para eventuais pendencias. Nenhuma funcionalidade ativa usa esse numero alem do armazenamento.
- Cardapio com **galeria de fotos** por produto (swipe entre imagens), descricoes, filtros (vegano, sem gluten, etc).
- Upselling: sugestoes automaticas de adicionais e acompanhamentos (ex: "Que tal adicionar bacon por R$ 4,00?" / "Combina com um Chopp Artesanal").
- **Pessoas na mesa:**
  - Apos a verificacao de WhatsApp, o cliente pode cadastrar outras pessoas na mesa (apenas nome, sem verificacao).
  - Se nao cadastrar ninguem, ele fica como unica pessoa.
  - Lista de pessoas editavel a qualquer momento durante a sessao (adicionar/remover).
- **Carrinho e envio de pedido:**
  - Ao adicionar cada item ao carrinho, o cliente **deve selecionar pelo menos 1 pessoa** para quem o item e destinado (obrigatorio).
  - Seletor multi-check com os nomes cadastrados na mesa (ex: "Joao", "Maria", "Marta").
  - O valor do item e dividido igualmente entre as pessoas selecionadas.
- **Acompanhamento de pedidos em tempo real:**
  - Cada envio do carrinho gera um **pedido separado** com seu proprio ciclo de vida (ex: Pedido #1: 1 cerveja + 2 sucos; Pedido #2: prato de comida).
  - Status por pedido/item: `Na fila` -> `Preparando` -> `Pronto` -> `Entregue`.
  - Atualizacoes em tempo real via WebSocket (sem necessidade de refresh).
  - **Tela "Meus Pedidos"**: lista todos os pedidos da sessao, agrupados por pedido, com status individual de cada item, horario e nomes das pessoas atribuidas.
  - Nessa tela, o cliente ainda pode **reatribuir pessoas** a cada item (marcar/desmarcar nomes). A divisao de valores recalcula automaticamente.
- **Divisao de conta por pessoa:**
  - **Tela "Conta"**: visao consolidada por pessoa — cada pessoa ve a soma dos itens atribuidos a ela.
  - A **taxa de servico (gorjeta)** e aplicada sobre o total de cada pessoa (ex: subtotal R$ 50 + 10% = R$ 55). A taxa aparece apenas no total, nao em cada item.
  - O percentual da taxa e configurado pelo restaurante nas configuracoes (Settings).
  - Visao geral da mesa: total de todos + total por pessoa.
- **Pagamento individual:** cada pessoa paga sua parte separadamente via Pix com QR Code (baixa automatica). Apple/Google Pay em fase futura.
- Botao "O Chefia": chamado ao garcom com motivo (limpar mesa, pedir gelo, duvida, conta).

### Modulo Garcom — Rota: `/garcom`
Acesso: Celular do garcom (PWA salvo na tela inicial).

- Comanda mobile: lancar pedidos rapidos para qualquer mesa.
- Lista de mesas atribuidas com status.
- Notificacoes push: "Fritas da Mesa 12 prontas na cozinha", "Mesa 04 chamou — motivo: pedir a conta".
- Historico de pedidos da mesa aberta com divisao por pessoa visivel.
- **Taxa de servico:** o garcom pode **desabilitar a taxa de servico** para uma sessao especifica (ex: cliente que nao quer pagar). Toggle por sessao, nao global.

### Modulo Explorar (Fase 2 — NAO IMPLEMENTAR) — Rota: `/explorar`
**Referencia arquitetural apenas. Nao implementar ate aviso explicito do usuario.**
Acesso: App nativo (iOS/Android).

- Listagem de estabelecimentos parceiros com fotos, cardapio, avaliacoes, horarios.
- Mapa e filtros (culinaria, preco, aberto agora, distancia).
- Lotacao em tempo real.
- Reserva de mesa.
- Pre-pedido antes de chegar.
- Perfil do consumidor: historico, favoritos, fidelidade.

---

## Convencoes de Codigo

### Geral
- TypeScript estrito em todo o projeto. Nunca usar `any`.
- Nomes de variaveis e funcoes em **camelCase**.
- Nomes de arquivos em **kebab-case** (ex: `auth.service.ts`, `order-status.ts`).
- Nomes de classes em **PascalCase**.
- Enums em **UPPER_CASE**.
- Exportacoes nomeadas (`export const`, `export function`, `export class`) — nunca `export default` salvo em paginas Next.js.

### Backend (NestJS — `apps/api`)
- Arquitetura Clean: toda logica de negocio fica no **Service**. O **Controller** apenas recebe, valida com DTO e delega.
- Nunca importar um Service de outro modulo diretamente — usar o sistema de exports/imports do NestJS.
- Todos os inputs validados com `class-validator` + `ValidationPipe` global.
- Todos os endpoints documentados com decorators Swagger (`@ApiTags`, `@ApiOperation`, `@ApiResponse`).
- Todo endpoint protegido com `@UseGuards(JwtAuthGuard)` + `@Roles()` salvo rotas publicas explicitas.
- Estrutura obrigatoria por modulo:
  ```
  *.module.ts
  *.controller.ts
  *.controller.spec.ts    <- Teste unitario (TDD: escrito ANTES do controller)
  *.service.ts
  *.service.spec.ts       <- Teste unitario (TDD: escrito ANTES do service)
  dto/
    create-*.dto.ts
    update-*.dto.ts
  ```

### Frontend (Next.js — `apps/web`)
- Paginas sao **Server Components** por padrao.
- Usar `'use client'` apenas quando necessario (interatividade, hooks de estado/efeito).
- Estilizacao exclusivamente com **Tailwind CSS**. Sem CSS customizado salvo excecoes justificadas e documentadas.
- Componentes com mais de 150 linhas devem ser quebrados em componentes menores.
- Props tipadas com `interface` (nao `type alias`) para objetos.
- Componentes exportados como **named exports**.
- Organizacao de componentes:
  ```
  components/ui/       -> Componentes base (Button, Card, Modal, Input) — sem logica de negocio
  components/admin/    -> Dashboard gerencial
  components/kds/      -> KDS
  components/garcom/   -> Modulo garcom
  components/cliente/  -> Cardapio digital
  ```

### Pacote Compartilhado (`packages/shared`)
- Apenas TypeScript puro. **Nenhuma** dependencia de framework (React, NestJS, Next.js).
- Tudo exportado pelo `index.ts` raiz.
- Tipos espelham os models do Prisma mas **sem dependencia do Prisma**.
- Usar `interface` para objetos, enums para status.
- Funcoes utilitarias devem ser puras (sem side effects) e testadas unitariamente.

### Banco de Dados (Prisma)
- Nomes de tabela em **snake_case plural** via `@@map` (ex: `@@map("order_items")`).
- Campos em **camelCase** no schema.
- Enums em **UPPER_CASE**.
- Toda alteracao no banco via `prisma migrate dev` — nunca alterar manualmente.
- O schema em `apps/api/prisma/schema.prisma` e a fonte de verdade da modelagem.

### Storage de Arquivos (Imagens)
- Abstrato via **StorageService** com interface unica (`upload`, `delete`, `getUrl`).
- Duas implementacoes: `LocalStorageService` (filesystem) e `S3StorageService` (AWS S3).
- Configuracao via variavel de ambiente `STORAGE_DRIVER=local|s3`.
- Deploy local: arquivos salvos em `/uploads/` dentro do container `api`, com volume Docker mapeado para o host.
- Deploy cloud: arquivos no S3, URLs via CloudFront CDN.
- Imagens de produto: redimensionadas no upload (thumbnail 200px, media 600px, original). Usar `sharp`.
- Formatos aceitos: JPEG, PNG, WebP. Max 5MB por imagem.

### WebSocket (Socket.IO)
- Nomes de eventos sempre importados de `@ochefia/shared/constants/socket-events`.
- O gateway (`events.gateway.ts`) nao contem logica de negocio — chama os Services dos modulos.
- Todo evento emitido deve ter um tipo definido no pacote shared.

### Testes

#### Ferramentas
| Tipo | Ferramenta | Local |
|---|---|---|
| Unitario | Jest | `apps/api/src/**/*.spec.ts`, `packages/shared/src/**/*.spec.ts` |
| Integracao (API) | Jest + Supertest | `apps/api/test/**/*.e2e-spec.ts` |
| E2E (UI) | Playwright | `apps/web/e2e/**/*.spec.ts` |
| Contrato | Jest | `apps/api/test/contracts/**/*.spec.ts` |

#### Testes Unitarios (Jest)
- Testar **services**, **utils**, **funcoes puras**, **validators**, **DTOs**.
- Mockar dependencias externas (Prisma, Redis, Storage, WebSocket gateway).
- Cada service tem seu `*.spec.ts` no mesmo diretorio.
- Cobertura minima: toda funcao publica de service/util deve ter teste.
- Exemplos do que testar:
  - `OrderService.calculateBill()` divide valores corretamente entre pessoas.
  - `formatBRL()` formata centavos para reais.
  - `SessionService.validateOtp()` rejeita codigo expirado.
  - DTO validation: campos obrigatorios, tipos errados, valores invalidos.

#### Testes de Integracao (Supertest)
- Testar **endpoints reais** com banco de teste (PostgreSQL de teste, limpo entre suites).
- Testar **fluxos completos** de negocio que cruzam modulos.
- Usar seed de teste dedicado (nao o seed de dev).
- Exemplos do que testar:
  - POST `/orders` com sessao valida -> GET `/session/:token/bill` retorna divisao correta.
  - POST `/session/:token/people` adiciona pessoa -> POST `/orders` com `personIds` -> valores divididos.
  - POST `/auth/login` com credenciais invalidas -> 401.
  - PATCH `/session/:token/service-charge` por garcom -> taxa removida do bill.
  - Fluxo completo: register -> login -> criar mesa -> abrir sessao -> verificar WhatsApp -> fazer pedido -> ver conta.

#### Testes E2E (Playwright)
- Testar **fluxos de usuario reais** no navegador.
- Rodar contra `api` e `web` em modo dev ou preview.
- Exemplos do que testar:
  - **Fluxo cliente:** abrir URL da mesa -> tela WhatsApp -> verificar OTP -> ver cardapio -> adicionar pessoas -> selecionar pessoas por item -> enviar pedido -> ver "Meus Pedidos" -> ver "Conta" com divisao.
  - **Fluxo admin:** login -> dashboard carrega metricas -> navegar para mesas -> criar mesa -> ver QR code.
  - **Fluxo KDS:** login como KITCHEN -> tela KDS carrega -> novo pedido aparece -> marcar como "Pronto".
  - **Fluxo garcom:** login como WAITER -> ver chamados -> marcar como resolvido -> desabilitar taxa de servico.

#### Testes de Contrato
- Garantir que os **tipos do `@ochefia/shared`** batem com as **responses reais da API**.
- Se a API retorna um campo novo ou remove um campo, o teste quebra.
- Protege contra divergencia entre frontend e backend.

#### Estrutura de Arquivos de Teste
```
apps/api/
├── src/
│   └── modules/
│       └── orders/
│           ├── orders.service.ts
│           ├── orders.service.spec.ts      <- Unitario
│           ├── orders.controller.ts
│           └── orders.controller.spec.ts   <- Unitario
├── test/
│   ├── orders.e2e-spec.ts                  <- Integracao
│   ├── session-flow.e2e-spec.ts            <- Integracao (fluxo completo)
│   ├── contracts/
│   │   └── order-response.spec.ts          <- Contrato
│   └── helpers/
│       ├── test-app.ts                     <- Setup NestJS de teste
│       ├── test-db.ts                      <- Reset do banco entre testes
│       └── test-auth.ts                    <- Helper para gerar JWT de teste
apps/web/
├── e2e/
│   ├── client-flow.spec.ts                 <- E2E
│   ├── admin-flow.spec.ts                  <- E2E
│   ├── kds-flow.spec.ts                    <- E2E
│   └── garcom-flow.spec.ts                 <- E2E
├── playwright.config.ts
packages/shared/
├── src/
│   └── utils/
│       ├── format-brl.ts
│       └── format-brl.spec.ts              <- Unitario
```

#### Comandos
```bash
# Unitarios + Integracao (API)
pnpm --filter @ochefia/api test          # Jest watch
pnpm --filter @ochefia/api test:cov      # Com cobertura
pnpm --filter @ochefia/api test:e2e      # Supertest (integracao)

# Unitarios (shared)
pnpm --filter @ochefia/shared test

# E2E (Playwright)
pnpm --filter @ochefia/web test:e2e      # Headless
pnpm --filter @ochefia/web test:e2e:ui   # Com navegador visivel (debug)

# Todos
pnpm test                                # Roda tudo via Turborepo
```

---

## Seguranca

- **Multi-tenant:** Middleware injeta `restaurantId` do JWT em toda query. PostgreSQL RLS como segunda camada.
- **Sessao do cliente (publica):** Nao usa JWT. Usa token unico da `TableSession` na URL + cookie. Sem login do cliente no MVP. Validado por IP + cookie como camada extra.
- **Identificacao via WhatsApp:** Ao abrir a sessao, cliente informa numero -> sistema envia OTP via WhatsApp -> confirma -> salva `phone` + `phoneVerified = true` na sessao. Nenhuma acao automatica usa o numero alem do armazenamento.
- **Autenticacao:** JWT com access token (15min) + refresh token (7 dias). Refresh token armazenado em httpOnly cookie.
- **Rate Limiting:** Por IP via `express-rate-limit`.
- **Validacao:** `class-validator` + `ValidationPipe` global.
- **LGPD:** Dados sensiveis criptografados. Endpoint de exclusao de dados do cliente obrigatorio.
- **HTTPS/TLS 1.3** obrigatorio em producao.
- **WAF:** Web Application Firewall contra injecao SQL, XSS e DDoS.

---

## Observabilidade (Logs)

### Estrategia
- **Winston** como biblioteca de log em todo o backend (NestJS).
- Output em **JSON estruturado** — facilita parsing e busca.
- Sem dependencia de servicos externos (ELK, Grafana). O sistema deve funcionar 100% offline.
- Rotacao de arquivos de log com `winston-daily-rotate-file` (ex: manter 30 dias, max 500MB).

### Correlation ID
- Toda request HTTP recebe um **correlationId** unico (UUID v4) via middleware.
- O correlationId e propagado para todos os services, repositorios e eventos WebSocket chamados dentro daquela request.
- Logs incluem sempre: `timestamp`, `level`, `correlationId`, `module`, `message`, `meta` (dados extras).
- Em caso de erro, o correlationId permite rastrear toda a cadeia de execucao em qualquer modulo.

### Formato do Log
```json
{
  "timestamp": "2026-03-06T14:30:00.000Z",
  "level": "error",
  "correlationId": "a1b2c3d4-e5f6-...",
  "module": "orders",
  "message": "Falha ao criar pedido",
  "meta": { "sessionToken": "abc123", "error": "Product not found" }
}
```

### Niveis
- `error` — Falhas que impedem a operacao.
- `warn` — Situacoes inesperadas mas recuperaveis.
- `info` — Eventos de negocio relevantes (pedido criado, pagamento confirmado, sessao aberta).
- `debug` — Detalhes tecnicos (queries, payloads). Desabilitado em producao por padrao.

### Onde os logs ficam
- **Deploy local:** Arquivos em `/var/log/ochefia/` dentro do container `api`, com volume Docker mapeado para o host.
- **Deploy cloud:** Stdout/stderr dos containers, capturados pelo CloudWatch (AWS) ou similar.

### Futuro (nao implementar agora)
- Alertas automaticos (ex: muitos erros em X minutos -> notificacao).
- Painel de super admin para visualizar logs de todas as instalacoes (requer "phone home" dos clientes locais).

---

## Multi-Tenancy

Toda entidade do banco esta vinculada a um `Restaurant` por `restaurantId`. O middleware de tenant injeta o `restaurantId` do JWT autenticado em toda query. PostgreSQL RLS garante isolamento como segunda camada de protecao.

Sessoes de clientes (publicas) sao isoladas pelo `token` unico da `TableSession` — sem JWT, sem autenticacao, mas a sessao so acessa dados daquela mesa/restaurante.

---

## Modelo de Deploy

O OChefia pode ser instalado de 3 formas diferentes. **Todo o sistema deve ser self-contained** — sem dependencia obrigatoria de servicos externos para funcionar.

### Deploy Local (On-Premise)
- Os 4 containers (`api`, `web`, `postgres`, `redis`) rodam na maquina do cliente (ex: um PC no bar).
- Funciona 100% offline na rede local (WiFi).
- Clientes acessam o cardapio digital pelo WiFi do estabelecimento.
- Garcom usa PWA no celular conectado ao mesmo WiFi.
- Fotos de produtos armazenadas no filesystem local.
- Logs em arquivos locais com rotacao automatica.
- Atualizacoes do sistema via script ou Docker pull manual.

### Deploy Cloud (AWS)
- `api` e `web` em containers (ECS/EKS). `postgres` no RDS. `redis` no ElastiCache.
- Fotos de produtos no S3 + CloudFront CDN.
- Logs via CloudWatch.
- Acesso de qualquer lugar via internet.

### Deploy Hibrido (definicao futura)
- Sistema roda local mas sincroniza dados/logs com a cloud quando tem internet.
- Detalhes a definir em sprint futura.

### Super Admin / Painel de Controle (futuro)
- Tela exclusiva da equipe OChefia (nao acessivel por clientes/restaurantes).
- Gerenciar todas as instalacoes: lista de clientes, tipo de deploy, versao, status (online/offline), ultimo heartbeat.
- Visualizar logs remotamente (clientes locais enviam logs via "phone home" quando conectados).
- Gestao de licencas e planos.
- **Nao faz parte do MVP** — implementar quando houver multiplos clientes ativos.

---

## Roles e Permissoes

```
OWNER    -> Acesso total
MANAGER  -> Admin sem configuracoes financeiras sensiveis
WAITER   -> Modulo garcom + chamados
KITCHEN  -> KDS (cozinha)
BAR      -> KDS (bar)
```

---

## Roteamento KDS

- Produtos com `destination: KITCHEN` -> tela da cozinha.
- Produtos com `destination: BAR` -> tela do bar.
- Produtos com `destination: BOTH` -> ambas as telas.

---

## Eventos WebSocket (Socket.IO)

Arquivo de referencia: `packages/shared/src/constants/socket-events.ts`

```typescript
export const SOCKET_EVENTS = {
  // Cliente -> Servidor
  ORDER_CREATED: 'order:created',           // Cliente fez um novo pedido
  CALL_REQUEST: 'call:request',             // Cliente apertou "O Chefia"
  PAYMENT_INITIATED: 'payment:initiated',   // Cliente iniciou pagamento

  // Servidor -> KDS
  KDS_NEW_ORDER: 'kds:new-order',           // Novo pedido na fila
  KDS_ORDER_CANCELLED: 'kds:order-cancelled',

  // KDS -> Servidor
  KDS_STATUS_UPDATE: 'kds:status-update',   // Cozinha mudou status (preparing/ready)

  // Servidor -> Garcom
  WAITER_ORDER_READY: 'waiter:order-ready', // Prato pronto pra retirar
  WAITER_CALL: 'waiter:call',               // Cliente chamou
  WAITER_NEW_ORDER: 'waiter:new-order',     // Novo pedido na mesa dele

  // Servidor -> Cliente
  CLIENT_ORDER_UPDATE: 'client:order-update',     // Status do pedido mudou
  CLIENT_SESSION_UPDATE: 'client:session-update',  // Conta atualizada

  // Servidor -> Admin
  ADMIN_TABLE_UPDATE: 'admin:table-update',        // Status de mesa mudou
  ADMIN_METRICS_UPDATE: 'admin:metrics-update',    // Metricas atualizaram

  // Estoque
  STOCK_ALERT_TRIGGERED: 'stock:alert-triggered',
  STOCK_UPDATED: 'stock:updated',
} as const;
```

---

## Endpoints da API (RESTful)

Base URL: `/api/v1`

### Auth
| Metodo | Rota | Descricao |
|---|---|---|
| POST | `/auth/register` | Registro de restaurante + owner |
| POST | `/auth/login` | Login -> retorna JWT |
| POST | `/auth/refresh` | Refresh token |
| GET | `/auth/me` | Dados do usuario logado |

### Restaurant
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/restaurants/:slug` | Dados publicos do restaurante |
| PUT | `/restaurants/:id` | Atualizar dados (OWNER/MANAGER) |
| GET | `/restaurants/:id/settings` | Configuracoes |
| PUT | `/restaurants/:id/settings` | Atualizar configuracoes |

### Tables
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/tables` | Listar mesas do restaurante |
| POST | `/tables` | Criar mesa |
| PUT | `/tables/:id` | Atualizar mesa |
| DELETE | `/tables/:id` | Remover mesa |
| POST | `/tables/:id/open` | Abrir sessao da mesa |
| POST | `/tables/:id/close` | Fechar sessao (encerrar conta) |
| GET | `/tables/:id/session` | Sessao ativa da mesa |

### Table Session (acesso publico via token)
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/session/:token` | Dados da sessao (pedidos, conta) |
| POST | `/session/:token/join` | Cliente entrar na sessao |
| POST | `/session/:token/phone` | Enviar OTP via WhatsApp para o numero informado |
| POST | `/session/:token/phone/verify` | Confirmar OTP e salvar numero verificado na sessao |
| GET | `/session/:token/people` | Listar pessoas cadastradas na sessao |
| POST | `/session/:token/people` | Adicionar pessoa na mesa (body: `{ name }`) |
| DELETE | `/session/:token/people/:personId` | Remover pessoa da mesa |
| PATCH | `/session/:token/service-charge` | Desabilitar/habilitar taxa de servico (garcom only) |
| GET | `/session/:token/bill` | Conta detalhada com divisao por pessoa + taxa de servico |

### Menu
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/menu/:restaurantSlug` | Cardapio publico (com cache Redis) |
| GET | `/menu/categories` | Listar categorias (admin) |
| POST | `/menu/categories` | Criar categoria |
| PUT | `/menu/categories/:id` | Atualizar categoria |
| GET | `/menu/products` | Listar produtos (admin) |
| POST | `/menu/products` | Criar produto |
| PUT | `/menu/products/:id` | Atualizar produto |
| PATCH | `/menu/products/:id/availability` | Toggle disponibilidade |

### Upload (Imagens)
| Metodo | Rota | Descricao |
|---|---|---|
| POST | `/upload/product-images` | Upload de imagens de produto (multipart, max 5 por request) |
| DELETE | `/upload/product-images/:imageId` | Remover imagem de produto |

### Orders
| Metodo | Rota | Descricao |
|---|---|---|
| POST | `/orders` | Criar pedido (via sessao token). Cada item inclui `personIds[]` (obrigatorio, pelo menos 1) |
| GET | `/orders` | Listar pedidos (admin, filtros) |
| GET | `/orders/:id` | Detalhes do pedido |
| PATCH | `/orders/:id/status` | Atualizar status (KDS/garcom) |
| PATCH | `/orders/items/:id/status` | Atualizar status de item individual |
| PATCH | `/orders/items/:id/people` | Reatribuir pessoas a um item (body: `{ personIds[] }`) |

### Payments
| Metodo | Rota | Descricao |
|---|---|---|
| POST | `/payments` | Iniciar pagamento individual por pessoa (body: `{ sessionToken, personId }`) |
| GET | `/payments/:id/status` | Verificar status |
| POST | `/payments/pix/webhook` | Webhook de confirmacao Pix |
| GET | `/payments/session/:token` | Listar pagamentos da sessao (quem ja pagou, quem falta) |

### Call Requests
| Metodo | Rota | Descricao |
|---|---|---|
| POST | `/calls` | Criar chamado (cliente) |
| GET | `/calls` | Listar chamados abertos (garcom) |
| PATCH | `/calls/:id/acknowledge` | Garcom viu |
| PATCH | `/calls/:id/resolve` | Garcom resolveu |

### Stock
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/stock/ingredients` | Listar ingredientes |
| POST | `/stock/ingredients` | Criar ingrediente |
| PUT | `/stock/ingredients/:id` | Atualizar estoque |
| GET | `/stock/alerts` | Ingredientes abaixo do minimo |

### Dashboard
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/dashboard/overview` | Metricas gerais em tempo real |
| GET | `/dashboard/revenue` | Faturamento por periodo |
| GET | `/dashboard/popular-items` | Itens mais vendidos |

### Staff
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/staff` | Listar funcionarios |
| POST | `/staff` | Criar funcionario |
| POST | `/staff/invite` | Enviar convite (log no console em dev) |
| POST | `/staff/accept` | Aceitar convite e criar conta (publico) |
| PUT | `/staff/:id` | Atualizar funcionario |
| DELETE | `/staff/:id` | Desativar funcionario |

---

## Design System

### Paleta de Cores

| Token | Hex | Tailwind | Uso |
|---|---|---|---|
| **Primaria** | `#EA580C` | `orange-600` | Botoes de acao, destaques, CTAs, links ativos |
| **Primaria hover** | `#C2410C` | `orange-700` | Hover de botoes |
| **Primaria light** | `#FFF7ED` | `orange-50` | Backgrounds sutis, badges |
| **Neutra escura** | `#111827` | `gray-900` | Sidebar, headers, textos principais |
| **Neutra media** | `#6B7280` | `gray-500` | Textos secundarios, placeholders |
| **Neutra clara** | `#F9FAFB` | `gray-50` | Fundos de pagina (admin, garcom) |
| **Sucesso** | `#16A34A` | `green-600` | Pronto, entregue, confirmado, online |
| **Atencao** | `#CA8A04` | `yellow-600` | Preparando, alerta, atenção |
| **Erro** | `#DC2626` | `red-600` | Atrasado, erro, urgente, offline |
| **Info** | `#2563EB` | `blue-600` | Na fila, informativo, links |
| **Branco** | `#FFFFFF` | `white` | Cards, modais, fundos de input |

### Tom por Modulo

| Modulo | Fundo | Tema | Motivo |
|---|---|---|---|
| Cliente (cardapio) | Branco (`white`) | Claro, clean | Foco nas fotos, leitura facil no celular |
| Admin (dashboard) | Cinza claro (`gray-50`) + sidebar escura (`gray-900`) | Profissional | Contraste para metricas e dados |
| KDS (cozinha/bar) | Escuro (`gray-900`) | Dark mode | Cozinha com pouca luz, alto contraste |
| Garcom | Branco (`white`) | Limpo, rapido | Mobile, legivel no sol |
| Login | Escuro (`gray-900`) | Impactante | Tela de entrada |

### Tipografia
- **Font:** Inter (via Google Fonts) com fallback `system-ui, -apple-system, sans-serif`.
- **Tamanhos:** seguir escala do Tailwind (`text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`).
- **Peso:** `font-normal` para corpo, `font-medium` para labels, `font-semibold` para titulos, `font-bold` para destaques.

### Componentes Base (referencia visual)
- **Botao primario:** bg-orange-600, text-white, rounded-lg, hover:bg-orange-700, px-4 py-2.
- **Botao secundario:** border border-gray-300, text-gray-700, rounded-lg, hover:bg-gray-50.
- **Card:** bg-white, rounded-xl, shadow-sm, border border-gray-100, p-4.
- **Input:** border border-gray-300, rounded-lg, px-3 py-2, focus:ring-2 focus:ring-orange-500.
- **Badge status:** rounded-full, px-2 py-0.5, text-xs, font-medium + cor do status.
- **Modal:** overlay bg-black/50, card centralizado bg-white rounded-xl shadow-xl max-w-md.

### Personalizacao de Cores por Restaurante (Theming)

Cada restaurante pode personalizar as cores do **modulo cliente (cardapio digital)** — que e a cara do estabelecimento para o consumidor. Os modulos internos (admin, KDS, garcom) mantem o design system padrao do OChefia.

#### Cores configuraveis (tela Settings do admin)
| Variavel | Descricao | Padrao |
|---|---|---|
| `--color-primary` | Botoes de acao, CTAs, destaques | `#EA580C` (orange-600) |
| `--color-primary-hover` | Hover de botoes | Calculado automaticamente (10% mais escuro) |
| `--color-secondary` | Headers, badges, detalhes | `#111827` (gray-900) |
| `--color-background` | Fundo da tela do cliente | `#FFFFFF` (white) |
| `--color-text` | Texto principal | Calculado automaticamente (contraste com background) |
| Logo | Imagem do restaurante | Texto do nome como fallback |

#### Temas Prontos
O restaurante pode escolher um tema pronto ou selecionar "Personalizado" e usar color picker livre.

| Tema | Primaria | Secundaria | Fundo | Tom |
|---|---|---|---|---|
| **Classico** (padrao) | `#EA580C` orange | `#111827` gray-900 | `#FFFFFF` white | Clean, universal |
| **Escuro** | `#F97316` orange-400 | `#F9FAFB` gray-50 | `#111827` gray-900 | Sofisticado, bar noturno |
| **Rustico** | `#92400E` amber-800 | `#451A03` amber-950 | `#FFFBEB` amber-50 | Churrascaria, comida caseira |
| **Moderno** | `#7C3AED` violet-600 | `#1E1B4B` indigo-950 | `#FFFFFF` white | Gastrobar, contemporaneo |
| **Tropical** | `#059669` emerald-600 | `#064E3B` emerald-900 | `#FFFFFF` white | Praia, acai, sucos |
| **Personalizado** | Color picker | Color picker | Color picker | Livre |

#### Implementacao tecnica
- As cores ficam na tabela `RestaurantSettings` no banco (`themeName`, `primaryColor`, `secondaryColor`, `backgroundColor`).
- A API retorna as cores no endpoint `GET /restaurants/:slug` (publico) junto com os dados do restaurante.
- O frontend do cliente injeta as cores como **CSS custom properties** no `:root` ao carregar a pagina.
- Se o restaurante nao definiu nada, usa o tema "Classico" (padrao).
- Preview em tempo real na tela de Settings: ao trocar cor/tema, o admin ve um mini-preview de como o cardapio ficara.
- **Validacao de contraste:** ao escolher cores custom, o sistema avisa se o contraste texto/fundo nao atende WCAG AA.

### Principios de UI
- **Mobile-first:** telas do cliente e garcom sao 100% mobile. Admin e KDS sao tablet/desktop.
- **Minimalista:** pouco texto, muita acao. O cardapio deve parecer um app de delivery premium.
- **Fotos grandes:** no cardapio, a foto do produto e o elemento principal do card.
- **Feedback visual:** toda acao do usuario deve ter resposta imediata (toast, loading, transicao).
- **Acessibilidade basica:** contraste minimo WCAG AA, botoes com area de toque minima 44x44px, labels nos inputs.

---

## Fase Atual

**Sprint P — Prototipos HTML**

Criar prototipos funcionais em HTML + CSS + JS vanilla para todas as telas do sistema. Validar interface grafica, fluxos e cores antes de qualquer codigo de producao.

Proximo: Sprint 0 (Scaffolding) -> Sprint 1-2 (Fundacao).

---

## Roadmap de Sprints

### Sprint P — Prototipos HTML (antes de tudo)
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
│   ├── cardapio-admin.html     <- CRUD categorias e produtos (com upload de fotos)
│   ├── estoque.html            <- Ingredientes e alertas
│   ├── staff.html              <- Gestao de equipe + convites
│   └── settings.html           <- Configuracoes (taxa de servico, dados do restaurante, tema/cores com preview)
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
- [ ] Telas do **admin** — login -> dashboard -> mesas -> cardapio CRUD -> estoque -> staff -> settings.
- [ ] Telas do **KDS** — cozinha e bar com fila, cores de status, temporizadores.
- [ ] Telas do **garcom** — mesas -> chamados -> detalhe da mesa -> comanda.
- [ ] Navegacao funcional entre todas as telas (links).
- [ ] Interacoes JS: adicionar ao carrinho, selecionar pessoas, trocar abas, mudar status no KDS.
- [ ] Responsivo: cliente e garcom em mobile (375px), admin e KDS em desktop/tablet (1024px+).
- [ ] Tela de **Settings** com selecao de tema + color picker + preview do cardapio.
- [ ] Prototipos do cliente devem demonstrar pelo menos 2 temas diferentes (Classico + Escuro) para validar que o theming funciona.
- [ ] Validacao visual aprovada pelo usuario antes de prosseguir para Sprint 0.

### Sprint 0 — Scaffolding e Documentacao Estrutural
- [ ] Criar toda a estrutura de pastas do monorepo com `README.md` em cada pasta relevante.

### Sprint 1-2 — Fundacao
- [ ] Setup monorepo Turborepo + pnpm.
- [ ] NestJS com estrutura de modulos, Prisma, PostgreSQL.
- [ ] Docker Compose rodando local.
- [ ] Modulo auth completo (register, login, JWT, roles).
- [ ] CRUD de restaurante e mesas.
- [ ] Seed com dados de teste.

### Sprint 3-4 — Cardapio e Pedidos
- [ ] CRUD de categorias, produtos, adicionais.
- [ ] Cache do cardapio no Redis.
- [ ] Endpoint publico do cardapio por slug.
- [ ] Frontend: tela do cardapio digital (Next.js).
- [ ] Carrinho e criacao de pedido.
- [ ] Sessao de mesa (token na URL + cookie).
- [ ] Coleta e verificacao de WhatsApp via OTP (tela obrigatoria ao abrir a sessao).

### Sprint 5-6 — KDS e Tempo Real
- [ ] WebSocket gateway (Socket.IO).
- [ ] Roteamento de pedidos (cozinha vs. bar).
- [ ] Frontend: tela KDS com fila, cores e temporizadores.
- [ ] Fluxo completo: cliente pede -> KDS recebe -> cozinha prepara -> marca pronto.

### Sprint 7-8 — Garcom, Chamados, Staff e Estoque
- [ ] Modulo garcom (comanda mobile).
- [ ] Botao "O Chefia" (chamados com tipo).
- [ ] Notificacoes para o garcom (pedido pronto, chamado de mesa).
- [ ] Frontend: tela do garcom (PWA).
- [ ] CRUD de ingredientes e alertas de estoque.
- [ ] Gestao de equipe com convites.
- [ ] Testes e2e (Supertest + Playwright).

### Sprint 9 — UI/UX e Componentes Base
- [ ] Biblioteca de componentes base (Button, Input, Badge, Modal, Toggle, Skeleton, Spinner).
- [ ] Toast notifications (sonner).
- [ ] Skeleton loading em todas as telas.
- [ ] Refactor KDS e admin para usar componentes base.

### Sprint 10 — Layout e Navegacao
- [ ] AdminSidebar fixa com navegacao, avatar e role.
- [ ] Layout admin com sidebar + mobile top bar.
- [ ] Redesign da pagina de login.
- [ ] KDS layout com indicador de conexao WebSocket.

### Sprint 11 — QR Code Pix, Relatorios, Notificacoes Push
- [ ] QR Code Pix com baixa automatica.
- [ ] Relatorios de faturamento e itens populares.
- [ ] Notificacoes push para o garcom.
- [ ] Racha de conta no frontend.

### Sprint 12+ — Dashboard Avancado e Otimizacoes
- [ ] Dashboard gerencial avancado (mapa de mesas visual, graficos).
- [ ] Controle de estoque com baixa automatica por pedido.
- [ ] Alertas de estoque minimo em tempo real.

### Sprint 13+ — Fase 2 (Plataforma) — NAO IMPLEMENTAR ATE AVISO EXPLICITO
**Apenas referencia arquitetural. Nao iniciar ate o usuario pedir.**
- [ ] App nativo com Capacitor (iOS/Android).
- [ ] Cadastro/login do consumidor final.
- [ ] Tela "Explorar" com estabelecimentos.
- [ ] Lotacao em tempo real, reserva de mesa, pre-pedido.
- [ ] Programa de fidelidade.
- [ ] Emissao de NFC-e/SAT (integracao com Focus NFe ou similar).
