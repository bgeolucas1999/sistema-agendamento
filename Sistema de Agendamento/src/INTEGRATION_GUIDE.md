# Guia de Integração - Frontend com Backend Spring Boot

## Visão Geral

Este documento descreve o processo de integração entre o frontend React e o backend Spring Boot para o sistema de agendamento de espaços coletivos.

## Arquitetura da Aplicação

### Frontend (React + TypeScript)
- **Framework**: React 18 com TypeScript
- **Roteamento**: React Router v6
- **Estilização**: Tailwind CSS v4
- **Componentes UI**: ShadCN/UI
- **Gerenciamento de Estado**: Context API
- **HTTP Client**: Axios

### Backend (Spring Boot)
- **Framework**: Spring Boot
- **Segurança**: Spring Security + JWT
- **Banco de Dados**: JPA/Hibernate
- **API**: REST API

## Configuração do Backend

### 1. Configuração do CORS

No arquivo `CorsConfig.java` ou `WebConfig.java`, adicione:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173", "http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

### 2. Estrutura das Entidades

#### User.java
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    @Column(unique = true)
    private String email;
    
    private String password;
    
    private String phone;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    private Set<Role> roles = new HashSet<>();
    
    // getters e setters
}
```

#### Space.java
```java
@Entity
@Table(name = "spaces")
public class Space {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    @Column(length = 1000)
    private String description;
    
    @Enumerated(EnumType.STRING)
    private SpaceType type;
    
    private Integer capacity;
    
    private BigDecimal pricePerHour;
    
    @ElementCollection
    private List<String> amenities;
    
    private String imageUrl;
    
    private Boolean available = true;
    
    private String floor;
    
    private String location;
    
    // getters e setters
}
```

#### Reservation.java
```java
@Entity
@Table(name = "reservations")
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "space_id")
    private Space space;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    private LocalDateTime startTime;
    
    private LocalDateTime endTime;
    
    @Enumerated(EnumType.STRING)
    private ReservationStatus status;
    
    private BigDecimal totalPrice;
    
    private String notes;
    
    private LocalDateTime createdAt;
    
    // getters e setters
}
```

### 3. Estrutura dos DTOs

#### LoginRequest.java
```java
public class LoginRequest {
    private String email;
    private String password;
    // getters e setters
}
```

#### JwtResponse.java
```java
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String email;
    private String name;
    private List<String> roles;
    // getters, setters e construtores
}
```

#### SpaceDTO.java
```java
public class SpaceDTO {
    private Long id;
    private String name;
    private String description;
    private String type;
    private Integer capacity;
    private BigDecimal pricePerHour;
    private List<String> amenities;
    private String imageUrl;
    private Boolean available;
    private String floor;
    private String location;
    // getters e setters
}
```

#### ReservationDTO.java
```java
public class ReservationDTO {
    private Long id;
    private Long spaceId;
    private String spaceName;
    private Long userId;
    private String userName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;
    private BigDecimal totalPrice;
    private String notes;
    private LocalDateTime createdAt;
    // getters e setters
}
```

### 4. Endpoints da API

#### AuthController.java
```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody LoginRequest request) {
        // Implementação
    }
    
    @PostMapping("/register")
    public ResponseEntity<JwtResponse> register(@RequestBody RegisterRequest request) {
        // Implementação
    }
}
```

#### SpaceController.java
```java
@RestController
@RequestMapping("/api/spaces")
public class SpaceController {
    
    @GetMapping
    public ResponseEntity<List<SpaceDTO>> getAllSpaces() {
        // Retorna todos os espaços
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<SpaceDTO> getSpaceById(@PathVariable Long id) {
        // Retorna um espaço específico
    }
    
    @GetMapping("/available")
    public ResponseEntity<List<SpaceDTO>> getAvailableSpaces(
        @RequestParam(required = false) String type,
        @RequestParam(required = false) Integer minCapacity,
        @RequestParam(required = false) BigDecimal maxPrice,
        @RequestParam(required = false) String startDate,
        @RequestParam(required = false) String endDate
    ) {
        // Retorna espaços disponíveis com filtros
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SpaceDTO> createSpace(@RequestBody SpaceDTO spaceDTO) {
        // Cria novo espaço
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SpaceDTO> updateSpace(
        @PathVariable Long id,
        @RequestBody SpaceDTO spaceDTO
    ) {
        // Atualiza espaço
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSpace(@PathVariable Long id) {
        // Deleta espaço
    }
}
```

#### ReservationController.java
```java
@RestController
@RequestMapping("/api/reservations")
public class ReservationController {
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReservationDTO>> getAllReservations(
        @RequestParam(required = false) Long spaceId,
        @RequestParam(required = false) Long userId,
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String startDate,
        @RequestParam(required = false) String endDate
    ) {
        // Retorna todas as reservas (admin)
    }
    
    @GetMapping("/my")
    public ResponseEntity<List<ReservationDTO>> getMyReservations() {
        // Retorna reservas do usuário autenticado
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ReservationDTO> getReservationById(@PathVariable Long id) {
        // Retorna uma reserva específica
    }
    
    @PostMapping
    public ResponseEntity<ReservationDTO> createReservation(
        @RequestBody ReservationCreateRequest request
    ) {
        // Cria nova reserva
    }
    
    @PostMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelReservation(@PathVariable Long id) {
        // Cancela reserva
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ReservationDTO> updateReservation(
        @PathVariable Long id,
        @RequestBody ReservationUpdateRequest request
    ) {
        // Atualiza reserva
    }
}
```

### 5. Configuração JWT

#### JwtUtil.java
```java
@Component
public class JwtUtil {
    
    @Value("${jwt.secret}")
    private String secret;
    
    @Value("${jwt.expiration}")
    private Long expiration;
    
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, userDetails.getUsername());
    }
    
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(SignatureAlgorithm.HS256, secret)
                .compact();
    }
    
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
    
    // outros métodos
}
```

#### JwtRequestFilter.java
```java
@Component
public class JwtRequestFilter extends OncePerRequestFilter {
    
    @Autowired
    private CustomUserDetailsService userDetailsService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain chain
    ) throws ServletException, IOException {
        
        final String authorizationHeader = request.getHeader("Authorization");
        
        String username = null;
        String jwt = null;
        
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            username = jwtUtil.extractUsername(jwt);
        }
        
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            
            if (jwtUtil.validateToken(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = 
                    new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()
                    );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        chain.doFilter(request, response);
    }
}
```

### 6. SecurityConfig.java
```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    
    @Autowired
    private JwtRequestFilter jwtRequestFilter;
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/spaces/**").authenticated()
                .requestMatchers("/api/reservations/**").authenticated()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public AuthenticationManager authenticationManager(
        AuthenticationConfiguration config
    ) throws Exception {
        return config.getAuthenticationManager();
    }
}
```

## Configuração do Frontend

### 1. Configurar URL da API

Edite o arquivo `/utils/constants.ts`:

```typescript
export const API_BASE_URL = 'http://localhost:8080/api';
```

Altere para a URL do seu backend em produção quando necessário.

### 2. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto frontend:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

E atualize `constants.ts`:

```typescript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
```

## Fluxo de Autenticação

1. **Login**:
   - Usuário envia email e senha para `/api/auth/login`
   - Backend valida credenciais
   - Backend gera JWT token
   - Frontend armazena token no localStorage
   - Frontend redireciona para dashboard

2. **Requisições Autenticadas**:
   - Frontend envia token no header: `Authorization: Bearer {token}`
   - Backend valida token via JwtRequestFilter
   - Backend processa requisição

3. **Logout**:
   - Frontend remove token do localStorage
   - Frontend redireciona para página de login

## Testando a Integração

### 1. Testar Autenticação

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### 2. Testar Endpoints Protegidos

```bash
# Listar espaços
curl -X GET http://localhost:8080/api/spaces \
  -H "Authorization: Bearer {seu-token-jwt}"
```

### 3. Testar Criação de Reserva

```bash
# Criar reserva
curl -X POST http://localhost:8080/api/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {seu-token-jwt}" \
  -d '{
    "spaceId": 1,
    "startTime": "2024-12-15T09:00:00",
    "endTime": "2024-12-15T11:00:00",
    "notes": "Reunião de equipe"
  }'
```

## Tratamento de Erros

### Backend
Crie um `GlobalExceptionHandler`:

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(404, ex.getMessage());
        return ResponseEntity.status(404).body(error);
    }
    
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorResponse> handleBadRequest(BadRequestException ex) {
        ErrorResponse error = new ErrorResponse(400, ex.getMessage());
        return ResponseEntity.status(400).body(error);
    }
    
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorized(UnauthorizedException ex) {
        ErrorResponse error = new ErrorResponse(401, ex.getMessage());
        return ResponseEntity.status(401).body(error);
    }
}
```

### Frontend
Os erros já são tratados no interceptor do Axios em `services/api.ts`.

## Dicas de Desenvolvimento

1. **Desenvolvimento Local**:
   - Backend: `http://localhost:8080`
   - Frontend: `http://localhost:5173`

2. **Testar API**: Use Postman ou Insomnia para testar endpoints

3. **Depuração**: Ative logs no Spring Boot:
   ```properties
   logging.level.org.springframework.security=DEBUG
   logging.level.com.java.reserves=DEBUG
   ```

4. **CORS**: Certifique-se de que o CORS está configurado corretamente

5. **JWT**: Verifique a secret key e tempo de expiração do token

## Checklist de Integração

- [ ] Backend rodando na porta 8080
- [ ] Frontend rodando na porta 5173
- [ ] CORS configurado no backend
- [ ] JWT configurado e funcionando
- [ ] Endpoints de autenticação funcionando
- [ ] Endpoints de espaços funcionando
- [ ] Endpoints de reservas funcionando
- [ ] Tratamento de erros implementado
- [ ] Validações de dados implementadas
- [ ] Roles e permissões funcionando

## Próximos Passos

1. Implementar testes unitários e de integração
2. Configurar deploy em produção
3. Adicionar logging e monitoramento
4. Implementar cache (Redis)
5. Adicionar notificações por email
6. Implementar websockets para atualizações em tempo real
