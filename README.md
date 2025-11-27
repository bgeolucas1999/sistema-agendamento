# Sistema de Agendamento

Sistema completo de agendamento de espaços com backend Spring Boot, frontend React e banco de dados PostgreSQL.

## 📋 Índice

- [Quickstart (Docker Compose)](#quickstart-docker-compose)
- [Desenvolvimento Local](#desenvolvimento-local)
- [Testes](#testes)
- [Acesso ao Banco de Dados](#acesso-ao-banco-de-dados)
- [API e Endpoints](#api-e-endpoints)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Quickstart (Docker Compose)

**Recomendado para ambiente completo** (backend, frontend e PostgreSQL).

```powershell
cd C:\workspace\sistema-agendamento
docker compose up -d --build
```

### Verificar Status

```powershell
# Verificar containers
docker compose ps

# Verificar logs
docker compose logs -f backend

# Testar health check
curl http://localhost:8080/api/health
```

### Acessar Aplicação

- **Backend API**: `http://localhost:8080/api`
- **Frontend**: `http://localhost:3000`
- **Health Check**: `http://localhost:8080/api/health`

### Parar Serviços

```powershell
docker compose down          # Parar containers
docker compose down -v        # Parar e remover volumes (limpa dados)
```

---

## 💻 Desenvolvimento Local

### Pré-requisitos

- **Java 21** (JDK)
- **Maven** (ou use `./mvnw`)
- **Node.js 18+** e npm
- **PostgreSQL 15** (ou use Docker apenas para o banco)

### Backend

#### Opção 1: Modo Desenvolvimento (Recomendado)

```powershell
cd C:\workspace\sistema-agendamento
./mvnw spring-boot:run
```

#### Opção 2: Build e Executar JAR

```powershell
cd C:\workspace\sistema-agendamento
./mvnw clean package -DskipTests
java -jar target/sistema-agendamento-0.0.1-SNAPSHOT.jar
```

**Backend estará disponível em:** `http://localhost:8080`

### Frontend

```powershell
cd "Sistema de Agendamento"
npm install
npm run dev
```

**Frontend estará disponível em:** `http://localhost:5173` (Vite dev server)

### Banco de Dados (Apenas PostgreSQL)

Se você quiser rodar apenas o PostgreSQL via Docker:

```powershell
docker run -d \
  --name sistema_agendamento_postgres \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=admin123 \
  -e POSTGRES_DB=sistema_agendamento \
  -p 5432:5432 \
  postgres:15
```

---

## 🧪 Testes

### Backend (Unit/Integration)

```powershell
cd C:\workspace\sistema-agendamento
./mvnw test
```

### Frontend (E2E com Playwright)

```powershell
cd "Sistema de Agendamento"
npm install
npm run test:e2e
```

**Comandos adicionais:**
- `npm run test:api` - Testar apenas endpoints da API
- `npm run test:headed` - Executar com navegador visível
- `npm run test:ui` - Interface interativa do Playwright

### Testar Health Check

```powershell
# Via curl
curl http://localhost:8080/api/health

# Via PowerShell
Invoke-RestMethod -Uri http://localhost:8080/api/health
```

**Resposta esperada:**
```json
{
  "status": "UP",
  "service": "sistema-agendamento",
  "timestamp": "2025-01-27T10:30:00",
  "database": "UP",
  "metrics": {
    "totalSpaces": 7,
    "totalReservations": 5
  }
}
```

---

## 🗄️ Acesso ao Banco de Dados

### Scripts PowerShell (Recomendado)

Dois scripts úteis estão disponíveis em `scripts/`:

```powershell
cd C:\workspace\sistema-agendamento

# Acesso interativo ao psql
.\scripts\db-connect.ps1

# Verificação automática (executa queries e mostra resultados)
.\scripts\db-verify.ps1
```

### Configuração para GUI (DBeaver, pgAdmin, etc.)

- **Host**: `localhost`
- **Port**: `5432`
- **Database**: `sistema_agendamento`
- **User**: `admin`
- **Password**: `admin123`

### Queries Úteis

#### Listar Tabelas
```sql
\dt
```

#### Contar Registros
```sql
SELECT 'spaces' AS table_name, COUNT(*) FROM spaces
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'reservations', COUNT(*) FROM reservations;
```

#### Reservas Recentes
```sql
SELECT id, space_id, user_name, user_email, start_time, end_time, status
FROM reservations
ORDER BY created_at DESC
LIMIT 10;
```

#### Usuários e Roles
```sql
SELECT u.id, u.name, u.email, array_agg(r.role) AS roles
FROM users u
LEFT JOIN user_roles r ON u.id = r.user_id
GROUP BY u.id, u.name, u.email
ORDER BY u.id;
```

---

## 🔌 API e Endpoints

### Base URL
```
http://localhost:8080/api
```

### Autenticação

A maioria dos endpoints requer autenticação via JWT:

```
Authorization: Bearer {token}
```

### Endpoints Principais

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| `GET` | `/health` | ❌ | Health check com status do sistema |
| `POST` | `/auth/login` | ❌ | Login e obtenção de token JWT |
| `POST` | `/auth/register` | ❌ | Registro de novo usuário |
| `GET` | `/spaces` | ❌ | Listar todos os espaços |
| `GET` | `/spaces/{id}` | ❌ | Obter espaço por ID |
| `GET` | `/spaces/available` | ❌ | Buscar espaços disponíveis (com filtros) |
| `POST` | `/spaces` | ✅ Admin | Criar novo espaço |
| `PUT` | `/spaces/{id}` | ✅ Admin | Atualizar espaço |
| `DELETE` | `/spaces/{id}` | ✅ Admin | Deletar espaço |
| `GET` | `/reservations` | ✅ Admin | Listar todas as reservas |
| `GET` | `/reservations/my` | ✅ | Listar minhas reservas |
| `GET` | `/reservations/{id}` | ✅ | Obter reserva por ID |
| `POST` | `/reservations` | ✅ | Criar nova reserva |
| `PUT` | `/reservations/{id}` | ✅ | Atualizar reserva (própria ou admin) |
| `POST` | `/reservations/{id}/cancel` | ✅ | Cancelar reserva (própria ou admin) |
| `DELETE` | `/reservations/{id}` | ✅ Admin | Deletar reserva |

### Exemplo: Login e Criar Reserva

```powershell
# 1. Login
$loginResponse = Invoke-RestMethod -Uri http://localhost:8080/api/auth/login `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"admin@example.com","password":"admin123"}'

$token = $loginResponse.token

# 2. Criar Reserva
$headers = @{
  "Authorization" = "Bearer $token"
  "Content-Type" = "application/json"
}

$reservation = @{
  spaceId = 1
  startTime = "2025-12-01T09:00:00"
  endTime = "2025-12-01T10:00:00"
  notes = "Reunião de equipe"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:8080/api/reservations `
  -Method POST `
  -Headers $headers `
  -Body $reservation
```

### Postman Collection

Importe o arquivo `postman_collection.json` no Postman:

1. Abra Postman → Import → Selecione `postman_collection.json`
2. Configure a variável `baseUrl` como `http://localhost:8080/api`
3. Faça login via endpoint `/auth/login`
4. Copie o token e cole na variável `token`

**Documentação completa da API:** Veja `API_DOCUMENTATION.md`

---

## 📁 Estrutura do Projeto

```
sistema-agendamento/
├── src/main/java/com/reserves/    # Backend (Spring Boot)
│   ├── controller/                 # REST Controllers
│   ├── service/                    # Lógica de negócio
│   ├── repository/                 # Data Access Layer
│   ├── model/                      # Entidades JPA
│   ├── dto/                        # Data Transfer Objects
│   ├── security/                   # JWT e configuração de segurança
│   └── exception/                  # Tratamento de exceções
├── Sistema de Agendamento/         # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/             # Componentes React
│   │   ├── pages/                  # Páginas da aplicação
│   │   ├── services/               # Serviços de API
│   │   └── hooks/                  # Custom hooks
│   └── tests/                      # Testes E2E (Playwright)
├── scripts/                        # Scripts utilitários
│   ├── db-connect.ps1              # Conectar ao PostgreSQL
│   ├── db-verify.ps1               # Verificar estado do banco
│   └── seed-data.sql               # Dados iniciais
├── docker-compose.yml              # Orquestração Docker
├── Dockerfile.backend              # Build do backend
└── pom.xml                         # Configuração Maven
```

---

## 🔧 Troubleshooting

### Backend não inicia

**Problema:** Erro de conexão com banco de dados

**Solução:**
1. Verifique se o PostgreSQL está rodando:
   ```powershell
   docker compose ps
   ```
2. Verifique as credenciais em `src/main/resources/application.properties`
3. Teste a conexão:
   ```powershell
   .\scripts\db-connect.ps1
   ```

### Erro 401 (Unauthorized)

**Problema:** Token inválido ou expirado

**Solução:**
1. Faça login novamente para obter um novo token
2. Verifique se o header `Authorization: Bearer {token}` está sendo enviado
3. Tokens JWT expiram após 24 horas

### Erro 403 (Forbidden)

**Problema:** Usuário não tem permissão

**Solução:**
- Operações de administração (criar/editar/deletar espaços) requerem role `ROLE_ADMIN`
- Usuários só podem modificar suas próprias reservas (exceto admins)

### Erro ao deletar espaço

**Problema:** "Não é possível excluir um espaço que possui reservas ativas"

**Solução:**
- O sistema agora valida se há reservas ativas antes de permitir exclusão
- Cancele ou delete as reservas ativas primeiro, ou aguarde seu término

### Frontend não conecta ao backend

**Problema:** Erro de CORS ou conexão recusada

**Solução:**
1. Verifique se o backend está rodando em `http://localhost:8080`
2. Verifique a variável `VITE_API_BASE_URL` no frontend
3. Verifique a configuração de CORS no backend (`CorsConfig.java`)

### Health Check retorna DOWN

**Problema:** `/api/health` retorna status DOWN

**Solução:**
1. Verifique se o banco de dados está acessível
2. Verifique os logs do backend:
   ```powershell
   docker compose logs backend
   ```
3. O health check agora inclui verificação de conectividade com o banco

---

## ✨ Melhorias Recentes

### Segurança
- ✅ Autorização implementada: usuários só podem modificar suas próprias reservas
- ✅ Admins têm acesso completo a todas as operações
- ✅ Validação de DTOs com anotações `@Valid`, `@NotNull`, `@Email`, etc.

### Validações
- ✅ Validação de exclusão de espaços: não permite deletar espaços com reservas ativas
- ✅ Validação de dados de entrada em todos os endpoints
- ✅ Mensagens de erro mais descritivas

### Health Check
- ✅ Endpoint `/api/health` aprimorado com:
  - Verificação de conectividade com banco de dados
  - Métricas básicas (total de espaços e reservas)
  - Timestamp da verificação
  - Status HTTP 503 se o banco estiver inacessível

### DTOs
- ✅ `ReservationDTO` agora inclui `userPhone` (estava faltando)
- ✅ Validações adicionadas em `ReservationCreateRequest` e `ReservationUpdateRequest`
- ✅ Validações adicionadas em `SpaceDTO`

---

## 📚 Documentação Adicional

- **`API_DOCUMENTATION.md`** - Documentação completa da API com exemplos
- **`DOCUMENTATION.md`** - Documentação técnica detalhada
- **`CODE_REVIEW.md`** - Revisão de código e melhorias implementadas
- **`DELIVERY_REPORT.md`** - Relatório de entrega do projeto

---

## 👥 Credenciais Padrão

### Usuário Administrador
- **Email**: `admin@example.com`
- **Password**: `admin123`
- **Roles**: `ROLE_USER`, `ROLE_ADMIN`

### Outros Usuários (Seed Data)
- **Email**: `joao@example.com` / `maria@example.com`
- **Password**: `senha123`
- **Roles**: `ROLE_USER`

---

## 📝 Notas

- O sistema usa **JWT** para autenticação (tokens expiram em 24 horas)
- **PostgreSQL 15** é o banco de dados recomendado para produção
- O frontend é uma **SPA (Single Page Application)** com roteamento client-side
- Todos os endpoints de criação/atualização validam dados de entrada
- O sistema previne exclusão de espaços com reservas ativas para manter integridade dos dados

---

## ✅ Conclusão & Handover

Resumo: o repositório contém um backend Spring Boot, frontend React (Vite) e scripts para inicializar e popular a base PostgreSQL com dados de demonstração. Durante verificação local, o seed foi aplicado manualmente ao banco em execução e o backend confirmou leitura dos dados via `/api/health`.

Quick commands (Windows PowerShell)
- Subir stack completa:
  - `docker compose up -d --build`
- Resetar dados (DESTRUTIVO):
  - `docker compose down -v` (remove volumes, limpa DB)
- Carregar seed (PowerShell — funciona mesmo sem `psql` instalado localmente):
  ```powershell
  Get-Content -Raw 'c:\workspace\sistema-agendamento\scripts\seed-data.sql' |
    docker exec -i sistema_agendamento_postgres psql -U admin -d sistema_agendamento -v ON_ERROR_STOP=1 -f -
  ```

Notes about seeding
- The provided `scripts/load-seed.sh` is a Bash loader that expects a host `psql` client and is useful on Linux/macOS or inside developer WSL shells. On Windows PowerShell prefer the `Get-Content | docker exec -i ... psql -f -` pipeline above.
- Placing `seed-data.sql` in `/docker-entrypoint-initdb.d/` only runs on first container initialization (when the Postgres data directory is empty). To force re-run, use `docker compose down -v` then restart.

Verify after seed
- Check counts inside container:
  - `docker exec -i sistema_agendamento_postgres psql -U admin -d sistema_agendamento -c "SELECT COUNT(*) FROM users;"`
  - `docker exec -i sistema_agendamento_postgres psql -U admin -d sistema_agendamento -c "SELECT COUNT(*) FROM spaces;"`
- Check backend health:
  - `Invoke-RestMethod -Uri http://localhost:8080/api/health -UseBasicParsing | ConvertTo-Json -Depth 4`

Tests and validation
- Backend unit/integration: `./mvnw test`
- Frontend E2E (Playwright): `cd "Sistema de Agendamento"; npm run test:e2e`

Suggested next steps (optional)
- Add a small `scripts/load-seed.ps1` to make seeding easier on Windows (I can add it if you want).
- Add a GitHub Actions workflow to run backend tests on PRs (CI) and a Playwright job to run E2E periodically.

If you'd like, I can commit a PowerShell seed loader and a short CI workflow — tell me which you want and I'll implement it.

**Desenvolvido com:** Spring Boot 2.7.18, React 18, PostgreSQL 15, Docker
