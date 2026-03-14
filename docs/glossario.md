# Glossario

Termos usados na documentacao do OChefia. Ordem alfabetica dentro de cada secao.

---

## Termos de Negocio

**Activity Log (Log de Atividade)** — Registro cronologico e legivel de todas as acoes de uma sessao (pedidos, reatribuicoes, cancelamentos). Visivel para todos os membros da mesa na aba "Historico" da conta.

**Aprovacao de Entrantes** — Processo pelo qual clientes ja aprovados na mesa decidem se um novo cliente pode entrar na sessao. A solicitacao expira em 5 minutos sem resposta. Renotificacao automatica a cada 60 segundos.

**Cardapio Digital** — Interface publica acessivel via QR Code que exibe produtos, categorias, tags e precos do restaurante. Pode ser usado em modo read-only (sem sessao) ou interativo (com sessao ativa).

**Chamado** — Solicitacao do cliente ao garcom via botao "O Chefia". Possui motivo (chamar garcom, pedir conta, outro) e mensagem opcional. Status: OPEN ou RESOLVED.

**Claim** — Ato de um garcom assumir a responsabilidade de retirar e entregar um grupo de entrega. O primeiro garcom que toca "Retirar" assume o grupo inteiro. O grupo some da tela dos outros garcons. Ver *Grupo de Entrega*.

**Clock-in / Clock-out** — Registro de inicio e fim do turno de trabalho de um garcom. Exige senha numerica (PIN). Gera um registro de *Turno*.

**Comanda** — Tela do modulo garcom para lancar pedidos rapidos em nome da mesa. Busca de produtos, selecao de pessoas e envio direto, sem passar pelo carrinho do cliente.

**Conta** — Resumo financeiro da sessao com 3 visualizacoes: visao geral (todos os itens), por pessoa (itens de cada pessoa com divisao) e historico (activity log). Inclui calculo de taxa de servico individual.

**Equipe do Dia** — Lista de funcionarios que vao trabalhar em determinado dia. Auto-preenchida pela *Escala*. Permite ajustes manuais e atribuicao de garcons a *Setores*.

**Escala** — Programacao de trabalho dos funcionarios por dia. Funcionarios permanentes e temporarios com dia fixo entram automaticamente. Permite desmarcar ou adicionar avulsos.

**Escalacao de Retirada** — Sistema automatico de alertas quando um item marcado como "Pronto" nao e entregue. Nivel 1: renotificacao ao garcom do setor a cada `pickupReminderInterval` minutos. Nivel 2: alerta para admin e todos os garcons apos `pickupEscalationTimeout` minutos.

**Fechamento de Caixa** — Resumo de valores recebidos no dia por forma de pagamento (Pix, dinheiro, cartao). Parte do modulo de *Faturamento*.

**Funcionario Temporario** — Staff cadastrado com flag `temporario`. Pode ter dias fixos da semana ou ser avulso. Entra na *Escala* automaticamente nos dias fixos.

**Grupo de Entrega** — Agrupamento de itens de um mesmo pedido para fins de notificacao e retirada. Cada pedido gera ate 3 grupos: Normal (itens comuns, garcom notificado quando todos ficarem prontos), Entrega Imediata (itens `immediateDelivery`, notificado quando todos os imediatos ficarem prontos) e Garcom Direto (entrega imediata sem KDS).

**Local de Preparo** — Lugar fisico onde itens sao produzidos (ex: "Cozinha Principal", "Pizzaria", "Bar"). Cada Local de Preparo corresponde a uma tela KDS independente. Possui um ou mais *Pontos de Entrega*.

**Mapeamento Setor-Local de Preparo** — Vinculo obrigatorio entre cada *Setor* e cada *Local de Preparo*, indicando qual *Ponto de Entrega* os garcons daquele setor usam para retirada. Bloqueia abertura de sessao se incompleto.

**Maquina de Estados do Pedido** — Fluxo de status de cada item: Na fila -> Preparando -> Pronto -> Entregue. Cancelamento possivel em Na fila (cliente ou staff) e Preparando (staff). Pronto/Entregue so cancelavel por OWNER/MANAGER. Sem transicao reversa.

**Mesa** — Entidade fisica do restaurante identificada por nome/numero. Pertence a exatamente 1 *Setor*. Possui QR Code fixo que gera URL permanente. Status: FREE, OCCUPIED ou AWAITING_CLEANUP.

**Modulo** — Unidade funcional do sistema. O modulo padrao (Fase 1) inclui cardapio, pedidos, KDS, garcom, mesas, faturamento e dashboard. Modulos extras (Fase 2) sao vendidos separadamente e habilitados pelo *Super Admin*.

**Notes (Observacoes)** — Campo de texto livre em cada item de pedido para instrucoes especiais do cliente (ex: "bem passado", "sem cebola"). Exibido em destaque amarelo no KDS.

**Pessoa** — Individuo cadastrado numa sessao de mesa. Nao exige verificacao de identidade — basta um nome. Itens do pedido sao atribuidos a pessoas para divisao da conta.

**Ponto de Entrega** — Local onde o garcom retira o item pronto. Pertence a um *Local de Preparo*. Exemplos: "Pass principal", "Balcao do bar". Possui flag `autoDelivery` que determina se o operador do KDS entrega direto na mesa.

**QR Code** — Codigo impresso e fixo em cada mesa. Gera URL permanente `/{slug}/mesa/{mesaId}`. Ponto de entrada do cliente no sistema.

**Reatribuicao de Pessoas** — Acao de alterar quais pessoas dividem um item ja pedido. Feita exclusivamente pelo cliente na tela "Meus Pedidos". Registrada no *Activity Log*.

**Sessao de Mesa** — Periodo entre a abertura e o fechamento de uma mesa. Vincula pessoas, pedidos, pagamentos e activity log. Identificada por token criptografico. Pode ser transferida entre mesas.

**Setor** — Agrupamento fisico de mesas (ex: "Salao Principal", "Terraco", "VIP"). Garcons sao atribuidos a setores, nao a mesas individuais. Taxa de servico dividida igualmente entre garcons do mesmo setor.

**Super Admin** — Equipe interna do OChefia com acesso cross-tenant. Gerencia estabelecimentos, cobranca, modulos extras e monitoramento da plataforma. Nao acessivel por restaurantes.

**Tag de Produto** — Rotulo descritivo aplicado a produtos do cardapio (ex: vegano, sem gluten, picante, sugestao do chef). Usado para filtros no cardapio digital.

**Taxa de Servico** — Percentual (default 10%) cobrado sobre o consumo de cada pessoa. Configuravel por restaurante. Pode ser desabilitada individualmente por pessoa pelo garcom. Valor distribuido entre garcons do setor com calculo *forward-only*.

**Ticket Medio** — Receita total dividida pela quantidade de pedidos num periodo. Exibido no *Faturamento* diario.

**Transferencia de Mesa** — Mover uma sessao inteira (pessoas, pedidos, conta) para outra mesa livre. Executada apenas por staff. Funciona entre setores. Claims ativos sao liberados automaticamente.

**Turno** — Registro de periodo de trabalho de um garcom. Criado pelo *clock-in* e encerrado pelo *clock-out*. Registra hora de inicio e fim.

---

## Termos Tecnicos

**autoDelivery** — Flag booleana do *Ponto de Entrega* (default `false`). Quando `true`, o operador do KDS entrega o item direto na mesa — o garcom nao e notificado para retirada. Quando `false`, o garcom e notificado pelo sistema de *Grupos de Entrega*.

**backoff exponencial** — Estrategia de reconexao do Socket.IO onde o intervalo entre tentativas aumenta progressivamente. Comportamento padrao da biblioteca.

**backpressure** — Mecanismo de controle de carga em WebSocket. Eventos nao-criticos (ex: metrics-update) usam `socket.volatile.emit()` que descarta se nao conseguir enviar. Eventos criticos usam emit normal.

**Bull (job queue)** — Fila de processamento assincrono baseada em Redis. Usada para processar webhooks Pix e verificar solicitacoes de aprovacao expiradas.

**circuit breaker** — Padrao de resiliencia que interrompe chamadas a servicos externos (ex: provedor Pix) apos falhas consecutivas. Evita sobrecarga em cascata.

**correlationId** — Identificador unico propagado em todas as requests e eventos WebSocket. Permite rastrear uma operacao completa atraves dos logs Winston e do AuditLog.

**forward-only** — Principio de calculo da taxa de garcom: a taxa e calculada no momento do pagamento de cada pessoa, usando os garcons atribuidos ao setor naquele instante. Nao e retroativo — garcons que entram depois so recebem taxa de pagamentos futuros.

**idempotency** — Garantia de que processar a mesma operacao multiplas vezes produz o mesmo resultado. Aplicado ao webhook Pix via campo `pixExternalId` para ignorar notificacoes duplicadas.

**immediateDelivery** — Flag booleana do produto (default `false`). Quando `true`, o item pode ser entregue antes dos demais do mesmo pedido (ex: drinks). Gera um *Grupo de Entrega* separado do tipo IMMEDIATE.

**multi-tenancy** — Isolamento de dados entre restaurantes. Toda entidade vinculada a restaurante possui campo `restaurantId`. Queries sempre filtram por tenant.

**orderDelayThreshold** — Parametro configuravel (default 15min) que define o tempo maximo que um pedido pode ficar "Na fila" antes de gerar alerta de "pedido atrasado" no dashboard. Diferente de `pickupEscalationTimeout`.

**pickupEscalationTimeout** — Parametro configuravel (default 10min) que define o tempo para escalar um item "Pronto" sem entrega ao nivel 2 (admin + todos os garcons). Ver *Escalacao de Retirada*.

**pickupReminderInterval** — Parametro configuravel (default 3min) que define o intervalo de renotificacao ao garcom do setor para itens "Pronto" sem entrega. Nivel 1 da *Escalacao de Retirada*.

**idleTableThreshold** — Parametro configuravel (default 30min) que define o tempo sem novo pedido para uma mesa ser considerada ociosa e gerar alerta no dashboard.

**polling HTTP** — Fallback para atualizacoes criticas quando a conexao WebSocket esta inativa. Requisicoes GET periodicas (a cada 10s) para endpoints REST ate a reconexao.

**Redis Adapter** — Adaptador `@socket.io/redis-adapter` que permite multiplas instancias da API compartilharem rooms e eventos WebSocket via Redis. Configurado desde a Fase 1 para preparar scaling horizontal.

**room (WebSocket)** — Canal logico do Socket.IO onde eventos sao emitidos para um grupo de sockets. Exemplos: `session:{token}` (clientes da mesa), `restaurant:{id}:kds:{prepLocationId}` (KDS de um local), `restaurant:{id}:waiter:sector:{sectorId}` (garcons de um setor).

**sessionToken** — Token criptograficamente seguro (UUID v4 ou `crypto.randomBytes(32).toString('hex')`) que identifica uma sessao de mesa. Usado na URL e em endpoints REST para acesso publico sem JWT.

**slug** — Identificador unico do restaurante usado na URL publica (`/{slug}/mesa/{mesaId}`). Ex: "ze-bar". Definido no cadastro do estabelecimento.

**snapshot de preco** — Copia do preco do produto no momento do pedido (`unitPrice` no OrderItem). Garante que alteracoes futuras no cardapio nao afetam pedidos existentes.

**soft delete** — Exclusao logica via campo `deletedAt`. O registro permanece no banco para preservar historico e metricas, mas e excluido de queries normais. Aplicado em mesas, setores, locais de preparo, categorias e produtos.

**StorageService** — Interface abstrata para upload e entrega de imagens. Implementacao Local (filesystem + nginx) na Fase 1 e S3 + CloudFront na Fase 2. Resize com `sharp` em 3 tamanhos: thumb (200px), medium (600px) e original.

**volatile emit** — Metodo do Socket.IO (`socket.volatile.emit()`) que descarta o evento se nao conseguir envia-lo imediatamente. Usado para eventos nao-criticos como atualizacao de metricas. Ver *backpressure*.

**webhook** — Endpoint que recebe notificacoes externas (ex: confirmacao de pagamento Pix). Valida assinatura de forma sincrona e processa via Bull. Protegido por idempotency.

---

## Siglas

**ADR** — Architecture Decision Record. Registro formal de decisoes arquiteturais do projeto, criado na Sprint 0.

**ALB** — Application Load Balancer. Balanceador de carga da AWS usado na Fase 2 para distribuir trafego entre instancias.

**CDN** — Content Delivery Network. Rede de distribuicao de conteudo. Na Fase 2, CloudFront serve imagens armazenadas no S3.

**CNPJ** — Cadastro Nacional da Pessoa Juridica. Identificador fiscal do estabelecimento, opcional na Fase 1.

**CRUD** — Create, Read, Update, Delete. Operacoes basicas de manipulacao de dados.

**CSRF** — Cross-Site Request Forgery. Ataque onde um site malicioso induz o navegador a enviar requests autenticadas. Mitigado por tokens e headers de seguranca.

**CSP** — Content Security Policy. Header HTTP que restringe origens de scripts, estilos e recursos carregaveis pelo navegador.

**DTO** — Data Transfer Object. Objeto usado para validacao e tipagem de dados de entrada nos controllers NestJS, com `class-validator`.

**ECS** — Elastic Container Service. Servico AWS para orquestracao de containers Docker, usado na Fase 2.

**FK** — Foreign Key. Chave estrangeira que referencia a PK de outra tabela.

**JWT** — JSON Web Token. Token de autenticacao usado por staff (admin, garcom, cozinha). Emitido no login e validado pelo `JwtAuthGuard`.

**KDS** — Kitchen Display System. Sistema de exibicao para equipe de producao (cozinha, bar). Cada *Local de Preparo* tem sua tela KDS independente com fila de pedidos, temporizadores e botoes de status.

**LGPD** — Lei Geral de Protecao de Dados. Legislacao brasileira de privacidade. O sistema oferece endpoints de acesso e exclusao de dados pessoais. Anonimizacao automatica apos 90 dias.

**M:N** — Relacionamento muitos-para-muitos. Implementado via tabela intermediaria (ex: OrderItemPerson, ProductTag).

**NFC-e** — Nota Fiscal de Consumidor Eletronica. Emissao fiscal integrada, prevista como modulo extra na Fase 2.

**OTP** — One-Time Password. Codigo de 6 digitos enviado via WhatsApp para verificacao do numero do cliente. Valido por tempo limitado.

**PK** — Primary Key. Chave primaria da tabela. UUID em todos os modelos do OChefia.

**PWA** — Progressive Web App. Aplicacao web que funciona como app nativo (offline, push notifications, instalacao). O cardapio do cliente e o modulo garcom sao PWAs.

**RLS** — Row-Level Security. Politica de seguranca a nivel de linha no banco de dados que restringe acesso por tenant (`restaurantId`). Garante isolamento entre restaurantes.

**RSS** — Resident Set Size. Metrica de uso de memoria do processo Node.js. Monitorada para detectar memory leaks.

**SAT** — Sistema Autenticador e Transmissor de Cupons Fiscais Eletronicos. Alternativa ao NFC-e, previsto como modulo extra na Fase 2.

**UUID** — Universally Unique Identifier. Identificador unico usado como PK em todos os modelos. Versao 4 (aleatorio).
