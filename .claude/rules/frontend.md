# Convenções Frontend (Next.js — `apps/web`)

- Server Components por padrão. `'use client'` só quando necessário.
- Tailwind CSS exclusivo. Componentes >150 linhas devem ser quebrados.
- Props tipadas com `interface`. Named exports.
- Organização: `components/ui/`, `components/admin/`, `components/kds/`, `components/garcom/`, `components/cliente/`.

## Idioma

- **Toda a interface (labels, botões, mensagens, placeholders) deve ser 100% em pt-BR com acentuação correta.** Código (variáveis, funções, classes) permanece em inglês.
- **Acentuação obrigatória:** Todo texto em português visível ao usuário (UI, protótipos, mensagens de erro, placeholders, toasts) DEVE usar acentuação correta (ã, é, ç, ô, í, ú, etc). Nunca escrever "Adicao" em vez de "Adição", "voce" em vez de "você", "pedido esta pronto" em vez de "pedido está pronto". Isso se aplica a protótipos HTML, componentes React, mensagens de toast, e qualquer texto renderizado na tela.

## NÃO FAÇA

- Não usar `'use client'` sem necessidade — Server Components por padrão.
- Não instalar bibliotecas de componentes (Material UI, Chakra, etc.) — Tailwind CSS exclusivo.
- Não criar componentes com mais de 150 linhas sem quebrar em sub-componentes.
- Não misturar idiomas na interface — textos visíveis 100% em pt-BR, código em inglês.
