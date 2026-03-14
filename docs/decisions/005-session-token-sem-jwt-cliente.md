# ADR-005: Session token sem JWT para cliente

**Status:** Aceito
**Data:** 2026-03-14

## Contexto

Clientes acessam o sistema via QR Code no celular. Nao tem login, nao tem cadastro. Precisam de alguma forma de autenticacao pra acessar dados da mesa. Alternativas: session token na URL, JWT pro cliente tambem.

## Decisao

Token criptografico (UUID v4 / randomBytes 32) na URL e cookie. Sem JWT.

## Justificativa

- **Cliente nao tem login:** nao existe usuario/senha. JWT resolveria um problema que nao existe.
- **Simplicidade:** token na URL (`/session/:token/*`) funciona como bearer token. 128+ bits de entropia — impossivel adivinhar.
- **Sem refresh flow:** JWT expira e precisa de refresh. Token de sessao vive enquanto a sessao esta aberta — sem complexidade de renovacao.
- **Verificacao WhatsApp como gate:** operacoes sensiveis (pedido, pagamento) exigem telefone verificado. O token sozinho nao basta.
- **CSRF nao se aplica:** autenticacao nao e cookie-based (token esta na URL/body, nao em cookie automatico).

## Alternativas descartadas

- **JWT pro cliente:** adicionaria complexity (refresh token, expiracao, storage) sem ganho real. Cliente nao precisa de claims (roles, permissions).

## Consequencias

- Token deve ser criptograficamente seguro: UUID v4 ou `crypto.randomBytes(32).toString('hex')`.
- Token expira quando sessao fecha. Tokens de sessoes fechadas nao reutilizaveis.
- Rate limit por IP + por telefone verificado como protecao.
- Unicidade de telefone: um telefone so pode estar em uma sessao ativa por vez.
