# Sprint 8 — Frontend Cliente: WhatsApp + Cardápio + Pessoas

Frontend do cliente. Zero endpoints REST novos.

**Checklist:**
- [ ] **Persistir `sessionToken`:** ao receber o token retornado por `POST /tables/:id/open` (primeiro cliente) ou `POST /session/:token/join` (entrante aprovado), salvar em localStorage (`ochefia_session_token`). Usar em todas as chamadas subsequentes (`/session/:token/*`). Limpar ao fechar sessão.
- [ ] **Tela de escolha após QR Code:** "Entrar na mesa" ou "Ver cardápio" (read-only sem sessão).
- [ ] **Modo read-only do cardápio:** acesso público com preços, sem poder fazer pedidos, sem identificação.
- [ ] Frontend cliente: tela WhatsApp (número + OTP). **Exibir texto de consentimento LGPD** claro sobre uso dos dados ao informar telefone (ver `docs/seguranca.md` seção LGPD).
- [ ] Frontend cliente: tela pessoas (+ botão no header de TODAS as telas do cliente).
- [ ] **Tela de pessoas com aprovação:** exibir entrantes pendentes com botões aprovar/rejeitar.
- [ ] **Tela de espera para entrantes:** mensagem de aguardo + botão "Lembrar mesa" (cooldown 60s) + botão "Ver cardápio" (read-only) + botão "Cancelar".
- [ ] **Notificação de novo entrante:** alerta in-app para membros aprovados (push notification na Sprint 18).
- [ ] Frontend cliente: cardápio com galeria, categorias, filtros.
- [ ] Frontend cliente: detalhe do produto.
