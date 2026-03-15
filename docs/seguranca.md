# Segurança e Multi-Tenancy

## Multi-Tenancy
- Toda entidade vinculada a `Restaurant` por `restaurantId`.
- Middleware injeta `restaurantId` do JWT em toda query.
- PostgreSQL RLS como segunda camada de proteção.
- Sessões de clientes isoladas pelo `token` único da `TableSession` — sem JWT, sem autenticação, mas só acessa dados daquela mesa/restaurante.

## Sessão do Cliente (pública)
- Não usa JWT. Usa token único da `TableSession` na URL + cookie.
- **Token da sessão deve ser criptograficamente seguro:** UUID v4 (128 bits) ou `crypto.randomBytes(32).toString('hex')`. Nunca sequencial ou previsível.
- Token expira automaticamente quando a sessão é fechada. Tokens de sessões fechadas não podem ser reutilizados.
- **Identificação individual por cookie:** ao ser aprovado na mesa (via OTP ou pelo garçom), o backend seta cookie httpOnly `ochefia_person_id` com o `personId` da pessoa. Endpoints que operam sobre uma pessoa específica (`POST /session/:token/payments`, `DELETE /session/:token/people/:personId`, etc.) validam que o `personId` do body/path corresponde ao cookie. Impede que um membro da mesa aja como outro. Cookie com `SameSite=Strict`, `Secure`, `Path=/session`.
- **Unicidade de telefone:** um telefone verificado só pode estar vinculado a uma sessão ativa por vez. Tentativa de entrar em outra mesa com sessão ativa retorna erro `SESSION_008`.
- **Força bruta em tokens de sessão:** o rate limit geral por IP é suficiente para proteger contra força bruta — tokens de sessão são UUID v4 (espaço de 2^122), tornando ataques de enumeração computacionalmente inviáveis.

## Aprovação de Entrada na Mesa
- **QR Code fixo por mesa.** Qualquer pessoa pode escanear, mas entrar na sessão requer aprovação.
- **Primeiro cliente:** escaneia QR + verifica WhatsApp → cria sessão e entra automaticamente como primeiro membro aprovado.
- **Novos entrantes:** escaneia QR + verifica WhatsApp → entra em fila de aprovação. **Não tem acesso a nenhum dado da mesa até ser aprovado.** Qualquer membro já aprovado pode aprovar ou rejeitar.
- **Reentrada:** se alguém já aprovado escaneia o QR novamente, abre o sistema normalmente (reconhecido via cookie + telefone verificado).
- **Mitigação de session sharing:** o sistema de aprovação substitui a dependência exclusiva de cookie binding. Mesmo que o link do QR seja compartilhado (ex: enviado por WhatsApp), o novo entrante precisa ser aprovado por quem está na mesa.
- **Notificação de aprovação:** membros recebem push notification + alerta in-app. O entrante pode reenviar notificação ("Lembrar mesa") com cooldown de 60 segundos.
- **Modo read-only:** qualquer pessoa pode ver o cardápio (com preços) sem entrar na sessão. Acesso público, sem dados da mesa.

## Identificação via WhatsApp
- Ao abrir sessão, cliente informa número -> sistema envia OTP via WhatsApp -> confirma -> salva `phone` + `phoneVerified = true`.
- Nenhuma ação automática usa o número além do armazenamento.
- **Rate limit específico para OTP:** máximo 3 envios por telefone em janela de 15 minutos (global, independente de mesa/sessão). Cooldown de 60 segundos entre envios. Previne abuso de custo de mensagens WhatsApp.
- **OTP expira em 5 minutos.** Máximo 5 tentativas de verificação por OTP. **Após expirar ou esgotar tentativas:** o cliente pode solicitar novo OTP (conta como novo envio dentro do limite de 3 por telefone). Cada novo OTP gera novo counter de 5 tentativas. O OTP anterior é invalidado automaticamente ao gerar novo.
- **Falha no envio:** se o envio via fila falhar (WhatsApp API indisponível, Redis fora), a tentativa **não é contabilizada** no rate limit. O sistema exibe mensagem "Não foi possível enviar. Tente novamente em 60s" sem consumir uma das 3 tentativas.
- **Fallback após esgotar OTP:** após 3 tentativas sem sucesso, o sistema cria JoinRequest com `otpFailed: true`. Cliente vê mensagem "Não foi possível verificar. Peça ao garçom para aprovar sua entrada." A solicitação aparece na tela de detalhe da mesa do garçom com indicação diferenciada ("Verificação WhatsApp falhou — aprovar manualmente?"). Garçom aprova no mesmo fluxo de aprovação normal.

## Autenticação Staff
- JWT com access token (15min) + refresh token (7 dias).
- Refresh token em httpOnly cookie com `SameSite=Strict` (proteção CSRF).
- Access token **nunca** armazenado em cookie — apenas em memória (variável JS). Enviado via header `Authorization: Bearer`.
- **Rate limit no `/auth/refresh`:** máximo 10 requests por IP em 15 minutos. Previne abuso com refresh token vazado.
- **Rate limit no `/auth/login`:** máximo 5 tentativas por IP em 15 minutos. Previne brute force de senha.
- **Rate limit no `/auth/register`:** máximo 3 requests por IP por hora. Previne spam de criação de restaurantes.
- **Revogação de refresh tokens:** ao desativar funcionário (`DELETE /staff/:id`), alterar role, ou resetar senha/PIN, o refresh token deve ser revogado. Implementação: denylist em Redis com TTL de 7 dias (tempo de vida do refresh token). Verificar denylist no middleware de refresh.

## Autenticação do KDS
- O KDS requer autenticação de funcionário com role `KITCHEN` (mesmo padrão de auth dos demais staff — JWT). Não opera como tela aberta. O operador pode acessar qualquer Local de Preparo do restaurante.

## CSRF (Cross-Site Request Forgery)

### Staff (JWT + cookie)
- Refresh token em httpOnly cookie exige proteção CSRF adicional além de `SameSite=Strict`.
- Implementar **CSRF token** (sync token pattern) via `csurf` ou equivalente NestJS.
- Token CSRF enviado em header customizado (`X-CSRF-Token`) em toda request que modifica estado (POST, PUT, PATCH, DELETE).
- Token gerado por sessão e validado no backend.
- `SameSite=Strict` no cookie é camada complementar, não substitui CSRF token.

### Cliente (session token)
- Endpoints do cliente (`/session/:token/*`) **não usam CSRF token**. Proteção via:
  1. **Token criptográfico na URL:** o `sessionToken` (UUID v4 / randomBytes 32) funciona como bearer token — impraticável de adivinhar (128+ bits de entropia).
  2. **Rate limiting por IP e por cliente** (telefone verificado) em todos os endpoints sensíveis.
  3. **WhatsApp verificado como pré-requisito** para operações de pedido e pagamento — atacante precisaria ter acesso ao WhatsApp da vítima.
- CSRF tradicional não se aplica porque a autenticação do cliente não é cookie-based — o token está na URL/body, não em cookie automático.

## PIN do Garçom (Clock-in)
- **PIN numérico de 4 dígitos**, definido no cadastro do funcionário. Armazenado com hash (bcrypt). OWNER/MANAGER pode resetar o PIN de qualquer funcionário.
- **Rate limit no endpoint `/shifts/clock-in`:** máximo 5 tentativas por staffId em 15 minutos. Após exceder, lockout de 15 minutos.
- Tentativas falhas devem ser logadas com `level: warn` para auditoria.

## Diferenciação OWNER vs MANAGER

OWNER e MANAGER têm permissões quase idênticas. A distinção existe para operações sensíveis que só o dono do restaurante deve executar:

| Operação | OWNER | MANAGER |
|---|---|---|
| Criar/remover OWNER ou MANAGER | Sim | **Não** |
| Excluir restaurante | Sim | **Não** |
| Alterar dados sensíveis (CNPJ, slug) | Sim | **Não** |
| Force-close de sessão | Sim | Sim |
| CRUD de staff (WAITER, KITCHEN) | Sim | Sim |
| Dashboard, faturamento, settings | Sim | Sim |
| Todas as outras operações admin | Sim | Sim |

MANAGER pode criar WAITER e KITCHEN, mas **não** pode criar ou remover OWNER/MANAGER. Essa restrição é validada no `POST /staff` e `DELETE /staff/:id`.

## Rate Limits — Endpoints do Cliente
- Rate limits são por **cliente** (telefone verificado), não por sessão/mesa. Justificativa: mesas grandes (30+ pessoas) precisam de rate limit individual para não bloquear pedidos simultâneos legítimos.
- `POST /orders`: máximo 3 requests por minuto por cliente.
- `POST /calls`: máximo 2 requests por minuto por cliente.
- `POST /session/:token/people`: máximo 5 requests por minuto por cliente.

## Super Admin (equipe OChefia)
- Role `SUPER_ADMIN` com acesso ao painel `/superadmin`.
- Não vinculado a nenhum restaurante — acesso cross-tenant.
- Gerencia estabelecimentos, cobrança, módulos e monitoramento.
- Autenticação via JWT igual ao staff, mas com role especial.
- Criado apenas via seed ou comando interno (não há registro público).

## Gateway de Pagamento PIX
- Interface genérica `PaymentGateway` com métodos: `createPixCharge()`, `verifyWebhook()`, `getPaymentStatus()`.
- Fase 1: `FakePaymentGateway` que simula tudo (QR fake, webhook simulado com delay, confirmação automática).
- Produção: implementação real (provedor definido antes do deploy). Troca só a implementação, sem mexer no resto do código.

## Confirmação Manual de Pagamento
- Garçom pode confirmar pagamento de qualquer método (PIX, CASH, CARD).
- Toda confirmação manual registra `confirmedByStaffId` + timestamp para auditoria.
- PIX também pode ser confirmado automaticamente via webhook (sem staffId).
- PIX pendente expira após 30 minutos (QR Code dinâmico — padrão Banco Central). Após expirar, status volta para não pago.
- Garçom pode cancelar PIX pendente manualmente.

## Suspensão de Restaurante
- Suspensão pelo Super Admin é gradual: bloqueia novos pedidos e novas sessões, mas sessões ativas terminam normalmente.
- Clientes conectados não são desconectados. Pedidos em preparo continuam no KDS.

## Webhook Pix — Validação Obrigatória
- **O endpoint `POST /payments/pix/webhook` DEVE validar a assinatura do provedor de pagamento** (ex: header HMAC-SHA256 ou mTLS conforme provedor).
- Sem validação, qualquer pessoa pode simular confirmação de pagamento com POST falso — **risco financeiro direto**.
- Implementar verificação de IP de origem (whitelist do provedor) como camada extra.
- Logar todas as chamadas ao webhook (válidas e inválidas) com `level: info/warn`.
- A validação de assinatura deve ser **síncrona** (antes de enfileirar no Bull). Retornar HTTP 400 imediatamente se assinatura inválida. Implementar **idempotency** via campo `externalId` do provedor: se o `externalId` já foi processado, retornar HTTP 200 sem re-processar.

## Upload de Imagens — Validação de Conteúdo
- Validar MIME type real do arquivo com biblioteca `file-type` (não confiar apenas na extensão).
- Aceitar apenas: `image/jpeg`, `image/png`, `image/webp`.
- Tamanho máximo: 5MB por arquivo, 5 arquivos por request.
- Sanitizar nome do arquivo (remover caracteres especiais, usar UUID como nome no storage).

## Proteções
- **Rate Limiting:** Por IP via `express-rate-limit`. Rate limits específicos para endpoints sensíveis (OTP, login, clock-in, webhook).
- **Validação:** `class-validator` + `ValidationPipe` global.
- **LGPD:** Dados sensíveis criptografados. Endpoint de exclusão de dados do cliente obrigatório (ver seção LGPD abaixo).
- **HTTPS/TLS 1.3** obrigatório em produção (nginx + Let's Encrypt na Fase 1, ACM + ALB na Fase 2).
- **WAF:** Web Application Firewall contra injeção SQL, XSS e DDoS (Fase 2 — AWS WAF. Na Fase 1, proteção via Helmet + rate limiting + validação de input).
- **Helmet:** Headers de segurança HTTP (X-Content-Type-Options, X-Frame-Options, CSP, Referrer-Policy, etc).
- **Referrer-Policy:** `strict-origin-when-cross-origin` — mitiga leaking de session tokens em URLs via header Referer ao clicar links externos.
- **CORS:** Configurado para aceitar apenas origens conhecidas (domínio do frontend).

## Content Security Policy (CSP)
- Configurar CSP via Helmet com política restritiva:
  - `default-src 'self'`
  - `img-src 'self' data:` (Fase 1: imagens servidas pelo próprio servidor. Fase 2: adicionar `https://*.cloudfront.net` para CDN)
  - `connect-src 'self' wss://*.ochefia.com.br` (WebSocket)
  - `script-src 'self'` (sem inline scripts)
  - `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com` (Tailwind gera inline styles)
  - `font-src 'self' https://fonts.gstatic.com`
- Revisar e ajustar CSP conforme integração com provedores externos (Pix, WhatsApp).
- Usar `report-uri` para monitorar violações em produção.
- **Nota Fase 2:** se o restaurante usar domínio próprio (white-label), o CSP do frontend precisa incluir o domínio da API OChefia explicitamente em `connect-src`.

## Sanitização de Input
- `class-validator` valida formato mas **não sanitiza HTML/XSS**.
- Usar `class-transformer` com sanitização para campos de texto livre (nome do restaurante, descrição de produto, nomes de pessoas na mesa).
- Remover tags HTML e caracteres perigosos antes de persistir.
- Campos que aceitam texto livre: `Restaurant.name`, `Product.name`, `Product.description`, `Person.name`, `Category.name`, `Tag.name`, `OrderItem.notes`, `Call.message`, `OrderItem.cancelReason`, `Payment.cancelReason`.

## Dependency Scanning
- Configurar **Dependabot** (GitHub) ou **Snyk** para scanning automático de vulnerabilidades em dependências.
- `pnpm audit` como step obrigatório no CI pipeline.
- Bloquear merge de PRs com vulnerabilidades críticas (`high` ou `critical`).
- Revisar dependências transitivas trimestralmente.

## Rotação de Secrets
- **JWT_SECRET:** rotação a cada 90 dias. Suportar dois secrets simultâneos durante período de transição (validar token com secret atual e anterior).
- **PIX_WEBHOOK_SECRET:** rotação conforme política do provedor Pix.
- **Fase 1:** rotação manual — atualizar `.env` no servidor e reiniciar containers.
- **Fase 2 (AWS):** usar AWS Secrets Manager rotation com Lambda para rotação automática.
- Nunca hardcodar secrets — mesmo em testes, usar variáveis de ambiente.

### Rotação de JWT_SECRET
- Variáveis: `JWT_SECRET` (atual) e `JWT_SECRET_OLD` (anterior).
- Verificação: tenta o secret atual primeiro; se falhar, tenta o anterior.
- Após período de transição (7 dias), remover `JWT_SECRET_OLD`.

## Prisma e SQL Injection
- Prisma ORM protege contra SQL injection por padrão via queries parametrizadas.
- **Se usar `$queryRaw` ou `$executeRaw`:** OBRIGATÓRIO usar template literals do Prisma (`Prisma.sql`) para parametrização. Nunca concatenar strings.
- Exemplo seguro: `prisma.$queryRaw(Prisma.sql\`SELECT * FROM users WHERE id = ${userId}\`)`.
- Exemplo **PROIBIDO**: `prisma.$queryRaw(\`SELECT * FROM users WHERE id = '${userId}'\`)`.

## Audit Log
- Ações administrativas críticas devem ser registradas em tabela `AuditLog`:
  - Suspensão/ativação de estabelecimento.
  - Alteração de plano/cobrança.
  - Habilitar/desabilitar módulos.
  - Alteração de roles de funcionários.
  - Exclusão de dados (LGPD).
- Campos: `id`, `userId`, `action`, `targetType`, `targetId`, `metadata` (JSON), `ipAddress`, `createdAt`.
- Audit logs são imutáveis — nunca deletar ou alterar.

## LGPD — Compliance
- **Endpoint obrigatório (exclusão):** `DELETE /session/:token/data` — exclui todos os dados pessoais da sessão (telefone, nome das pessoas). Pedidos/pagamentos são anonimizados (mantidos para faturamento, mas sem dados pessoais). Controle de acesso:
  - Requer telefone verificado (mesmo telefone da sessão).
  - Só pode ser chamado após sessão fechada (não permite exclusão com pedidos em andamento).
  - Admin/Super Admin pode forçar exclusão via painel (para atender solicitação formal LGPD).
- **Endpoint obrigatório (acesso):** `GET /session/:token/data` — retorna todos os dados pessoais da sessão (telefone, nomes). Requer telefone verificado. Direito de acesso (LGPD Art. 18).
- **Consentimento:** ao informar telefone, exibir texto de consentimento claro sobre uso dos dados + link para Política de Privacidade (`/{slug}/privacidade`). Ver `docs/privacidade.md` para texto completo e regras.
- **Retenção:** dados pessoais de sessões fechadas devem ser anonimizados após 90 dias automaticamente. Job agendado via Bull queue para anonimização automática. Será implementado na Sprint 26 (Segurança Avançada + LGPD).

### Anonimização Automática (90 dias)
- Cron job diário (madrugada). Após 90 dias do fechamento da sessão:
- `Person.name` → 'Pessoa Anonimizada'
- `Person.phone` → null
- `JoinRequest.phone` → null
- `JoinRequest.phoneLast4` → null
- `Person.consentGivenAt` → **preservado** (prova legal de que consentimento foi dado — necessário para compliance LGPD).
- OrderItemPerson e Payment mantidos (sem dados pessoais, Person já anonimizada).
- Pessoa que voltar após anonimização é tratada como nova — sem vínculo com dados anteriores.
