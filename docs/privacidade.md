# Politica de Privacidade — Texto e Regras

Definicao do conteudo e comportamento da Politica de Privacidade exibida ao cliente no fluxo de entrada (WhatsApp OTP).

## URL

- Rota publica: `/{slug}/privacidade` (nao requer sessao, nao requer autenticacao).
- Link exibido na tela de verificacao WhatsApp, abaixo do campo de telefone.
- Abre em nova aba (`target="_blank"`).

## Conteudo Obrigatorio (LGPD Art. 9)

O texto deve conter, no minimo:

1. **Identificacao do controlador:** nome do restaurante (exibido dinamicamente via slug) + "operado pela plataforma OChefia".
2. **Dados coletados:** numero de telefone (WhatsApp), nome informado na mesa.
3. **Finalidade:** identificacao na mesa para atribuicao de pedidos e divisao de conta. Nenhum uso para marketing, compartilhamento com terceiros ou formacao de perfil.
4. **Base legal:** consentimento (LGPD Art. 7, I) — ao informar o numero, o cliente consente com o uso descrito.
5. **Retencao:** dados pessoais sao anonimizados automaticamente 90 dias apos o fechamento da sessao. Durante a sessao, o cliente pode solicitar exclusao a qualquer momento.
6. **Direitos do titular (LGPD Art. 18):**
   - Acesso aos dados: disponivel na propria tela durante a sessao.
   - Exclusao: `DELETE /session/:token/data` (apos sessao fechada) ou via solicitacao ao estabelecimento.
   - Revogacao de consentimento: sair da mesa encerra o vinculo.
7. **Contato:** email de contato do restaurante (campo `Restaurant.email`) para exercicio de direitos.

## Texto de Consentimento Inline

Exibido diretamente na tela de verificacao WhatsApp, abaixo do campo de telefone:

> Ao informar seu numero, voce concorda com o uso dos seus dados para identificacao nesta mesa. Seus dados podem ser excluidos a qualquer momento. Consulte nossa [Politica de Privacidade](/{slug}/privacidade).

## Implementacao

- **Sprint P (prototipo):** link aponta para `privacidade.html` na pasta `prototypes/cliente/`.
- **Sprint 8 (frontend cliente):** pagina real renderizada server-side com dados do restaurante via slug. Conteudo estatico com nome do restaurante dinamico.
- **Sprint 26 (LGPD):** adicionar botao "Excluir meus dados" na propria pagina de privacidade (requer sessao fechada + telefone verificado).

## Responsabilidade

- O texto padrao e fornecido pela plataforma OChefia.
- O restaurante NAO edita o texto de privacidade na Fase 1 (texto unico para todos).
- Fase 2: possibilidade de customizacao pelo restaurante (campo opcional).
