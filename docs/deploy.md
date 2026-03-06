# Modelo de Deploy

O OChefia pode ser instalado de 3 formas. **Todo o sistema deve ser self-contained** — sem dependencia obrigatoria de servicos externos.

## Deploy Local (On-Premise)
- Os 4 containers (`api`, `web`, `postgres`, `redis`) rodam na maquina do cliente (ex: um PC no bar).
- Funciona 100% offline na rede local (WiFi).
- Clientes acessam o cardapio digital pelo WiFi do estabelecimento.
- Garcom usa PWA no celular conectado ao mesmo WiFi.
- Fotos de produtos armazenadas no filesystem local.
- Logs em arquivos locais com rotacao automatica.
- Atualizacoes do sistema via script ou Docker pull manual.

## Deploy Cloud (AWS)
- `api` e `web` em containers (ECS/EKS). `postgres` no RDS. `redis` no ElastiCache.
- Fotos de produtos no S3 + CloudFront CDN.
- Logs via CloudWatch.
- Acesso de qualquer lugar via internet.

## Deploy Hibrido (definicao futura)
- Sistema roda local mas sincroniza dados/logs com a cloud quando tem internet.
- Detalhes a definir em sprint futura.

## Super Admin / Painel de Controle (futuro)
- Tela exclusiva da equipe OChefia (nao acessivel por clientes/restaurantes).
- Gerenciar todas as instalacoes: lista de clientes, tipo de deploy, versao, status (online/offline), ultimo heartbeat.
- Visualizar logs remotamente (clientes locais enviam logs via "phone home" quando conectados).
- Gestao de licencas e planos.
- **Nao faz parte do MVP**.
