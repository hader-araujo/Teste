# Sprint 26 — Segurança Avançada + LGPD

Revisão de segurança e compliance LGPD. Zero endpoints REST novos (exceto LGPD).

**Endpoints (~2):**
- DELETE `/session/:token/data` — LGPD: excluir dados pessoais da sessão.
- GET `/session/:token/data` — LGPD: retornar todos os dados pessoais da sessão (direito de acesso).

**Checklist:**
- [ ] LGPD: endpoint `DELETE /session/:token/data` para exclusão de dados pessoais (telefone, nomes). Pedidos/pagamentos são anonimizados.
- [ ] LGPD: endpoint `GET /session/:token/data` para acesso aos dados pessoais (direito de acesso via telefone verificado). Ver `docs/seguranca.md` seção LGPD.
- [ ] LGPD: job agendado para anonimizar dados pessoais de sessões fechadas há mais de 90 dias.
- [ ] Rotação de JWT_SECRET testada end-to-end (suportar 2 secrets simultâneos — implementação na Sprint 2, teste de rotação aqui).
- [ ] Revisão de segurança: verificar que todos os campos de texto livre passam por sanitização `class-transformer`.
- [ ] Revisão de segurança: verificar que `$queryRaw`/`$executeRaw` (se usados) utilizam `Prisma.sql` para parametrização.
- [ ] Revisão de segurança: verificar que upload de imagens valida MIME type real em todos os endpoints.
