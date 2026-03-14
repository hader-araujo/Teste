# Deploy

## Fase 1 — Docker Only

A Fase 1 (MVP) roda **inteiramente em Docker**. Sem servicos AWS. O deploy e feito com Docker Compose num servidor (VPS, EC2 simples, DigitalOcean, etc.) com nginx na frente para HTTPS.

### Containers

| Container | Servico | Porta |
|---|---|---|
| `ochefia-api` | NestJS (backend + Bull workers) | 3001 |
| `ochefia-web` | Next.js (frontend) | 3000 |
| `ochefia-postgres` | PostgreSQL (banco de dados) | 5433 |
| `ochefia-redis` | Redis (cache + filas Bull + Socket.IO adapter) | 6380 |

**Sao 4 containers. Nada mais.** Logs nao sao um container separado — Winston roda dentro do `ochefia-api` e escreve no stdout. Visualizavel via `docker compose logs -f api`.

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
- Interface `StorageService` (`upload`, `delete`, `getUrl`). Implementacao: Local.
- `STORAGE_DRIVER=local`. Resize com `sharp` (thumb 200px, media 600px, original). Max 5MB, JPEG/PNG/WebP.
- nginx serve os arquivos estaticos do volume mapeado.

### Filas Assincronas (Bull + Redis)
- Operacoes pesadas ou com dependencias externas sao processadas via **Bull** (biblioteca de filas para Node.js) usando o container Redis.
- Bull roda dentro do proprio container `ochefia-api` (workers em processo).

| Fila | Uso |
|---|---|
| `ochefia-image-resize` | Resize de imagens apos upload (Sharp) |
| `ochefia-otp-send` | Envio de OTP via WhatsApp API |
| `ochefia-pix-process` | Processamento de confirmacoes webhook Pix |
| `ochefia-pickup-escalation` | Verifica itens READY sem entrega + timeout de claims (5min) |
| `ochefia-join-renotification` | Reenvia notificação de aprovação de entrada na mesa a cada 60s |

- **Retries:** 3 tentativas com backoff exponencial. Mensagens que falharam 3x vao para estado `failed` no Bull e podem ser inspecionadas via Bull Dashboard (opcional) ou logs.
- **Persistencia:** Bull usa Redis, entao filas sobrevivem a restart do container da API (desde que o Redis persista dados).

### Cron Jobs (dentro do container `ochefia-api`)

| Cron | Horário | Descrição |
|---|---|---|
| Anonimização LGPD | Diário, madrugada (ex: 03:00) | Anonimiza dados pessoais de sessões fechadas há mais de 90 dias (`Person.name`, `Person.phone`, `JoinRequest.phoneLast4`) |
| Preenchimento DayTeam | Diário, 04:00 | Auto-preenche equipe do dia a partir do Schedule semanal. Não sobrescreve se admin já editou manualmente |

### Logs e Observabilidade
- **Winston** como biblioteca de log no backend. Output em JSON estruturado para stdout.
- Em producao (Docker): `docker compose logs -f api` para ver logs em tempo real.
- Em desenvolvimento: console formatado (colorido).
- **Correlation ID** em toda request (UUID v4) propagado para services, repositorios e eventos WebSocket.
- Sem CloudWatch, sem X-Ray na Fase 1. Ver `docs/observabilidade.md` para detalhes.

### Health Checks

| Endpoint | Uso |
|---|---|
| `GET /health` | Health check basico (API respondendo) — usado pelo nginx |
| `GET /health/ready` | Readiness check (banco + Redis conectados) — usado pelo Docker healthcheck |

- Docker healthcheck no `docker-compose.yml` aponta para `/health/ready`.
- nginx health check aponta para `/health`.
- Ambos retornam HTTP 200 quando saudavel, 503 quando nao.

### Variaveis de Ambiente

Gerenciadas via `.env` no servidor. Nunca commitar `.env` no repositorio.

Variaveis principais:
- `DATABASE_URL` — Connection string PostgreSQL
- `REDIS_URL` — Connection string Redis
- `JWT_SECRET` — Segredo para tokens JWT
- `STORAGE_DRIVER=local` — Driver de storage (filesystem local)
- `UPLOAD_DIR` — Diretorio de upload (volume Docker mapeado)
- `WHATSAPP_API_KEY` — API para envio de OTP
- `PIX_WEBHOOK_SECRET` — Segredo para validar assinatura do webhook Pix

### Deploy em Producao (Fase 1)

1. Servidor com Docker e Docker Compose instalados (VPS, EC2, DigitalOcean, etc.).
2. nginx como reverse proxy com HTTPS (Let's Encrypt / Certbot).
3. `docker compose up -d` para subir os 4 containers.
4. Volume Docker mapeado para imagens (`./uploads:/app/uploads`).
5. Backup do PostgreSQL via `pg_dump` agendado (cron job no host).
6. Backup do volume de imagens via rsync ou similar.

### Graceful Shutdown

- Containers devem tratar `SIGTERM` para:
  - Parar de aceitar novas requests.
  - Drenar conexoes WebSocket ativas (30s de grace period).
  - Fechar conexoes com banco e Redis.
- Docker Compose `stop_grace_period: 30s`.

### Scaling na Fase 1

- **Vertical:** aumentar recursos do servidor (CPU, RAM).
- Sem auto-scaling horizontal. Se necessario escalar, migrar para Fase 2 (AWS).
- Para a maioria dos restaurantes, um servidor com 2 vCPU / 4GB RAM e suficiente.

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
- **Branch protection:** PR so pode ser mergeado com CI verde. Minimo 1 approval.
- **Checks obrigatorios:** lint, test, audit.

### Deploy Producao (Fase 1)
- **Trigger:** merge para `main`.
- **Steps:**
  1. CI completo (mesmos steps acima).
  2. Build das imagens Docker (`api` + `web`).
  3. SSH no servidor + `docker compose pull && docker compose up -d`.
  4. Smoke test automatico (`/health/ready` retorna 200).
- **Rollback:** `docker compose down && docker compose up -d` com imagem anterior (tag).

---

## Circuit Breaker — Configuracao

Usar `opossum` para proteger chamadas a dependencias externas:

| Dependencia | Timeout | Threshold | Reset |
|---|---|---|---|
| **WhatsApp API** | 10s | 5 falhas em 30s | 60s |
| **Pix Provider** | 15s | 3 falhas em 60s | 120s |

- **Estado aberto:** retorna erro amigavel imediato + loga `warn`.
- **Estado half-open:** permite 1 request de teste. Se sucesso, fecha o circuit.
- **Metricas:** logar estado do circuit breaker (open/closed/half-open) via Winston.

## State Recovery (Timers e Status)

- **KDS timers:** tempo de preparo baseado em `createdAt` do pedido no banco, **nunca em timer em memoria**. Se container reinicia, KDS recalcula tempo decorrido a partir do timestamp.
- **Pedidos em "preparing":** ao iniciar, worker/KDS registra `startedAt` no banco. Timer no frontend e calculado como `now - startedAt`.
- **Sessoes WebSocket:** ao reconectar, cliente faz fetch REST para sincronizar estado completo (nao depende de replay de eventos).
- **Filas Bull:** jobs com retry automatico. Se worker morre, job volta para fila quando timeout expira.

---

## Fase 2 — Migracao para AWS (apos MVP validado)

**NAO IMPLEMENTAR ATE AVISO EXPLICITO.** Apenas referencia arquitetural para quando o projeto precisar escalar.

### Infraestrutura AWS

| Servico | Substitui (Fase 1) | Uso |
|---|---|---|
| **ECS Fargate** | Docker Compose no servidor | Containers `api` e `web` (serverless, sem gerenciar EC2) |
| **RDS PostgreSQL** | Container PostgreSQL | Banco com backups automaticos, Multi-AZ |
| **RDS Proxy** | — (novo) | Connection pooling para Prisma/containers |
| **ElastiCache Redis** | Container Redis | Cache, filas, Socket.IO adapter. Snapshot habilitado |
| **S3 + CloudFront** | Filesystem local | Imagens de produtos (upload -> S3, entrega via CDN) |
| **SQS** | Bull + Redis | Filas para jobs assincronos (substituir Bull por SQS) |
| **Route 53** | DNS do provedor | DNS e dominio |
| **ACM** | Let's Encrypt | Certificados SSL/TLS (gratuito, renovacao automatica) |
| **CloudWatch** | Winston stdout | Logs, metricas e alarmes |
| **X-Ray** | — (novo) | Distributed tracing (APM) |
| **Secrets Manager** | `.env` no servidor | Credenciais (JWT secret, DB password, API keys) |
| **WAF** | — (novo) | Protecao contra SQL injection, XSS, DDoS |
| **ECR** | — (novo) | Registro de imagens Docker |

### Arquitetura AWS

```
Internet -> Route 53 -> CloudFront (CDN)
                     -> ALB -> ECS Fargate (api + web)
                                  -> RDS PostgreSQL (via RDS Proxy)
                                  -> ElastiCache Redis
                                  -> S3 (imagens)
```

- **HTTPS/TLS 1.3** obrigatorio (ACM + ALB).
- Containers rodam em **subnets privadas**. Apenas o ALB e publico.
- RDS e ElastiCache em subnets privadas, sem acesso externo.
- **RDS Proxy** entre containers e RDS — essencial para connection pooling com Prisma em ambiente Fargate.
- S3 acessado via CloudFront (origin access control).

### Auto-Scaling

- **ECS Service Auto Scaling** com target tracking:
  - CPU medio > 70% -> scale out.
  - CPU medio < 30% -> scale in.
  - Minimo: 2 tasks (alta disponibilidade). Maximo: 10 tasks.
- **Cooldown:** 60s para scale out, 300s para scale in.
- Considerar scaling por request count no ALB para picos de horario (almoco/jantar).

### Filas Assincronas (SQS)

Na Fase 2, substituir Bull por SQS para maior resiliencia e scaling:

| Fila | Uso |
|---|---|
| `ochefia-image-resize` | Resize de imagens apos upload (Sharp) |
| `ochefia-otp-send` | Envio de OTP via WhatsApp API |
| `ochefia-pix-process` | Processamento de confirmacoes webhook Pix |

- **Dead Letter Queue (DLQ)** para cada fila — mensagens que falharam 3x vao para DLQ.
- **Alarme CloudWatch:** DLQ com mensagens > 0 dispara alarme imediato (SNS -> email/Slack).
- **Retencao DLQ:** 14 dias.

### Deploy CD (AWS)

#### Deploy Staging
- **Trigger:** merge para `develop`.
- Build das imagens Docker → push para ECR → deploy via ECS rolling update → smoke test.
- **Rollback:** se smoke test falha, reverte para task definition anterior.

#### Deploy Production
- **Trigger:** merge para `main`.
- CI completo → testes e2e (Playwright) contra staging → build + push ECR com tag de versao → deploy ECS rolling update.
- **Rollback automatico:** se health check falha por 3 minutos, ECS reverte.

### Database Failover e Resiliencia

#### RDS Multi-AZ
- Failover automatico em caso de falha (30-60 segundos).
- RDS Proxy absorve parte do impacto.
- Prisma com `connect_timeout` configurado (10s) e retry logic.
- **Backups:** automaticos diarios com retencao de 7 dias + snapshots manuais antes de migrations.

#### Connection Pooling
- **RDS Proxy:** obrigatorio em producao AWS. Prisma em Fargate abre muitas conexoes.
- `connection_limit` no Prisma datasource (ex: 5 por container).
- Monitorar `DatabaseConnections` no CloudWatch.

### Variaveis de Ambiente (AWS)

Gerenciadas via **AWS Secrets Manager**. Variaveis adicionais:
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
| **Estoque** | 2+ | Controle de estoque, ingredientes, baixa automatica, alertas |
| **Explorar** | 2+ | App consumidor, listagem, reserva, fidelidade |
| **NFC-e/SAT** | 2+ | Emissao fiscal |

### Monitoramento
- Metricas de uso por estabelecimento (pedidos/mes, mesas ativas).
- Ultimo acesso.
- Fase 1: logs via `docker compose logs`. Fase 2: CloudWatch.
