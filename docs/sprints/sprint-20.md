# Sprint 20 — Push Notifications + Escalação de Retirada

Infraestrutura de notificações. Zero endpoints REST novos.

**Checklist:**
- [ ] Push notifications via Service Worker + Web Push API.
- [ ] **Service Worker com cache do cardápio para suporte offline** (leitura do cardápio funciona sem internet). Estratégia stale-while-revalidate.
- [ ] Notificação: item pronto para retirada (com indicação do Ponto de Entrega).
- [ ] Notificação: chamado de mesa.
- [ ] **Escalação de retirada nível 1:** job que verifica itens com status "Pronto" sem "Entregue" há mais de `pickupReminderInterval` minutos. Reenvia push + alerta in-app ao(s) garçom(ns) do setor. Repete a cada intervalo até entrega ou escalação nível 2.
- [ ] **Escalação de retirada nível 2:** item "Pronto" sem "Entregue" há mais de `pickupEscalationTimeout` minutos. Notifica admin (push + alerta dashboard via `admin:pickup-escalation`) + todos os garçons ativos (via `waiter:pickup-escalation`). Registra ocorrência para relatório.
- [ ] **Registro de escalações:** salvar cada ocorrência (garçom responsável, item, mesa, tempo de espera, nível) para consulta em relatório do admin (Sprint 22).
- [ ] Pontos de Entrega com `kitchenDelivery = true`: operador recebe notificação própria (sem notificar garçom). Não passa por escalação.
- [ ] Real-time admin: table update, metrics update via WebSocket, alerta de escalação de retirada (nível 2).
- [ ] Indicador de conexão WebSocket no cliente (pedidos/conta — componente da Sprint 13).
- [ ] Polling HTTP fallback no cliente quando desconectado (componente da Sprint 13).
