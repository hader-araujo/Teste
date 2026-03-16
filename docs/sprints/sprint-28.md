# Sprint 28 — Segurança Avançada + LGPD

Revisão de segurança e compliance LGPD. Zero endpoints REST novos (exceto LGPD).

**Endpoints (~6):**
- DELETE `/session/:token/data` — LGPD: excluir dados pessoais da sessão.
- GET `/session/:token/data` — LGPD: retornar todos os dados pessoais da sessão (direito de acesso).
- POST `/lgpd/verify` — Enviar OTP para verificação do telefone (acesso global a dados LGPD). Body: `{ phone }`.
- POST `/lgpd/verify/confirm` — Confirmar OTP. Body: `{ phone, otp }`. Retorna `{ lgpdToken }` (UUID, expira 5min).
- GET `/lgpd/data` — Retornar dados pessoais de todas as sessões do telefone. Header: `Authorization: Bearer {lgpdToken}`.
- DELETE `/lgpd/data` — Anonimizar dados pessoais de todas as sessões passadas do telefone. Header: `Authorization: Bearer {lgpdToken}`.

**Checklist:**
- [ ] LGPD: endpoint `DELETE /session/:token/data` para exclusão de dados pessoais (telefone, nomes). Pedidos/pagamentos são anonimizados.
- [ ] LGPD: endpoint `GET /session/:token/data` para acesso aos dados pessoais (direito de acesso via telefone verificado). Ver `docs/seguranca.md` seção LGPD.
- [ ] LGPD: fluxo em 2 etapas para acesso global: `POST /lgpd/verify` envia OTP, `POST /lgpd/verify/confirm` retorna lgpdToken temporário (5min). Dados sensíveis nunca em query params.
- [ ] LGPD: endpoint `GET /lgpd/data` com lgpdToken no header para acesso global a dados pessoais.
- [ ] LGPD: endpoint `DELETE /lgpd/data` com lgpdToken no header para exclusão global de dados pessoais.
- [ ] LGPD: job agendado para anonimizar dados pessoais de sessões fechadas há mais de 90 dias.
- [ ] Rotação de JWT_SECRET testada end-to-end (suportar 2 secrets simultâneos — implementação na Sprint 2, teste de rotação aqui).
- [ ] Revisão de segurança: verificar que todos os campos de texto livre passam por sanitização `class-transformer`.
- [ ] Revisão de segurança: verificar que `$queryRaw`/`$executeRaw` (se usados) utilizam `Prisma.sql` para parametrização.
- [ ] Revisão de segurança: verificar que upload de imagens valida MIME type real em todos os endpoints.
