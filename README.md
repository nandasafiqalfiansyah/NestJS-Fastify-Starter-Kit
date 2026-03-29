# NestJS Fastify Starter Kit

Starter kit backend berbasis NestJS dan Fastify, dirancang untuk memulai API project dengan struktur yang clean, konsisten, dan mudah dikembangkan.

## Why This Starter

- Fast startup dengan Fastify
- Struktur dasar production-ready
- Konfigurasi environment terpusat
- Swagger untuk dokumentasi API
- Pondasi response dan error format yang konsisten
- Fleksibel untuk multi database

## Core Features

- NestJS 11 + Fastify adapter
- Swagger docs di `/docs`
- Global config via `@nestjs/config`
- Drizzle ORM untuk SQL database
- Multi database config: PostgreSQL, MySQL, SQLite
- NoSQL mode pada konfigurasi (provider terpisah dari Drizzle)
- Global response interceptor
- Global exception filter
- Global request validation pipe
- Health check endpoint di `/health`

## Project Structure

```text
src/
  common/
    filters/http-exception.filter.ts
    interceptors/response.interceptor.ts
    pipes/request-validation.pipe.ts
  database/
    database.config.ts
    database.module.ts
    database.types.ts
    drizzle.provider.ts
  health/
    health.controller.ts
    health.module.ts
  app.controller.ts
  app.module.ts
  app.service.ts
  main.ts
```

## Quick Start

1. Install dependencies

```bash
npm install
```

2. Create local environment file

```bash
cp .env.example .env
```

3. Run development server

```bash
npm run dev
```

4. Open service endpoints

- API root: `http://localhost:3000/`
- Swagger: `http://localhost:3000/docs`
- Health check: `http://localhost:3000/health`

## Environment Variables

Semua contoh tersedia di `.env.example`.

### App

- `APP_NAME`
- `APP_DESCRIPTION`
- `APP_VERSION`
- `APP_ENV`
- `APP_PORT`

### Database Mode

- `DB_CLIENT=postgres`
- `DB_CLIENT=mysql`
- `DB_CLIENT=sqlite`
- `DB_CLIENT=nosql`

### SQL Settings

- `DB_URL`
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_SSL`
- `DB_SQLITE_FILE`

### NoSQL Settings

- `NOSQL_PROVIDER`
- `NOSQL_URI`
- `NOSQL_DATABASE`

## Database Examples

PostgreSQL:

```env
DB_CLIENT=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=app_db
```

MySQL:

```env
DB_CLIENT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=secret
DB_NAME=app_db
```

SQLite:

```env
DB_CLIENT=sqlite
DB_SQLITE_FILE=./data/app.db
```

NoSQL mode:

```env
DB_CLIENT=nosql
NOSQL_PROVIDER=mongodb
NOSQL_URI=mongodb://localhost:27017
NOSQL_DATABASE=app_nosql_db
```

## Available Scripts

- `npm run dev` run watch mode
- `npm run build` compile to `dist`
- `npm run start` run app normally
- `npm run start:debug` run debug mode
- `npm run start:prod` run compiled app
- `npm run lint` run lint autofix
- `npm run test` run unit tests
- `npm run test:e2e` run e2e tests

## API Response Convention

Success response dibungkus oleh interceptor dalam bentuk:

```json
{
  "success": true,
  "path": "/endpoint",
  "timestamp": "2026-03-29T10:00:00.000Z",
  "data": {}
}
```

Error response dibentuk oleh global exception filter agar konsisten.

## Notes

Beberapa dependency Nest CLI lama masih memiliki peer dependency lawas. Saat menambah package baru, gunakan:

```bash
npm install <package-name> --legacy-peer-deps
```

## License

UNLICENSED
