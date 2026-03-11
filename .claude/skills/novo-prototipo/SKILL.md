---
name: novo-prototipo
description: Criar novo protótipo HTML para o OChefia seguindo padrões da Sprint P
user-invocable: true
---

# Criar Novo Protótipo HTML

Cria um protótipo HTML estático para o OChefia, seguindo os padrões estabelecidos na Sprint P.

## Antes de criar

1. **Ler os docs relevantes** para a interface que será criada:
   - Cliente: `docs/design-cliente.md` + `docs/fluxos.md` (seção Cliente)
   - Admin: `docs/design-admin.md` + `docs/fluxos.md` (seção Admin)
   - KDS: `docs/design-staff.md` (seção KDS) + `docs/fluxos.md` (seção KDS)
   - Garçom: `docs/design-staff.md` (seção Garçom) + `docs/fluxos.md` (seção Garçom)
   - Super Admin: `docs/design-superadmin.md` + `docs/fluxos.md` (seção Super Admin)
   - Base (sempre): `docs/design-system.md` (paleta, tipografia, princípios)

2. **Ler os protótipos existentes** da mesma interface para manter consistência:
   - CSS compartilhado: `prototypes/css/style.css`
   - JS compartilhado: `prototypes/js/app.js`
   - Hub de navegação: `prototypes/index.html`
   - Pelo menos 1 protótipo da mesma interface (ex: se criando `admin/nova-tela.html`, ler `admin/dashboard.html`)

3. **Verificar o checklist** em `docs/sprints.md` (Sprint P) para confirmar que a tela está prevista.

## Estrutura obrigatória

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Título da Tela] — [Nome do Restaurante ou OChefia]</title>
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>
  <!-- Conteúdo aqui -->
  <script src="../js/app.js"></script>
</body>
</html>
```

## Regras

- **CSS:** Usar classes do `style.css` compartilhado. Estilos específicos da tela em `<style>` no `<head>` apenas se necessário.
- **JS:** Usar funções do `app.js` compartilhado. Scripts específicos em `<script>` no final do body.
- **Dados:** Hardcoded com valores realistas brasileiros (restaurante "Zé do Bar", pratos reais, preços reais, nomes reais).
- **Texto em pt-BR:** Com acentuação correta obrigatória. "Adição" nunca "Adicao".
- **Interações:** JS vanilla para interações básicas (carrinho, seleção, troca de abas, mudança de status).
- **Sem persistência:** Dados mock apenas. Não salvar em localStorage.
- **Responsivo:** Cliente e garçom em mobile (375px). Admin, KDS e Super Admin em desktop (1024px+).

## Após criar

1. **Adicionar link** no `prototypes/index.html` (hub de navegação), no card da interface correspondente.
2. **Adicionar navegação** de/para outras telas da mesma interface (links, sidebar, bottom nav).
3. **Verificar** que o protótipo abre corretamente no navegador e que as interações JS funcionam.
