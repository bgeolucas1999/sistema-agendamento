// API Configuration
// Use environment variable if available, otherwise default to localhost
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
export const API_BASE_URL = baseURL;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
  },
  USERS: {
    BASE: '/users',
    ME: '/users/me',
    UPDATE: '/users',
  },
  SPACES: {
    BASE: '/spaces',
    AVAILABLE: '/spaces/available',
    BY_ID: (id: number) => `/spaces/${id}`,
  },
  RESERVATIONS: {
    BASE: '/reservations',
    MY_RESERVATIONS: '/reservations/my',
    BY_ID: (id: number) => `/reservations/${id}`,
    CANCEL: (id: number) => `/reservations/${id}/cancel`,
  },
};

// Space Types
export const SPACE_TYPES = [
  { value: 'DESK', label: 'Mesa Individual' },
  { value: 'MEETING_ROOM', label: 'Sala de Reunião' },
  { value: 'PRIVATE_OFFICE', label: 'Escritório Privado' },
  { value: 'EVENT_SPACE', label: 'Espaço para Eventos' },
  { value: 'COWORKING', label: 'Coworking' },
];

// Reservation Status
export const RESERVATION_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'authToken',
  USER: 'userData',
};

// Pagination
export const DEFAULT_PAGE_SIZE = 10;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  API: 'yyyy-MM-dd',
  DATETIME: 'dd/MM/yyyy HH:mm',
  TIME: 'HH:mm',
};
