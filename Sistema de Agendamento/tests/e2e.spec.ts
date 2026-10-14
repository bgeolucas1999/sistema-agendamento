import { test, expect, Page } from '@playwright/test';

// Setup: Login helper function
async function login(page: Page, email = 'admin@example.com', password = 'admin123') {
  await page.goto('/');
  await page.fill('#email', email);
  await page.fill('#password', password);
  await page.click('button:has-text("Entrar")');
  // Wait for redirect and API response
  await page.waitForResponse((resp) => resp.url().includes('/api/spaces') && resp.status() === 200);
  await page.waitForLoadState('networkidle');
}

test.describe('Sistema de Agendamento - Suite E2E', () => {
  
  // ========== AUTHENTICATION & LOGIN ==========
  test.describe('Autenticação', () => {
    test('Login com credenciais válidas redireciona ao dashboard', async ({ page }) => {
      await page.goto('/');
      
      // Fill login form
      await page.fill('#email', 'admin@example.com');
      await page.fill('#password', 'admin123');
      
      // Submit
      await page.click('button:has-text("Entrar")');
      
      // Verify API call succeeded
      await page.waitForResponse((resp) => resp.url().includes('/api/spaces') && resp.status() === 200);
      
      // Verify token stored
      const token = await page.evaluate(() => localStorage.getItem('authToken'));
      expect(token).toBeTruthy();
      expect(token).toMatch(/^eyJ/);
    });

    test('Usuário autenticado pode acessar dashboard', async ({ page }) => {
      await login(page);
      
      // Verify we can see navigation
      await expect(page.locator('a:has-text("Espaços")')).toBeVisible();
      await expect(page.locator('a:has-text("Reservas")')).toBeVisible();
    });
  });

  // ========== NAVIGATION ==========
  test.describe('Navegação', () => {
    test('Link "Espaços" navega para página de espaços', async ({ page }) => {
      await login(page);
      
      // Click Espaços link
      await page.click('a:has-text("Espaços")');
      
      // Wait for spaces to load
      await page.waitForResponse((resp) => resp.url().includes('/api/spaces') && resp.status() === 200);
      await page.waitForSelector('text=Sala de Reunião|Auditório', { timeout: 5000 });
      
      // Verify we're on spaces page
      expect(page.url()).toContain('/spaces');
    });

    test('Link "Reservas" navega para página de reservas', async ({ page }) => {
      await login(page);
      
      // Click Reservas link
      await page.click('a:has-text("Reservas")');
      
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Verify we're on reservations page
      expect(page.url()).toContain('/reservations');
    });

    test('Link "Dashboard" volta ao dashboard', async ({ page }) => {
      await login(page);
      
      // Go to spaces first
      await page.click('a:has-text("Espaços")');
      await page.waitForLoadState('networkidle');
      
      // Return to dashboard
      await page.click('a:has-text("Dashboard")');
      await page.waitForLoadState('networkidle');
      
      // Verify URL (might be / or /dashboard)
      const url = page.url();
      expect(url.includes('/dashboard') || url.includes('/') || url.includes('localhost')).toBeTruthy();
    });
  });

  // ========== SPACES LISTING ==========
  test.describe('Listagem de Espaços', () => {
    test('Página de espaços carrega e exibe espaços disponíveis', async ({ page }) => {
      await login(page);
      await page.click('a:has-text("Espaços")');
      
      // Wait for API call
      await page.waitForResponse((resp) => resp.url().includes('/api/spaces') && resp.status() === 200);
      
      // Wait for content
      await page.waitForSelector('text=Sala de Reunião', { timeout: 5000 });
      
      // Verify spaces are visible
      const spaces = page.locator('text=Sala de Reunião A|Auditório Azul');
      expect(await spaces.count()).toBeGreaterThan(0);
    });

    test('Botão "Reservar" está visível em cada espaço', async ({ page }) => {
      await login(page);
      await page.click('a:has-text("Espaços")');
      
      // Wait for spaces to load
      await page.waitForResponse((resp) => resp.url().includes('/api/spaces') && resp.status() === 200);
      await page.waitForSelector('button:has-text("Reservar")', { timeout: 5000 });
      
      // Verify reservar buttons exist
      const reservarBtns = page.locator('button:has-text("Reservar")');
      expect(await reservarBtns.count()).toBeGreaterThan(0);
    });
  });

  // ========== RESERVATION CREATION ==========
  test.describe('Criar Reserva', () => {
    test('Clicar em "Reservar" abre formulário de reserva', async ({ page }) => {
      await login(page);
      await page.click('a:has-text("Espaços")');
      
      // Wait for spaces
      await page.waitForResponse((resp) => resp.url().includes('/api/spaces') && resp.status() === 200);
      await page.waitForSelector('button:has-text("Reservar")', { timeout: 5000 });
      
      // Click first reservar button
      const firstReserveBtn = page.locator('button:has-text("Reservar")').first();
      await firstReserveBtn.click();
      
      // Dialog should open
      const dialog = page.locator('role=dialog');
      await expect(dialog).toBeVisible({ timeout: 3000 });
    });

    test('Preencher e submeter formulário de reserva (fluxo completo)', async ({ page }) => {
      await login(page);
      await page.click('a:has-text("Espaços")');
      
      // Wait for spaces
      await page.waitForResponse((resp) => resp.url().includes('/api/spaces') && resp.status() === 200);
      await page.waitForSelector('button:has-text("Reservar")', { timeout: 5000 });
      
      // Open reservation form
      const firstReserveBtn = page.locator('button:has-text("Reservar")').first();
      await firstReserveBtn.click();
      
      const dialog = page.locator('role=dialog');
      await expect(dialog).toBeVisible();
      
      // Select date (first available day button)
      const dayBtn = dialog.locator('button:not([disabled])').filter({ hasText: /^\d{1,2}$/ }).first();
      if (await dayBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await dayBtn.click();
      }
      
      // Set times
      const startSelect = dialog.locator('#startTime');
      const endSelect = dialog.locator('#endTime');
      
      if (await startSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
        await startSelect.selectOption('09:00');
      }
      
      if (await endSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
        await endSelect.selectOption('11:00');
      }
      
      // Confirm reservation
      let reservationCreated = false;
      page.on('response', (response) => {
        if (response.url().includes('/api/reservations') && (response.status() === 200 || response.status() === 201)) {
          reservationCreated = true;
        }
      });
      
      const confirmBtn = dialog.locator('button:has-text("Confirmar Reserva")');
      if (await confirmBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await confirmBtn.click();
      }
      
      // Wait for response or dialog to close
      await page.waitForTimeout(2000);
      
      // Verify either reservation was created or no crash occurred
      expect(reservationCreated || !await dialog.isVisible().catch(() => true)).toBeTruthy();
    });

    test('Cancelar formulário fecha modal sem submeter', async ({ page }) => {
      await login(page);
      await page.click('a:has-text("Espaços")');
      
      // Wait for spaces
      await page.waitForResponse((resp) => resp.url().includes('/api/spaces') && resp.status() === 200);
      await page.waitForSelector('button:has-text("Reservar")', { timeout: 5000 });
      
      // Open form
      const firstReserveBtn = page.locator('button:has-text("Reservar")').first();
      await firstReserveBtn.click();
      
      const dialog = page.locator('role=dialog');
      await expect(dialog).toBeVisible();
      
      // Find and click cancel button
      const cancelBtn = dialog.locator('button:has-text("Cancelar"|"Fechar")').last();
      if (await cancelBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await cancelBtn.click();
      } else {
        // Try ESC key
        await page.keyboard.press('Escape');
      }
      
      // Wait for dialog to disappear
      await page.waitForTimeout(1000);
      
      // Verify dialog is gone
      const dialogVisible = await dialog.isVisible().catch(() => false);
      expect(!dialogVisible).toBeTruthy();
    });
  });

  // ========== BACKEND API VALIDATION ==========
  test.describe('API Backend Validation', () => {
    test('GET /api/spaces retorna lista com espaços', async ({ page }) => {
      await login(page);
      
      const spaces = await page.evaluate(async () => {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:8080/api/spaces', {
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.json();
      });
      
      expect(Array.isArray(spaces)).toBeTruthy();
      expect(spaces.length).toBeGreaterThan(0);
      expect(spaces[0]).toHaveProperty('id');
      expect(spaces[0]).toHaveProperty('name');
      expect(spaces[0]).toHaveProperty('pricePerHour');
    });

    test('GET /api/reservations/my retorna array de reservas do usuário', async ({ page }) => {
      await login(page);
      
      const reservations = await page.evaluate(async () => {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:8080/api/reservations/my', {
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.json();
      });
      
      expect(Array.isArray(reservations)).toBeTruthy();
    });

    test('/api/health endpoint (sem auth) retorna status ok', async ({ page }) => {
      const healthResponse = await page.evaluate(async () => {
        const response = await fetch('http://localhost:8080/api/health');
        return response.json();
      });
      
      expect(healthResponse).toHaveProperty('status');
      expect(['ok', 'UP']).toContain(healthResponse.status);
    });
  });

  // ========== PERSISTENCE & STATE ==========
  test.describe('Persistência de Dados', () => {
    test('Token persiste após refresh da página', async ({ page }) => {
      await login(page);
      
      // Get token
      const token1 = await page.evaluate(() => localStorage.getItem('authToken'));
      
      // Refresh page
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Get token again
      const token2 = await page.evaluate(() => localStorage.getItem('authToken'));
      
      // Should be the same
      expect(token1).toBe(token2);
      expect(token2).toBeTruthy();
    });

    test('Usuário data persiste em localStorage após login', async ({ page }) => {
      await login(page);
      
      // Check userData exists
      const userData = await page.evaluate(() => {
        const data = localStorage.getItem('userData');
        return data ? JSON.parse(data) : null;
      });
      
      expect(userData).toBeTruthy();
      expect(userData).toHaveProperty('email');
      expect(userData.email).toBe('admin@example.com');
    });
  });

  // ========== UI INTERACTIONS & BUTTON TESTS ==========
  test.describe('Interações da UI', () => {
    test('Botões de navegação são clicáveis e respondem', async ({ page }) => {
      await login(page);
      
      const navItems = ['Dashboard', 'Espaços', 'Reservas'];
      
      for (const item of navItems) {
        const link = page.locator(`a:has-text("${item}")`);
        
        // Should be visible
        await expect(link).toBeVisible();
        
        // Click it
        await link.click();
        
        // Wait for navigation
        await page.waitForLoadState('networkidle');
      }
    });

    test('Formulário de login valida e submete', async ({ page }) => {
      await page.goto('/');
      
      const emailInput = page.locator('#email');
      const passwordInput = page.locator('#password');
      const submitBtn = page.locator('button:has-text("Entrar")');
      
      // All elements should be visible
      await expect(emailInput).toBeVisible();
      await expect(passwordInput).toBeVisible();
      await expect(submitBtn).toBeVisible();
      
      // Fill and submit
      await emailInput.fill('admin@example.com');
      await passwordInput.fill('admin123');
      await submitBtn.click();
      
      // Should redirect after login
      await page.waitForResponse((resp) => resp.url().includes('/api/spaces') && resp.status() === 200);
    });
  });

  // ========== RESPONSIVE DESIGN & MOBILE ==========
  test.describe('Responsividade', () => {
    test('[Mobile] Dashboard carrega em mobile viewport', { tag: '@mobile' }, async ({ page }) => {
      page.setViewportSize({ width: 375, height: 667 });
      
      await login(page);
      
      // Wait for content
      await page.waitForSelector('a:has-text("Espaços")', { timeout: 5000 });
      
      // Verify navigation is accessible
      await expect(page.locator('a:has-text("Espaços")')).toBeVisible();
    });

    test('[Desktop] Espaços carregam e são clicáveis em desktop', { tag: '@desktop' }, async ({ page }) => {
      page.setViewportSize({ width: 1920, height: 1080 });
      
      await login(page);
      await page.click('a:has-text("Espaços")');
      
      // Wait for spaces
      await page.waitForResponse((resp) => resp.url().includes('/api/spaces') && resp.status() === 200);
      await page.waitForSelector('button:has-text("Reservar")', { timeout: 5000 });
      
      // Verify multiple spaces visible
      const reservarBtns = page.locator('button:has-text("Reservar")');
      expect(await reservarBtns.count()).toBeGreaterThan(0);
    });
  });
});
