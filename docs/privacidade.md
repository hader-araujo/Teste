# Política de Privacidade — Texto e Regras

Definição do conteúdo e comportamento da Política de Privacidade exibida ao cliente no fluxo de entrada (WhatsApp OTP).

## URL

- Rota pública: `/{slug}/privacidade` (não requer sessão, não requer autenticação).
- Link exibido na tela de verificação WhatsApp, abaixo do campo de telefone.
- Abre em nova aba (`target="_blank"`).

## Conteúdo Obrigatório (LGPD Art. 9)

O texto deve conter, no mínimo:

1. **Identificação do controlador:** nome do restaurante (exibido dinamicamente via slug) + "operado pela plataforma OChefia".
2. **Dados coletados:** número de telefone (WhatsApp), nome informado na mesa.
3. **Finalidade:** identificação na mesa para atribuição de pedidos e divisão de conta. Nenhum uso para marketing, compartilhamento com terceiros ou formação de perfil.
4. **Base legal:** consentimento (LGPD Art. 7, I) — ao informar o número, o cliente consente com o uso descrito.
5. **Retenção:** dados pessoais são anonimizados automaticamente 90 dias após o fechamento da sessão. Durante a sessão, o cliente pode solicitar exclusão a qualquer momento.
6. **Direitos do titular (LGPD Art. 18):**
   - Acesso aos dados: disponível na própria tela durante a sessão.
   - Exclusão: `DELETE /session/:token/data` (após sessão fechada) ou via solicitação ao estabelecimento. Após o fechamento da sessão, a exclusão também pode ser solicitada via `DELETE /lgpd/data` (requer verificação do telefone via OTP).
   - Revogação de consentimento: sair da mesa encerra o vínculo.
7. **Contato:** email de contato do restaurante (campo `Restaurant.email`) para exercício de direitos.

## Texto de Consentimento Inline

Exibido diretamente na tela de verificação WhatsApp, abaixo do campo de telefone:

> Ao informar seu número, você concorda com o uso dos seus dados para identificação nesta mesa. Seus dados podem ser excluídos a qualquer momento. Consulte nossa [Política de Privacidade](/{slug}/privacidade).

## Implementação

- **Sprint P (protótipo):** link aponta para `privacidade.html` na pasta `prototypes/cliente/`.
- **Sprint 9 (frontend cliente):** página real renderizada server-side com dados do restaurante via slug. Conteúdo estático com nome do restaurante dinâmico.
- **Sprint 27 (LGPD):** adicionar botão "Excluir meus dados" na própria página de privacidade (requer sessão fechada + telefone verificado).

## Responsabilidade

- O texto padrão é fornecido pela plataforma OChefia.
- O restaurante NÃO edita o texto de privacidade na Fase 1 (texto único para todos).
- Fase 2: possibilidade de customização pelo restaurante (campo opcional).
