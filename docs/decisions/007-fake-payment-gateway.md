# ADR-007: Fake Payment Gateway na Fase 1

**Status:** Aceito
**Data:** 2026-03-14

## Contexto

O MVP precisa de pagamento Pix funcional. Alternativas: integrar com provedor real desde o início, ou usar gateway fake na Fase 1 e trocar depois.

## Decisão

`FakePaymentGateway` na Fase 1. Interface genérica `PaymentGateway` permite trocar implementação sem mexer no resto do código.

## Justificativa

- **MVP precisa validar o fluxo, não o provedor:** o importante é testar QR Code → pagamento → confirmação → conta atualizada. O provedor real não muda o fluxo.
- **Integração real atrasa o MVP:** setup de conta, documentação, sandbox, webhook real — semanas de overhead.
- **Interface genérica:** `PaymentGateway` com `createPixCharge()`, `verifyWebhook()`, `getPaymentStatus()`. Trocar de Fake para real é trocar a implementação, sem mexer em controller/service.
- **Simulação completa:** QR fake, webhook simulado com delay, confirmação automática. Testa o fluxo inteiro end-to-end.

## Alternativas descartadas

- **Integração real desde o início:** risco de ficar preso em burocracia do provedor. Provedor nem está definido ainda.

## Consequências

- `FakePaymentGateway` simula tudo: QR Code, webhook com delay, confirmação.
- PIX pendente expira em 30 min (mesmo fake).
- Antes do deploy para produção: escolher provedor, implementar `RealPaymentGateway`, configurar webhook real.
- Validação de assinatura do webhook já implementada na interface (mesmo fake valida, para garantir que o fluxo funciona).
