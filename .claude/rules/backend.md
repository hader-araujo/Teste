# Convenções Backend (NestJS — `apps/api`)

- Lógica de negócio no **Service**. Controller apenas recebe, valida com DTO e delega.
- Nunca importar Service de outro módulo diretamente — usar exports/imports NestJS.
- Inputs validados com `class-validator` + `ValidationPipe` global.
- Endpoints documentados com Swagger. Protegidos com `JwtAuthGuard` + `@Roles()`.
- Estrutura por módulo: `*.module.ts`, `*.controller.ts`, `*.controller.spec.ts`, `*.service.ts`, `*.service.spec.ts`, `dto/`.

## Shared (`packages/shared`)

- TypeScript puro. Zero dependências de framework. Tudo exportado pelo `index.ts`.

## Banco (Prisma)

- Tabelas: **snake_case plural** via `@@map`. Campos: **camelCase**. Enums: **UPPER_CASE**.
- Alterações via `prisma migrate dev`. Schema em `apps/api/prisma/schema.prisma`.
- Se usar `$queryRaw` ou `$executeRaw`: OBRIGATÓRIO usar template literals do Prisma (`Prisma.sql`). Nunca concatenar strings.

## NÃO FAÇA

- Não colocar lógica de negócio no Controller — só validação de DTO e delegação pro Service.
- Não chamar Service de outro módulo diretamente — usar o sistema de exports/imports do NestJS.
- Não retornar dados de outro restaurante — sempre filtrar por `restaurantId` do JWT.
- Não usar `prisma migrate dev` fora do ambiente local.
- Não criar endpoint sem `@Roles()` — todo endpoint precisa de permissão explícita.
