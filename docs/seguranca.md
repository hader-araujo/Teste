# Seguranca e Multi-Tenancy

## Multi-Tenancy
- Toda entidade vinculada a `Restaurant` por `restaurantId`.
- Middleware injeta `restaurantId` do JWT em toda query.
- PostgreSQL RLS como segunda camada de protecao.
- Sessoes de clientes isoladas pelo `token` unico da `TableSession` — sem JWT, sem autenticacao, mas so acessa dados daquela mesa/restaurante.

## Sessao do Cliente (publica)
- Nao usa JWT. Usa token unico da `TableSession` na URL + cookie.
- Sem login do cliente no MVP. Validado por IP + cookie como camada extra.

## Identificacao via WhatsApp
- Ao abrir sessao, cliente informa numero -> sistema envia OTP via WhatsApp -> confirma -> salva `phone` + `phoneVerified = true`.
- Nenhuma acao automatica usa o numero alem do armazenamento.

## Autenticacao Staff
- JWT com access token (15min) + refresh token (7 dias).
- Refresh token em httpOnly cookie.

## Super Admin (equipe OChefia)
- Role `SUPER_ADMIN` com acesso ao painel `/superadmin`.
- Nao vinculado a nenhum restaurante — acesso cross-tenant.
- Gerencia estabelecimentos, cobranca, modulos e monitoramento.
- Autenticacao via JWT igual ao staff, mas com role especial.
- Criado apenas via seed ou comando interno (nao ha registro publico).

## Protecoes
- **Rate Limiting:** Por IP via `express-rate-limit`.
- **Validacao:** `class-validator` + `ValidationPipe` global.
- **LGPD:** Dados sensiveis criptografados. Endpoint de exclusao de dados do cliente obrigatorio.
- **HTTPS/TLS 1.3** obrigatorio em producao.
- **WAF:** Web Application Firewall contra injecao SQL, XSS e DDoS.
