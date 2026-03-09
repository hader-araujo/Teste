# Design — Protótipos Super Admin (Sprint P)

**Data:** 2026-03-09
**Escopo:** 8 telas HTML do Super Admin + CSS + JS + dados mock + atualização dos docs

## Telas

| Arquivo | Conteúdo |
|---|---|
| `superadmin/login.html` | Login com branding OChefia, cor indigo |
| `superadmin/dashboard.html` | 4 KPIs + alertas recentes + últimos acessos |
| `superadmin/estabelecimentos.html` | Tabela com filtros (status, inadimplência) + busca + paginação |
| `superadmin/estabelecimento-novo.html` | Formulário: nome, slug (auto), CNPJ (máscara), responsável, email, telefone (máscara) |
| `superadmin/estabelecimento-detalhe.html` | Tabs: Dados Gerais, Cobrança, Módulos |
| `superadmin/cobranca.html` | Valor do plano + tabela pagamentos mensais + registrar pagamento + badges |
| `superadmin/modulos.html` | Grid de cards por módulo com toggle, valor padrão e override |
| `superadmin/monitoramento.html` | Métricas de uso por estabelecimento, últimos acessos, pedidos/mês |

## Visual

- Sidebar: `indigo-950` (#1E1B4B) — diferente do admin (`gray-900`)
- Logo OChefia com ícone indigo
- Item ativo: `bg-indigo-500/20 text-white`, ícone `indigo-400`
- Botão primário: `bg-indigo-500`
- Hover tabela: `indigo-50`
- Menu: Dashboard, Estabelecimentos, Módulos, Monitoramento

## CSS

Classes específicas no `style.css`: `.superadmin-sidebar`, `.btn-indigo`, etc.

## Dados mock

Adicionar ao `MOCK` no `app.js`:
- `establishments[]` — 8-10 com dados brasileiros realistas
- `modules[]` — 4 módulos (Padrão, Estoque, Explorar, NFC-e/SAT)
- `payments[]` — histórico de pagamentos mensais

## Interações JS

- Filtros na listagem (status, inadimplência)
- Busca por nome/slug
- Paginação funcional (mock)
- Alterar status com modal de confirmação
- Registrar pagamento com modal
- Toggle de módulos
- Auto-gerar slug a partir do nome
- Máscaras CNPJ e telefone

## Docs

- Atualizar `docs/sprints.md`: adicionar `monitoramento.html` na estrutura e checklist
