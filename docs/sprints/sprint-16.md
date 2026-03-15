# Sprint 16 — Garçom: Clock-in + Chamados + Mesas

**Endpoints (~8):**
- POST `/shifts/clock-in` — Garçom inicia turno (staffId + pin).
- POST `/shifts/clock-out` — Garçom encerra turno.
- GET `/shifts` — Listar turnos por período.
- GET `/shifts/active` — Garçons com turno ativo.
- POST `/tables/:id/open-staff` — Garçom abre mesa sem OTP. Body: `{ peopleCount, names? }`.
- POST `/calls` — Criar chamado (cliente).
- GET `/calls` — Listar chamados abertos (garçom).
- PATCH `/calls/:id/resolve` — Garçom resolveu.

**Checklist:**
- [ ] Clock-in/out com senha do garçom. Registro de tempo de serviço. Rate limit: 5 tentativas por staffId em 15min, lockout de 15min.
- [ ] Sistema de chamados com tipo (chamar garçom, pedir conta, outro).
- [ ] Frontend garçom: clock-in com senha.
- [ ] `POST /tables/:id/open-staff` — garçom abre mesa sem WhatsApp/OTP. Cria sessão + pessoas genéricas. `consentGivenAt` null.
- [ ] Frontend garçom: lista de mesas dos setores atribuídos (agrupadas por setor).
- [ ] Frontend garçom: chamados abertos.
- [ ] Botão "O Chefia" no cliente: modal com motivo + mensagem + enviar (usa `POST /calls`).
- [ ] Evento `admin:no-waiter-alert` — alerta severo ao admin quando cliente tenta abrir mesa em setor sem garçom com turno ativo (SESSION_019).
- [ ] Indicador de conexão WebSocket no garçom (componente da Sprint 12).
- [ ] Polling HTTP fallback no garçom quando desconectado (componente da Sprint 12).
