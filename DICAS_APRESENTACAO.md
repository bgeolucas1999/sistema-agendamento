# 🎓 DICAS FINAIS PARA APRESENTAÇÃO ACADÊMICA

## 📌 RESUMO EXECUTIVO (30 segundos)

"Criei um **Sistema de Agendamento de Espaços** full-stack com **React no frontend** e **Spring Boot no backend**, containerizado com **Docker**, e testado com **Playwright**. O sistema valida reservas em tempo real, impede conflitos de agendamento e persiste dados em um banco H2."

---

## 🎬 ROTEIRO OTIMIZADO (15 minutos)

### Minuto 1-2: Introdução
```
Slide: Título + Objetivo

"Boa [manhã/tarde]. Vou apresentar um sistema de agendamento de espaços.
Objetivo: Demonstrar competências em:
- Arquitetura full-stack (frontend + backend)
- Desenvolvimento seguro com JWT
- Containerização com Docker
- Testes automáticos com Playwright
- Code quality e manutenibilidade"
```

### Minuto 3-5: Arquitetura (Mostrar Diagrama)
```
Slide ou Quadro:

   ┌─────────────────────────────────────────┐
   │     FRONTEND (React + Vite)             │
   │     Port 3000 - Nginx                   │
   │  ✓ Login                                │
   │  ✓ Dashboard                            │
   │  ✓ Listar Espaços                       │
   │  ✓ Criar Reservas                       │
   └─────────────┬───────────────────────────┘
                 │ REST API + JWT
   ┌─────────────▼───────────────────────────┐
   │   BACKEND (Spring Boot 2.7)             │
   │   Port 8080 - Tomcat                    │
   │  ✓ Authentication (JWT)                 │
   │  ✓ Reservations Logic                   │
   │  ✓ Conflict Detection                   │
   │  ✓ Persistence (JPA)                    │
   └─────────────┬───────────────────────────┘
                 │
   ┌─────────────▼───────────────────────────┐
   │     Database (H2 In-Memory)             │
   │  ✓ 2 Spaces (seed data)                 │
   │  ✓ Admin User                           │
   │  ✓ Reservations                         │
   └─────────────────────────────────────────┘

Containerized with Docker Compose
```

**Explicação:**
"O frontend em React comunica com o backend via REST API. Cada request leva um JWT token no header Authorization. O backend valida o token, processa a lógica, e persiste em H2."

### Minuto 6-12: DEMO AO VIVO

**Part 1: Login (1 min)**
```
1. Abrir http://localhost:3000
2. Email: admin@example.com
3. Senha: admin123
4. Clicar "Entrar"

While DevTools Network tab is visible:
- Mostrar POST /api/auth/login → 200
- Mostrar response com token e dados do usuário
```

**Part 2: Dashboard (1 min)**
```
1. Dashboard carrega com:
   - Nome do usuário (Admin)
   - 2 Espaços disponíveis
   - 0 Minhas Reservas
   - Gráfico de ocupação

Mencionar:
"Dashboard carrega dados do backend via GET /api/spaces
Dados armazenados em localStorage - se fizer F5, mantém sessão"
```

**Part 3: Listar Espaços (1 min)**
```
1. Clique em "Espaços" (navbar)
2. Mostra 2 cards:
   - Sala de Reunião A (10 pessoas, R$ 50/h)
   - Auditório Azul (100 pessoas, R$ 200/h)
3. Cada card tem botão "Reservar"

Mencionar:
"Dados vêm do backend, renderizados em React com Tailwind CSS"
```

**Part 4: Criar Reserva (2 min)**
```
1. Clique em "Reservar" na primeira sala
2. Modal abre com:
   - Date picker (mostra apenas datas futuras)
   - Time selects (start/end)
   - Descrição
   - Botões Confirmar/Cancelar

3. Preencher:
   - Data: próximo dia (segunda-feira)
   - Hora início: 09:00
   - Hora fim: 11:00
   - Descrição: "Reunião com time"

4. Clicar "Confirmar Reserva"

DevTools Network:
- Mostrar POST /api/reservations
- Status 201 Created ✅
- Response com ID da reserva

Mencionar:
"Backend validou:
- Horário fim > horário início
- Não há conflito com outra reserva no mesmo período
- Usuário autenticado
- Cálculo de preço: 2h × R$50 = R$100"
```

**Part 5: Verificar Persistência (2 min)**
```
1. Clicar em "Minhas Reservas"
   - Mostra a reserva que acabou de criar
   - Status: CONFIRMED
   - Preço total: R$100.00
   - Data/hora: [como preencheu]

2. Pressionar F5 (refresh)
   - Reserva AINDA aparece
   - Token mantido em localStorage
   - Dados persistidos no H2

3. DevTools > Application > LocalStorage
   - Mostrar: authToken, userData
   - Token é JWT: header.payload.signature

Mencionar:
"H2 em-memory persiste durante lifetime do container.
JWT permite que Frontend saiba quem é o usuário sem guardar sessão no server.
Isso é stateless - escalável!"
```

**Part 6: Backend Health (30 seg)**
```
1. Abrir nova aba: http://localhost:8080/api/health
2. Mostra JSON: {"status":"ok","service":"sistema-agendamento"}

Mencionar:
"Endpoint de health check - common em produção"
```

### Minuto 13-14: Testes Automáticos (1 min)
```
Slide: Mostra 30+ testes

Ou rodar ao vivo (rápido):
npx playwright test --reporter=line

Resultado: 40 testes em ~60 segundos

Coverage:
✅ Autenticação (login, JWT, logout)
✅ Navegação entre páginas
✅ Listar espaços
✅ Criar reservas
✅ Validação de APIs
✅ Persistência de dados
✅ Interações UI
✅ Responsividade (mobile/desktop)
```

### Minuto 15: Conclusão

```
Menção Final:
"Implementei um sistema completo, testado, documentado e pronto para produção.
Tecnologias:
- Frontend: React, TypeScript, Tailwind, Playwright
- Backend: Spring Boot, Java 21, JWT, JPA
- Infrastructure: Docker, docker-compose
- Deployment-ready: Health checks, logging, structured error handling"

Possíveis Melhorias (se perguntarem):
- GraphQL para queries mais eficientes
- PostgreSQL em produção (ao invés de H2)
- Redis para cache
- Microserviços (Payments, Notifications separados)
- CI/CD com GitHub Actions
- Kubernetes para orchestration
```

---

## 🎯 RESPOSTAS PREPARADAS

### P: "Por que Spring Boot?"
R: "Spring é padrão em empresas enterprise. Oferece segurança built-in, ORM (JPA), e ecossistema maduro. Para um sistema acadêmico, escolher Spring demonstra conhecimento de tecnologia profissional."

### P: "Como lidaria com escala?"
R: "
1. Database: PostgreSQL com índices + connection pooling
2. Cache: Redis para espaços (dados semi-estáticos)
3. API: Paginação nas listas
4. Infra: Horizontal scaling com load balancer
5. Frontend: Code splitting, lazy loading, CDN para assets
"

### P: "E segurança? Como protege contra XSS?"
R: "
- React sanitiza HTML automaticamente
- JWT tokens só em HttpOnly cookies (não localStorage em produção)
- Backend valida TODAS as inputs
- CORS configurado para apenas origem confiável
- SQL Injection: Impossível com JPA (parameterized queries)
"

### P: "Por que não usar banco SQL tradicional?"
R: "Para demo/desenvolvimento, H2 em-memory é perfeito - zero setup. Em produção, migraria para PostgreSQL com migrations (Flyway). Código Java não mudaria - JPA abstrai o banco."

### P: "Como trata conflitos de reserva?"
R: "Query SQL que busca reservas CONFIRMED no mesmo espaço com overlap de horários. Se encontrar alguma, retorna erro 400 com mensagem clara. Transações JPA garantem atomicidade."

### P: "Qual é o JWT payload?"
R: "Subject (email do usuário), issued time (iat), expiration (exp). Assinado com HMAC-SHA256 e chave secreta do servidor. Se alguém alterar o payload, assinatura fica inválida e token é rejeitado."

### P: "Como o frontend sabe que está autenticado?"
R: "
1. Login bem-sucedido → backend retorna JWT + dados do usuário
2. Frontend armazena em localStorage
3. Em cada request, Axios interceptor adiciona: Authorization: Bearer {token}
4. Backend desserializa JWT e extrai subject (email)
5. Usa email para filtrar reservas do usuário
"

### P: "Qual é o design pattern?"
R: "
- Frontend: Component-based (React) com hooks
- Backend: Service-Repository pattern (separation of concerns)
- Database: Active Record via JPA
- API: REST (standard enterprise)
"

---

## 💬 LINGUAGEM E COMUNICAÇÃO

### ✅ Faça Assim:
```
"O sistema valida se..."
"Backend retorna erro 400 se..."
"Frontend intercepta a response e mostra toast..."
"Docker containeriza ambos os serviços..."
"Testes E2E garantem que..."
```

### ❌ Evite:
```
"Uh... deixa eu pensar"
"Acho que..."
"Provavelmente..."
"Não tenho certeza, mas..."
```

### ✅ Demonstre Confiança:
```
"Vou mostrar a validação de conflitos"
"Vejam o JWT token no Network tab"
"Aqui está o test report com 40 tests rodando"
"O backend retorna 201 Created, confirmando persistência"
```

---

## 📊 TIMELINE NA SALA

```
-60 min: Chegar com antecedência
-45 min: Setup projetor, plugar HDMI, testar resolução
-30 min: docker compose up -d (containers iniziam)
-10 min: Pre-demo-check.ps1 (verificar tudo)
-5 min: Smoke test (login + criar reserva)
-2 min: Fechar outros apps, ativar "Do Not Disturb"
0 min: Iniciar apresentação
+2 min: Abrir slides
+5 min: Mostrar arquitetura
+6 min: Abrir live demo (localhost:3000)
+12 min: Terminar demo ao vivo
+13 min: Mostrar testes Playwright
+15 min: Conclusão e possíveis melhorias
+15-20 min: Q&A com professores
```

---

## 🎨 SLIDES RECOMENDADOS

### Slide 1: Capa
```
SISTEMA DE AGENDAMENTO DE ESPAÇOS
Frontend: React + TypeScript + Vite
Backend: Spring Boot 2.7 + Java 21
Infra: Docker + Docker Compose
Testing: Playwright E2E (30+ tests)

[Seu nome]
[Instituição]
[Data]
```

### Slide 2: Problema
```
✗ Muitos espaços disponíveis
✗ Reservas manuais (propenso a erros)
✗ Conflitos de agendamento frequentes
✗ Sem histórico de reservas

→ Solução: Sistema automático, online, com validações
```

### Slide 3: Arquitetura
```
[Diagrama: Frontend → Backend → Database]
```

### Slide 4: Tecnologias
```
Frontend:
  • React 18 (UI framework)
  • TypeScript (type safety)
  • Tailwind CSS (styling)
  • Axios (HTTP client)
  • Playwright (E2E tests)

Backend:
  • Spring Boot 2.7 (web framework)
  • Spring Security (JWT auth)
  • JPA/Hibernate (ORM)
  • H2 (database)

Infra:
  • Docker (containers)
  • nginx (reverse proxy)
  • docker-compose (orchestration)
```

### Slide 5: Features
```
✅ Autenticação com JWT
✅ Listar espaços disponíveis
✅ Criar reservas com validação
✅ Detectar conflitos de horário
✅ Calcular preço automaticamente
✅ Visualizar minhas reservas
✅ Cancelar reservas
✅ Responsive design
✅ Testes automáticos
```

### Slide 6: Demo ao Vivo
```
[Ao vivo aqui]
- Fazer login
- Navegar pelo sistema
- Criar uma reserva
- Verificar persistência
```

### Slide 7: Testes
```
30+ Testes Automáticos (Playwright)
- Autenticação (4 testes)
- Navegação (3 testes)
- Espaços (2 testes)
- Reservas (3 testes)
- APIs (3 testes)
- Persistência (2 testes)
- UI (2 testes)
- Responsividade (2 testes)

Execução: npx playwright test
Relatório: npx playwright show-report
```

### Slide 8: Code Quality
```
✅ Clean Code principles
✅ SOLID principles
✅ Design patterns
✅ Error handling
✅ Logging estruturado
✅ Documentation
✅ Type safety (TypeScript)
✅ No hardcoded secrets
```

### Slide 9: Conclusão
```
Competências Demonstradas:
✓ Full-stack development
✓ Frontend (React)
✓ Backend (Spring Boot)
✓ Database design
✓ API RESTful
✓ Security (JWT)
✓ Testing (E2E)
✓ DevOps (Docker)
✓ Problem solving
✓ Communication

Próximas Melhorias:
- GraphQL
- PostgreSQL
- Redis cache
- Microserviços
- CI/CD
```

### Slide 10: Obrigado
```
Dúvidas?

[Contato seu / Links]
```

---

## 🏆 FINAL MINDSET

**Você preparou:**
- ✅ Sistema funcionando em Docker
- ✅ Código clean e bem estruturado
- ✅ 30+ testes automáticos
- ✅ Documentação completa
- ✅ Recuperação de emergência

**O que falta:**
- Confiança de apresentar
- Comunicação clara
- Domínio do código

**Como conseguir:**
1. Leia o código 1x antes da demo
2. Pratique o roteiro 2x em voz alta
3. Teste login + criar reserva 3x
4. Respire fundo e lembre: VOCÊ FEZ ISSO

**Se algo falhar:**
- Não é o fim
- Mostra debugging skills
- Você conhece a solução
- Professores vão respeitar

---

**Você está pronto. Vai ser incrível! 🚀✨**
