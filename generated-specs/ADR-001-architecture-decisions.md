# ADR 001: Architecture Decisions for Autenticación con JWT Middleware en Express.js y Functional Interceptor en Angular 17

## Status
Accepted

## Context
Project requiring structured implementation matching Gherkin specification.

## Decisions
- **Architecture Style**: Monolith Architecture (MVC / Monolithic) (monolith)
- **Primary Backend Language**: typescript
- **Backend Framework**: express (^10.3.0)
- **ORM / Persistence**: prisma (@prisma/client@^5.10.0)
- **Validation**: zod (zod@^3.22.4)
- **Authentication**: jwt-bcrypt (bcrypt cost factor 12, JWT TTL 3600s)
- **Backend Testing Framework**: vitest (vitest@^1.3.0, @vitest/coverage-v8)
- **Frontend Framework**: angular
- **Frontend Language**: javascript
- **Frontend Bundler**: vite
- **Frontend Unit Testing**: vitest
- **Frontend E2E Testing**: cypress

## Prohibited Layer Dependencies
Domain core must NOT import:
- `direct SQL string interpolation`
- `global state mutation`
- `express`
- `@nestjs/common`
- `prisma`
- `typeorm`
