# ADR-005: Session token sem JWT para cliente

**Status:** Aceito
**Data:** 2026-03-14

## Contexto

Clientes acessam o sistema via QR Code no celular. Não tem login, não tem cadastro. Precisam de alguma forma de autenticação para acessar dados da mesa. Alternativas: session token na URL, JWT pro cliente também.

## Decisão

Token criptográfico (UUID v4 / randomBytes 32) na URL e cookie. Sem JWT.

## Justificativa

- **Cliente não tem login:** não existe usuário/senha. JWT resolveria um problema que não existe.
- **Simplicidade:** token na URL (`/session/:token/*`) funciona como bearer token. 128+ bits de entropia — impossível adivinhar.
- **Sem refresh flow:** JWT expira e precisa de refresh. Token de sessão vive enquanto a sessão está aberta — sem complexidade de renovação.
- **Verificação WhatsApp como gate:** operações sensíveis (pedido, pagamento) exigem telefone verificado. O token sozinho não basta.
- **CSRF não se aplica:** autenticação não é cookie-based (token está na URL/body, não em cookie automático).

## Alternativas descartadas

- **JWT pro cliente:** adicionaria complexity (refresh token, expiração, storage) sem ganho real. Cliente não precisa de claims (roles, permissions).

## Consequências

- Token deve ser criptograficamente seguro: UUID v4 ou `crypto.randomBytes(32).toString('hex')`.
- Token expira quando sessão fecha. Tokens de sessões fechadas não reutilizáveis.
- Rate limit por IP + por telefone verificado como proteção.
- Unicidade de telefone: um telefone só pode estar em uma sessão ativa por vez.
