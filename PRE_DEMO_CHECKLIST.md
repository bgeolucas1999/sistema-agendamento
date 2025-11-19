# 🎯 CHECKLIST PRÉ-DEMO - APRESENTAÇÃO ACADÊMICA

## ✅ 48 HORAS ANTES DA APRESENTAÇÃO

### 1. **Verificar Ambiente Local**
- [ ] Docker Desktop instalado e funcionando
  ```bash
  docker --version
  docker ps
  ```
- [ ] Node.js 18+ instalado
  ```bash
  node --version
  npm --version
  ```
- [ ] Java 21 instalado (verificar)
  ```bash
  java -version
  ```
- [ ] Git atualizado e sem commits pendentes
  ```bash
  git status
  git log --oneline -5
  ```

### 2. **Build Verificação**
- [ ] Backend compila sem erros
  ```bash
  cd c:\workspace\sistema-agendamento
  .\mvnw.cmd clean package -DskipTests
  ```
- [ ] Frontend instala dependências
  ```bash
  cd "c:\workspace\sistema-agendamento\Sistema de Agendamento"
  npm install
  ```
- [ ] Docker images buildáveis
  ```bash
  docker compose build --no-cache
  ```

### 3. **Dados Seed**
- [ ] 2 espaços criados automaticamente (data.sql)
  - Sala de Reunião A (10 pessoas, R$ 50/h)
  - Auditório Azul (100 pessoas, R$ 200/h)
- [ ] Admin user criado: `admin@example.com` / `admin123`
- [ ] H2 console acessível (opcional para debug)

### 4. **Documentação Verificação**
- [ ] README.md atualizado
- [ ] RESUMO_FINAL.md com flow completo
- [ ] TESTES_E2E.md com lista de testes
- [ ] Credenciais documentadas

---

## 🚀 30 MINUTOS ANTES DA APRESENTAÇÃO

### 1. **Limpar e Preparar Sistema**
```bash
# Clear containers antigos
docker compose down --volumes
docker system prune -f

# Limpar node_modules e cache
cd "c:\workspace\sistema-agendamento\Sistema de Agendamento"
rm -r node_modules package-lock.json
npm cache clean --force

# Rebuild e inicie
cd c:\workspace\sistema-agendamento
docker compose build --no-cache
docker compose up -d

# Aguarde 15 segundos
Start-Sleep -Seconds 15
```

### 2. **Teste Rápido de Conectividade**
```bash
# Backend
curl http://localhost:8080/api/health

# Frontend
curl http://localhost:3000

# API Spaces
$token = (Invoke-WebRequest -Uri http://localhost:8080/api/auth/login `
  -Method Post -ContentType "application/json" `
  -Body '{"email":"admin@example.com","password":"admin123"}' `
  -UseBasicParsing).Content | ConvertFrom-Json | Select-Object -ExpandProperty token

Invoke-WebRequest -Uri http://localhost:8080/api/spaces `
  -Headers @{ Authorization = "Bearer $token" } -UseBasicParsing
```

### 3. **Browser Setup**
- [ ] Abrir 2 abas:
  - Tab 1: `http://localhost:3000` (Frontend)
  - Tab 2: `http://localhost:8080/api/spaces` (API debug)
- [ ] DevTools aberto (F12) - Network tab
- [ ] localStorage inspecionável (DevTools → Application)
- [ ] Zoom ajustado (100% ou 125%)

### 4. **Teste de Fluxo Rápido (5 minutos)**
- [ ] Login com `admin@example.com` / `admin123`
- [ ] Verificar token em localStorage
- [ ] Navegar para "Espaços"
- [ ] Clicar "Reservar" em um espaço
- [ ] Preencher formulário e submeter
- [ ] Verificar resposta 201 em Network
- [ ] Navegar para "Reservas"
- [ ] Ver reserva criada na lista

---

## 📊 ROTEIRO DE APRESENTAÇÃO (15-20 minutos)

### SLIDE 1: Introdução (1 min)
- Título: "Sistema de Agendamento de Espaços"
- Tecnologias: React 18 + Spring Boot 2.7 + Docker
- Objetivo: Demonstrar full-stack + testes E2E

### SLIDE 2: Arquitetura (2 min)
```
┌──────────────────────────────────────────┐
│  Frontend (React + Vite on port 3000)   │
│  - Login, Dashboard, Spaces, Reservations│
│  - JWT Authentication                    │
│  - localStorage para sessão             │
└──────────────┬───────────────────────────┘
               │ HTTPS/REST
┌──────────────▼───────────────────────────┐
│ Backend (Spring Boot on port 8080)       │
│ - JWT + Security Filter                  │
│ - JPA + H2 In-memory Database           │
│ - Reservation Logic & Validation         │
└──────────────────────────────────────────┘
```

### SLIDE 3: Demo ao Vivo (10-12 min)
**Abrir Frontend em Full Screen**

#### Part 1: Login (1 min)
```
Email: admin@example.com
Password: admin123
→ Mostrar token em Network tab
```

#### Part 2: Dashboard (1 min)
```
Widgets com:
- 2 Espaços Disponíveis
- 0 Minhas Reservas (antes de criar)
- Taxa de Ocupação
```

#### Part 3: Listar Espaços (1 min)
```
Clique em "Espaços"
→ Mostra 2 espaços com cards
→ Cada espaço tem botão "Reservar"
```

#### Part 4: Criar Reserva (3 min)
```
1. Clicar "Reservar" na primeira sala
2. Modal abre com:
   - Date picker (Calendar)
   - Time selects (09:00 - 11:00)
3. Clicar "Confirmar Reserva"
4. Mostrar:
   - Network request POST /api/reservations (201)
   - Success toast
   - Modal fecha
```

#### Part 5: Verificar Persistência (2 min)
```
1. Navegar para "Reservas"
   → Mostra a reserva criada
2. F5 (Refresh page)
   → Reserva ainda lá (H2 persistence)
3. Abrir DevTools → Application → localStorage
   → Mostrar authToken + userData
```

#### Part 6: Backend Health (1 min)
```
Abrir nova aba: http://localhost:8080/api/health
→ {"status":"ok","service":"sistema-agendamento"}
```

### SLIDE 4: Testes E2E (2 min)
```bash
Mostrar: npx playwright test
→ 30+ testes automáticos
→ Coverage: Auth, Navigation, CRUD, APIs, Persistence
```

### SLIDE 5: Conclusão (1 min)
- Pontos fortes: Full-stack, Docker, Tests, JWT
- Possíveis melhorias: More validations, GraphQL, microservices
- Tecnologias aprendidas: React, Spring, Docker, Playwright

---

## 🚨 TROUBLESHOOTING - SE ALGO DER ERRADO

### ❌ Problema: "Connection refused" em localhost:3000 ou 8080

**Solução:**
```bash
# Verificar containers
docker ps

# Se não aparecerem:
docker compose up -d

# Se ainda falhar:
docker compose logs backend
docker compose logs frontend

# Nuclear option:
docker compose down --volumes
docker system prune -a -f
docker compose up -d --build
```

### ❌ Problema: Login não funciona

**Solução:**
```bash
# Verificar admin user criado:
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Se erro 401: Recreate containers
docker compose down
docker compose up -d --build

# Aguarde 20 segundos para seeds rodar
```

### ❌ Problema: Modal de reserva não abre

**Solução:**
```javascript
// DevTools Console:
console.log(localStorage.getItem('authToken')); // Deve ter valor
console.log(localStorage.getItem('userData'));   // Deve ter email
```

### ❌ Problema: Reserva não salva no backend

**Solução:**
1. Abrir DevTools → Network
2. Filtrar por "reservations"
3. Verificar:
   - Method: POST
   - Status: 201 (Created) ✅ ou 400/401 ❌
   - Response body com error message

Se status 400:
```json
{
  "error": "Horário final deve ser após o horário inicial"
  // ou algum erro de validação
}
```

### ❌ Problema: Port já em uso (8080 ou 3000)

**Solução:**
```bash
# Windows - Find process using port
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Ou mudar porta em docker-compose.yml:
# ports:
#   - "8081:8080"   # Backend em 8081
#   - "3001:80"     # Frontend em 3001
```

### ❌ Problema: Sem internet na sala (importantes!)

**O que fazer:**
1. Não depender de CDNs externas ✅ (tudo local)
2. Não fazer login social ✅ (auth simples)
3. Não enviar emails ✅ (só em-memory)
4. **Tudo funciona offline** ✅

### ❌ Problema: Browser crashes ou freeze

**Solução:**
```bash
# Abrir em modo incognito/private
# Ou limpar cache:
Ctrl + Shift + Delete → Clear browsing data

# Usar outro browser
# Chrome → Firefox → Edge
```

---

## 🎓 SLIDES COM PRINTS/SCREENSHOTS

### Recomendado: Ter 5 screenshots prontos
1. Login screen
2. Dashboard com widgets
3. Spaces list com cards
4. Modal de reserva aberto
5. Reservation confirmada

**Como capturar:**
```bash
# Print = PrtScn
# Salvar em: apresentacao/screenshots/
# Usar em slide de backup
```

---

## 📋 CHECKLIST NO DIA DA DEMO

### 1 HORA ANTES:
- [ ] Chegar com antecedência
- [ ] Plugar projetor/TV
- [ ] Testar HDMI/conexão
- [ ] Aumentar fonte do browser (Ctrl +)
- [ ] Desativar notificações do Windows
  ```bash
  Settings → Notifications → Turn off
  ```
- [ ] Fechar Slack, Discord, Teams
- [ ] Modo "Não Perturbar" ativo

### 30 MINUTOS ANTES:
- [ ] `docker compose up -d`
- [ ] Abrir Firefox/Chrome em full screen
- [ ] Testar login
- [ ] Testar criar reserva
- [ ] Verificar Network tab visível
- [ ] Ter terminal pronto para comandos (opcional)

### 5 MINUTOS ANTES:
- [ ] Slides prontos
- [ ] Browser na aba do frontend
- [ ] Terminal limpo
- [ ] Câmera/Microfone testados (se virtual)
- [ ] Respirar fundo 😎

---

## ✨ DICAS EXTRAS PARA IMPRESSIONAR

### 1. **Mostrar o Código (opcional)**
```bash
# Abrir VS Code com estrutura
code .
# Mostrar: DebugController.java, e2e.spec.ts
```

### 2. **Mencionar Arquitetura**
- "Backend em Java 21 com Spring Security"
- "Frontend em React com TypeScript"
- "Containerizado com Docker Compose"
- "Testes automáticos com Playwright"

### 3. **Falar de Validações**
- "Reservas não podem sobrepor no mesmo espaço"
- "Horário não pode ser no passado"
- "JWT com 24h de expiração"
- "H2 Database em-memory com seed data"

### 4. **Performance**
- "Docker multi-stage builds"
- "Frontend compilado com Vite (rápido!)"
- "Nginx servindo frontend em produção"

### 5. **Segurança Mencionada**
- "JWT Bearer tokens"
- "BCrypt password hashing"
- "CORS configured"
- "Role-based access (ROLE_ADMIN, ROLE_USER)"

---

## 🎬 ROTEIRO ALTERNATIVO (SE ALGO FALHAR)

**Plano B:**
1. Mostrar screenshots da demo funcionando
2. Rodar testes Playwright (mostra automation)
3. Explicar code structure no VS Code
4. Falar sobre melhorias futuras

**Plano C:**
1. Rodar testes E2E ao vivo (30 segundos)
2. Mostrar relatório HTML do Playwright
3. Discutir arquitetura e decisions
4. Q&A com professores

---

## 📞 CONTATOS ÚTEIS (Se precisar)

- **Documentação:**
  - README.md → Getting Started
  - RESUMO_FINAL.md → Architecture & Metrics
  - TESTES_E2E.md → Test Cases

- **Logs (Debugging):**
  ```bash
  docker logs sistema_agendamento_backend
  docker logs sistema_agendamento_frontend
  docker compose logs -f
  ```

- **Reset rápido:**
  ```bash
  docker compose down
  docker compose up -d --build
  # Aguarde 20 segundos
  ```

---

## ✅ FINAL CHECKLIST

```
AMBIENTE:
☐ Docker rodando
☐ Containers healthy (docker ps)
☐ Localhost:3000 acessível
☐ Localhost:8080 respondendo
☐ Login funciona

DEMO:
☐ Slides prontos
☐ Browser em full screen
☐ DevTools acessível
☐ Network tab visível
☐ localStorage visível

BACKUP:
☐ Screenshots salvos
☐ Testes E2E prontos
☐ Código aberto no VS Code
☐ Terminal limpinho

APRESENTAÇÃO:
☐ Microfone testado
☐ Câmera testada (se virtual)
☐ Iluminação ok
☐ Fonte grande (zoom 150%)
☐ Nenhuma notificação ativa

VOCÊ:
☐ Descansado
☐ Preparado
☐ Confiante
☐ Com água próxima 💧
☐ Sorrindo 😊
```

---

**Bora apresentar! Você vai arrasar! 🚀**
