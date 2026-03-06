# Endpoints da API (RESTful)

Base URL: `/api/v1`

## Auth
| Metodo | Rota | Descricao |
|---|---|---|
| POST | `/auth/register` | Registro de restaurante + owner |
| POST | `/auth/login` | Login -> retorna JWT |
| POST | `/auth/refresh` | Refresh token |
| GET | `/auth/me` | Dados do usuario logado |

## Restaurant
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/restaurants/:slug` | Dados publicos do restaurante |
| PUT | `/restaurants/:id` | Atualizar dados (OWNER/MANAGER) |
| GET | `/restaurants/:id/settings` | Configuracoes |
| PUT | `/restaurants/:id/settings` | Atualizar configuracoes |

## Tables
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/tables` | Listar mesas do restaurante |
| POST | `/tables` | Criar mesa |
| PUT | `/tables/:id` | Atualizar mesa |
| DELETE | `/tables/:id` | Remover mesa |
| POST | `/tables/:id/open` | Abrir sessao da mesa |
| POST | `/tables/:id/close` | Fechar sessao (encerrar conta) |
| GET | `/tables/:id/session` | Sessao ativa da mesa |

## Table Session (acesso publico via token)
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/session/:token` | Dados da sessao (pedidos, conta) |
| POST | `/session/:token/join` | Cliente entrar na sessao |
| POST | `/session/:token/phone` | Enviar OTP via WhatsApp para o numero informado |
| POST | `/session/:token/phone/verify` | Confirmar OTP e salvar numero verificado na sessao |
| GET | `/session/:token/people` | Listar pessoas cadastradas na sessao |
| POST | `/session/:token/people` | Adicionar pessoa na mesa (body: `{ name }`) |
| DELETE | `/session/:token/people/:personId` | Remover pessoa da mesa |
| PATCH | `/session/:token/service-charge` | Desabilitar/habilitar taxa de servico (garcom only) |
| GET | `/session/:token/bill` | Conta detalhada com divisao por pessoa + taxa de servico |

## Menu
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/menu/:restaurantSlug` | Cardapio publico (com cache Redis) |
| GET | `/menu/categories` | Listar categorias (admin) |
| POST | `/menu/categories` | Criar categoria |
| PUT | `/menu/categories/:id` | Atualizar categoria |
| GET | `/menu/products` | Listar produtos (admin) |
| POST | `/menu/products` | Criar produto (bebidas incluem `readyMade: bool` — pronta ou preparada) |
| PUT | `/menu/products/:id` | Atualizar produto |
| PATCH | `/menu/products/:id/availability` | Toggle disponibilidade |

## Upload (Imagens)
| Metodo | Rota | Descricao |
|---|---|---|
| POST | `/upload/product-images` | Upload de imagens de produto (multipart, max 5 por request) |
| DELETE | `/upload/product-images/:imageId` | Remover imagem de produto |

## Orders
| Metodo | Rota | Descricao |
|---|---|---|
| POST | `/orders` | Criar pedido (via sessao token). Cada item inclui `personIds[]` (obrigatorio, pelo menos 1). Pedidos mistos geram sub-pedidos automaticos com sufixo (`_cozinha`, `_bar`, `_garcom`) |
| GET | `/orders` | Listar pedidos (admin, filtros) |
| GET | `/orders/:id` | Detalhes do pedido |
| PATCH | `/orders/:id/status` | Atualizar status (KDS/garcom) |
| PATCH | `/orders/items/:id/status` | Atualizar status de item individual |
| PATCH | `/orders/items/:id/people` | Reatribuir pessoas a um item (body: `{ personIds[] }`) |

## Payments
| Metodo | Rota | Descricao |
|---|---|---|
| POST | `/payments` | Iniciar pagamento individual por pessoa (body: `{ sessionToken, personId }`) |
| GET | `/payments/:id/status` | Verificar status |
| POST | `/payments/pix/webhook` | Webhook de confirmacao Pix |
| GET | `/payments/session/:token` | Listar pagamentos da sessao (quem ja pagou, quem falta) |

## Call Requests
| Metodo | Rota | Descricao |
|---|---|---|
| POST | `/calls` | Criar chamado (cliente) |
| GET | `/calls` | Listar chamados abertos (garcom) |
| PATCH | `/calls/:id/acknowledge` | Garcom viu |
| PATCH | `/calls/:id/resolve` | Garcom resolveu |

## Stock
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/stock/ingredients` | Listar ingredientes |
| POST | `/stock/ingredients` | Criar ingrediente |
| PUT | `/stock/ingredients/:id` | Atualizar estoque |
| GET | `/stock/alerts` | Ingredientes abaixo do minimo |

## Dashboard
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/dashboard/overview` | Metricas gerais em tempo real |
| GET | `/dashboard/revenue` | Faturamento por periodo |
| GET | `/dashboard/popular-items` | Itens mais vendidos |

## Staff
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/staff` | Listar funcionarios |
| POST | `/staff` | Criar funcionario (body inclui `temporary: bool`, `fixedWeekdays?: number[]`, `delivers?: bool` para BAR) |
| POST | `/staff/invite` | Enviar convite (log no console em dev) |
| POST | `/staff/accept` | Aceitar convite e criar conta (publico) |
| PUT | `/staff/:id` | Atualizar funcionario |
| DELETE | `/staff/:id` | Desativar funcionario |

## Escala (Programacao de Equipe)
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/schedule` | Listar escala por periodo (query: `from`, `to`) |
| GET | `/schedule/day/:date` | Equipe do dia (auto-preenchido + ajustes manuais) |
| PUT | `/schedule/day/:date` | Definir equipe do dia (body: `{ staffIds[] }`) |
| PATCH | `/schedule/day/:date/tables` | Distribuir mesas entre garcons do dia (body: `{ assignments: [{ staffId, tableIds[] }] }`) |

## Configuracoes de Distribuicao
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/restaurants/:id/settings` | Inclui `tableDistributionMode`: `all` ou `auto` |
| PUT | `/restaurants/:id/settings` | Atualizar modo de distribuicao |
