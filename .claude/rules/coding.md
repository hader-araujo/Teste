# Convenções Gerais de Código

- TypeScript estrito. Nunca usar `any`.
- **Naming e exports são enforçados pelo ESLint** (configurado na Sprint 0). Referência rápida: variáveis/funções camelCase, arquivos kebab-case, classes PascalCase, enums UPPER_CASE, exportações nomeadas (sem `export default`, exceto páginas Next.js). **Não depender da LLM para isso — o linter pega.**
- Não usar `npm` — sempre `pnpm`. O projeto usa pnpm workspaces.
- Não criar arquivos fora da estrutura definida — respeitar a organização do monorepo.
- Não commitar `.env`, secrets ou credentials — nunca.
- Não usar `git add .` — adicionar arquivos específicos por nome.
- Não escrever texto em português sem acentuação — "Adição" nunca "Adicao".
- Não implementar Fase 2 (AWS, estoque, explorar, NFC-e) até aviso explícito.
