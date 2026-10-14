# Copilot Instructions for Sistema de Agendamento

## Project Overview
- **Architecture:**
  - Monorepo with Java Spring Boot backend and React/Vite frontend.
  - Backend: `src/main/java/com/reserves/` (API, DTOs, services).
  - Frontend: `Sistema de Agendamento/src/` (React components, pages, hooks).
  - Data: PostgreSQL (via Docker Compose, scripts, or local connection).
  - API base path: `/api` (backend runs on port 8080).
  - Frontend runs on port 3000.

## Developer Workflows
- **Full stack (recommended):**
  - `docker compose up -d --build` (starts backend, frontend, and Postgres)
  - Access backend: [http://localhost:8080/api](http://localhost:8080/api)
  - Access frontend: [http://localhost:3000](http://localhost:3000)
  - Stop: `docker compose down`
- **Backend only:**
  - `./mvnw spring-boot:run` (dev mode)
  - Or: `./mvnw clean package -DskipTests` then `java -jar target/sistema-agendamento-0.0.1-SNAPSHOT.jar`
- **Frontend only:**
  ```markdown
  # Copilot Instructions — Sistema de Agendamento (brief)

  Purpose: help AI coding assistants be immediately productive in this monorepo.

  Quick Orientation
  - Monorepo with a Java Spring Boot backend (root `src/main/java/com/reserves`) and a React + Vite frontend in `Sistema de Agendamento/`.
  - API base: `/api` (backend listens on 8080). Frontend dev server: Vite (5173) but Docker maps frontend to port 3000.
  - DB: PostgreSQL (container defined in `docker-compose.yml`). Seed data: `scripts/seed-data.sql`.

  Primary Commands (copyable for Windows PowerShell)
  - Full stack (recommended):
    - `docker compose up -d --build` — starts backend, frontend, postgres
    - `docker compose down -v` — stop and remove volumes (clears DB)
  - Backend (local dev):
    - `./mvnw spring-boot:run` — run app in dev mode
    - `./mvnw clean package -DskipTests && java -jar target/sistema-agendamento-0.0.1-SNAPSHOT.jar` — build & run jar
  - Frontend (local dev):
    - `cd "Sistema de Agendamento"; npm install; npm run dev` — Vite dev server
  - Tests:
    - Backend unit/integration: `./mvnw test`
    - Frontend E2E (Playwright): `cd "Sistema de Agendamento"; npm run test:e2e`

  Key Files to Inspect (high value for agents)
  - `pom.xml` — Java 21, Maven wrapper, Lombok, Spring Boot configuration
  - `Dockerfile.backend` — multi-stage build (mvn package then runtime jar)
  - `docker-compose.yml` — service bindings, ports and env (postgres credentials)
  - `scripts/seed-data.sql` — realistic seed data; shows default admin (`admin@example.com`) and password hash
  - `src/main/java/com/reserves/` — controllers, services, repositories, DTOs, security (JWT)
  - `Sistema de Agendamento/src/` — React components, hooks, services, Playwright tests
  - `postman_collection.json` — ready API examples and `baseUrl` variable

  Project-Specific Conventions & Patterns (easily discoverable)
  - API path convention: controllers expose `/api/{resource}`. Health endpoint: `/api/health`.
  - Security: JWT authentication; roles stored via `user_roles` table. Admin-only operations require `ROLE_ADMIN`.
  - DTO & validation: use `@Valid`, `@NotNull`, `@Email` in request DTOs; see `src/.../dto/`.
  - Lombok is used pervasively — expect `@Data`, `@Builder`, and annotation processing in `pom.xml`.
  - DB seed: `scripts/seed-data.sql` resets tables, inserts users (password hashed), spaces, amenities and reservations — useful for tests and local debugging.

  Data Flow Notes
  - Frontend calls backend at `/api` (when running under Docker the frontend is served from Nginx and proxies `/api`).
  - Backend talks to Postgres (credentials in `docker-compose.yml`). Health check includes DB connectivity and metrics (totalSpaces/totalReservations).

  Developer Workflows / Debugging Tips
  - When backend logs are needed: `docker compose logs -f backend` or run `./mvnw spring-boot:run` locally for stack traces.
  - Use `./scripts/db-verify.ps1` to run quick DB checks after seeding.
  - To reset local DB data: `docker compose down -v && docker compose up -d --build` then run `.
    scripts\db-verify.ps1` or connect with a DB client.

  Integration Points
  - Postman: import `postman_collection.json`, set `baseUrl` to `http://localhost:8080/api` and run flows (login → set `token`).
  - Playwright: E2E tests under `Sistema de Agendamento/tests` — run via `npm run test:e2e`.

  What to change / edit safely as an agent
  - Small bugfixes in controllers/services and corresponding unit tests. Avoid changing security configs or DB migrations without explicit request.
  - When adding endpoints: follow existing controller/service/repository separation and add DTOs in `dto/`.

  Common Gotchas
  - Frontend dev port mismatch: Vite default is 5173 — Docker maps to 3000. Use `VITE_API_BASE_URL` when debugging the frontend.
  - Database reset is destructive; use `docker compose down -v` only when you intend to wipe demo data.
  - JWT token expiration: tokens expire (24h); tests that rely on long-lived tokens may fail if tokens are hard-coded.

  Where to look for examples
  - Reservation flows: controllers under `src/main/java/com/reserves/controller/ReservationController` and DTOs under `dto/Reservation*`.
  - Seeded data patterns: `scripts/seed-data.sql` (shows bulk inserts and sequence resets).

  If anything is unclear or you need deeper context (e.g., class-level behavior, custom exception mappings, or specific Playwright test expectations), tell me which area and I will extract exact files and produce targeted guidance or code edits.

  ```
