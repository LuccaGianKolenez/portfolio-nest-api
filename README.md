# Portfolio — Nest API (NestJS + TypeScript + Prisma + PostgreSQL + Swagger)

API de portfólio construída com **NestJS**, **TypeScript**, **Prisma** (ORM), **PostgreSQL**, documentação **OpenAPI/Swagger** e validação com **class-validator**. Estruturada no estilo “padrão sênior”: camadas claras, scripts úteis, e passos de rodar/testar localmente.

> Objetivo: servir como referência de setup e boas práticas para uma API Nest moderna, pronta para evoluir (CI, auth, versionamento, observabilidade, etc.).

---

## Sumário
- [Arquitetura & Stack](#arquitetura--stack)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Como Rodar (Local)](#como-rodar-local)
- [Rotas Principais](#rotas-principais)
- [CRUD: Items](#crud-items)
- [Scripts](#scripts)
- [Testar sem Banco (modo rápido)](#testar-sem-banco-modo-rápido)
- [Prisma & Migrações](#prisma--migrações)
- [Erros Comuns (Troubleshooting)](#erros-comuns-troubleshooting)

---

## Arquitetura & Stack

- **NestJS** (HTTP via `@nestjs/platform-express`)
- **TypeScript**
- **Prisma ORM** com **PostgreSQL**
- **Swagger/OpenAPI** (via `@nestjs/swagger` + `swagger-ui-express`)
- **class-validator** + **class-transformer** (validação/transformação em DTOs)
- Config 12-factor com **.env** (`@nestjs/config`)

---

## Estrutura de Pastas

```
portfolio-nest-api/
├─ src/
│  ├─ app.module.ts          # módulo raiz
│  ├─ main.ts                # bootstrap (ValidationPipe + Swagger)
│  ├─ health/                # /api/health
│  │  ├─ health.controller.ts
│  │  └─ health.module.ts
│  ├─ prisma/                # injeção do PrismaClient
│  │  ├─ prisma.module.ts
│  │  └─ prisma.service.ts
│  └─ items/                 # domínio de exemplo
│     ├─ dto/
│     │  ├─ create-item.dto.ts
│     │  └─ update-item.dto.ts
│     ├─ items.controller.ts
│     ├─ items.module.ts
│     └─ items.service.ts
├─ prisma/
│  ├─ schema.prisma          # schema do Prisma
│  └─ migrations/            # gerado pelo prisma migrate
├─ .env.example
├─ tsconfig.json
├─ tsconfig.build.json
├─ nest-cli.json
└─ .gitignore
```

---

## Variáveis de Ambiente

Crie um arquivo **`.env`** (baseado no `.env.example`):

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/portfolio_nest?schema=public"
```

> Ajuste `DATABASE_URL` conforme seu ambiente local (usuário/senha/porta).

---

## Como Rodar (Local)

```bash
# 1) Instalar dependências
pnpm install

# 2) Copiar env e ajustar se preciso
cp .env.example .env

# 3) Gerar client Prisma e aplicar migrações
pnpm prisma:generate
pnpm prisma:migrate

# 4) Rodar em desenvolvimento
pnpm dev
```

- **Health**: http://localhost:3000/api/health → `{"status":"ok"}`  
- **Swagger**: http://localhost:3000/api/docs

---

## 🌐 Rotas Principais

| Recurso           | Método(s)                         | Caminho                   | Auth |
|-------------------|-----------------------------------|---------------------------|------|
| **Health**        | `GET`                             | `/api/health`             | —    |
| **Swagger UI**    | `GET`                             | `/api/docs`               | —    |
| **Items**         | `GET \| POST`                     | `/api/items`              | —    |
| **Item por ID**   | `GET \| PATCH \| DELETE`         | `/api/items/{id}`         | —    |

> A API ainda não tem autenticação configurada. O objetivo aqui é demonstrar a base (Swagger, validação, Prisma, rotas).

---

## CRUD: Items

**Modelo (`prisma/schema.prisma`)**  
- `id` (UUID, PK), `name` (string, 120), `price` (decimal 10,2)  
- timestamps `createdAt`/`updatedAt`

**Exemplos (curl)**

Criar:
```bash
curl -X POST http://localhost:3000/api/items   -H "Content-Type: application/json"   -d '{"name":"Notebook","price":1999.90}'
```

Listar:
```bash
curl http://localhost:3000/api/items
```

Buscar por ID:
```bash
curl http://localhost:3000/api/items/<uuid>
```

Atualizar (parcial):
```bash
curl -X PATCH http://localhost:3000/api/items/<uuid>   -H "Content-Type: application/json"   -d '{"price":2199.90}'
```

Remover:
```bash
curl -X DELETE http://localhost:3000/api/items/<uuid>
```

---

## Scripts

`package.json` inclui:

```json
{
  "scripts": {
    "dev": "nest start --watch",
    "build": "nest build",
    "start": "node dist/main.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",

    "verify:types": "tsc -p tsconfig.json --noEmit",
    "verify:prisma": "prisma format && prisma validate",
    "verify:prisma:diff": "prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script",
    "verify": "pnpm verify:types && pnpm verify:prisma && pnpm verify:prisma:diff"
  }
}
```

- `pnpm verify` roda checagens **offline** (sem conectar no DB).

---

## 🧪 Testar sem Banco (modo rápido)

O projeto suporta subir **sem conectar ao Postgres** para validar **/api/health** e **/api/docs**.

```bash
# checagens offline (types + prisma validate + diff)
pnpm verify

# sobe sem DB (usa flag em PrismaService)
SKIP_DB_CONNECT=true pnpm dev
```

> As rotas de `items` exigem DB; sem DB vão falhar (esperado).

---

## Prisma & Migrações

- Gerar client: `pnpm prisma:generate`  
- Criar/applicar migrações: `pnpm prisma:migrate`  
- Inspecionar dados: `pnpm prisma:studio`

**Dica (macOS/Homebrew):** caso precise instalar/ativar o Postgres:
```bash
brew install postgresql@16
brew services start postgresql@16
```

Se seu usuário local não for `postgres`, ajuste a `DATABASE_URL`.  
Exemplo sem senha, usando seu usuário do macOS:
```
DATABASE_URL="postgresql://seuUsuario@localhost:5432/portfolio_nest?schema=public"
```

---

## Erros Comuns (Troubleshooting)

**`role "postgres" does not exist`**  
→ Crie o usuário `postgres` **ou** use seu usuário local na `DATABASE_URL`.  
```sql
-- via psql com seu usuário local:
CREATE ROLE postgres WITH LOGIN SUPERUSER PASSWORD 'postgres';
CREATE DATABASE portfolio_nest OWNER postgres;
```

**`P1010: User was denied access` (Prisma)**  
→ Permissões do usuário no DB. Verifique owner do DB/schema.

**`Cannot find module '@nestjs/common'`**  
→ Falta instalar deps base:  
```bash
pnpm add @nestjs/common @nestjs/core @nestjs/platform-express rxjs reflect-metadata
```

**`TS5058: tsconfig.json not found`**  
→ Crie `tsconfig.json` e `tsconfig.build.json` (estão versionados aqui).

