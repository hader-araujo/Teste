# ADR-007: Fake Payment Gateway na Fase 1

**Status:** Aceito
**Data:** 2026-03-14

## Contexto

O MVP precisa de pagamento Pix funcional. Alternativas: integrar com provedor real desde o inicio, ou usar gateway fake na Fase 1 e trocar depois.

## Decisao

`FakePaymentGateway` na Fase 1. Interface generica `PaymentGateway` permite trocar implementacao sem mexer no resto do codigo.

## Justificativa

- **MVP precisa validar o fluxo, nao o provedor:** o importante e testar QR Code → pagamento → confirmacao → conta atualizada. O provedor real nao muda o fluxo.
- **Integracao real atrasa o MVP:** setup de conta, documentacao, sandbox, webhook real — semanas de overhead.
- **Interface generica:** `PaymentGateway` com `createPixCharge()`, `verifyWebhook()`, `getPaymentStatus()`. Trocar de Fake pra real e trocar a implementacao, sem mexer em controller/service.
- **Simulacao completa:** QR fake, webhook simulado com delay, confirmacao automatica. Testa o fluxo inteiro end-to-end.

## Alternativas descartadas

- **Integracao real desde o inicio:** risco de ficar preso em burocracia do provedor. Provedor nem esta definido ainda.

## Consequencias

- `FakePaymentGateway` simula tudo: QR Code, webhook com delay, confirmacao.
- PIX pendente expira em 30 min (mesmo fake).
- Antes do deploy pra producao: escolher provedor, implementar `RealPaymentGateway`, configurar webhook real.
- Validacao de assinatura do webhook ja implementada na interface (mesmo fake valida, pra garantir que o fluxo funciona).
