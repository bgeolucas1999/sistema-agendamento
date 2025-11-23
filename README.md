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
# Sistema de Agendamento — README (modo estudante)

E aí! Sou estudante e escrevi um README prático — direto ao ponto. Vou te mostrar o jeito mais rápido de rodar tudo, como acessar o banco e umas queries pra checar se está tudo certo.

Se você só quer acessar o banco agora, vai direto para a seção "Acesso rápido ao banco".

## Começo rápido (com Docker)

Se você tem Docker, é só:

```powershell
cd C:\workspace\sistema-agendamento
docker compose up -d --build
```

Depois espera um pouco e abre:
- Backend: http://localhost:8080 (API em `/api`)
- Frontend: http://localhost:3000

Pra desligar tudo:

```powershell
docker compose down
```

## Rodando local (dev sem Docker)

### Backend

```powershell
cd C:\workspace\sistema-agendamento
./mvnw spring-boot:run
```

ou gerar o JAR e rodar direto:

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

Unit / integration (backend):

```powershell
./mvnw test
```

E2E (Playwright):

```powershell
cd "Sistema de Agendamento"
npm install
npm run test:e2e
```

## Acesso rápido ao banco (o jeito fácil)

Eu criei dois scripts em `scripts/` pra facilitar:

- `scripts/db-connect.ps1` — abre um `psql` interativo dentro do container Postgres.
- `scripts/db-verify.ps1` — roda um conjunto de queries úteis e mostra os resultados.

Use assim (PowerShell):

```powershell
cd C:\workspace\sistema-agendamento
.\scripts\db-connect.ps1   # psql interativo
.\scripts\db-verify.ps1    # queries de verificação (executa e mostra)
```

Se preferir usar GUI (DBeaver / pgAdmin), configure com:

- Host: `localhost`
- Port: `5432`
- Database: `sistema_agendamento`
- User: `admin`
- Password: `admin123`

Se a conexão do host falhar, primeiro roda `db-connect.ps1` — se isso funcionar, o problema é com o cliente/host (porta, firewall, etc.).

## Queries úteis pra checar o banco

Cole essas queries no `psql` (ou rode `db-verify.ps1`):

- Listar tabelas:

```sql
\dt
```

- Contar registros nas tabelas principais:

```sql
SELECT 'spaces' AS table_name, COUNT(*) FROM spaces;
SELECT 'users' AS table_name, COUNT(*) FROM users;
SELECT 'reservations' AS table_name, COUNT(*) FROM reservations;
```

- Mostrar as 10 reservas mais recentes:

```sql
SELECT id, space_id, user_name, user_email, start_time, end_time, status
FROM reservations
ORDER BY created_at DESC LIMIT 10;
```

- Ver quem é admin (se tiver user_roles):

```sql
SELECT u.id, u.name, u.email, array_agg(r.role) AS roles
FROM users u
LEFT JOIN user_roles r ON u.id = r.user_id
GROUP BY u.id, u.name, u.email
ORDER BY u.id;
```

## Scripts que adicionei

- `scripts/db-connect.ps1` — abre `psql` dentro do container (usa `docker exec`).
- `scripts/db-verify.ps1` — roda as queries acima automaticamente e mostra os resultados.

## Postman

Importa `postman_collection.json` que já está no repositório. Ajusta `baseUrl` pra `http://localhost:8080/api`. Faz login e coloca o token na variável `token`.

---

Se quiser eu mando as queries em `.sql`, gero CSVs das tabelas ou faço um script pra exportar dados. Quer que eu adicione o script que exporta as tabelas pra CSV também?
