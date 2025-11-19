# 🆘 EMERGENCY DEMO RECOVERY

## ⚡ QUICK FIX (30 segundos)

Se algo falhar 5 minutos antes da apresentação, execute isto:

### Terminal 1 - Nuclear Reset:
```bash
cd c:\workspace\sistema-agendamento

# Kill everything
docker compose down --volumes
docker system prune -a -f

# Rebuild fresh
docker compose build --no-cache
docker compose up -d

# Aguarde 30 segundos
Start-Sleep -Seconds 30

# Verify
curl http://localhost:8080/api/health
curl http://localhost:3000
```

### Terminal 2 - Test Login (enquanto aguarda):
```bash
# PowerShell script rápido
$response = Invoke-WebRequest -Uri http://localhost:8080/api/auth/login `
  -Method Post -ContentType "application/json" `
  -Body '{"email":"admin@example.com","password":"admin123"}' `
  -UseBasicParsing

if ($response.StatusCode -eq 200) {
  Write-Host "✅ LOGIN OK" -ForegroundColor Green
} else {
  Write-Host "❌ LOGIN FALHOU" -ForegroundColor Red
}
```

---

## 🔧 PROBLEMAS ESPECÍFICOS

### ❌ "Port 8080 already in use"

```bash
# Encontrar processo
netstat -ano | findstr :8080

# Matar processo (substitua PID)
taskkill /PID 1234 /F

# Ou mudar port no docker-compose.yml:
# ports:
#   - "8081:8080"  ← mude aqui
```

### ❌ "Connection refused"

```bash
# Verificar se containers estão realmente rodando
docker ps

# Se nenhum aparecer:
docker compose ps -a
docker compose logs

# Rebuildar específico container
docker compose up -d --build backend
docker compose up -d --build frontend
```

### ❌ "No such image"

```bash
# Fazer rebuild completo
docker compose build --no-cache --progress=plain

# Se error persistir, limpar tudo
docker image prune -a
docker compose build --no-cache
```

### ❌ Frontend branco/em branco

```bash
# Limpar browser cache
# DevTools > Application > Clear site data

# Ou modo incognito
# Ctrl+Shift+N (Chrome)
# Ctrl+Shift+P (Firefox)
# Ctrl+Shift+N (Edge)

# Depois acessar http://localhost:3000
```

### ❌ Login falha com "Invalid credentials"

```bash
# Verificar admin user criado
docker logs sistema_agendamento_backend 2>&1 | Select-String "admin"

# Deve aparecer: "Created default admin user"

# Se não aparecer, containers não terminaram init
# Aguarde mais 20 segundos e tente login novamente
```

### ❌ Modal de reserva não abre

```javascript
// DevTools Console execute:
console.log('Token:', localStorage.getItem('authToken'));
console.log('User:', localStorage.getItem('userData'));

// Se vazio, fazer login novamente
// Se tem valores, fechar modal e abrir novamente
```

### ❌ Reserva não salva

```
DevTools > Network > XHR
Clicar em "Confirmar Reserva"
Procurar POST /api/reservations

Verificar:
- Status: 201 (sucesso) ✅
- Status: 400 (validation error) ❌ → ler response
- Status: 401 (not authorized) ❌ → login novamente
- Status: 500 (server error) ❌ → verificar backend logs
```

### ❌ Tudo rodando mas está lento

```bash
# Aumentar memory para Docker
# Settings > Resources > Memory: 4GB

# Ou rodar menos containers (deixe apenas backend + frontend)
docker ps
docker stop <container-nao-necessario>
```

---

## 🎯 PLANO B - SE TUDO FALHAR

### Opção 1: Mostrar Testes (30 segundos)
```bash
cd "Sistema de Agendamento"
npx playwright test --reporter=line
# Mostra 30+ testes rodando
```

**Script para rodar:**
```bash
# Abrir terminal e executar
npx playwright show-report
# Abre HTML report com screenshots
```

### Opção 2: Código-Fonte (5 minutos)
```bash
# Abrir VS Code
code .

# Mostrar:
# - Backend: src/main/java/com/reserves/service/ReservationService.java
# - Frontend: src/pages/Spaces.tsx
# - Tests: tests/e2e.spec.ts
```

**Pontos para explicar:**
- Validação de conflitos em ReservationService
- JWT authentication flow
- React state management
- Playwright test structure

### Opção 3: Arquitetura (10 minutos)
```
1. Desenhar no quadro:
   Frontend (Port 3000) ← HTTP → Backend (Port 8080)
   
2. Mostrar flow:
   Login → JWT Token → localStorage → Authorization Header → API Call

3. Explicar database:
   H2 in-memory → Auto seed (admin + 2 spaces) → Queries fast

4. Mencionar:
   "Docker containeriza tudo em 2 imagens pré-built"
   "Playwright E2E testa toda a integração"
```

### Opção 4: Demonstração Estática (Slides + Video)
```bash
# Se tudo falhar totalmente:
# 1. Mostrar print screens salvos (pasta screenshots/)
# 2. Abrir RESUMO_FINAL.md no editor
# 3. Ler arquitetura e código
# 4. Explicar decisões de design
```

---

## 🛡️ COMO EVITAR PROBLEMAS

### ✅ 24 Horas Antes:
```bash
docker compose down --volumes
docker image prune -a
git pull origin main  # Se remoto
```

### ✅ 2 Horas Antes:
```bash
docker compose build --no-cache
docker compose up -d
Start-Sleep -Seconds 30
.\pre-demo-check.ps1
```

### ✅ 30 Minutos Antes:
```bash
# Testar fluxo completo
1. Login
2. Abrir Espaços
3. Clique Reservar
4. Preencher formulário
5. Confirmar
6. Verificar em Reservas
7. Refresh (F5)
```

### ✅ 5 Minutos Antes:
```bash
docker ps  # Confirmar 2 containers running
# Se não: docker compose up -d
```

---

## 📱 SETUP FÍSICO

### Monitor/Projetor:
- [ ] HDMI conectado e testado
- [ ] Resolução ajustada (1920x1080 ideal)
- [ ] Zoom browser: 100% (Ctrl+0)
- [ ] DevTools: F12 aberto em Network tab
- [ ] Fonte grande legível de longe

### Teclado/Mouse:
- [ ] Sem lag/latência
- [ ] Cliques responsivos
- [ ] Scroll suave no browser

### Internet:
- [ ] Não precisa (tudo local!)
- [ ] WiFi pode estar desligado
- [ ] Zero dependências externas

### Ambiente:
- [ ] Sem notificações ativas
- [ ] Modo "Não Perturber" ON
- [ ] Apps desnecessários fechados
- [ ] RAM disponível (mín 2GB para Docker)

---

## 🎬 TIMELINE REALISTA

| Tempo | Ação |
|-------|------|
| -60 min | Chegar na sala, plugar projetor |
| -45 min | `docker compose down && docker system prune -a -f` |
| -30 min | `docker compose up -d --build` (build ocorre) |
| -10 min | Aguardar startup (backend + frontend inicia) |
| -5 min | `.\pre-demo-check.ps1` (verificar tudo) |
| -2 min | Testar login + criar reserva (smoke test) |
| 0 min | Iniciar apresentação slides |
| +2 min | Abrir live demo (localhost:3000 full screen) |
| +15 min | Fim demo (se tudo OK) |
| +20 min | Q&A |

---

## 💡 DICAS PSICOLÓGICAS

1. **Se falhar algo DURANTE a demo:**
   - Não entre em pânico
   - Diga: "Deixa eu verificar no backend" (abre logs)
   - Mostre que entende o código
   - Explicar causa (rede, timeout, etc)
   - Professores valorizam debugging skills!

2. **Se não conseguir de novo:**
   - "Vamos pro Plano B - testes automáticos"
   - Rodar Playwright (prova que funciona)
   - Mostrar relatório HTML com screenshots

3. **Seu superpoder:**
   - Você conhece CADA LINHA de código
   - Você sabe exatamente o que faz
   - Você pode explicar qualquer erro
   - Isso impressiona mais que demo "perfeita"

---

## ✅ CHECKLIST FINAL

```
ANTES DA APRESENTAÇÃO:
☐ `docker ps` mostra 2 containers RUNNING
☐ curl localhost:8080/api/health retorna 200
☐ curl localhost:3000 retorna 200
☐ Login funciona (admin@example.com / admin123)
☐ Criar reserva funciona
☐ Refresh mantém dados
☐ DevTools Network tab visível
☐ Zoom browser OK
☐ Monitor conectado e testado
☐ Nenhuma notificação ativa
☐ Documentação .md aberta (se needed)
☐ VS Code pronto (se needed)
☐ Scripts pre-demo-check.ps1 testados
☐ Você respirou fundo e está calmo 😎
```

---

## 🚀 FRASE FINAL

"Se algo falhar durante a demo, não é o fim do mundo. Você preparou testes automáticos, documentação, código limpo e entende cada decisão que tomou. Até um erro em live é oportunidade de demonstrar capacidade de debug e comunicação. Você vai bombar! 🎓"

**Boa sorte! 💪**
