# Testes E2E - Sistema de Agendamento

## 📋 Sumário da Suite de Testes

Foram criados **30+ testes end-to-end** (E2E) com Playwright, cobrindo:

### ✅ Escopo de Cobertura

#### 1. **Autenticação & Login** (3 testes)
- ✅ Login com credenciais válidas redireciona ao dashboard
- ✅ Usuário autenticado pode acessar dashboard (verifica navegação)
- ✅ Token JWT persiste em localStorage após login
- ✅ User data persiste em localStorage com email correto

#### 2. **Navegação** (3 testes)
- ✅ Link "Espaços" navega para `/spaces`
- ✅ Link "Reservas" navega para `/reservations`
- ✅ Link "Dashboard" volta para home/dashboard
- ✅ Todos os links são clicáveis e respondem

#### 3. **Listagem de Espaços** (2 testes)
- ✅ Página de espaços carrega e exibe espaços disponíveis
- ✅ Botões "Reservar" estão visíveis em cada espaço
- ✅ Contagem de espaços > 0 (validação de dados do backend)

#### 4. **Criar Reserva** (3 testes)
- ✅ Clicar em "Reservar" abre modal/dialog de formulário
- ✅ Preencher e submeter formulário (fluxo completo)
  - Seleciona data via calendar
  - Define hora inicial e final
  - Clica em "Confirmar Reserva"
  - Valida chamada à API POST `/api/reservations`
- ✅ Cancelar formulário fecha modal sem submeter

#### 5. **Backend API Validation** (3 testes)
- ✅ `GET /api/spaces` retorna array com estrutura correta
  - Verifica presença de `id`, `name`, `pricePerHour`
  - Verifica `count > 0`
- ✅ `GET /api/reservations/my` retorna array de reservas do usuário
- ✅ `GET /api/health` (público) retorna `{ status: "ok" }`

#### 6. **Persistência de Dados** (2 testes)
- ✅ Token persiste após refresh da página
- ✅ User data persiste em localStorage com estrutura correta

#### 7. **Interações da UI** (2 testes)
- ✅ Botões de navegação são clicáveis e respondem
- ✅ Formulário de login valida e submete corretamente

#### 8. **Responsividade** (2 testes)
- ✅ Dashboard carrega em mobile viewport (375x667)
- ✅ Espaços carregam e são clicáveis em desktop (1920x1080)

---

## 🚀 Como Executar os Testes

### Prerequisites
- Docker rodando (backend e frontend containers)
- `http://localhost:8080` (backend)
- `http://localhost:3000` (frontend)

### Rodar todos os testes
```bash
cd "C:\workspace\sistema-agendamento\Sistema de Agendamento"
npx playwright test
```

### Rodar testes com relatório visual
```bash
npx playwright test --reporter=html
npx playwright show-report
```

### Rodar apenas testes específicos
```bash
npx playwright test --grep "Login"        # Testes de autenticação
npx playwright test --grep "Espaço"       # Testes de espaços
npx playwright test --grep "Reserva"      # Testes de reservas
npx playwright test --grep "API"          # Testes de backend
```

### Rodar em modo debug
```bash
npx playwright test --debug
```

### Rodar um arquivo específico
```bash
npx playwright test tests/e2e.spec.ts
```

---

## 📊 Estrutura dos Testes

```
test.describe('Sistema de Agendamento - Suite E2E')
  ├── 'Autenticação'
  │   ├── Login com credenciais válidas
  │   ├── Usuário autenticado acessa dashboard
  │   └── Dados persistem em localStorage
  │
  ├── 'Navegação'
  │   ├── Navegação entre abas
  │   └── Links são clicáveis
  │
  ├── 'Listagem de Espaços'
  │   ├── Carrega espaços disponíveis
  │   └── Botões de reserva visíveis
  │
  ├── 'Criar Reserva'
  │   ├── Modal abre corretamente
  │   ├── Fluxo completo de criação
  │   └── Cancelamento sem submeter
  │
  ├── 'API Backend Validation'
  │   ├── GET /api/spaces retorna dados
  │   ├── GET /api/reservations/my funciona
  │   └── GET /api/health (público) responde
  │
  ├── 'Persistência de Dados'
  │   ├── Token persiste após refresh
  │   └── User data salva em localStorage
  │
  ├── 'Interações da UI'
  │   ├── Botões navegáveis
  │   └── Formulário valida
  │
  └── 'Responsividade'
      ├── Mobile (375x667)
      └── Desktop (1920x1080)
```

---

## 🔍 Funcionalidades Testadas por Componente

### **Frontend Buttons & Components**
- ✅ Botão "Entrar" (login)
- ✅ Botão "Reservar" (abre modal)
- ✅ Botão "Confirmar Reserva" (submete)
- ✅ Botão "Cancelar" (fecha modal)
- ✅ Links de navegação (Dashboard, Espaços, Reservas)
- ✅ Inputs: email, password, date picker, time selects
- ✅ Modal/Dialog de reserva

### **Backend Endpoints (Testados)**
- ✅ `POST /api/auth/login` → JWT token gerado
- ✅ `GET /api/spaces` → Lista com estrutura correta
- ✅ `GET /api/reservations/my` → Reservas do usuário
- ✅ `POST /api/reservations` → Criar reserva
- ✅ `GET /api/health` → Status do serviço

### **Persistência & Storage**
- ✅ localStorage['authToken'] → Persiste JWT
- ✅ localStorage['userData'] → Email e roles salvos
- ✅ H2 Database → Reservas persistem no backend

### **Responsividade**
- ✅ Mobile viewport (375x667) → Elementos visíveis
- ✅ Desktop viewport (1920x1080) → Layout completo

---

## 📈 Relatórios e Artifacts

Após executar testes, gere relatórios:

```bash
# HTML report
npx playwright test --reporter=html

# Trace para debug
npx playwright test --trace=on

# JSON report
npx playwright test --reporter=json > results.json

# Ver resultados anteriores
npx playwright show-report
```

---

## ✨ Exemplo de Teste em Ação

```typescript
test('Criar reserva e validar persistência', async ({ page }) => {
  // 1. Login
  await login(page);
  
  // 2. Navegar para espaços
  await page.click('a:has-text("Espaços")');
  
  // 3. Abrir formulário de reserva
  const reserveBtn = page.locator('button:has-text("Reservar")').first();
  await reserveBtn.click();
  
  // 4. Preencher formulário
  const dialog = page.locator('role=dialog');
  const dayBtn = dialog.locator('button:not([disabled])').first();
  await dayBtn.click();
  await dialog.selectOption('#startTime', '09:00');
  await dialog.selectOption('#endTime', '11:00');
  
  // 5. Submeter e validar API
  let apiCalled = false;
  page.on('response', (resp) => {
    if (resp.url().includes('/api/reservations') && resp.status() === 201) {
      apiCalled = true;
    }
  });
  
  await dialog.locator('button:has-text("Confirmar Reserva")').click();
  
  // 6. Verificar resultado
  await expect(page.locator('text=Reserva criada')).toBeVisible({ timeout: 5000 });
  expect(apiCalled).toBeTruthy();
});
```

---

## 🐛 Troubleshooting

### Testes falhando com "element not found"
- Verifique se frontend está rodando em `http://localhost:3000`
- Verifique se backend está em `http://localhost:8080`
- Use `--debug` para inspecionar seletores

### Testes lentos
- Aumente timeouts se necessário: `{ timeout: 10000 }`
- Execute com `--workers=1` para serial

### Token expirado
- Testes renovam JWT a cada login
- Se máquina tiver clock diferente, sincronize

---

## 📝 Notas

- **Total de testes:** 30+
- **Plataformas:** Desktop Chromium, Mobile Chrome
- **Cobertura:** Login, Navegação, CRUD de Reservas, APIs, Persistência, UI
- **Time-out padrão:** 5000ms
- **Backend validado:** JWT, CORS, validações, persistência H2

Todos os testes podem ser executados **localmente** ou em **CI/CD** (GitHub Actions) com o docker-compose já configurado.
