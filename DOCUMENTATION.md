# Sistema de Agendamento — Documentação objetiva e completa

Este documento fornece instruções objetivas e completas para desenvolvedores e operadores do projeto "Sistema de Agendamento". Cobre visão geral, pré-requisitos, como rodar em desenvolvimento, build para produção, Docker/Docker Compose, testes, estrutura do repositório e resolução de problemas.

---

## Visão geral
- **Nome:** Sistema de Agendamento
- **Artefato Maven:** `sistema-agendamento` (versão `0.0.1-SNAPSHOT`)
- **Backend:** Spring Boot (Java 21, Spring Boot 2.7.x)
- **Banco de dados:** PostgreSQL (imagem `postgres:15`) — com fallback/h2 para runtime de teste
- **Frontend:** Aplicação em Vite + React (pasta `Sistema de Agendamento`)
- **Testes E2E:** Playwright (`@playwright/test`)

---

## Tecnologias principais
- **Java 21**, **Maven** (wrapper `mvnw`/`mvnw.cmd`)
- **Spring Boot** (web, security, data-jpa, validation)
- **PostgreSQL** (produção), **H2** (runtime/test)
- **Node.js / Vite / React** para frontend
- **Docker / Docker Compose** para orquestração local
- **Playwright** para testes end-to-end

---

## Pré-requisitos de ambiente
- Java 21 (JDK)
- Maven (ou use `./mvnw`)
- Node.js 16+ e npm/pnpm
- Docker e Docker Compose (para rodar via contêineres)

No Windows PowerShell, use `;` para comandos encadeados quando necessário.

---

## Como executar localmente (desenvolvimento)

### Backend (modo desenvolvimento)
1. Instale dependências do Maven (geralmente não necessário com wrapper):

```powershell
./mvnw -v
```

2. Rodar a aplicação Spring Boot em modo dev (na raiz do repo):

```powershell
./mvnw spring-boot:run
```

ou empacotar e rodar o jar:

```powershell
./mvnw clean package -DskipTests
java -jar target/sistema-agendamento-0.0.1-SNAPSHOT.jar
```

O backend expõe por padrão a porta `8080`.

### Frontend (modo desenvolvimento)
1. Entre na pasta do frontend:

```powershell
cd "Sistema de Agendamento"
```

2. Instale dependências e rode em dev:

```powershell
npm install
npm run dev
```

O Vite serve normalmente em `http://localhost:5173` (confirme no output do `vite`).

Se quiser apenas servir a build de produção localmente:

```powershell
npm run build
npm run preview
```

---

## Rodando com Docker Compose (recomendado para ambiente local completo)
O projeto inclui `docker-compose.yml` que define serviços: `backend`, `frontend` e `postgres`.

Comandos úteis (PowerShell):

```powershell
# Construir e subir os serviços
docker compose up --build

# Subir em background
docker compose up -d --build

# Parar e remover
docker compose down
```

Ports expostas (conforme `docker-compose.yml`):
- Backend: `8080:8080`
- Frontend: `3000:80` (o frontend é servido via Nginx na imagem)
- Postgres: `5432:5432`

Variáveis do Postgres definidas no compose:
- `POSTGRES_USER=admin`
- `POSTGRES_PASSWORD=admin123`
- `POSTGRES_DB=sistema_agendamento`

Observação: o `Dockerfile.backend` usa Maven wrapper para construir o JAR com Java 21. O `Dockerfile.frontend` (na pasta `Sistema de Agendamento`) gera os assets estáticos servidos por Nginx.

---

## Build para produção

### Backend
```powershell
./mvnw clean package -DskipTests
# resultado: target/sistema-agendamento-0.0.1-SNAPSHOT.jar
```

### Frontend
```powershell
cd "Sistema de Agendamento"
npm install
npm run build
# artefatos finais em Sistema de Agendamento/dist (ou build) — confera build config
```

---

## Variáveis de ambiente importantes
- `VITE_API_BASE_URL` — configurada no `Dockerfile.frontend` como `/api` quando construído via Compose; em `.env` para dev local normalmente `http://localhost:8080/api`.
- Postgres via compose: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`.

Onde procurar: `docker-compose.yml`, `Sistema de Agendamento/.env` (se existir), `application.properties`/`application.yml` do backend (procure no código fonte `src/main/resources`).

---

## Banco de dados
- Em desenvolvimento/CI: H2 (runtime) pode ser usado para testes rápidos.
- Em ambiente integrado/produção: PostgreSQL 15 (configurado no `docker-compose.yml`).
- Volume persistente: `postgres_data` montado em `/var/lib/postgresql/data`.

Se precisar resetar os dados do Postgres em Docker Compose:

```powershell
docker compose down -v
docker compose up -d --build
```

---

## Testes

### Unit / Integration (backend)
Use Maven para rodar testes do Spring Boot:

```powershell
./mvnw test
```

### E2E (Playwright) — frontend + integração
No repositório há scripts e configuração do Playwright. Exemplo:

```powershell
cd "Sistema de Agendamento"
npm install
npm run test:e2e
# Ou para modo headed:
npm run test:e2e:headed
```

Relatórios e artefatos de teste são gerados na pasta `test-results/`.

---

## Estrutura principal do repositório (resumo)
- `pom.xml` — configuração Maven e dependências do backend
- `Dockerfile.backend` — build multi-stage do backend (Java 21)
- `docker-compose.yml` — orquestração local (backend + frontend + postgres)
- `Sistema de Agendamento/` — frontend (Vite + React)
  - `package.json` — scripts e dependências do frontend
  - `Dockerfile.frontend` — (imagem para servir assets)
- `src/` — código-fonte Java (backend)
- `tests/` e `test-results/` — testes e resultados (Playwright, etc.)
- `target/` — artefatos Maven gerados

---

## Endpoints principais (resumo — ver implementações para detalhes)
Base (padrão): `http://localhost:8080/api`

- `POST /api/auth/login` — autenticação (JWT)
- `POST /api/auth/register` — registrar usuário
- `GET /api/spaces` — listar espaços
- `GET /api/spaces/{id}` — obter espaço
- `POST /api/reservations` — criar reserva
- `GET /api/reservations/my` — listar minhas reservas
- `POST /api/reservations/{id}/cancel` — cancelar reserva

Consulte os controllers no código-fonte para obter payloads, validações e respostas.

---

## Segurança e autenticação
- O projeto usa Spring Security e JWT (`io.jsonwebtoken:jjwt`).
- Valide headers `Authorization: Bearer {token}` nas chamadas autenticadas.

---

## Troubleshooting rápido
- Erro CORS: confirme origem e configuração no backend (permitir `http://localhost:5173` para dev).
- 401 Unauthorized: cheque `localStorage` do frontend e refaça login; confirme secret/algoritmo JWT no backend.
- Postgres não inicia: verifique se a porta `5432` está livre e se existem volumes com permissões diferentes.
- Build Docker falha: verifique versões do JDK e Maven; o `Dockerfile.backend` usa `./mvnw` internamente, então o contexto deve conter `.mvn` e `mvnw`.

---

## Boas práticas para desenvolvedores
- Ao alterar o modelo de dados, adicione/atualize scripts de migração ou `data.sql` para dados iniciais.
- Execute `./mvnw test` antes de abrir PRs. Execute `npm run build` para verificar frontend.
- Mantenha segredos fora do repositório — use variáveis de ambiente/secret managers.

---

## Onde procurar mais informações no repositório
- Guia de testes frontend: `Sistema de Agendamento/TESTING_GUIDE.md`
- README do frontend: `Sistema de Agendamento/README.md`
- Scripts e configuração de build: `pom.xml`, `Sistema de Agendamento/package.json`
- Dockerfiles: `Dockerfile.backend`, `Sistema de Agendamento/Dockerfile.frontend`

---

## Próximos passos / opções
- Posso dividir essa documentação em vários arquivos (`README.md`, `DEPLOYMENT.md`, `TESTING.md`) se desejar.
- Posso também gerar manuais de operação para deploy em um provedor específico (Azure/AWS) ou CI/CD (GitHub Actions).

---

Se quiser ajustes (ex.: tradução de trechos técnicos, mais detalhes sobre endpoints ou políticas de banco), diga o escopo que prefere e eu adapto o documento.
