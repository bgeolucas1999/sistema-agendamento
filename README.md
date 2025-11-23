# Sistema de Agendamento — README

Resumo rápido com instruções para iniciar o projeto, rodar localmente, testar e conectar ao banco de dados.

## Quickstart (Docker Compose)
Recomendado para obter um ambiente completo (backend, frontend e Postgres).

```powershell
cd C:\workspace\sistema-agendamento
docker compose up -d --build

# Verificar containers
docker compose ps

# Parar e remover
docker compose down
```

Após `up`, o backend estará em `http://localhost:8080` (API base: `/api`) e o frontend em `http://localhost:3000`.

## Rodar local (desenvolvimento)

### Backend
```powershell
cd C:\workspace\sistema-agendamento
./mvnw spring-boot:run
```

ou empacotar e executar o jar:
```powershell
./mvnw clean package -DskipTests
java -jar target/sistema-agendamento-0.0.1-SNAPSHOT.jar
```

### Frontend
```powershell
cd "Sistema de Agendamento"
npm install
npm run dev
```

## Testes

### Backend (unit/integration)
```powershell
./mvnw test
```

### E2E (Playwright)
```powershell
cd "Sistema de Agendamento"
npm install
npm run test:e2e
```

## Acesso ao banco de dados (Postgres)

O `docker-compose.yml` define o Postgres com as seguintes credenciais (padrão local):
- host: `localhost`
- port: `5432`
- database: `sistema_agendamento`
- user: `admin`
- password: `admin123`

Conectar a partir do host (se tiver `psql` instalado):

```powershell
psql -h localhost -p 5432 -U admin -d sistema_agendamento
# Digite a senha: admin123
```

Conectar ao container Postgres (acessar psql dentro do container):

```powershell
docker exec -it sistema_agendamento_postgres psql -U admin -d sistema_agendamento
```

Conectar via GUI (DBeaver / pgAdmin):
- Host: `localhost`
- Port: `5432`
- Database: `sistema_agendamento`
- User: `admin`
- Password: `admin123`

Se os serviços não estiverem levantados, rode `docker compose up -d --build` antes.

## Postman collection
Uma collection de exemplo está incluída em `postman_collection.json` com requests para `health`, `login`, `get spaces`, `get my reservations` e `create reservation`.

Importe o arquivo no Postman/Insomnia e ajuste a variável `baseUrl` se necessário.

## Notas extras
- Formato de datas: use `LocalDateTime` ISO (ex.: `2025-12-01T09:00:00`).
- Autenticação: enviar header `Authorization: Bearer <token>` nas rotas protegidas.

---

Se quiser, eu posso:
- publicar uma collection no Postman Cloud ou gerar um arquivo `openapi.yaml` com base nas DTOs.
- gerar um `.env.example` com as variáveis mais usadas.
