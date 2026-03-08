# Seguranca e Multi-Tenancy

## Multi-Tenancy
- Toda entidade vinculada a `Restaurant` por `restaurantId`.
- Middleware injeta `restaurantId` do JWT em toda query.
- PostgreSQL RLS como segunda camada de protecao.
- Sessoes de clientes isoladas pelo `token` unico da `TableSession` — sem JWT, sem autenticacao, mas so acessa dados daquela mesa/restaurante.

## Sessao do Cliente (publica)
- Nao usa JWT. Usa token unico da `TableSession` na URL + cookie.
- **Token da sessao deve ser criptograficamente seguro:** UUID v4 (128 bits) ou `crypto.randomBytes(32).toString('hex')`. Nunca sequencial ou previsivel.
- Token expira automaticamente quando a sessao e fechada. Tokens de sessoes fechadas nao podem ser reutilizados.
- Sem login do cliente no MVP. Validado por IP + cookie como camada extra.

## Identificacao via WhatsApp
- Ao abrir sessao, cliente informa numero -> sistema envia OTP via WhatsApp -> confirma -> salva `phone` + `phoneVerified = true`.
- Nenhuma acao automatica usa o numero alem do armazenamento.
- **Rate limit especifico para OTP:** maximo 3 envios por sessao, cooldown de 60 segundos entre envios. Previne abuso de custo de mensagens WhatsApp.
- **OTP expira em 5 minutos.** Maximo 5 tentativas de verificacao por OTP.

## Autenticacao Staff
- JWT com access token (15min) + refresh token (7 dias).
- Refresh token em httpOnly cookie com `SameSite=Strict` (protecao CSRF).
- Access token **nunca** armazenado em cookie — apenas em memoria (variavel JS). Enviado via header `Authorization: Bearer`.

## PIN do Garcom (Clock-in)
- **Rate limit no endpoint `/shifts/clock-in`:** maximo 5 tentativas por staffId em 15 minutos. Apos exceder, lockout de 15 minutos.
- Tentativas falhas devem ser logadas com `level: warn` para auditoria.

## Super Admin (equipe OChefia)
- Role `SUPER_ADMIN` com acesso ao painel `/superadmin`.
- Nao vinculado a nenhum restaurante — acesso cross-tenant.
- Gerencia estabelecimentos, cobranca, modulos e monitoramento.
- Autenticacao via JWT igual ao staff, mas com role especial.
- Criado apenas via seed ou comando interno (nao ha registro publico).

## Webhook Pix — Validacao Obrigatoria
- **O endpoint `POST /payments/pix/webhook` DEVE validar a assinatura do provedor de pagamento** (ex: header HMAC-SHA256 ou mTLS conforme provedor).
- Sem validacao, qualquer pessoa pode simular confirmacao de pagamento com POST falso — **risco financeiro direto**.
- Implementar verificacao de IP de origem (whitelist do provedor) como camada extra.
- Logar todas as chamadas ao webhook (validas e invalidas) com `level: info/warn`.

## Upload de Imagens — Validacao de Conteudo
- Validar MIME type real do arquivo com biblioteca `file-type` (nao confiar apenas na extensao).
- Aceitar apenas: `image/jpeg`, `image/png`, `image/webp`.
- Tamanho maximo: 5MB por arquivo, 5 arquivos por request.
- Sanitizar nome do arquivo (remover caracteres especiais, usar UUID como nome no S3).

## Protecoes
- **Rate Limiting:** Por IP via `express-rate-limit`. Rate limits especificos para endpoints sensiveis (OTP, login, clock-in, webhook).
- **Validacao:** `class-validator` + `ValidationPipe` global.
- **LGPD:** Dados sensiveis criptografados. Endpoint de exclusao de dados do cliente obrigatorio (ver secao LGPD abaixo).
- **HTTPS/TLS 1.3** obrigatorio em producao.
- **WAF:** Web Application Firewall contra injecao SQL, XSS e DDoS.
- **Helmet:** Headers de seguranca HTTP (X-Content-Type-Options, X-Frame-Options, CSP, etc).
- **CORS:** Configurado para aceitar apenas origens conhecidas (dominio do frontend).

## Audit Log
- Acoes administrativas criticas devem ser registradas em tabela `AuditLog`:
  - Suspensao/ativacao de estabelecimento.
  - Alteracao de plano/cobranca.
  - Habilitar/desabilitar modulos.
  - Alteracao de roles de funcionarios.
  - Exclusao de dados (LGPD).
- Campos: `id`, `userId`, `action`, `targetType`, `targetId`, `metadata` (JSON), `ipAddress`, `createdAt`.
- Audit logs sao imutaveis — nunca deletar ou alterar.

## LGPD — Compliance
- **Endpoint obrigatorio:** `DELETE /session/:token/data` — exclui todos os dados pessoais da sessao (telefone, nome das pessoas). Pedidos/pagamentos sao anonimizados (mantidos para faturamento, mas sem dados pessoais).
- **Consentimento:** ao informar telefone, exibir texto de consentimento claro sobre uso dos dados.
- **Retencao:** dados pessoais de sessoes fechadas devem ser anonimizados apos 90 dias automaticamente (job agendado).
- **Acesso:** cliente pode solicitar seus dados via telefone verificado.
