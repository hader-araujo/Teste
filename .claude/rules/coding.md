# Convenções Gerais de Código

- TypeScript estrito. Nunca usar `any`.
- Variáveis/funções: **camelCase**. Arquivos: **kebab-case**. Classes: **PascalCase**. Enums: **UPPER_CASE**.
- Exportações nomeadas — nunca `export default` (salvo páginas Next.js).
- Não usar `npm` — sempre `pnpm`. O projeto usa pnpm workspaces.
- Não criar arquivos fora da estrutura definida — respeitar a organização do monorepo.
- Não commitar `.env`, secrets ou credentials — nunca.
- Não usar `git add .` — adicionar arquivos específicos por nome.
- Não escrever texto em português sem acentuação — "Adição" nunca "Adicao".
- Não implementar Fase 2 (AWS, estoque, explorar, NFC-e) até aviso explícito.
