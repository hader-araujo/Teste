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
