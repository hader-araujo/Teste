# Sprint 13 — KDS Frontend

Frontend do KDS. Zero endpoints REST novos.

**Checklist:**
- [ ] Frontend KDS genérico — uma tela por Local de Preparo (dark mode, temporizadores, cores de status).
- [ ] Header exibe nome do Local de Preparo. Seleção de Local de Preparo ao abrir o KDS.
- [ ] Cores: Verde (no prazo), Amarelo (atenção), Vermelho (atrasado).
- [ ] Alertas visuais e sonoros para pedido novo/urgente.
- [ ] Clique no prato para ficha técnica (ingredientes, modo de preparo, foto).
- [ ] Botão "Pronto" com lógica:
  - Ponto de Entrega com `autoDelivery = false`: notifica garçom(ns) do setor para retirada.
  - Ponto de Entrega com `autoDelivery = true`: operador entrega direto. KDS exibe "Pronto" e "Entregue".
- [ ] Indicador de conexão WebSocket (componente da Sprint 11).
- [ ] Polling HTTP fallback para atualizações KDS quando desconectado (componente da Sprint 11).
