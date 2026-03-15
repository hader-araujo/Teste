# Deploy

## Fase 1 — Docker Only

A Fase 1 (MVP) roda **inteiramente em Docker**. Sem serviços AWS. O deploy é feito com Docker Compose num servidor (VPS, EC2 simples, DigitalOcean, etc.) com nginx na frente para HTTPS.

### Containers

| Container | Serviço | Porta |
|---|---|---|
| `ochefia-api` | NestJS (backend + Bull workers) | 3001 |
| `ochefia-web` | Next.js (frontend) | 3000 |
| `ochefia-postgres` | PostgreSQL (banco de dados) | 5433 |
| `ochefia-redis` | Redis (cache + filas Bull + Socket.IO adapter) | 6380 |

**São 4 containers. Nada mais.** Logs não são um container separado — Winston roda dentro do `ochefia-api` e escreve no stdout. Visualizável via `docker compose logs -f api`.

### Arquitetura Fase 1

```
Internet -> nginx (HTTPS/TLS) -> ochefia-web (3000)
                               -> ochefia-api (3001)
                                    -> ochefia-postgres (5433)
                                    -> ochefia-redis (6380)
                                    -> filesystem local (imagens)
```

### Imagens (Storage)
- **Filesystem local** com volume Docker mapeado para o host.
- Interface `StorageService` (`upload`, `delete`, `getUrl`). Implementação: Local.
- `STORAGE_DRIVER=local`. Resize com `sharp` (thumb 200px, media 600px, original). Max 5MB, JPEG/PNG/WebP.
- nginx serve os arquivos estáticos do volume mapeado.

### Filas Assíncronas (Bull + Redis)
- Operações pesadas ou com dependências externas são processadas via **Bull** (biblioteca de filas para Node.js) usando o container Redis.
- Bull roda dentro do próprio container `ochefia-api` (workers em processo).

| Fila | Uso |
|---|---|
| `ochefia-image-resize` | Resize de imagens após upload (Sharp) |
| `ochefia-otp-send` | Envio de OTP via WhatsApp API |
| `ochefia-pix-process` | Processamento de confirmações webhook Pix |
| `ochefia-pix-expiration` | Job periódico: marca pagamentos PIX com status PAYMENT_PENDING há mais de 30min como PAYMENT_EXPIRED. Emite `client:payment-cancelled` com `reason: 'expired'` |
| `ochefia-pickup-escalation` | Verifica itens ORDER_READY sem entrega (job periódico para re-notificação e escalação nível 1/2) |
| `ochefia-claim-timeout` | Bull delayed job: agendado ao fazer claim, delay de `claimTimeout` minutos. Libera claim expirado, re-emite `waiter:order-ready`. Cancelado se garçom marca "Entregue" antes. Notificação `waiter:claim-expiring` 1min antes |
| `ochefia-session-cleanup` | Job periódico: fecha sessões vazias (sem pedidos) abertas há mais de `idleTableThreshold` minutos. Sessões com pedidos nunca são fechadas automaticamente |
| `ochefia-join-renotification` | Processa JoinRequests pendentes a cada 60s: reenvia notificação se não expirou, marca `JOIN_EXPIRED` se passou 5min. Um job, duas responsabilidades coesas |

- **Retries:** 3 tentativas com backoff exponencial. Mensagens que falharam 3x vão para estado `failed` no Bull e podem ser inspecionadas via Bull Dashboard (opcional) ou logs.
- **Persistência:** Bull usa Redis, então filas sobrevivem a restart do container da API (desde que o Redis persista dados).

### Cron Jobs (dentro do container `ochefia-api`)

| Cron | Horário | Descrição |
|---|---|---|
| Anonimização LGPD | Diário, madrugada (ex: 03:00) | Anonimiza dados pessoais de sessões fechadas há mais de 90 dias (`Person.name`, `Person.phone`, `JoinRequest.phoneLast4`) |
| Preenchimento DayTeam | Diário, 04:00 | Auto-preenche equipe do dia a partir do Schedule semanal. Não sobrescreve se admin já editou manualmente |

### Logs e Observabilidade
- **Winston** como biblioteca de log no backend. Output em JSON estruturado para stdout.
- Em produção (Docker): `docker compose logs -f api` para ver logs em tempo real.
- Em desenvolvimento: console formatado (colorido).
- **Correlation ID** em toda request (UUID v4) propagado para services, repositórios e eventos WebSocket.
- Sem CloudWatch, sem X-Ray na Fase 1. Ver `docs/observabilidade.md` para detalhes.

### Health Checks

| Endpoint | Uso |
|---|---|
| `GET /health` | Health check básico (API respondendo) — usado pelo nginx |
| `GET /health/ready` | Readiness check (banco + Redis conectados) — usado pelo Docker healthcheck |

- Docker healthcheck no `docker-compose.yml` aponta para `/health/ready`.
- nginx health check aponta para `/health`.
- Ambos retornam HTTP 200 quando saudável, 503 quando não.

### Variáveis de Ambiente

Gerenciadas via `.env` no servidor. Nunca commitar `.env` no repositório.

Variáveis principais:
- `DATABASE_URL` — Connection string PostgreSQL
- `REDIS_URL` — Connection string Redis
- `JWT_SECRET` — Segredo para tokens JWT
- `STORAGE_DRIVER=local` — Driver de storage (filesystem local)
- `UPLOAD_DIR` — Diretório de upload (volume Docker mapeado)
- `WHATSAPP_API_KEY` — API para envio de OTP
- `PIX_WEBHOOK_SECRET` — Segredo para validar assinatura do webhook Pix

### Deploy em Produção (Fase 1)

1. Servidor com Docker e Docker Compose instalados (VPS, EC2, DigitalOcean, etc.).
2. nginx como reverse proxy com HTTPS (Let's Encrypt / Certbot).
3. `docker compose up -d` para subir os 4 containers.
4. Volume Docker mapeado para imagens (`./uploads:/app/uploads`).
5. Backup do PostgreSQL via `pg_dump` agendado (cron job no host).
6. Backup do volume de imagens via rsync ou similar.

### Graceful Shutdown

- Containers devem tratar `SIGTERM` para:
  - Parar de aceitar novas requests.
  - Drenar conexões WebSocket ativas (30s de grace period).
  - Fechar conexões com banco e Redis.
- Docker Compose `stop_grace_period: 30s`.

### Scaling na Fase 1

- **Vertical:** aumentar recursos do servidor (CPU, RAM).
- Sem auto-scaling horizontal. Se necessário escalar, migrar para Fase 2 (AWS).
- Para a maioria dos restaurantes, um servidor com 2 vCPU / 4GB RAM é suficiente.

---

## CI/CD Pipeline (GitHub Actions)

Pipeline automatizado para garantir qualidade. Funciona igual nas duas fases.

### Pull Request (CI)
- **Trigger:** todo PR para `main` ou `develop`.
- **Steps:**
  1. `pnpm install --frozen-lockfile`
  2. `pnpm lint` (ESLint + Prettier check)
  3. `pnpm audit --audit-level=high` (dependency scanning)
  4. `pnpm --filter @ochefia/shared build`
  5. `pnpm test` (unit + integration via Turborepo)
  6. Upload de coverage report (Codecov ou similar)
- **Branch protection:** PR só pode ser mergeado com CI verde. Mínimo 1 approval.
- **Checks obrigatórios:** lint, test, audit.

### Deploy Produção (Fase 1)
- **Trigger:** merge para `main`.
- **Steps:**
  1. CI completo (mesmos steps acima).
  2. Build das imagens Docker (`api` + `web`).
  3. SSH no servidor + `docker compose pull && docker compose up -d`.
  4. Smoke test automático (`/health/ready` retorna 200).
- **Rollback:** `docker compose down && docker compose up -d` com imagem anterior (tag).

---

## Circuit Breaker — Configuração

Usar `opossum` para proteger chamadas a dependências externas:

| Dependência | Timeout | Threshold | Reset |
|---|---|---|---|
| **WhatsApp API** | 10s | 5 falhas em 30s | 60s |
| **Pix Provider** | 15s | 3 falhas em 60s | 120s |

- **Estado aberto:** retorna erro amigável imediato + loga `warn`.
- **Estado half-open:** permite 1 request de teste. Se sucesso, fecha o circuit.
- **Métricas:** logar estado do circuit breaker (open/closed/half-open) via Winston.

## State Recovery (Timers e Status)

- **KDS timers:** tempo de preparo baseado em `createdAt` do pedido no banco, **nunca em timer em memória**. Se container reinicia, KDS recalcula tempo decorrido a partir do timestamp.
- **Pedidos em "preparing":** ao iniciar, worker/KDS registra `startedAt` no banco. Timer no frontend é calculado como `now - startedAt`.
- **Sessões WebSocket:** ao reconectar, cliente faz fetch REST para sincronizar estado completo (não depende de replay de eventos).
- **Filas Bull:** jobs com retry automático. Se worker morre, job volta para fila quando timeout expira.

---

## Fase 2 — Migração para AWS (após MVP validado)

**NÃO IMPLEMENTAR ATÉ AVISO EXPLÍCITO.** Apenas referência arquitetural para quando o projeto precisar escalar.

### Infraestrutura AWS

| Serviço | Substitui (Fase 1) | Uso |
|---|---|---|
| **ECS Fargate** | Docker Compose no servidor | Containers `api` e `web` (serverless, sem gerenciar EC2) |
| **RDS PostgreSQL** | Container PostgreSQL | Banco com backups automáticos, Multi-AZ |
| **RDS Proxy** | — (novo) | Connection pooling para Prisma/containers |
| **ElastiCache Redis** | Container Redis | Cache, filas, Socket.IO adapter. Snapshot habilitado |
| **S3 + CloudFront** | Filesystem local | Imagens de produtos (upload -> S3, entrega via CDN) |
| **SQS** | Bull + Redis | Filas para jobs assíncronos (substituir Bull por SQS) |
| **Route 53** | DNS do provedor | DNS e domínio |
| **ACM** | Let's Encrypt | Certificados SSL/TLS (gratuito, renovação automática) |
| **CloudWatch** | Winston stdout | Logs, métricas e alarmes |
| **X-Ray** | — (novo) | Distributed tracing (APM) |
| **Secrets Manager** | `.env` no servidor | Credenciais (JWT secret, DB password, API keys) |
| **WAF** | — (novo) | Proteção contra SQL injection, XSS, DDoS |
| **ECR** | — (novo) | Registro de imagens Docker |

### Arquitetura AWS

```
Internet -> Route 53 -> CloudFront (CDN)
                     -> ALB -> ECS Fargate (api + web)
                                  -> RDS PostgreSQL (via RDS Proxy)
                                  -> ElastiCache Redis
                                  -> S3 (imagens)
```

- **HTTPS/TLS 1.3** obrigatório (ACM + ALB).
- Containers rodam em **subnets privadas**. Apenas o ALB é público.
- RDS e ElastiCache em subnets privadas, sem acesso externo.
- **RDS Proxy** entre containers e RDS — essencial para connection pooling com Prisma em ambiente Fargate.
- S3 acessado via CloudFront (origin access control).

### Auto-Scaling

- **ECS Service Auto Scaling** com target tracking:
  - CPU médio > 70% -> scale out.
  - CPU médio < 30% -> scale in.
  - Mínimo: 2 tasks (alta disponibilidade). Máximo: 10 tasks.
- **Cooldown:** 60s para scale out, 300s para scale in.
- Considerar scaling por request count no ALB para picos de horário (almoço/jantar).

### Filas Assíncronas (SQS)

Na Fase 2, substituir Bull por SQS para maior resiliência e scaling:

| Fila | Uso |
|---|---|
| `ochefia-image-resize` | Resize de imagens após upload (Sharp) |
| `ochefia-otp-send` | Envio de OTP via WhatsApp API |
| `ochefia-pix-process` | Processamento de confirmações webhook Pix |

- **Dead Letter Queue (DLQ)** para cada fila — mensagens que falharam 3x vão para DLQ.
- **Alarme CloudWatch:** DLQ com mensagens > 0 dispara alarme imediato (SNS -> email/Slack).
- **Retenção DLQ:** 14 dias.

### Deploy CD (AWS)

#### Deploy Staging
- **Trigger:** merge para `develop`.
- Build das imagens Docker → push para ECR → deploy via ECS rolling update → smoke test.
- **Rollback:** se smoke test falha, reverte para task definition anterior.

#### Deploy Production
- **Trigger:** merge para `main`.
- CI completo → testes e2e (Playwright) contra staging → build + push ECR com tag de versão → deploy ECS rolling update.
- **Rollback automático:** se health check falha por 3 minutos, ECS reverte.

### Database Failover e Resiliência

#### RDS Multi-AZ
- Failover automático em caso de falha (30-60 segundos).
- RDS Proxy absorve parte do impacto.
- Prisma com `connect_timeout` configurado (10s) e retry logic.
- **Backups:** automáticos diários com retenção de 7 dias + snapshots manuais antes de migrations.

#### Connection Pooling
- **RDS Proxy:** obrigatório em produção AWS. Prisma em Fargate abre muitas conexões.
- `connection_limit` no Prisma datasource (ex: 5 por container).
- Monitorar `DatabaseConnections` no CloudWatch.

### Variáveis de Ambiente (AWS)

Gerenciadas via **AWS Secrets Manager**. Variáveis adicionais:
- `DATABASE_URL` — Connection string PostgreSQL (via RDS Proxy)
- `REDIS_URL` — Connection string Redis (ElastiCache)
- `S3_BUCKET` — Bucket para imagens
- `CLOUDFRONT_URL` — URL do CDN
- `STORAGE_DRIVER=s3` — Driver de storage (S3)
- `SQS_IMAGE_RESIZE_URL` — URL da fila SQS de resize
- `SQS_OTP_SEND_URL` — URL da fila SQS de OTP
- `SQS_PIX_PROCESS_URL` — URL da fila SQS de Pix

### Processamento de Dead Letter Queue (DLQ)

- **Alarme CloudWatch:** DLQ com mensagens > 0 dispara alarme imediato.
- **Processo de reprocessamento:**
  1. Engenheiro analisa mensagens na DLQ via console AWS ou CLI.
  2. Identifica causa raiz.
  3. Corrige o problema.
  4. Move mensagens da DLQ de volta para fila principal (`RedrivePolicy`).

---

## Super Admin — Painel de Controle OChefia

Tela exclusiva da equipe OChefia (role `SUPER_ADMIN`). Não acessível por estabelecimentos.

### Gestão de Estabelecimentos
- **Listagem:** todos os estabelecimentos cadastrados com status (ativo, suspenso, inadimplente).
- **Cadastro:** criar novo estabelecimento com dados básicos (nome, slug, CNPJ, responsável, email, telefone).
- **Cobrança:** campo de valor mensal do plano base. Registrar pagamentos mensais.
- **Status de pagamento:** pago, pendente, atrasado. Histórico de pagamentos.
- **Suspensão:** suspender acesso de estabelecimentos inadimplentes.

### Gestão de Módulos
- **Módulo padrão (Fase 1):** incluso no plano base. Cardápio digital, pedidos, KDS, garçom, faturamento.
- **Módulos extras (pagos):** vendidos separadamente. Cada módulo tem valor próprio.
- **Habilitar/desabilitar** módulos por estabelecimento.
- **Definição de valores** de cada módulo (configurável globalmente e por estabelecimento).

### Módulos disponíveis (planejado)

| Módulo | Fase | Descrição |
|---|---|---|
| **Padrão** | 1 (MVP) | Cardápio, pedidos, KDS, garçom, faturamento, mesas |
| **Estoque** | 2+ | Controle de estoque, ingredientes, baixa automática, alertas |
| **Explorar** | 2+ | App consumidor, listagem, reserva, fidelidade |
| **NFC-e/SAT** | 2+ | Emissão fiscal |

### Monitoramento
- Métricas de uso por estabelecimento (pedidos/mês, mesas ativas).
- Último acesso.
- Fase 1: logs via `docker compose logs`. Fase 2: CloudWatch.
