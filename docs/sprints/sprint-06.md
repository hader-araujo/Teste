# Sprint 6 — Sessão de Mesa + WhatsApp OTP + Pessoas (Backend)

Backend da sessão do cliente. Aprovação de entrantes na Sprint 7. Frontend na Sprint 8.

**Endpoints (~8):**
- POST `/tables/:id/open` — Estender endpoint da Sprint 3 com body opcional: `{ personCount?, names? }` para pré-cadastro de pessoas.
- GET `/session/:token` — Dados da sessão.
- POST `/session/:token/phone` — Enviar OTP via WhatsApp.
- POST `/session/:token/phone/verify` — Confirmar OTP.
- GET `/session/:token/people` — Listar pessoas na sessão.
- POST `/session/:token/people` — Adicionar pessoa na mesa.
- PATCH `/session/:token/people/:personId` — Atualizar nome da pessoa (body: `{ name }`).
- DELETE `/session/:token/people/:personId` — Remover pessoa.

**Checklist:**
- [ ] Sessão de mesa via token criptograficamente seguro (UUID v4 ou `crypto.randomBytes(32)`) na URL + cookie.
- [ ] `POST /tables/:id/open` com body opcional `{ personCount?, names? }` para pré-cadastro de pessoas ao abrir mesa.
- [ ] Geração de token seguro na criação da sessão.
- [ ] Verificação WhatsApp via OTP de 6 dígitos. Rate limit: 3 envios por sessão, cooldown 60s. OTP expira em 5min, max 5 tentativas.
- [ ] **Detalhes do fluxo OTP:**
  - `POST /session/:token/phone` é público — qualquer pessoa com token válido pode solicitar OTP, mesmo antes de entrar na sessão (necessário para o fluxo de verificação pré-entrada).
  - Envio via fila assíncrona (Bull + Redis). **Propagar `correlationId`** nos dados do job Bull.
  - Se provider WhatsApp indisponível: retornar HTTP 503 com `SESSION_012: Serviço de WhatsApp indisponível`. Tentativa **não conta** no rate limit (já documentado em `docs/seguranca.md`).
  - Expiração do OTP verificada no endpoint `/phone/verify` (checa `createdAt + 5min`), sem job Bull separado. Retorna `SESSION_003` se expirado.
- [ ] CRUD de pessoas na mesa (incluindo atualização de nome via PATCH).
- [ ] **Unicidade de telefone por sessão (SESSION_008):** mesmo número não pode estar em duas sessões ativas simultaneamente no mesmo restaurante.
- [ ] Sanitização de nomes de pessoas na mesa contra XSS via `class-transformer`.
- [ ] Error codes padronizados para módulo Session (SESSION_001 a SESSION_006, SESSION_008, SESSION_011, SESSION_012). Ver `docs/observabilidade.md`.
