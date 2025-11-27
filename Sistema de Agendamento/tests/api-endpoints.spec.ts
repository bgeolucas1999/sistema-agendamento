import { test, expect, APIRequestContext } from '@playwright/test';

const API_BASE_URL = 'http://localhost:8080/api';

// Setup: Login helper to get token
async function loginAndGetToken(request: APIRequestContext): Promise<string> {
  const loginRes = await request.post(`${API_BASE_URL}/auth/login`, {
    data: {
      email: 'admin@example.com',
      password: 'admin123',
    },
  });
  expect(loginRes.ok()).toBeTruthy();
  const body = await loginRes.json();
  return body.token;
}

// Setup: Get authenticated headers
function getAuthHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

test.describe('API Endpoints - Full Test Suite', () => {
  let authToken: string;

  test.beforeAll(async ({ playwright }) => {
    // Get token once for all tests
    const request = await playwright.request.newContext();
    authToken = await loginAndGetToken(request);
    await request.dispose();
  });

  // ========== AUTHENTICATION ENDPOINTS ==========
  test.describe('🔐 Authentication Endpoints', () => {
    test('POST /auth/login - Login com credenciais válidas', async ({ request }) => {
      const res = await request.post(`${API_BASE_URL}/auth/login`, {
        data: {
          email: 'admin@example.com',
          password: 'admin123',
        },
      });

      expect(res.ok()).toBeTruthy();
      expect(res.status()).toBe(200);

      const body = await res.json();
      expect(body).toHaveProperty('token');
      expect(body).toHaveProperty('type');
      expect(body).toHaveProperty('email');
      expect(body).toHaveProperty('name');
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('roles');
      expect(body.type).toBe('Bearer');
      expect(body.email).toBe('admin@example.com');
      expect(Array.isArray(body.roles)).toBeTruthy();
    });

    test('POST /auth/login - Falha com credenciais inválidas', async ({ request }) => {
      const res = await request.post(`${API_BASE_URL}/auth/login`, {
        data: {
          email: 'admin@example.com',
          password: 'wrongpassword',
        },
      });

      expect([401, 403]).toContain(res.status());
    });

    test('POST /auth/register - Registrar novo usuário', async ({ request }) => {
      const newEmail = `user_${Date.now()}@example.com`;
      const res = await request.post(`${API_BASE_URL}/auth/register`, {
        data: {
          name: 'Test User',
          email: newEmail,
          phone: '(11) 98765-4321',
          password: 'password123',
        },
      });

      expect(res.ok()).toBeTruthy();
      expect(res.status()).toBe(200);

      const body = await res.json();
      expect(body).toHaveProperty('token');
      expect(body).toHaveProperty('type');
      expect(body).toHaveProperty('email');
      expect(body).toHaveProperty('name');
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('roles');
      expect(body.type).toBe('Bearer');
      expect(body.email).toBe(newEmail);
      expect(Array.isArray(body.roles)).toBeTruthy();
    });

    test('POST /auth/register - Falha ao registrar email duplicado', async ({ request }) => {
      const res = await request.post(`${API_BASE_URL}/auth/register`, {
        data: {
          name: 'Duplicate User',
          email: 'admin@example.com',
          phone: '(11) 98765-4321',
          password: 'password123',
        },
      });

      expect(res.status()).toBe(400);
    });
  });

  // ========== SPACES ENDPOINTS ==========
  test.describe('🏢 Spaces Endpoints', () => {
    test('GET /spaces - Listar todos os espaços', async ({ request }) => {
      const res = await request.get(`${API_BASE_URL}/spaces`, {
        headers: getAuthHeaders(authToken),
      });

      expect(res.ok()).toBeTruthy();
      expect(res.status()).toBe(200);

      const spaces = await res.json();
      expect(Array.isArray(spaces)).toBeTruthy();
      expect(spaces.length).toBeGreaterThan(0);

      // Validate first space structure
      const space = spaces[0];
      expect(space).toHaveProperty('id');
      expect(space).toHaveProperty('name');
      expect(space).toHaveProperty('description');
      expect(space).toHaveProperty('capacity');
      expect(space).toHaveProperty('pricePerHour');
      expect(space).toHaveProperty('type');
      expect(space).toHaveProperty('available');
      expect(space).toHaveProperty('amenities');
      expect(space).toHaveProperty('location');
      expect(space).toHaveProperty('floor');
      expect(space).toHaveProperty('imageUrl');
      expect(space).toHaveProperty('createdAt');

      // Validate data types
      expect(typeof space.id).toBe('number');
      expect(typeof space.name).toBe('string');
      expect(typeof space.capacity).toBe('number');
      expect(typeof space.pricePerHour).toMatch(/number|string/);
      expect(typeof space.available).toBe('boolean');
      expect(Array.isArray(space.amenities)).toBeTruthy();
    });

    test('GET /spaces/{id} - Obter espaço por ID', async ({ request }) => {
      // First get all spaces to get a valid ID
      const listRes = await request.get(`${API_BASE_URL}/spaces`, {
        headers: getAuthHeaders(authToken),
      });
      const spaces = await listRes.json();
      const spaceId = spaces[0].id;

      // Now get specific space
      const res = await request.get(`${API_BASE_URL}/spaces/${spaceId}`, {
        headers: getAuthHeaders(authToken),
      });

      expect(res.ok()).toBeTruthy();
      expect(res.status()).toBe(200);

      const space = await res.json();
      expect(space.id).toBe(spaceId);
      expect(space).toHaveProperty('name');
      expect(space).toHaveProperty('pricePerHour');
    });

    test('GET /spaces/{id} - Falha ao buscar espaço inexistente', async ({ request }) => {
      const res = await request.get(`${API_BASE_URL}/spaces/99999`, {
        headers: getAuthHeaders(authToken),
      });

      expect(res.status()).toBe(404);
    });

    test('GET /spaces/available - Listar espaços disponíveis com filtros', async ({ request }) => {
      const res = await request.get(
        `${API_BASE_URL}/spaces/available?minCapacity=10&maxPrice=300`,
        {
          headers: getAuthHeaders(authToken),
        }
      );

      expect(res.ok()).toBeTruthy();
      expect(res.status()).toBe(200);

      const spaces = await res.json();
      expect(Array.isArray(spaces)).toBeTruthy();

      // Validate all spaces meet filter criteria
      spaces.forEach((space) => {
        expect(space.capacity).toBeGreaterThanOrEqual(10);
        expect(parseFloat(space.pricePerHour)).toBeLessThanOrEqual(300);
      });
    });

    test('POST /spaces - Admin: Criar novo espaço', async ({ request }) => {
      const newSpace = {
        name: `Sala Teste ${Date.now()}`,
        description: 'Sala de teste para validação',
        capacity: 8,
        pricePerHour: 120.00,
        type: 'CONFERENCE_ROOM',
        location: 'Prédio 1',
        floor: '2º Andar',
        amenities: ['Wi-Fi', 'Projetor'],
        imageUrl: 'https://via.placeholder.com/300x200?text=TestRoom',
        available: true,
      };

      const res = await request.post(`${API_BASE_URL}/spaces`, {
        headers: getAuthHeaders(authToken),
        data: newSpace,
      });

      expect([200, 201]).toContain(res.status());
      expect(res.ok()).toBeTruthy();

      const created = await res.json();
      expect(created.id).toBeDefined();
      expect(created.name).toBe(newSpace.name);
      expect(created.capacity).toBe(newSpace.capacity);
    });

    test('PUT /spaces/{id} - Admin: Atualizar espaço', async ({ request }) => {
      // Get first space
      const listRes = await request.get(`${API_BASE_URL}/spaces`, {
        headers: getAuthHeaders(authToken),
      });
      const spaces = await listRes.json();
      const spaceId = spaces[0].id;

      const updatedData = {
        name: `Sala Atualizada ${Date.now()}`,
        description: 'Descrição atualizada',
        capacity: 15,
        pricePerHour: 180.00,
        type: 'CONFERENCE_ROOM',
        location: 'Prédio 1',
        floor: '3º Andar',
        amenities: ['Wi-Fi', 'Videoconferência'],
        imageUrl: 'https://via.placeholder.com/300x200?text=Updated',
        available: true,
      };

      const res = await request.put(`${API_BASE_URL}/spaces/${spaceId}`, {
        headers: getAuthHeaders(authToken),
        data: updatedData,
      });

      expect(res.ok()).toBeTruthy();
      expect([200, 201]).toContain(res.status());

      const updated = await res.json();
      expect(updated.name).toBe(updatedData.name);
    });

    test('DELETE /spaces/{id} - Admin: Deletar espaço', async ({ request }) => {
      // Create a space first
      const newSpace = {
        name: `Sala para Deletar ${Date.now()}`,
        description: 'Esta sala será deletada',
        capacity: 5,
        pricePerHour: 100.00,
        type: 'TRAINING_ROOM',
        location: 'Prédio 2',
        floor: '1º Andar',
        amenities: ['Wi-Fi'],
        imageUrl: 'https://via.placeholder.com/300x200?text=ToDelete',
        available: true,
      };

      const createRes = await request.post(`${API_BASE_URL}/spaces`, {
        headers: getAuthHeaders(authToken),
        data: newSpace,
      });

      const created = await createRes.json();
      const spaceId = created.id;

      // Now delete it
      const deleteRes = await request.delete(`${API_BASE_URL}/spaces/${spaceId}`, {
        headers: getAuthHeaders(authToken),
      });

      expect([200, 204]).toContain(deleteRes.status());

      // Verify it's deleted
      const getRes = await request.get(`${API_BASE_URL}/spaces/${spaceId}`, {
        headers: getAuthHeaders(authToken),
      });
      expect(getRes.status()).toBe(404);
    });
  });

  // ========== RESERVATIONS ENDPOINTS ==========
  test.describe('📅 Reservations Endpoints', () => {
    test('POST /reservations - Criar nova reserva', async ({ request }) => {
      // Get first space
      const spacesRes = await request.get(`${API_BASE_URL}/spaces`, {
        headers: getAuthHeaders(authToken),
      });
      const spaces = await spacesRes.json();
      const spaceId = spaces[0].id;

      // Create reservation
      const tomorrow = new Date();
      // use a date further ahead to avoid collisions with mock data
      tomorrow.setDate(tomorrow.getDate() + 7);
      const startTime = new Date(tomorrow);
      startTime.setHours(10, 0, 0, 0);
      const endTime = new Date(tomorrow);
      endTime.setHours(12, 0, 0, 0);

      const reservation = {
        spaceId: spaceId,
        userName: 'Test User',
        userEmail: 'admin@example.com',
        userPhone: '(11) 98765-4321',
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        notes: 'Reserva de teste',
      };

      const res = await request.post(`${API_BASE_URL}/reservations`, {
        headers: getAuthHeaders(authToken),
        data: reservation,
      });

      expect([200, 201]).toContain(res.status());
      expect(res.ok()).toBeTruthy();

      const created = await res.json();
      expect(created.id).toBeDefined();
      expect(created.spaceId).toBe(spaceId);
      expect(created.userEmail).toBe('admin@example.com');
      expect(created).toHaveProperty('status');
      expect(created).toHaveProperty('totalPrice');
      expect(created).toHaveProperty('createdAt');
    });

    test('GET /reservations/my - Listar minhas reservas', async ({ request }) => {
      const res = await request.get(`${API_BASE_URL}/reservations/my`, {
        headers: getAuthHeaders(authToken),
      });

      expect(res.ok()).toBeTruthy();
      expect(res.status()).toBe(200);

      const reservations = await res.json();
      expect(Array.isArray(reservations)).toBeTruthy();

      // If there are reservations, validate structure
      if (reservations.length > 0) {
        const reservation = reservations[0];
        expect(reservation).toHaveProperty('id');
        expect(reservation).toHaveProperty('spaceId');
        expect(reservation).toHaveProperty('spaceName');
        expect(reservation).toHaveProperty('userEmail');
        expect(reservation).toHaveProperty('startTime');
        expect(reservation).toHaveProperty('endTime');
        expect(reservation).toHaveProperty('status');
        expect(reservation).toHaveProperty('totalPrice');
        expect(reservation).toHaveProperty('createdAt');
      }
    });

    test('GET /reservations/{id} - Obter reserva por ID', async ({ request }) => {
      // Get my reservations to get a valid ID
      const listRes = await request.get(`${API_BASE_URL}/reservations/my`, {
        headers: getAuthHeaders(authToken),
      });
      const reservations = await listRes.json();

      if (reservations.length > 0) {
        const reservationId = reservations[0].id;

        const res = await request.get(
          `${API_BASE_URL}/reservations/${reservationId}`,
          {
            headers: getAuthHeaders(authToken),
          }
        );

        expect(res.ok()).toBeTruthy();
        expect(res.status()).toBe(200);

        const reservation = await res.json();
        expect(reservation.id).toBe(reservationId);
        expect(reservation).toHaveProperty('spaceId');
        expect(reservation).toHaveProperty('status');
      }
    });

    test('GET /reservations - Admin: Listar todas as reservas', async ({ request }) => {
      const res = await request.get(`${API_BASE_URL}/reservations`, {
        headers: getAuthHeaders(authToken),
      });

      expect(res.ok()).toBeTruthy();
      expect(res.status()).toBe(200);

      const reservations = await res.json();
      expect(Array.isArray(reservations)).toBeTruthy();

      // Validate structure
      if (reservations.length > 0) {
        const reservation = reservations[0];
        expect(reservation).toHaveProperty('id');
        expect(reservation).toHaveProperty('spaceId');
        expect(reservation).toHaveProperty('userEmail');
        expect(reservation).toHaveProperty('startTime');
        expect(reservation).toHaveProperty('endTime');
      }
    });

    test('GET /reservations - Com filtros de query', async ({ request }) => {
      const res = await request.get(
        `${API_BASE_URL}/reservations?status=CONFIRMED&spaceId=100`,
        {
          headers: getAuthHeaders(authToken),
        }
      );

      expect(res.ok()).toBeTruthy();
      expect(res.status()).toBe(200);

      const reservations = await res.json();
      expect(Array.isArray(reservations)).toBeTruthy();
    });

    test('POST /reservations/{id}/cancel - Cancelar reserva', async ({ request }) => {
      // Get my reservations
      const listRes = await request.get(`${API_BASE_URL}/reservations/my`, {
        headers: getAuthHeaders(authToken),
      });
      const reservations = await listRes.json();

      if (reservations.length > 0) {
        const reservationId = reservations[0].id;

        const res = await request.post(
          `${API_BASE_URL}/reservations/${reservationId}/cancel`,
          {
            headers: getAuthHeaders(authToken),
          }
        );

        expect(res.ok()).toBeTruthy();
        expect([200, 201]).toContain(res.status());

        const cancelled = await res.json();
        expect(cancelled.status).toMatch(/CANCELLED|CANCELED/);
      }
    });

    test('PUT /reservations/{id} - Atualizar reserva', async ({ request }) => {
      // Get my reservations
      const listRes = await request.get(`${API_BASE_URL}/reservations/my`, {
        headers: getAuthHeaders(authToken),
      });
      const reservations = await listRes.json();

      if (reservations.length > 0) {
        const reservationId = reservations[0].id;

        const updatedData = {
          userName: 'Updated User Name',
          userEmail: 'admin@example.com',
          userPhone: '(11) 99999-9999',
          startTime: reservations[0].startTime,
          endTime: reservations[0].endTime,
          notes: 'Notas atualizadas',
        };

        const res = await request.put(
          `${API_BASE_URL}/reservations/${reservationId}`,
          {
            headers: getAuthHeaders(authToken),
            data: updatedData,
          }
        );

        expect(res.ok()).toBeTruthy();
        expect([200, 201]).toContain(res.status());

        const updated = await res.json();
        expect(updated.userName).toBe(updatedData.userName);
      }
    });

    test('DELETE /reservations/{id} - Admin: Deletar reserva', async ({ request }) => {
      // Create a reservation first
      const spacesRes = await request.get(`${API_BASE_URL}/spaces`, {
        headers: getAuthHeaders(authToken),
      });
      const spaces = await spacesRes.json();
      const spaceId = spaces[0].id;

      const tomorrow = new Date();
      // use a date further ahead to avoid collisions with mock data
      tomorrow.setDate(tomorrow.getDate() + 8);
      const startTime = new Date(tomorrow);
      startTime.setHours(14, 0, 0, 0);
      const endTime = new Date(tomorrow);
      endTime.setHours(16, 0, 0, 0);

      const reservation = {
        spaceId: spaceId,
        userName: 'To Delete User',
        userEmail: 'admin@example.com',
        userPhone: '(11) 98765-4321',
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        notes: 'Esta reserva será deletada',
      };

      const createRes = await request.post(`${API_BASE_URL}/reservations`, {
        headers: getAuthHeaders(authToken),
        data: reservation,
      });

      const created = await createRes.json();
      const reservationId = created.id;

      // Now delete it
      const deleteRes = await request.delete(
        `${API_BASE_URL}/reservations/${reservationId}`,
        {
          headers: getAuthHeaders(authToken),
        }
      );

      expect([200, 204]).toContain(deleteRes.status());

      // Verify it's deleted
      const getRes = await request.get(
        `${API_BASE_URL}/reservations/${reservationId}`,
        {
          headers: getAuthHeaders(authToken),
        }
      );
      expect(getRes.status()).toBe(404);
    });
  });

  // ========== HEALTH & DEBUG ENDPOINTS ==========
  test.describe('🏥 Health & Debug Endpoints', () => {
    test('GET /health - Verificar saúde da API (sem autenticação)', async ({
      request,
    }) => {
      const res = await request.get(`${API_BASE_URL}/health`);

      expect(res.ok()).toBeTruthy();
      expect(res.status()).toBe(200);

      const body = await res.json();
      expect(body).toHaveProperty('status');
      expect(['ok', 'UP']).toContain(body.status);
      expect(body).toHaveProperty('service');
      expect(body.service).toBe('sistema-agendamento');
    });

    test('GET /debug/reservations - Admin: Debug de todas as reservas', async ({
      request,
    }) => {
      const res = await request.get(`${API_BASE_URL}/debug/reservations`, {
        headers: getAuthHeaders(authToken),
      });

      expect(res.ok()).toBeTruthy();
      expect(res.status()).toBe(200);

      const reservations = await res.json();
      expect(Array.isArray(reservations)).toBeTruthy();
    });
  });

  // ========== ERROR HANDLING & VALIDATION ==========
  test.describe('⚠️ Error Handling & Validation', () => {
    test('POST /reservations - Falha sem dados obrigatórios', async ({
      request,
    }) => {
      const res = await request.post(`${API_BASE_URL}/reservations`, {
        headers: getAuthHeaders(authToken),
        data: {
          // Missing required fields
          userName: 'Test',
        },
      });

      expect(res.status()).toBe(400);
    });

    test('POST /spaces - Falha sem autenticação', async ({ request }) => {
      const res = await request.post(`${API_BASE_URL}/spaces`, {
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          name: 'Test Space',
          capacity: 10,
          pricePerHour: 100,
        },
      });

      expect(res.status()).toBe(401);
    });

    test('GET /spaces/{id} - Falha com ID inválido', async ({ request }) => {
      const res = await request.get(`${API_BASE_URL}/spaces/abc`, {
        headers: getAuthHeaders(authToken),
      });

      expect([400, 404]).toContain(res.status());
    });

    test('POST /auth/login - Falha sem email', async ({ request }) => {
      const res = await request.post(`${API_BASE_URL}/auth/login`, {
        data: {
          password: 'admin123',
        },
      });

      expect(res.status()).toBe(400);
    });

    test('POST /auth/login - Falha sem password', async ({ request }) => {
      const res = await request.post(`${API_BASE_URL}/auth/login`, {
        data: {
          email: 'admin@example.com',
        },
      });

      expect(res.status()).toBe(400);
    });
  });

  // ========== DATA CONSISTENCY ==========
  test.describe('🔄 Data Consistency', () => {
    test('Dados criados aparecem na listagem', async ({ request }) => {
      // Create space
      const newSpace = {
        name: `Consistency Test ${Date.now()}`,
        description: 'Teste de consistência',
        capacity: 12,
        pricePerHour: 140.00,
        type: 'CONFERENCE_ROOM',
        location: 'Prédio 1',
        floor: '2º Andar',
        amenities: ['Wi-Fi'],
        imageUrl: 'https://via.placeholder.com/300x200?text=Consistency',
        available: true,
      };

      const createRes = await request.post(`${API_BASE_URL}/spaces`, {
        headers: getAuthHeaders(authToken),
        data: newSpace,
      });

      const created = await createRes.json();
      const spaceId = created.id;

      // List spaces and find the created one
      const listRes = await request.get(`${API_BASE_URL}/spaces`, {
        headers: getAuthHeaders(authToken),
      });

      const spaces = await listRes.json();
      const foundSpace = spaces.find((s) => s.id === spaceId);

      expect(foundSpace).toBeDefined();
      expect(foundSpace.name).toBe(newSpace.name);
      expect(foundSpace.capacity).toBe(newSpace.capacity);
    });

    test('Reservas criadas aparecem em /reservations/my', async ({
      request,
    }) => {
      // Get first space
      const spacesRes = await request.get(`${API_BASE_URL}/spaces`, {
        headers: getAuthHeaders(authToken),
      });
      const spaces = await spacesRes.json();
      const spaceId = spaces[0].id;

      // Create reservation
      const tomorrow = new Date();
      // use a date further ahead to avoid collisions with mock data
      tomorrow.setDate(tomorrow.getDate() + 9);
      const startTime = new Date(tomorrow);
      startTime.setHours(15, 0, 0, 0);
      const endTime = new Date(tomorrow);
      endTime.setHours(17, 0, 0, 0);

      const reservation = {
        spaceId: spaceId,
        userName: 'Consistency Test',
        userEmail: 'admin@example.com',
        userPhone: '(11) 98765-4321',
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        notes: 'Teste de consistência de reserva',
      };

      const createRes = await request.post(`${API_BASE_URL}/reservations`, {
        headers: getAuthHeaders(authToken),
        data: reservation,
      });

      const created = await createRes.json();
      const reservationId = created.id;

      // Get my reservations and find it
      const myRes = await request.get(`${API_BASE_URL}/reservations/my`, {
        headers: getAuthHeaders(authToken),
      });

      const myReservations = await myRes.json();
      const foundReservation = myReservations.find(
        (r) => r.id === reservationId
      );

      expect(foundReservation).toBeDefined();
      expect(foundReservation.spaceId).toBe(spaceId);
    });
  });

  // ========== PAGINATION & FILTERING ==========
  test.describe('🔍 Pagination & Filtering', () => {
    test('GET /spaces/available - Filtrar por capacidade mínima', async ({
      request,
    }) => {
      const res = await request.get(`${API_BASE_URL}/spaces/available?minCapacity=20`, {
        headers: getAuthHeaders(authToken),
      });

      expect(res.ok()).toBeTruthy();
      const spaces = await res.json();

      spaces.forEach((space) => {
        expect(space.capacity).toBeGreaterThanOrEqual(20);
      });
    });

    test('GET /spaces/available - Filtrar por preço máximo', async ({
      request,
    }) => {
      const res = await request.get(`${API_BASE_URL}/spaces/available?maxPrice=200`, {
        headers: getAuthHeaders(authToken),
      });

      expect(res.ok()).toBeTruthy();
      const spaces = await res.json();

      spaces.forEach((space) => {
        expect(parseFloat(space.pricePerHour)).toBeLessThanOrEqual(200);
      });
    });

    test('GET /spaces/available - Filtrar por tipo de espaço', async ({
      request,
    }) => {
      const res = await request.get(`${API_BASE_URL}/spaces/available?type=CONFERENCE_ROOM`, {
        headers: getAuthHeaders(authToken),
      });

      expect(res.ok()).toBeTruthy();
      const spaces = await res.json();

      spaces.forEach((space) => {
        expect(space.type).toBe('CONFERENCE_ROOM');
      });
    });
  });
});
