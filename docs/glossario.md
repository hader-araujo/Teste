# Glossário

Termos usados na documentação do OChefia. Ordem alfabética dentro de cada seção.

---

## Termos de Negócio

**Activity Log (Log de Atividade)** — Registro cronológico e legível de todas as ações de uma sessão (pedidos, reatribuições, cancelamentos). Visível para todos os membros da mesa na aba "Histórico" da conta.

**Aprovação de Entrantes** — Processo pelo qual clientes já aprovados na mesa decidem se um novo cliente pode entrar na sessão. A solicitação expira em 5 minutos sem resposta. Renotificação automática a cada 60 segundos.

**Cardápio Digital** — Interface pública acessível via QR Code que exibe produtos, categorias, tags e preços do restaurante. Pode ser usado em modo read-only (sem sessão) ou interativo (com sessão ativa).

**Chamado** — Solicitação do cliente ao garçom via botão "O Chefia". Possui motivo (chamar garçom, pedir conta, outro) e mensagem opcional. Status: OPEN ou RESOLVED.

**Claim** — Ato de um garçom assumir a responsabilidade de retirar e entregar um grupo de entrega. O primeiro garçom que toca "Retirar" assume o grupo inteiro. O grupo some da tela dos outros garçons. Ver *Grupo de Entrega*.

**Clock-in / Clock-out** — Registro de início e fim do turno de trabalho de um garçom. Exige senha numérica (PIN). Gera um registro de *Turno*.

**Comanda** — Tela do módulo garçom para lançar pedidos rápidos em nome da mesa. Busca de produtos, seleção de pessoas e envio direto, sem passar pelo carrinho do cliente.

**Conta** — Resumo financeiro da sessão com 3 visualizações: visão geral (todos os itens), por pessoa (itens de cada pessoa com divisão) e histórico (activity log). Inclui cálculo de taxa de serviço individual.

**Equipe do Dia** — Lista de funcionários que vão trabalhar em determinado dia. Auto-preenchida pela *Escala*. Permite ajustes manuais e atribuição de garçons a *Setores*.

**Escala** — Programação de trabalho dos funcionários por dia. Funcionários permanentes e temporários com dia fixo entram automaticamente. Permite desmarcar ou adicionar avulsos.

**Escalação de Retirada** — Sistema automático de alertas quando um item marcado como "Pronto" não é entregue. Nível 1: renotificação ao garçom do setor a cada `pickupReminderInterval` minutos. Nível 2: alerta para admin e todos os garçons após `pickupEscalationTimeout` minutos.

**Fechamento de Caixa** — Resumo de valores recebidos no dia por forma de pagamento (Pix, dinheiro, cartão). Parte do módulo de *Faturamento*.

**Force-close** — Fechamento forçado de sessão por OWNER/MANAGER (`POST /tables/:id/force-close`). Fecha mesmo com pagamentos pendentes — marca como PAYMENT_CANCELLED. Registra em AuditLog. Usado para calote ou situações excepcionais. Diferente do fechamento normal que exige pagamentos quitados.

**Funcionário Temporário** — Staff cadastrado com flag `temporario`. Pode ter dias fixos da semana ou ser avulso. Entra na *Escala* automaticamente nos dias fixos.

**Grupo de Entrega** — Agrupamento de itens de um mesmo pedido para fins de notificação e retirada. Cada pedido gera até 3 grupos: Normal (itens comuns, garçom notificado quando todos ficarem prontos), Entrega Antecipada (itens `earlyDelivery`, notificado quando todos os antecipados ficarem prontos) e Garçom Direto (entrega imediata sem KDS).

**Local de Preparo** — Lugar físico onde itens são produzidos (ex: "Cozinha Principal", "Pizzaria", "Bar"). Cada Local de Preparo corresponde a uma tela KDS independente. Possui um ou mais *Pontos de Entrega*.

**Mapeamento Setor-Local de Preparo** — Vínculo obrigatório entre cada *Setor* e cada *Local de Preparo*, indicando qual *Ponto de Entrega* os garçons daquele setor usam para retirada. Bloqueia abertura de sessão se incompleto.

**Máquina de Estados do Pedido** — Fluxo de status de cada item: Na fila -> Preparando -> Pronto -> Entregue. Cancelamento possível em Na fila (cliente ou staff) e Preparando (staff). Pronto/Entregue só cancelável por OWNER/MANAGER. Sem transição reversa.

**Mesa** — Entidade física do restaurante identificada por nome/número. Pertence a exatamente 1 *Setor*. Possui QR Code fixo que gera URL permanente. Status: FREE ou OCCUPIED.

**Módulo** — Unidade funcional do sistema. O módulo padrão (Fase 1) inclui cardápio, pedidos, KDS, garçom, mesas, faturamento e dashboard. Módulos extras (Fase 2) são vendidos separadamente e habilitados pelo *Super Admin*.

**Notes (Observações)** — Campo de texto livre em cada item de pedido para instruções especiais do cliente (ex: "bem passado", "sem cebola"). Exibido em destaque amarelo no KDS.

**Modo Read-only** — Visualização do cardápio sem sessão ativa (Caminho A do fluxo do cliente). Cliente escaneia QR Code e escolhe "Ver cardápio" sem entrar na mesa. Pode ver produtos e preços, mas não pode adicionar ao carrinho nem fazer pedidos.

**Pessoa** — Indivíduo cadastrado numa sessão de mesa. Não exige verificação de identidade — basta um nome. Itens do pedido são atribuídos a pessoas para divisão da conta.

**Ponto de Entrega** — Local onde o garçom retira o item pronto. Pertence a um *Local de Preparo*. Exemplos: "Pass principal", "Balcão do bar". Possui flag `kitchenDelivery` que determina se o operador do KDS entrega direto na mesa.

**PIN** — Personal Identification Number. Senha numérica de 4 dígitos usada por garçons (clock-in) e operadores KDS (login). Definida no cadastro do funcionário, armazenada com hash bcrypt. OWNER/MANAGER pode resetar via `POST /staff/:id/reset-pin`.

**QR Code** — Código impresso e fixo em cada mesa. Gera URL permanente `/{slug}/mesa/{mesaId}`. Ponto de entrada do cliente no sistema.

**Reatribuição de Pessoas** — Ação de alterar quais pessoas dividem um item já pedido. Feita exclusivamente pelo cliente na tela "Meus Pedidos". Registrada no *Activity Log*.

**Sessão Fantasma** — Sessão aberta por alguém que escaneou o QR Code remotamente (ex: foto do QR Code) sem estar fisicamente na mesa. Detectada quando garçom vai até a mesa e encontra vazia. Mitigação: auto-close de sessão vazia após `idleTableThreshold` minutos, alertas de mesa ociosa, garçom fecha via `POST /tables/:id/close`.

**Sessão de Mesa** — Período entre a abertura e o fechamento de uma mesa. Vincula pessoas, pedidos, pagamentos e activity log. Identificada por token criptográfico. Pode ser transferida entre mesas.

**Setor** — Agrupamento físico de mesas (ex: "Salão Principal", "Terraço", "VIP"). Garçons são atribuídos a setores, não a mesas individuais. Taxa de serviço dividida igualmente entre garçons do mesmo setor.

**Super Admin** — Equipe interna do OChefia com acesso cross-tenant. Gerencia estabelecimentos, cobrança, módulos extras e monitoramento da plataforma. Não acessível por restaurantes.

**Tag de Produto** — Rótulo descritivo aplicado a produtos do cardápio (ex: vegano, sem glúten, picante, sugestão do chef). Usado para filtros no cardápio digital.

**Taxa de Serviço** — Percentual (default 10%) cobrado sobre o consumo de cada pessoa. Configurável por restaurante. Pode ser desabilitada individualmente por pessoa pelo garçom. Valor distribuído entre garçons do setor com cálculo *forward-only*.

**Ticket Médio por Mesa** — Receita total dividida pela quantidade de sessões fechadas num período. Mostra o gasto médio por visita/mesa. Exibido no *Faturamento* diário.

**Ticket Médio por Pessoa** — Receita total dividida pelo total de pessoas que pagaram num período. Mostra o gasto médio por cliente individual. Exibido ao lado do ticket médio por mesa no *Faturamento* diário.

**Transferência de Mesa** — Mover uma sessão inteira (pessoas, pedidos, conta) para outra mesa livre. Executada apenas por staff. Funciona entre setores. Claims ativos são liberados automaticamente.

**Turno** — Registro de período de trabalho de um garçom. Criado pelo *clock-in* e encerrado pelo *clock-out*. Registra hora de início e fim.

---

## Mapeamento de Terminologia (Código ↔ Interface)

A API e o schema usam enums em UPPER_CASE (inglês). A interface do cliente exibe em pt-BR. O frontend é responsável pela tradução.

| Enum (código) | pt-BR (interface) | Contexto |
|---|---|---|
| `ORDER_QUEUED` | Na fila | Status do pedido |
| `ORDER_PREPARING` | Preparando | Status do pedido |
| `ORDER_READY` | Pronto | Status do pedido |
| `ORDER_DELIVERED` | Entregue | Status do pedido |
| `ORDER_CANCELLED` | Cancelado | Status do pedido (OrderItemStatus) |
| `PAYMENT_CANCELLED` | Pagamento cancelado | Status de pagamento (tentativa cancelada antes de pagar) |
| `FREE` | Livre | Status da mesa |
| `OCCUPIED` | Ocupada | Status da mesa |
| `WAITER` | Garçom | Role / motivo de chamado |
| `KITCHEN` | Operador de KDS | Role |
| `OWNER` | Dono | Role |
| `MANAGER` | Gerente | Role |
| `SUPER_ADMIN` | Super Admin | Role (equipe interna OChefia) |
| `NORMAL` | Entrega com pedido completo | Grupo de entrega |
| `EARLY_DELIVERY` | Entrega antecipada | Grupo de entrega |
| `WAITER_DIRECT` | Garçom direto | Grupo de entrega |
| `PIX` | Pix | Método de pagamento |
| `CASH` | Dinheiro | Método de pagamento |
| `CARD_DEBIT` | Cartão de débito | Método de pagamento |
| `CARD_CREDIT` | Cartão de crédito | Método de pagamento |
| `PAYMENT_PENDING` | Pendente | Status de pagamento |
| `PAYMENT_CONFIRMED` | Confirmado | Status de pagamento |
| `PAYMENT_EXPIRED` | Expirado | Status de pagamento |
| `PAYMENT_PENDING_REFUND` | Devolução pendente | Status de pagamento |
| `PAYMENT_REFUNDED` | Devolvido | Status de pagamento |

---

## Termos Técnicos

**kitchenDelivery** — Flag booleana do *Ponto de Entrega* (default `false`). Quando `true`, o operador do KDS entrega o item direto na mesa (entrega pela cozinha) — o garçom não é notificado para retirada. Quando `false`, o garçom é notificado pelo sistema de *Grupos de Entrega*.

**backoff exponencial** — Estratégia de reconexão do Socket.IO onde o intervalo entre tentativas aumenta progressivamente. Comportamento padrão da biblioteca.

**backpressure** — Mecanismo de controle de carga em WebSocket. Eventos não-críticos (ex: metrics-update) usam `socket.volatile.emit()` que descarta se não conseguir enviar. Eventos críticos usam emit normal.

**Bull (job queue)** — Fila de processamento assíncrono baseada em Redis. Usada para processar webhooks Pix e verificar solicitações de aprovação expiradas.

**circuit breaker** — Padrão de resiliência que interrompe chamadas a serviços externos (ex: provedor Pix) após falhas consecutivas. Evita sobrecarga em cascata.

**correlationId** — Identificador único propagado em todas as requests e eventos WebSocket. Permite rastrear uma operação completa através dos logs Winston e do AuditLog.

**forward-only** — Princípio de cálculo da taxa de garçom: a taxa é calculada no momento do pagamento de cada pessoa, usando os garçons atribuídos ao setor naquele instante. Não é retroativo — garçons que entram depois só recebem taxa de pagamentos futuros.

**idempotency** — Garantia de que processar a mesma operação múltiplas vezes produz o mesmo resultado. Aplicado ao webhook Pix via campo `pixExternalId` para ignorar notificações duplicadas.

**earlyDelivery** — Flag booleana do produto (default `false`). Quando `true`, o item pode ser entregue antes dos demais do mesmo pedido (ex: drinks). Gera um *Grupo de Entrega* separado do tipo EARLY_DELIVERY.

**multi-tenancy** — Isolamento de dados entre restaurantes. Toda entidade vinculada a restaurante possui campo `restaurantId`. Queries sempre filtram por tenant.

**orderDelayThreshold** — Parâmetro configurável (default 15min) que define o tempo máximo que um pedido pode ficar "Na fila" antes de gerar alerta de "pedido atrasado" no dashboard. Diferente de `pickupEscalationTimeout`.

**pickupEscalationTimeout** — Parâmetro configurável (default 10min) que define o tempo para escalar um item "Pronto" sem entrega ao nível 2 (admin + todos os garçons). Ver *Escalação de Retirada*.

**pickupReminderInterval** — Parâmetro configurável (default 3min) que define o intervalo de renotificação ao garçom do setor para itens "Pronto" sem entrega. Nível 1 da *Escalação de Retirada*.

**idleTableThreshold** — Parâmetro configurável (default 30min) que define o tempo sem novo pedido para uma mesa ser considerada ociosa e gerar alerta no dashboard.

**polling HTTP** — Fallback para atualizações críticas quando a conexão WebSocket está inativa. Requisições GET periódicas (a cada 10s) para endpoints REST até a reconexão.

**Redis Adapter** — Adaptador `@socket.io/redis-adapter` que permite múltiplas instâncias da API compartilharem rooms e eventos WebSocket via Redis. Configurado desde a Fase 1 para preparar scaling horizontal.

**room (WebSocket)** — Canal lógico do Socket.IO onde eventos são emitidos para um grupo de sockets. Exemplos: `session:{token}` (clientes da mesa), `restaurant:{id}:kds:{prepLocationId}` (KDS de um local), `restaurant:{id}:waiter:sector:{sectorId}` (garçons de um setor).

**sessionToken** — Token criptograficamente seguro (UUID v4 ou `crypto.randomBytes(32).toString('hex')`) que identifica uma sessão de mesa. Usado na URL e em endpoints REST para acesso público sem JWT.

**slug** — Identificador único do restaurante usado na URL pública (`/{slug}/mesa/{mesaId}`). Ex: "ze-bar". Definido no cadastro do estabelecimento.

**snapshot de preço** — Cópia do preço do produto no momento do pedido (`unitPrice` no OrderItem). Garante que alterações futuras no cardápio não afetam pedidos existentes.

**soft delete** — Exclusão lógica via campo `deletedAt`. O registro permanece no banco para preservar histórico e métricas, mas é excluído de queries normais. Aplicado em mesas, setores, locais de preparo, categorias e produtos.

**StorageService** — Interface abstrata para upload e entrega de imagens. Implementação Local (filesystem + nginx) na Fase 1 e S3 + CloudFront na Fase 2. Resize com `sharp` em 3 tamanhos: thumb (200px), medium (600px) e original.

**volatile emit** — Método do Socket.IO (`socket.volatile.emit()`) que descarta o evento se não conseguir enviá-lo imediatamente. Usado para eventos não-críticos como atualização de métricas. Ver *backpressure*.

**webhook** — Endpoint que recebe notificações externas (ex: confirmação de pagamento Pix). Valida assinatura de forma síncrona e processa via Bull. Protegido por idempotency.

---

## Siglas

**ADR** — Architecture Decision Record. Registro formal de decisões arquiteturais do projeto, criado na Sprint 0.

**ALB** — Application Load Balancer. Balanceador de carga da AWS usado na Fase 2 para distribuir tráfego entre instâncias.

**CDN** — Content Delivery Network. Rede de distribuição de conteúdo. Na Fase 2, CloudFront serve imagens armazenadas no S3.

**CNPJ** — Cadastro Nacional da Pessoa Jurídica. Identificador fiscal do estabelecimento, opcional na Fase 1.

**CRUD** — Create, Read, Update, Delete. Operações básicas de manipulação de dados.

**CSRF** — Cross-Site Request Forgery. Ataque onde um site malicioso induz o navegador a enviar requests autenticadas. Mitigado por tokens e headers de segurança.

**CSP** — Content Security Policy. Header HTTP que restringe origens de scripts, estilos e recursos carregáveis pelo navegador.

**DTO** — Data Transfer Object. Objeto usado para validação e tipagem de dados de entrada nos controllers NestJS, com `class-validator`.

**ECS** — Elastic Container Service. Serviço AWS para orquestração de containers Docker, usado na Fase 2.

**FK** — Foreign Key. Chave estrangeira que referencia a PK de outra tabela.

**JWT** — JSON Web Token. Token de autenticação usado por staff (admin, garçom, cozinha). Emitido no login e validado pelo `JwtAuthGuard`.

**KDS** — Kitchen Display System. Sistema de exibição para equipe de produção (cozinha, bar). Cada *Local de Preparo* tem sua tela KDS independente com fila de pedidos, temporizadores e botões de status.

**LGPD** — Lei Geral de Proteção de Dados. Legislação brasileira de privacidade. O sistema oferece endpoints de acesso e exclusão de dados pessoais. Anonimização automática após 90 dias.

**M:N** — Relacionamento muitos-para-muitos. Implementado via tabela intermediária (ex: OrderItemPerson, ProductTag).

**NFC-e** — Nota Fiscal de Consumidor Eletrônica. Emissão fiscal integrada, prevista como módulo extra na Fase 2.

**OTP** — One-Time Password. Código de 6 dígitos enviado via WhatsApp para verificação do número do cliente. Válido por tempo limitado.

**PK** — Primary Key. Chave primária da tabela. UUID em todos os modelos do OChefia.

**PWA** — Progressive Web App. Aplicação web que funciona como app nativo (offline, push notifications, instalação). O cardápio do cliente e o módulo garçom são PWAs.

**RLS** — Row-Level Security. Política de segurança a nível de linha no banco de dados que restringe acesso por tenant (`restaurantId`). Garante isolamento entre restaurantes.

**RSS** — Resident Set Size. Métrica de uso de memória do processo Node.js. Monitorada para detectar memory leaks.

**SAT** — Sistema Autenticador e Transmissor de Cupons Fiscais Eletrônicos. Alternativa ao NFC-e, previsto como módulo extra na Fase 2.

**UUID** — Universally Unique Identifier. Identificador único usado como PK em todos os modelos. Versão 4 (aleatório).
