# API — Sistema de Agendamento

Documento conciso dos endpoints HTTP do backend, modelos esperados (JSON) e exemplos de uso (curl). Baseado nos controllers em `src/main/java/com/reserves/controller` e DTOs em `src/main/java/com/reserves/dto`.

Base URL (local): `http://localhost:8080/api`

Auth: JWT Bearer token via header `Authorization: Bearer {token}`.

---

## Autenticação

### POST /api/auth/login
- Descrição: Autentica usuário e retorna token JWT.
- Autenticação: não
- Request JSON:

```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

- Response 200 (exemplo):

```json
{
  "token": "<jwt>",
  "type": "Bearer",
  "id": 1,
  "email": "admin@example.com",
  "name": "Admin",
  "roles": ["ROLE_ADMIN"]
}
```

- Response 401: `Invalid credentials`

### POST /api/auth/register
- Descrição: Registra um novo usuário.
- Autenticação: não
- Request JSON:

```json
{
  "name": "Nome",
  "email": "user@example.com",
  "password": "senha",
  "phone": "(11) 99999-9999"
}
```

- Response 200: `User registered` ou 400 se email já cadastrado.

---

## Espaços (Spaces)

### GET /api/spaces
- Descrição: Retorna lista de espaços.
- Autenticação: não
- Response: array de `SpaceDTO`.

Exemplo `SpaceDTO`:

```json
{
  "id": 1,
  "name": "Sala de Reunião A",
  "description": "Sala equipada",
  "type": "MEETING",
  "capacity": 10,
  "pricePerHour": 50.00,
  "amenities": ["projector","whiteboard"],
  "imageUrl": "http://...",
  "available": true,
  "floor": "3",
  "location": "Bloco A",
  "createdAt": "2025-11-23T12:00:00"
}
```

### GET /api/spaces/{id}
- Descrição: Obtém um espaço por `id`.
- Autenticação: não

### GET /api/spaces/available
- Descrição: Filtra espaços disponíveis.
- Query params (opcionais): `type`, `minCapacity`, `maxPrice`

### POST /api/spaces
- Descrição: Cria novo espaço.
- Autenticação: ADMIN
- Request: `SpaceDTO` (sem `id` nem `createdAt` normalmente)

### PUT /api/spaces/{id}
- Descrição: Atualiza espaço.
- Autenticação: ADMIN

### DELETE /api/spaces/{id}
- Descrição: Remove espaço.
- Autenticação: ADMIN

---

## Reservas (Reservations)

### GET /api/reservations
- Descrição: Lista todas as reservas (admin).
- Autenticação: ADMIN (verificação via `@PreAuthorize`)
- Query params opcionais: `spaceId`, `userId`, `status`, `startDate`, `endDate`

### GET /api/reservations/my
- Descrição: Lista reservas do usuário autenticado.
- Autenticação: Bearer token (qualquer usuário)

### GET /api/reservations/{id}
- Descrição: Obter reserva por id.
- Autenticação: não (mas normalmente a rota exige contexto - ver regras do serviço)

### POST /api/reservations
- Descrição: Cria reserva. Se o usuário estiver autenticado, usa o email dele; caso contrário permite preencher `userEmail`/`userName` no body.
- Autenticação: opcional (recomenda-se autenticar)
- Request JSON (`ReservationCreateRequest`):

```json
{
  "spaceId": 1,
  "userName": "Fulano",
  "userEmail": "fulano@example.com",
  "userPhone": "(11) 98888-8888",
  "startTime": "2025-12-01T09:00:00",
  "endTime": "2025-12-01T11:00:00",
  "notes": "Reunião mensal"
}
```

- Response: `ReservationDTO` (ex.: id, spaceId, userName, startTime, endTime, status, totalPrice)

### POST /api/reservations/{id}/cancel
- Descrição: Cancela reserva por id.
- Autenticação: usuária (ou admin) — controller cancela via service.

### PUT /api/reservations/{id}
- Descrição: Atualiza dados da reserva.
- Autenticação: não restrito aqui (ver `ReservationService` para regras)
- Request JSON (`ReservationUpdateRequest`):

```json
{
  "userName": "Nome",
  "userEmail": "email@example.com",
  "userPhone": "(11) 99999-9999",
  "startTime": "2025-12-01T10:00:00",
  "endTime": "2025-12-01T12:00:00",
  "notes": "Atualização"
}
```

### DELETE /api/reservations/{id}
- Descrição: Remove reserva.
- Autenticação: ADMIN

---

## Debug / Health

### GET /api/health
- Descrição: Health check simples.
- Autenticação: não

Response:

```json
{ "status": "ok", "service": "sistema-agendamento" }
```

### GET /api/debug/reservations
- Descrição: Retorna todas as reservas (raw) — protegido: ADMIN

---

## Exemplos de uso (curl)

1) Login e salvar token (bash/powershell compatible):

```bash
curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# resposta contém o token no campo "token"
```

2) Usar token para listar minhas reservas:

```bash
TOKEN="<jwt>"
curl -X GET http://localhost:8080/api/reservations/my \
  -H "Authorization: Bearer $TOKEN"
```

3) Criar reserva (com token ou sem):

```bash
curl -X POST http://localhost:8080/api/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"spaceId":1,"startTime":"2025-12-01T09:00:00","endTime":"2025-12-01T10:00:00","notes":"Teste"}'
```

---

## Observações e notas de implementação
- Datas usam `LocalDateTime` no backend; ao enviar JSON certifique-se do formato ISO `YYYY-MM-DDTHH:MM:SS`.
- Autorização: algumas rotas usam `@PreAuthorize("hasRole('ADMIN')")` — ver `SpaceController.getAll` e operações de administração de espaços/reservas.
- Validações: controllers usam `@Valid` para requests de criação/atualização; erros são tratados por classes de exceção no pacote `exception`.
- Consulte `src/main/resources` por configurações de serialização (se houver) e `application.properties` para ajustes de timezone/formato.

---

Se você quiser, eu posso:
- Gerar um arquivo `openapi.yaml` / `swagger.json` baseado nas classes (posso sintetizar com base nas DTOs).
- Criar collection do Postman/Insomnia com exemplos prontos.
- Tentar subir o projeto localmente aqui (vou rodar via Docker Compose ou mvnw e reportar o resultado).
