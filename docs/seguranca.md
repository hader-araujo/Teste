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
- **Unicidade de telefone:** um telefone verificado só pode estar vinculado a uma sessão ativa por vez. Tentativa de entrar em outra mesa com sessão ativa retorna erro `SESSION_008`.

## Aprovacao de Entrada na Mesa
- **QR Code fixo por mesa.** Qualquer pessoa pode escanear, mas entrar na sessao requer aprovacao.
- **Primeiro cliente:** escaneia QR + verifica WhatsApp → cria sessao e entra automaticamente como primeiro membro aprovado.
- **Novos entrantes:** escaneia QR + verifica WhatsApp → entra em fila de aprovacao. **Nao tem acesso a nenhum dado da mesa ate ser aprovado.** Qualquer membro ja aprovado pode aprovar ou rejeitar.
- **Reentrada:** se alguem ja aprovado escaneia o QR novamente, abre o sistema normalmente (reconhecido via cookie + telefone verificado).
- **Mitigacao de session sharing:** o sistema de aprovacao substitui a dependencia exclusiva de cookie binding. Mesmo que o link do QR seja compartilhado (ex: enviado por WhatsApp), o novo entrante precisa ser aprovado por quem esta na mesa.
- **Notificacao de aprovacao:** membros recebem push notification + alerta in-app. O entrante pode reenviar notificacao ("Lembrar mesa") com cooldown de 60 segundos.
- **Modo read-only:** qualquer pessoa pode ver o cardapio (com precos) sem entrar na sessao. Acesso publico, sem dados da mesa.

## Identificacao via WhatsApp
- Ao abrir sessao, cliente informa numero -> sistema envia OTP via WhatsApp -> confirma -> salva `phone` + `phoneVerified = true`.
- Nenhuma acao automatica usa o numero alem do armazenamento.
- **Rate limit especifico para OTP:** maximo 3 envios por sessao, cooldown de 60 segundos entre envios. Previne abuso de custo de mensagens WhatsApp.
- **OTP expira em 5 minutos.** Maximo 5 tentativas de verificacao por OTP.
- **Falha no envio:** se o envio via fila falhar (WhatsApp API indisponível, Redis fora), a tentativa **não é contabilizada** no rate limit. O sistema exibe mensagem "Não foi possível enviar. Tente novamente em 60s" sem consumir uma das 3 tentativas.

## Autenticacao Staff
- JWT com access token (15min) + refresh token (7 dias).
- Refresh token em httpOnly cookie com `SameSite=Strict` (protecao CSRF).
- Access token **nunca** armazenado em cookie — apenas em memoria (variavel JS). Enviado via header `Authorization: Bearer`.
- **Rate limit no `/auth/refresh`:** maximo 10 requests por IP em 15 minutos. Previne abuso com refresh token vazado.

## Autenticação do KDS
- O KDS requer autenticação de funcionário com role `KITCHEN` ou `BAR` (mesmo padrão de auth dos demais staff — JWT). Não opera como tela aberta.

## CSRF (Cross-Site Request Forgery)
- Refresh token em httpOnly cookie exige protecao CSRF adicional alem de `SameSite=Strict`.
- Implementar **CSRF token** (sync token pattern) via `csurf` ou equivalente NestJS.
- Token CSRF enviado em header customizado (`X-CSRF-Token`) em toda request que modifica estado (POST, PUT, PATCH, DELETE).
- Token gerado por sessao e validado no backend.
- `SameSite=Strict` no cookie e camada complementar, nao substitui CSRF token.

## PIN do Garcom (Clock-in)
- **Rate limit no endpoint `/shifts/clock-in`:** maximo 5 tentativas por staffId em 15 minutos. Apos exceder, lockout de 15 minutos.
- Tentativas falhas devem ser logadas com `level: warn` para auditoria.

## Rate Limits — Endpoints do Cliente
- Rate limits são por **cliente** (telefone verificado), não por sessão/mesa. Justificativa: mesas grandes (30+ pessoas) precisam de rate limit individual para não bloquear pedidos simultâneos legítimos.
- `POST /orders`: máximo 3 requests por minuto por cliente.
- `POST /calls`: máximo 2 requests por minuto por cliente.
- `POST /session/:token/people`: máximo 5 requests por minuto por cliente.

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
- A validação de assinatura deve ser **síncrona** (antes de enfileirar no Bull). Retornar HTTP 400 imediatamente se assinatura inválida. Implementar **idempotency** via campo `externalId` do provedor: se o `externalId` já foi processado, retornar HTTP 200 sem re-processar.

## Upload de Imagens — Validacao de Conteudo
- Validar MIME type real do arquivo com biblioteca `file-type` (nao confiar apenas na extensao).
- Aceitar apenas: `image/jpeg`, `image/png`, `image/webp`.
- Tamanho maximo: 5MB por arquivo, 5 arquivos por request.
- Sanitizar nome do arquivo (remover caracteres especiais, usar UUID como nome no storage).

## Protecoes
- **Rate Limiting:** Por IP via `express-rate-limit`. Rate limits especificos para endpoints sensiveis (OTP, login, clock-in, webhook).
- **Validacao:** `class-validator` + `ValidationPipe` global.
- **LGPD:** Dados sensiveis criptografados. Endpoint de exclusao de dados do cliente obrigatorio (ver secao LGPD abaixo).
- **HTTPS/TLS 1.3** obrigatorio em producao (nginx + Let's Encrypt na Fase 1, ACM + ALB na Fase 2).
- **WAF:** Web Application Firewall contra injecao SQL, XSS e DDoS (Fase 2 — AWS WAF. Na Fase 1, protecao via Helmet + rate limiting + validacao de input).
- **Helmet:** Headers de seguranca HTTP (X-Content-Type-Options, X-Frame-Options, CSP, etc).
- **CORS:** Configurado para aceitar apenas origens conhecidas (dominio do frontend).

## Content Security Policy (CSP)
- Configurar CSP via Helmet com politica restritiva:
  - `default-src 'self'`
  - `img-src 'self' data:` (Fase 1: imagens servidas pelo proprio servidor. Fase 2: adicionar `https://*.cloudfront.net` para CDN)
  - `connect-src 'self' wss://*.ochefia.com.br` (WebSocket)
  - `script-src 'self'` (sem inline scripts)
  - `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com` (Tailwind gera inline styles)
  - `font-src 'self' https://fonts.gstatic.com`
- Revisar e ajustar CSP conforme integracao com provedores externos (Pix, WhatsApp).
- Usar `report-uri` para monitorar violacoes em producao.

## Sanitizacao de Input
- `class-validator` valida formato mas **nao sanitiza HTML/XSS**.
- Usar `class-transformer` com sanitizacao para campos de texto livre (nome do restaurante, descricao de produto, nomes de pessoas na mesa).
- Remover tags HTML e caracteres perigosos antes de persistir.
- Campos que aceitam texto livre: `Restaurant.name`, `Product.name`, `Product.description`, `Person.name`, `Category.name`, `Tag.name`.

## Dependency Scanning
- Configurar **Dependabot** (GitHub) ou **Snyk** para scanning automatico de vulnerabilidades em dependencias.
- `pnpm audit` como step obrigatorio no CI pipeline.
- Bloquear merge de PRs com vulnerabilidades criticas (`high` ou `critical`).
- Revisar dependencias transitivias trimestralmente.

## Rotacao de Secrets
- **JWT_SECRET:** rotacao a cada 90 dias. Suportar dois secrets simultaneos durante periodo de transicao (validar token com secret atual e anterior).
- **PIX_WEBHOOK_SECRET:** rotacao conforme politica do provedor Pix.
- **Fase 1:** rotacao manual — atualizar `.env` no servidor e reiniciar containers.
- **Fase 2 (AWS):** usar AWS Secrets Manager rotation com Lambda para rotacao automatica.
- Nunca hardcodar secrets — mesmo em testes, usar variaveis de ambiente.

## Prisma e SQL Injection
- Prisma ORM protege contra SQL injection por padrao via queries parametrizadas.
- **Se usar `$queryRaw` ou `$executeRaw`:** OBRIGATORIO usar template literals do Prisma (`Prisma.sql`) para parametrizacao. Nunca concatenar strings.
- Exemplo seguro: `prisma.$queryRaw(Prisma.sql\`SELECT * FROM users WHERE id = ${userId}\`)`.
- Exemplo **PROIBIDO**: `prisma.$queryRaw(\`SELECT * FROM users WHERE id = '${userId}'\`)`.

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
- **Endpoint obrigatório (exclusão):** `DELETE /session/:token/data` — exclui todos os dados pessoais da sessão (telefone, nome das pessoas). Pedidos/pagamentos são anonimizados (mantidos para faturamento, mas sem dados pessoais). Controle de acesso:
  - Requer telefone verificado (mesmo telefone da sessão).
  - Só pode ser chamado após sessão fechada (não permite exclusão com pedidos em andamento).
  - Admin/Super Admin pode forçar exclusão via painel (para atender solicitação formal LGPD).
- **Endpoint obrigatorio (acesso):** `GET /session/:token/data` — retorna todos os dados pessoais da sessao (telefone, nomes). Requer telefone verificado. Direito de acesso (LGPD Art. 18).
- **Consentimento:** ao informar telefone, exibir texto de consentimento claro sobre uso dos dados.
- **Retenção:** dados pessoais de sessões fechadas devem ser anonimizados após 90 dias automaticamente. Job agendado via Bull queue para anonimização automática. Será implementado na Sprint 25 (Segurança Avançada + LGPD).
