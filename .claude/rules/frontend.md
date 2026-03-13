# Convenções Frontend (Next.js — `apps/web`)

- Server Components por padrão. `'use client'` só quando necessário.
- Tailwind CSS exclusivo. Componentes >150 linhas devem ser quebrados.
- Props tipadas com `interface`. Named exports.
- Organização: `components/ui/`, `components/admin/`, `components/kds/`, `components/garcom/`, `components/cliente/`.

## Idioma

- **Toda a interface (labels, botões, mensagens, placeholders) deve ser 100% em pt-BR com acentuação correta.** Código (variáveis, funções, classes) permanece em inglês.
- **Acentuação obrigatória:** Todo texto em português visível ao usuário (UI, protótipos, mensagens de erro, placeholders, toasts) DEVE usar acentuação correta (ã, é, ç, ô, í, ú, etc). Nunca escrever "Adicao" em vez de "Adição", "voce" em vez de "você", "pedido esta pronto" em vez de "pedido está pronto". Isso se aplica a protótipos HTML, componentes React, mensagens de toast, e qualquer texto renderizado na tela.
