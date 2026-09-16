# 🚀 AI AGENT MASTER IMPLEMENTATION PROMPT
## Feature: Autenticación con JWT Middleware en Express.js y Functional Interceptor en Angular 17 (Spec Hash: a135c5f5)
## Architecture: MONOLITH | Stack: TYPESCRIPT (express)
## Prompt Version / Audit Hash: prt_42d13031
## Author / Developer: Fenner Eduardo González C. <fennereduardo@gmail.com> (source: git)

### 📌 Context Files to Read & Follow:
- @.ghkgovernance.yaml
- @features/express_angular_auth.feature
- @generated-specs/contracts.ts
- @generated-specs/ADR-001-architecture-decisions.md
- @generated-specs/openapi.json
- @generated-specs/docker-compose.yml

### 🛠️ Technical Guardrails & Stack Specifications:
- **Language**: typescript (express)
- **Persistence**: prisma + mysql
- **Validation**: zod
- **Testing Framework**: vitest

### 🐳 Docker Execution Sandbox & Host Isolation Guardrails:
> **IMPORTANT**: If your host operating system lacks the native runtime SDK (TYPESCRIPT), DO NOT install heavy packages directly on the host machine.
> Execute all compilation, migrations, and test runs inside the isolated Docker container:
> 
> ```bash
> # Start database and infrastructure services
> docker compose up -d
> 
> # Execute test suite inside Docker sandbox container:
> docker compose run --rm app npx vitest run
> ```

### 🎯 Mandatory Step-by-Step Implementation Flow:

#### Phase 1: Pure Domain Layer
1. Read the feature specification in `features/express_angular_auth.feature` and contract in `generated-specs/contracts.ts`.
2. Implement pure domain Entities, Value Objects, and Domain Events.
3. Ensure zero dependencies on external frameworks or database drivers in the domain core.

#### Phase 2: Application Use Cases & Infrastructure
1. Implement the Repository Port interface using PRISMA (mysql).
2. Implement Controllers/Handlers to process HTTP requests and return appropriate status codes (e.g. 201 Created, 400 Bad Request).
3. Apply validation using zod.

#### Phase 3: Automated Unit & Feature Testing
1. Implement automated test cases in VITEST matching all scenarios in `features/express_angular_auth.feature`.
2. Assert HTTP response status codes, payload structures, and event emissions.
3. If host environment lacks SDK, run verification inside Docker sandbox (`docker compose run --rm app npx vitest run`).
4. Ensure 100% scenario pass rate.
