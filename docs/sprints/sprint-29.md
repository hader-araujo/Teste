# Sprint 29 — Fase 2: Migração para AWS — NÃO IMPLEMENTAR

**Apenas referência arquitetural. Migrar para AWS quando precisar escalar além de um servidor.**

- [ ] **Infra:** Migrar containers para ECS Fargate.
- [ ] **Infra:** Migrar PostgreSQL para RDS Multi-AZ + RDS Proxy.
- [ ] **Infra:** Migrar Redis para ElastiCache.
- [ ] **Infra:** Migrar imagens de filesystem local para S3 + CloudFront. Atualizar CSP para incluir `img-src https://*.cloudfront.net`.
- [ ] **Infra:** Migrar filas de Bull + Redis para SQS + DLQ.
- [ ] **Infra:** Configurar auto-scaling ECS (CPU > 70% scale out, < 30% scale in, min 2, max 10).
- [ ] **Infra:** CloudWatch (logs, métricas, alarmes) + X-Ray (tracing).
- [ ] **Infra:** WAF, Secrets Manager, ECR, Route 53, ACM.
- [ ] **Infra:** CI/CD com deploy para ECR + ECS rolling update.
- [ ] Ver `docs/deploy.md` seção "Fase 2 — Migração para AWS" para detalhes completos.
