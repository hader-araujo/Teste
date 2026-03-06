# Deploy — AWS Cloud

O OChefia roda **exclusivamente na cloud (AWS)**. Nao ha opcao de deploy local ou hibrido.

## Infraestrutura AWS

| Servico | Uso |
|---|---|
| **ECS Fargate** | Containers `api` e `web` (serverless, sem gerenciar EC2) |
| **RDS PostgreSQL** | Banco de dados com backups automaticos, Multi-AZ |
| **ElastiCache Redis** | Cache de cardapio e sessoes |
| **S3 + CloudFront** | Imagens de produtos (upload -> S3, entrega via CDN) |
| **Route 53** | DNS e dominio |
| **ACM** | Certificados SSL/TLS (gratuito, renovacao automatica) |
| **CloudWatch** | Logs, metricas e alarmes |
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
- S3 acessado via CloudFront (origin access control).

## Ambientes

| Ambiente | Uso |
|---|---|
| `production` | Producao real |
| `staging` | Testes pre-producao |
| `development` | Docker Compose local para desenvolvimento (postgres 5433, redis 6380) |

## Variaveis de Ambiente

Gerenciadas via **AWS Secrets Manager** em producao. `.env` local apenas para desenvolvimento.

Variaveis principais:
- `DATABASE_URL` — Connection string PostgreSQL (RDS)
- `REDIS_URL` — Connection string Redis (ElastiCache)
- `JWT_SECRET` — Segredo para tokens JWT
- `S3_BUCKET` — Bucket para imagens
- `CLOUDFRONT_URL` — URL do CDN
- `WHATSAPP_API_KEY` — API para envio de OTP

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
