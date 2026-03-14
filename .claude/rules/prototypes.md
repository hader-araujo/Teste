# Convenções de Protótipos (Sprint P)

## Critério de Aprovação

- **100% de cobertura de telas obrigatória.** Todo fluxo descrito em `docs/fluxos.md`, `docs/design-cliente.md`, `docs/design-staff.md`, `docs/design-admin.md` e `docs/design-superadmin.md` DEVE ter protótipo correspondente em `prototypes/`.
- Protótipo não aprovado = sprint não concluída. Sem exceções.
- Verificar cobertura comparando cada passo dos fluxos documentados contra os HTMLs existentes.

## Padrão Obrigatório

- HTML + CSS + JS vanilla. Sem frameworks.
- Textos 100% em pt-BR com acentuação correta.
- Seguir `docs/design-system.md` (cores, tipografia, componentes, layout).
- Cada módulo em sua pasta: `prototypes/cliente/`, `prototypes/admin/`, `prototypes/kds/`, `prototypes/garcom/`, `prototypes/superadmin/`.
- Style guide (`prototypes/style-guide.html`) deve cobrir TODAS as interfaces (Cliente, KDS, Garçom, Admin, Super Admin).

## NÃO FAÇA

- Não aprovar protótipos com telas faltando — mesmo que "sejam simples" ou "óbvias".
- Não pular a comparação protótipo vs docs — a auditoria é obrigatória antes da aprovação.
- Não criar protótipo sem antes ler a spec correspondente no `docs/`.
