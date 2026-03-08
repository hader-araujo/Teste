# Deploy — AWS Cloud

O OChefia roda **exclusivamente na cloud (AWS)**. Nao ha opcao de deploy local ou hibrido.

## Infraestrutura AWS

| Servico | Uso |
|---|---|
| **ECS Fargate** | Containers `api` e `web` (serverless, sem gerenciar EC2) |
| **RDS PostgreSQL** | Banco de dados com backups automaticos, Multi-AZ |
| **RDS Proxy** | Connection pooling para Prisma/containers (evita esgotar conexoes do RDS) |
| **ElastiCache Redis** | Cache de cardapio, sessoes e metricas pre-calculadas. Snapshot habilitado. |
| **S3 + CloudFront** | Imagens de produtos (upload -> S3, entrega via CDN) |
| **SQS** | Filas para jobs assincronos (resize de imagem, envio OTP, processamento webhook Pix) |
| **Route 53** | DNS e dominio |
| **ACM** | Certificados SSL/TLS (gratuito, renovacao automatica) |
| **CloudWatch** | Logs, metricas e alarmes |
| **X-Ray** | Distributed tracing (APM) para diagnosticar latencia |
| **Secrets Manager** | Credenciais (JWT secret, DB password, API keys) |
| **WAF** | Protecao contra SQL injection, XSS, DDoS |
| **ECR** | Registro de imagens Docker |

## Arquitetura

```
Internet -> Route 53 -> CloudFront (CDN)
                     -> ALB -> ECS Fargate (api + web)
                                  -> RDS PostgreSQL
                                  -> ElastiCache Redis
                                  -> S3 (imagens)
```

- **HTTPS/TLS 1.3** obrigatorio (ACM + ALB).
- Containers rodam em **subnets privadas**. Apenas o ALB e publico.
- RDS e ElastiCache em subnets privadas, sem acesso externo.
- **RDS Proxy** entre containers e RDS — essencial para connection pooling com Prisma em ambiente Fargate (cada container abre multiplas conexoes).
- S3 acessado via CloudFront (origin access control).

## Health Checks

| Endpoint | Uso |
|---|---|
| `GET /health` | Health check basico (API respondendo) — usado pelo ALB |
| `GET /health/ready` | Readiness check (banco + Redis conectados) — usado pelo ECS |

- ALB health check aponta para `/health` com intervalo de 30s.
- ECS health check aponta para `/health/ready`.
- Ambos retornam HTTP 200 quando saudavel, 503 quando nao.

## Auto-Scaling

- **ECS Service Auto Scaling** com target tracking:
  - CPU medio > 70% -> scale out.
  - CPU medio < 30% -> scale in.
  - Minimo: 2 tasks (alta disponibilidade). Maximo: 10 tasks.
- **Cooldown:** 60s para scale out, 300s para scale in.
- Considerar scaling por request count no ALB para picos de horario (almoco/jantar).

## Graceful Shutdown

- Containers devem tratar `SIGTERM` para:
  - Parar de aceitar novas requests.
  - Drenar conexoes WebSocket ativas (30s de grace period).
  - Fechar conexoes com banco e Redis.
- ECS `deregistrationDelay` no target group: 30 segundos.

## Filas Assincronas (SQS)

Operacoes pesadas ou com dependencias externas devem ser processadas via fila:

| Fila | Uso |
|---|---|
| `ochefia-image-resize` | Resize de imagens apos upload (Sharp) |
| `ochefia-otp-send` | Envio de OTP via WhatsApp API |
| `ochefia-pix-process` | Processamento de confirmacoes webhook Pix |

- **Dead Letter Queue (DLQ)** para cada fila — mensagens que falharam 3x vao para DLQ para analise.
- Worker pode rodar como task separada no ECS ou processar inline na API (Bull/Redis como alternativa ao SQS em dev).

## Ambientes

| Ambiente | Uso |
|---|---|
| `production` | Producao real |
| `staging` | Testes pre-producao |
| `development` | Docker Compose local para desenvolvimento (postgres 5433, redis 6380) |

## Variaveis de Ambiente

Gerenciadas via **AWS Secrets Manager** em producao. `.env` local apenas para desenvolvimento.

Variaveis principais:
- `DATABASE_URL` — Connection string PostgreSQL (via RDS Proxy)
- `REDIS_URL` — Connection string Redis (ElastiCache)
- `JWT_SECRET` — Segredo para tokens JWT
- `S3_BUCKET` — Bucket para imagens
- `CLOUDFRONT_URL` — URL do CDN
- `WHATSAPP_API_KEY` — API para envio de OTP
- `PIX_WEBHOOK_SECRET` — Segredo para validar assinatura do webhook Pix
- `SQS_IMAGE_RESIZE_URL` — URL da fila SQS de resize
- `SQS_OTP_SEND_URL` — URL da fila SQS de OTP
- `SQS_PIX_PROCESS_URL` — URL da fila SQS de Pix

## CI/CD Pipeline (GitHub Actions)

Pipeline automatizado para garantir qualidade e deploys seguros:

### Pull Request (CI)
- **Trigger:** todo PR para `main` ou `develop`.
- **Steps:**
  1. `pnpm install --frozen-lockfile`
  2. `pnpm lint` (ESLint + Prettier check)
  3. `pnpm audit --audit-level=high` (dependency scanning)
  4. `pnpm --filter @ochefia/shared build`
  5. `pnpm test` (unit + integration via Turborepo)
  6. Upload de coverage report (Codecov ou similar)
- **Branch protection:** PR so pode ser mergeado com CI verde. Minimo 1 approval.
- **Checks obrigatorios:** lint, test, audit.

### Deploy Staging (CD)
- **Trigger:** merge para `develop`.
- **Steps:**
  1. CI completo (mesmos steps acima).
  2. Build das imagens Docker (`api` + `web`).
  3. Push para ECR.
  4. Deploy via ECS service update (rolling update).
  5. Smoke test automatico (`/health/ready` retorna 200).
- **Rollback:** se smoke test falha, reverte para task definition anterior.

### Deploy Production (CD)
- **Trigger:** merge para `main` (manual ou via release tag).
- **Steps:**
  1. CI completo.
  2. Testes e2e (Playwright) contra staging.
  3. Build + push ECR com tag de versao.
  4. Deploy ECS com rolling update (minHealthyPercent: 100, maxPercent: 200).
  5. Smoke test + health check.
- **Rollback automatico:** se health check falha por 3 minutos, ECS reverte.
- **Canary (futuro):** avaliar weighted target groups no ALB para deploys graduais.

## Processamento de Dead Letter Queue (DLQ)

Mensagens que falharam 3x vao para DLQ e precisam de tratamento:

- **Alarme CloudWatch:** DLQ com mensagens > 0 dispara alarme imediato (SNS -> email/Slack).
- **Processo de reprocessamento:**
  1. Engenheiro analisa mensagens na DLQ via console AWS ou CLI.
  2. Identifica causa raiz (bug no worker, servico externo fora, dados invalidos).
  3. Corrige o problema.
  4. Move mensagens da DLQ de volta para fila principal (`RedrivePolicy`).
- **Retencao DLQ:** 14 dias (tempo suficiente para analise antes de perder mensagens).
- **Metricas:** monitorar `ApproximateNumberOfMessagesVisible` em cada DLQ.

## Database Failover e Resiliencia

### RDS Multi-AZ
- RDS PostgreSQL configurado com **Multi-AZ** para alta disponibilidade.
- Failover automatico em caso de falha da instancia primaria (30-60 segundos).
- **Comportamento do app durante failover:**
  - Conexoes existentes sao interrompidas.
  - RDS Proxy absorve parte do impacto (mantem conexoes do lado do app).
  - Prisma deve ter `connect_timeout` configurado (10s) e retry logic.
  - Requests em andamento retornam 503; frontend exibe "Tente novamente em instantes".
  - WebSocket permanece conectado (nao depende do banco diretamente).
- **Backups:** automaticos diarios com retencao de 7 dias + snapshots manuais antes de migrations.

### Connection Pooling
- **RDS Proxy:** obrigatorio em producao. Prisma em Fargate abre muitas conexoes (1 por query concorrente).
- Configurar `connection_limit` no Prisma datasource (ex: 5 por container).
- RDS Proxy gerencia o pool real (max connections = RDS instance class limit).
- Monitorar `DatabaseConnections` no CloudWatch.

## Circuit Breaker — Configuracao

Usar `opossum` para proteger chamadas a dependencias externas:

| Dependencia | Timeout | Threshold | Reset |
|---|---|---|---|
| **WhatsApp API** | 10s | 5 falhas em 30s | 60s |
| **Pix Provider** | 15s | 3 falhas em 60s | 120s |
| **S3 Upload** | 30s | 5 falhas em 60s | 60s |

- **Estado aberto:** retorna erro amigavel imediato + loga `warn`.
- **Estado half-open:** permite 1 request de teste. Se sucesso, fecha o circuit.
- **Metricas:** publicar estado do circuit breaker no CloudWatch (open/closed/half-open).

## State Recovery (Timers e Status)

- **KDS timers:** tempo de preparo baseado em `createdAt` do pedido no banco, **nunca em timer em memoria**. Se container reinicia, KDS recalcula tempo decorrido a partir do timestamp.
- **Pedidos em "preparing":** ao iniciar, worker/KDS registra `startedAt` no banco. Timer no frontend e calculado como `now - startedAt`.
- **Sessoes WebSocket:** ao reconectar, cliente faz fetch REST para sincronizar estado completo (nao depende de replay de eventos).
- **Filas SQS:** mensagens com `visibilityTimeout` adequado (5min para image-resize, 2min para OTP, 5min para Pix). Se worker morre, mensagem volta para fila automaticamente.

## Super Admin — Painel de Controle OChefia

Tela exclusiva da equipe OChefia (role `SUPER_ADMIN`). Nao acessivel por estabelecimentos.

### Gestao de Estabelecimentos
- **Listagem:** todos os estabelecimentos cadastrados com status (ativo, suspenso, inadimplente).
- **Cadastro:** criar novo estabelecimento com dados basicos (nome, slug, CNPJ, responsavel, email, telefone).
- **Cobranca:** campo de valor mensal do plano base. Registrar pagamentos mensais.
- **Status de pagamento:** pago, pendente, atrasado. Historico de pagamentos.
- **Suspensao:** suspender acesso de estabelecimentos inadimplentes.

### Gestao de Modulos
- **Modulo padrao (Fase 1):** incluso no plano base. Cardapio digital, pedidos, KDS, garcom, faturamento.
- **Modulos extras (pagos):** vendidos separadamente. Cada modulo tem valor proprio.
- **Habilitar/desabilitar** modulos por estabelecimento.
- **Definicao de valores** de cada modulo (configuravel globalmente e por estabelecimento).

### Modulos disponiveis (planejado)

| Modulo | Fase | Descricao |
|---|---|---|
| **Padrao** | 1 (MVP) | Cardapio, pedidos, KDS, garcom, faturamento, mesas |
| **Estoque** | 2 | Controle de estoque, ingredientes, baixa automatica, alertas |
| **Explorar** | 2 | App consumidor, listagem, reserva, fidelidade |
| **NFC-e/SAT** | 2 | Emissao fiscal |

Novos modulos serao adicionados conforme demanda.

### Monitoramento
- Visualizar logs de qualquer estabelecimento (via CloudWatch).
- Metricas de uso: pedidos/mes, mesas ativas, usuarios.
- Ultimo acesso de cada estabelecimento.
