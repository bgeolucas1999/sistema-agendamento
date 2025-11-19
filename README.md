MEU PROJETO - Sistema de Agendamento de Espaços

Backend em Spring Boot 3 (Java 17) com H2 em memória.

Instalação e execução (PowerShell):

```powershell
cd .\workspace\sistema-agendamento
mvn -v
mvn -DskipTests clean package
mvn spring-boot:run
```

API base: `http://localhost:8080/api`

H2 console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:reservasdb`)

Use `src/main/resources/data.sql` para popular dados iniciais. O projeto já contém exemplos de espaços e uma reserva.

Endpoints principais:

- `GET  /api/spaces`
- `GET  /api/spaces/{id}`
- `GET  /api/spaces/available?type=&minCapacity=&maxPrice=`
- `POST /api/spaces`
- `PUT  /api/spaces/{id}`
- `DELETE /api/spaces/{id}`

- `GET  /api/reservations`
- `GET  /api/reservations/{id}`
- `GET  /api/reservations/user/{email}`
- `POST /api/reservations`
- `PUT  /api/reservations/{id}`
- `POST /api/reservations/{id}/cancel`
- `DELETE /api/reservations/{id}`

Exemplos rápidos (PowerShell / curl):

Listar espaços:
```powershell
curl http://localhost:8080/api/spaces
```

Criar um espaço (JSON):
```powershell
curl -H "Content-Type: application/json" -d '{"name":"Sala B","type":"MEETING_ROOM","capacity":8,"pricePerHour":40.0}' http://localhost:8080/api/spaces -X POST
```

Criar uma reserva:
```powershell
curl -H "Content-Type: application/json" -d '{
	"space": {"id": 1},
	"userName": "Maria",
	"userEmail": "maria@example.com",
	"startTime": "2025-11-19T10:00:00",
	"endTime": "2025-11-19T12:00:00"
}' http://localhost:8080/api/reservations -X POST
```

Notas:
- Para desenvolvimento acadêmico usamos `spring.jpa.hibernate.ddl-auto=create-drop` (os dados são resetados a cada execução).
- Os endpoints recebem e retornam as entidades JPA diretamente; para produção recomenda-se usar DTOs/VOs.
- Validações são aplicadas via `jakarta.validation` (@NotBlank, @NotNull, @Email, @Min, @DecimalMin).

Próximo passo (opcional): forneça o frontend e eu ajudo a integrar chamando estes endpoints.
